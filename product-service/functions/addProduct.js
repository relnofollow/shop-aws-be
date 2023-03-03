import productsRepository from "../shared/productsRepository.js";
import addProductSchemaValidator from "../schema-validators/addProductSchemaValidator.js";

export default async function addProduct(event) {
  try {
    const payload = JSON.parse(event.body);
    const valid = addProductSchemaValidator(payload);

    if (!valid) {
      return {
        statusCode: 400,
        body: JSON.stringify(addProductSchemaValidator.errors),
        headers: {
          "content-type": "application/json",
        },
      };
    }

    const { count, ...productData } = payload;

    const product = await productsRepository.addProduct(productData, count);

    return {
      statusCode: 201,
      body: JSON.stringify(product),
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
