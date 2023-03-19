import ProductsRepository from "../shared/ProductsRepository.js";

export default async function getProductsList(event) {
  const products = await ProductsRepository.getProducts();

  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
}
