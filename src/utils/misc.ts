export const getUrlParams = () => {
  const query = window.location.search.slice(1) ?? "";
  const queryParams: Record<string, string> = {};

  query.split("&").forEach((params) => {
    const [field, value] = params.split("=");
    queryParams[field] = value;
  });

  return queryParams;
};

export const sleep = async (ms: number) => {
  /**@param ms  Number of milliSeconds */
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
