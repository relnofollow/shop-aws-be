import initAjv from "../shared/initAjv.js";

const schema = {
  type: "object",
  properties: {
    title: {
      type: "string",
    },
    company: {
      type: "string",
    },
    description: {
      type: "string",
    },
    price: {
      type: "number",
      format: "float",
    },
    count: {
      minimum: 0,
      type: "integer",
    },
    minAge: {
      maximum: 100,
      minimum: 0,
      type: "integer",
    },
    reviews: {
      minimum: 0,
      type: "integer",
    },
    rating: {
      maximum: 5,
      minimum: 0,
      type: "integer",
    },
  },
};

schema.required = Object.keys(schema.properties);

const ajv = initAjv();
const addProductSchemaValidator = ajv.compile(schema);

export default addProductSchemaValidator;
