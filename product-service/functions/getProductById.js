import productsRepository from "../shared/productsRepository.js";

export default async function getProductById(event) {
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
