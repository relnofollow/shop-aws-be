import { logRequest } from "@libs/lambda";
import { S3CreateEvent } from "aws-lambda";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import middy from "@middy/core";
const csv = require("csv-parser");

const PARSED_DIR_PATH = "parsed/";
const UPLOADED_DIR_PATH = "uploaded/";

const client = new S3Client({ region: process.env.AWS_REGION });

async function getS3ObjectStream(
  bucket: string,
  key: string
): Promise<ReadableStream> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await client.send(command);
  return response.Body;
}

async function parseCsvFile(fileStream: ReadableStream) {
  return new Promise((resolve, reject) => {
    fileStream
      .pipe(csv())
      .on("data", (data) => console.log(data))
      .on("error", (error) => reject(error))
      .on("end", () => {
        resolve(null);
      });
  });
}

const uploadedFileRegex = new RegExp(`${UPLOADED_DIR_PATH}(?<fileName>.+)`);

async function copyObject(bucket: string, key: string, newDirectory: string) {
  const match = uploadedFileRegex.exec(key);
  const { fileName } = match.groups;

  const command = new CopyObjectCommand({
    CopySource: encodeURI(`${bucket}/${key}`),
    Bucket: bucket,
    Key: `${newDirectory}${fileName}`,
  });

  await client.send(command);
}

async function deleteObject(bucket: string, key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await client.send(command);
}

const importFileParser = async (event: S3CreateEvent) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  try {
    console.log(`File '${key}': parsing process started`);

    const fileStream = await getS3ObjectStream(bucket, key);
    await parseCsvFile(fileStream);

    console.log(`File '${key}': successfully parsed`);
  } catch (error) {
    console.log(`File '${key}': parsing error: ${error.message}`);
  }

  try {
    console.log(`File '${key}': moving to '${PARSED_DIR_PATH}'`);

    await copyObject(bucket, key, PARSED_DIR_PATH);
    await deleteObject(bucket, key);

    console.log(`File '${key}': successfully moved to '${PARSED_DIR_PATH}'`);
  } catch (error) {
    console.log(
      `File '${key}': error moving parsed file to 'parsed' directory: ${error.message}`
    );
  }
};

export const main = middy(importFileParser).use(logRequest());
