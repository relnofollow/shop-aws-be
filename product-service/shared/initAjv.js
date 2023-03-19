import Ajv from "ajv";
import addFormats from "ajv-formats";

export default function initAjv() {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  return ajv;
}
