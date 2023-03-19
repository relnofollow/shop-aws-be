import middy from "@middy/core";

import { logRequest, handleError } from "../middleware/index.js";
import productsRepository from "../shared/productsRepository.js";

async function getProductsListHandler(event) {
  const products = await productsRepository.getProducts();

  return {
    statusCode: 200,
    body: JSON.stringify(products),
    headers: {
      "content-type": "application/json",
    },
  };
}

const getProductsList = middy(getProductsListHandler);
getProductsList.use(logRequest()).use(handleError());

export default getProductsList;
