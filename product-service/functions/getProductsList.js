import ProductsRepository from "../shared/ProductsRepository.js";

export default async function getProductsList(event) {
  try {
    const products = await ProductsRepository.getProducts();

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message,
    };
  }
}
