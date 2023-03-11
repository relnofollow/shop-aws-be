import { logRequest } from "@libs/lambda";
import { S3CreateEvent } from "aws-lambda";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import middy from "@middy/core";
const csv = require("csv-parser");

async function getS3ObjectStream(
  bucket: string,
  key: string
): Promise<ReadableStream> {
  const client = new S3Client({ region: process.env.AWS_REGION });

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await client.send(command);
  return response.Body;
}

const importFileParser = async (event: S3CreateEvent) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  try {
    console.log(`File '${key}': parsing process started`);

    const fileStream = await getS3ObjectStream(bucket, key);
    fileStream
      .pipe(csv())
      .on("data", (data) => console.log(data))
      .on("end", () => {
        console.log(`File '${key}': successfully parsed`);
      });
  } catch (error) {
    console.log(`File '${key}': parsing error: ${error.message}`);
  }
};

export const main = middy(importFileParser).use(logRequest());
