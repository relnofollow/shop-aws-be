import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const createPresignedUrlWithClient = async ({ key }) => {
  const client = new S3Client({ region: process.env.AWS_REGION });

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_IMPORT,
    Key: key,
    ContentType: "text/csv",
  });

  return getSignedUrl(client, command, { expiresIn: 3600 });
};

const importProductsFile = async (event: APIGatewayProxyEvent) => {
  const fileName = event.queryStringParameters?.name;

  if (!fileName) {
    return formatJSONResponse(
      {
        error: "Bad request",
      },
      400
    );
  }

  const fileKey = `uploaded/${fileName}`;

  const url = await createPresignedUrlWithClient({ key: fileKey });

  return {
    statusCode: 200,
    body: url,
  };
};

export const main = middyfy(importProductsFile);
