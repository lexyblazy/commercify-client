import { ApiResponse } from "apisauce";

// TODO - the alerts are temporary for time being, 
// the ideal plan is have some globally available Toast/SnackBar that will be used to show network/server errors
export const handleErrors = async <T, U = T>({
  response,
  onClientError,
  onNetworkError,
  onServerError,
}: {
  response: ApiResponse<T, U>;
  onClientError: () => void;
  onNetworkError?: () => void;
  onServerError?: () => void;
}) => {
  if (response.problem === "CLIENT_ERROR") {
    onClientError();
  } else if (
    response.problem === "NETWORK_ERROR" ||
    response.problem === "CONNECTION_ERROR"
  ) {
    onNetworkError
      ? onNetworkError()
      : alert("There seems to be a problem with your network/connection"); 
  } else {
    onServerError
      ? onServerError()
      : alert(
          "It's not you, it's us, Our servers are having a temporary hiccup"
        );
  }
};
