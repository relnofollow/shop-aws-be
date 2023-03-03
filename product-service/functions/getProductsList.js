import productsRepository from "../shared/productsRepository.js";

export default async function getProductsList(event) {
  try {
    const products = await productsRepository.getProducts();

    return {
      statusCode: 200,
      body: JSON.stringify(products),
      headers: {
        "content-type": "application/json",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message,
    };
  }
}
