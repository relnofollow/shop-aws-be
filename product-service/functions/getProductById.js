const ProductRepository = require("../shared/ProductsRepository");

module.exports = async function getProductById(event) {
  const product = await ProductRepository.getProductById(
    event.pathParameters.productId
  );

  if (product) {
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify("Product not found"),
    };
  }
};
