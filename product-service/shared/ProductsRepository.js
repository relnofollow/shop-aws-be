import { ddbDocClient } from "./ddbDocClient.js";
import {
  GetCommand,
  ScanCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;

const productsScanParams = {
  TableName: PRODUCTS_TABLE,
};

const stocksScanParams = {
  TableName: STOCKS_TABLE,
};

class ProductsRepository {
  async getProducts() {
    const products = await ddbDocClient.send(
      new ScanCommand(productsScanParams)
    );
    const stocks = await ddbDocClient.send(new ScanCommand(stocksScanParams));

    return products.Items.map((product) => {
      const productStock = stocks.Items.find(
        (stock) => stock.product_id === product.id
      );

      return this.combineProductWithStock(product, productStock);
    });
  }

  async getProductById(id) {
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
      ? this.combineProductWithStock(product.Item, stock.Item)
      : null;
  }

  async addProduct(productData, stockCount) {
    const product = this.initProduct(productData);
    const stock = this.initStock(product.id, stockCount);

    await ddbDocClient.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: PRODUCTS_TABLE,
              Item: product,
            },
          },
          {
            Put: {
              TableName: STOCKS_TABLE,
              Item: stock,
            },
          },
        ],
      })
    );

    return this.combineProductWithStock(product, stock);
  }

  combineProductWithStock(product, stock) {
    return {
      ...product,
      ...{ count: stock.count },
    };
  }

  initProduct(productData) {
    return {
      ...productData,
      ...{ id: uuidv4() },
    };
  }

  initStock(productId, count) {
    return {
      count,
      product_id: productId,
    };
  }
}

const productsRepository = new ProductsRepository();

export default productsRepository;
