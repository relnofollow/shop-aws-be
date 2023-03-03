import middy from "@middy/core";

import { logRequest, handleError } from "../middleware/index.js";
import productsRepository from "../shared/productsRepository.js";

async function getProductByIdHandler(event) {
  const product = await productsRepository.getProductById(
    event.pathParameters.productId
  );

  if (product) {
    return {
      statusCode: 200,
      body: JSON.stringify(product),
      headers: {
        "content-type": "application/json",
      },
    };
  } else {
    return {
      statusCode: 404,
      body: "Product not found",
    };
  }
}

const getProductById = middy(getProductByIdHandler);
getProductById.use(logRequest()).use(handleError());

export default getProductById;
