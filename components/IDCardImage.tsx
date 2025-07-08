import config from "@/lib/config";
import { IKImage, ImageKitProvider } from "imagekitio-next";

const {
  env: {
    imageKit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndPoint}/api/auth/imagekit`);

    console.log("API endpoint used:", config.env.apiEndPoint);

    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.text()}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { token, signature, expire };
  } catch (error: any) {
    throw new Error(`Authentication request failed ${error.message}`);
  }
};

const IDCardImage = ({ path }: { path: string }) => {
  if (!path) return null;

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKImage
        path={path}
        alt="User ID Card"
        width={300}
        height={200}
        className="rounded shadow"
      />
    </ImageKitProvider>
  );
};

export default IDCardImage;
