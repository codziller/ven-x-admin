import { isBoolean, isEmpty } from "lodash";

const cleanPayload = (payload) => {
  Object.keys(payload).forEach((key) => {
    if (!isBoolean(payload[key]) && isEmpty(payload[key])) {
      delete payload[key];
    }
  });
  return payload;
};
export default cleanPayload;
