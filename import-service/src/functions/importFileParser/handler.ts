import { logRequest } from "@libs/lambda";
import { S3CreateEvent } from "aws-lambda";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

import middy from "@middy/core";
const csv = require("csv-parser");

const PARSED_DIR_PATH = "parsed/";
const UPLOADED_DIR_PATH = "uploaded/";

const clientS3 = new S3Client({ region: process.env.AWS_REGION });
const clientSQS = new SQSClient({ region: process.env.AWS_REGION });

async function getS3ObjectStream(
  bucket: string,
  key: string
): Promise<ReadableStream> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await clientS3.send(command);
  return response.Body;
}

async function parseCsvFile(
  fileStream: ReadableStream,
  callback: (data: any) => void
) {
  return new Promise((resolve, reject) => {
    fileStream
      .pipe(csv())
      .on("data", (data) => callback(data))
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

  await clientS3.send(command);
}

async function deleteObject(bucket: string, key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await clientS3.send(command);
}

function convertNumericProps(csvData) {
  const numericProps = ["minAge", "reviews", "rating", "count", "price"];
  const result = {};

  for (let [key, value] of Object.entries(csvData)) {
    result[key] = numericProps.includes(key) ? Number(value) : value;
  }

  return result;
}

async function sendDataToSQS(csvData) {
  try {
    console.log(`Sending data to SQS [raw: ${JSON.stringify(csvData)}]`);

    const command = new SendMessageCommand({
      QueueUrl: process.env.SQS_URL,
      MessageBody: JSON.stringify(convertNumericProps(csvData)),
    });

    await clientSQS.send(command);

    console.log(`Message is sent to SQS`);
  } catch (error) {
    console.log(error);
  }
}

const importFileParser = async (event: S3CreateEvent) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  try {
    console.log(`File '${key}': parsing process started`);

    const fileStream = await getS3ObjectStream(bucket, key);
    await parseCsvFile(fileStream, sendDataToSQS);

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
