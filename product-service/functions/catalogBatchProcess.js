import middy from "@middy/core";

import { logRequest } from "../middleware/index.js";
import productsRepository from "../shared/productsRepository.js";
import addProductSchemaValidator from "../schema-validators/addProductSchemaValidator.js";

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
}

const catalogBatchProcess = middy(catalogBatchProcessHandler);
catalogBatchProcess.use(logRequest());

export default catalogBatchProcess;
