const ProductsRepository = require("../shared/ProductsRepository");

module.exports = async function getProductsList(event) {
  const products = await ProductsRepository.getProducts();

  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};
