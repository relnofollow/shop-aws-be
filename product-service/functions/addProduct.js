import ProductsRepository from "../shared/ProductsRepository.js";

export default async function addProduct(event) {
  const { count, ...productData } = JSON.parse(event.body);

  try {
    const product = await ProductsRepository.addProduct(productData, count);

    return {
      statusCode: 201,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message,
    };
  }
}
