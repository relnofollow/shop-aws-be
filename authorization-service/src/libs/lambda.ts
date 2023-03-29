export function logRequest() {
  const logRequestBefore = async (request) => {
    console.log("event = ", JSON.stringify(request.event));
  };
  return {
    before: logRequestBefore,
  };
}
