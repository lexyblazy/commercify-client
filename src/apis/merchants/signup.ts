import apisauce from "apisauce";

import * as consts from "../consts";

export const signup = async (params: MerchantSignupParams) => {
  const api = apisauce.create({ baseURL: consts.BASE_URL });

  return api.post<MerchantSignupResponse, CommonApiError>("/merchants", params);
};
