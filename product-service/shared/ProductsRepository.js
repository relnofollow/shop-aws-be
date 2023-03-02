import { ddbDocClient } from "../shared/ddbDocClient.js";
import { GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;

const productsScanParams = {
  TableName: PRODUCTS_TABLE,
};

const stocksScanParams = {
  TableName: STOCKS_TABLE,
};

export default class ProductsRepository {
  static async getProducts() {
    const products = await ddbDocClient.send(
      new ScanCommand(productsScanParams)
    );
    const stocks = await ddbDocClient.send(new ScanCommand(stocksScanParams));

    return products.Items.map((product) => {
      const productStock = stocks.Items.find(
        (stock) => stock.product_id === product.id
      );

      return {
        ...product,
        ...(productStock ? { count: productStock.count } : {}),
      };
    });
  }

  static async getProductById(id) {
    const productsGetByIdParams = {
      TableName: PRODUCTS_TABLE,
      Key: {
        id,
      },
    };

    const stocksGetByIdParams = {
      TableName: STOCKS_TABLE,
      Key: {
        product_id: id,
      },
    };

    const product = await ddbDocClient.send(
      new GetCommand(productsGetByIdParams)
    );
    const stock = await ddbDocClient.send(new GetCommand(stocksGetByIdParams));

    return product.Item && stock.Item
      ? {
          ...product.Item,
          ...{ count: stock.Item.count },
        }
      : null;
  }
}
