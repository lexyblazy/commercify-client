import apisauce from "apisauce";

import * as utils from "../../utils";

import * as consts from "../consts";

export const list = () => {
  const token = utils.auth.getToken();

  const api = apisauce.create({
    baseURL: consts.BASE_URL,
    headers: {
      authorization: token,
    },
  });

  return api.get<any, CommonApiError>("/products");
};
