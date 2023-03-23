import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

import catalogBatchProcess from "../catalogBatchProcess.js";
import productsRepository from "../../shared/productsRepository.js";

jest.mock("../../shared/productsRepository.js");
const SNSClientMock = mockClient(SNSClient);

beforeEach(() => {
  SNSClientMock.reset();
  productsRepository.addProduct.mockReset();
});

describe("catalogBatchProcess function", () => {
  it("should try to store every product from 'Records' property", async () => {
    // arrange
    const event = {
      Records: [
        {
          body: '{"title":"Test Product 1","company":"Test Company 1","description":"Lorem ipsum","price":10,"count":2,"minAge":6,"reviews":0,"rating":0}',
        },
        {
          body: '{"title":"Test Product 2","company":"Test Company 2","description":"Lorem ipsum","price":20,"count":4,"minAge":10,"reviews":0,"rating":0}',
        },
      ],
    };
    productsRepository.addProduct
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});

    // act
    await catalogBatchProcess(event);

    // assert
    // Store correct number of records
    expect(productsRepository.addProduct).toHaveBeenCalledTimes(2);
    // Store 1st product data
    expect(productsRepository.addProduct.mock.calls[0][0]).toEqual({
      company: "Test Company 1",
      description: "Lorem ipsum",
      minAge: 6,
      price: 10,
      rating: 0,
      reviews: 0,
      title: "Test Product 1",
    });
    // Store 1st product stock
    expect(productsRepository.addProduct.mock.calls[0][1]).toEqual(2);

    // Store 2nd product data
    expect(productsRepository.addProduct.mock.calls[1][0]).toEqual({
      title: "Test Product 2",
      company: "Test Company 2",
      description: "Lorem ipsum",
      price: 20,
      minAge: 10,
      reviews: 0,
      rating: 0,
    });
    // Store 2nd product stock
    expect(productsRepository.addProduct.mock.calls[1][1]).toEqual(4);
  });

  it("should send SNS message after successfully adding products", async () => {
    // arrange
    const event = {
      Records: [
        {
          body: '{"title":"Test Product 1","company":"Test Company 1","description":"Lorem ipsum","price":10,"count":2,"minAge":6,"reviews":0,"rating":0}',
        },
      ],
    };
    productsRepository.addProduct.mockResolvedValueOnce({});

    // act
    await catalogBatchProcess(event);

    // assert
    expect(SNSClientMock).toHaveReceivedCommandWith(PublishCommand, {
      Subject: "New products were added",
    });
  });

  it("should send SNS message with company = LEGO if any of the added product is LEGO", async () => {
    // arrange
    const event = {
      Records: [
        {
          body: '{"title":"Test Product 1","company":"Test Company 1","description":"Lorem ipsum","price":10,"count":2,"minAge":6,"reviews":0,"rating":0}',
        },
        {
          body: '{"title":"Test Product 2","company":"LEGO","description":"Lorem ipsum","price":20,"count":4,"minAge":10,"reviews":0,"rating":0}',
        },
      ],
    };
    productsRepository.addProduct
      .mockResolvedValueOnce({ company: "Test Company 1" })
      .mockResolvedValueOnce({ company: "LEGO" });

    // act
    await catalogBatchProcess(event);

    // assert
    expect(SNSClientMock).toHaveReceivedCommandWith(PublishCommand, {
      MessageAttributes: {
        company: {
          DataType: "String",
          StringValue: "LEGO",
        },
      },
    });
  });

  it("should send SNS message with company = company of first added product, if no LEGO product was added", async () => {
    // arrange
    const event = {
      Records: [
        {
          body: '{"title":"Test Product 1","company":"Test Company 1","description":"Lorem ipsum","price":10,"count":2,"minAge":6,"reviews":0,"rating":0}',
        },
        {
          body: '{"title":"Test Product 2","company":"Test Company 2","description":"Lorem ipsum","price":20,"count":4,"minAge":10,"reviews":0,"rating":0}',
        },
      ],
    };
    productsRepository.addProduct
      .mockResolvedValueOnce({ company: "Test Company 1" })
      .mockResolvedValueOnce({ company: "Test Company 2" });

    // act
    await catalogBatchProcess(event);

    // assert
    expect(SNSClientMock).toHaveReceivedCommandWith(PublishCommand, {
      MessageAttributes: {
        company: {
          DataType: "String",
          StringValue: "Test Company 1",
        },
      },
    });
  });
});
