import { ddbDocClient } from "../shared/ddbDocClient.js";
import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

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

      return ProductsRepository.combineProductWithStock(product, productStock);
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
      ? ProductsRepository.combineProductWithStock(product.Item, stock.Item)
      : null;
  }

  static async addProduct(productData, stockCount) {
    const product = ProductsRepository.initProduct(productData);
    const stock = ProductsRepository.initStock(product.id, stockCount);

    await Promise.all([
      ddbDocClient.send(
        new PutCommand({
          TableName: PRODUCTS_TABLE,
          Item: product,
        })
      ),
      ddbDocClient.send(
        new PutCommand({
          TableName: STOCKS_TABLE,
          Item: stock,
        })
      ),
    ]);

    return ProductsRepository.combineProductWithStock(product, stock);
  }

  static combineProductWithStock(product, stock) {
    return {
      ...product,
      ...{ count: stock.count },
    };
  }

  static initProduct(productData) {
    return {
      ...productData,
      ...{ id: uuidv4() },
    };
  }

  static initStock(productId, count) {
    return {
      count,
      product_id: productId,
    };
  }
}
