import middy from "@middy/core";

import { logRequest } from "../middleware/index.js";
import productsRepository from "../shared/productsRepository.js";
import addProductSchemaValidator from "../schema-validators/addProductSchemaValidator.js";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

async function addProductFromMessage(message) {
  try {
    const payload = JSON.parse(message);
    const valid = addProductSchemaValidator(payload);

    if (!valid) {
      throw new Error(
        "Message body doesn't correspond to product schema: " + message
      );
    }

    const { count, ...productData } = payload;
    const product = await productsRepository.addProduct(productData, count);

    return product;
  } catch (error) {
    console.log(error);
    return Promise.resolve(null);
  }
}

async function catalogBatchProcessHandler(event) {
  const messages = event.Records.map((record) => record.body);

  const result = await Promise.all(
    messages.map((message) => addProductFromMessage(message))
  );

  console.log(`Successfully added ${result.filter(Boolean).length} products`);

  await sendSNSMessage(result.filter(Boolean));

  console.log("Successfully sent SNS message");
}

const clientSNS = new SNSClient({ region: process.env.AWS_REGION });

async function sendSNSMessage(products) {
  const command = new PublishCommand({
    TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN,
    Subject: "New products were added",
    Message: `New products were added:

${JSON.stringify(products, null, "  ")}`,
  });

  await clientSNS.send(command);
}

const catalogBatchProcess = middy(catalogBatchProcessHandler);
catalogBatchProcess.use(logRequest());

export default catalogBatchProcess;
