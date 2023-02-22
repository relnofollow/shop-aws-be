const ProductRepository = require("../shared/ProductsRepository");

module.exports = async function getProductById(event) {
  const product = await ProductRepository.getProductById(
    event.pathParameters.productId
  );

  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
};
