import apisauce from "apisauce";

export const uploadToS3 = async (signedUrl: string, file: File) => {
  const [objectUrl] = signedUrl.split("?");

  const api = apisauce.create({
    baseURL: "",
    headers: {
      "Content-Type": file.type,
    },
  });

  const response = await api.put(signedUrl, file);

  console.log(response.ok, response.data, response.config?.url);

  if (!response.ok) {
    return null;
  }

  return objectUrl;
};
