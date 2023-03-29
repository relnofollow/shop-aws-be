import type { AWS } from "@serverless/typescript";

import importProductsFile from "@functions/importProductsFile";
import importFileParser from "@functions/importFileParser";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "eu-central-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      BUCKET_IMPORT: "constructor-shop-957659-import",
      SQS_URL:
        "https://sqs.eu-central-1.amazonaws.com/240983830311/product-service-dev-catalogItemsQueue",
    },
    httpApi: {
      authorizers: {
        basicAuthorizer: {
          type: "request",
          functionArn:
            "arn:aws:lambda:eu-central-1:240983830311:function:authorization-service-dev-basicAuthorizer",
          identitySource: ["$request.header.Authorization"],
          payloadVersion: "2.0",
        },
      },
      cors: {
        allowedOrigins: [
          "http://localhost:4200",
          "https://d2vtpotpr14qt7.cloudfront.net",
          "https://inspector.swagger.io",
        ],
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "s3:PutObject",
              "s3:GetObject",
              "s3:DeleteObject",
              "s3:ListBucket",
            ],
            Resource:
              "arn:aws:s3:::${self:provider.environment.BUCKET_IMPORT}/*",
          },
          {
            Effect: "Allow",
            Action: ["sqs:*"],
            Resource:
              "arn:aws:sqs:eu-central-1:240983830311:product-service-dev-catalogItemsQueue",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
