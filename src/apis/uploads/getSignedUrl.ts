import apisauce from "apisauce";

import * as utils from "../../utils";

import * as consts from "../consts";

export const getSignedUrl = (files: Array<{ name: string; type: string }>) => {
  const token = utils.auth.getToken();

  const api = apisauce.create({
    baseURL: consts.BASE_URL,
    headers: {
      authorization: token,
    },
  });

  return api.post<string[], CommonApiError>("/uploads/signed-url", {
    files,
  });
};
