import middy from "@middy/core";

import { logRequest, handleError } from "../middleware/index.js";
import productsRepository from "../shared/productsRepository.js";
import addProductSchemaValidator from "../schema-validators/addProductSchemaValidator.js";

async function addProductHandler(event) {
  const payload = JSON.parse(event.body);
  const valid = addProductSchemaValidator(payload);

  if (!valid) {
    return {
      statusCode: 400,
      body: JSON.stringify(addProductSchemaValidator.errors),
      headers: {
        "content-type": "application/json",
      },
    };
  }

  const { count, ...productData } = payload;

  const product = await productsRepository.addProduct(productData, count);

  return {
    statusCode: 201,
    body: JSON.stringify(product),
    headers: {
      "content-type": "application/json",
    },
  };
}

const addProduct = middy(addProductHandler);
addProduct.use(logRequest()).use(handleError());

export default addProduct;
