import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";

export function logRequest() {
  const logRequestBefore = async (request) => {
    console.log("event = ", JSON.stringify(request.event));
  };
  return {
    before: logRequestBefore,
  };
}

export function handleError() {
  const handleErrorOnError = async (request) => {
    console.error(request.error);

    return {
      statusCode: 500,
      body: request.error.message,
    };
  };

  return {
    onError: handleErrorOnError,
  };
}


export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser()).use(logRequest()).use(handleError());
}
