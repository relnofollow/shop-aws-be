import type { AWS } from "@serverless/typescript";

import importProductFile from "@functions/importProductFile";

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
    },
    httpApi: {
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
            Action: "s3:PutObject",
            Resource:
              "arn:aws:s3:::${self:provider.environment.BUCKET_IMPORT}/*",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { importProductFile },
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