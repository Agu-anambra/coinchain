"use client";
import config from "@/lib/config";
// import {
//   Image,
//   ImageKitProvider,
//   upload,
// } from "@imagekit/next";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import ImageKit from "imagekit";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner"

const {
  env: {
    imageKit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndPoint}/api/auth/imagekit`);

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
const ImageUpload = ({onFileChange}:{onFileChange:(filePath:string)=>void}) => {
  const IKUploadRef = useRef(null);

  const [file, setFile] = useState<{ filePath: string } | null>(null);

  const onError = (error: any) => {
    toast("ID upload failed.", { description: 'Your ID could not be uploaded. Please try again!' })
    console.error("Upload failed:", error);
  };
  const onSuccess = (res: any) => {
    setFile(res)
    onFileChange(res.filePath);
    toast("ID uploaded successfully.", { description: `${res.filePath} uploaded successfully!` })
    // toast({
    //       title: "Scheduled: Catch up",
    //       description: "Friday, February 10, 2023 at 5:57 PM",
    //     })
  };
  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
      className='hidden'
        ref={IKUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        fileName="test-image.jpg"
        folder="/uploads"
      />
      <button className="upload-btn cursor-pointer" onClick={(e) => {
        e.preventDefault();
        if(IKUploadRef.current){
          // @ts-ignore
        IKUploadRef.current?.click()
        }}}>
        <Image
          src={"/icons/upload.svg"}
          alt="upload icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className="text-base text-light-100">Upload a File</p>
        {file && <p className="upload-filename">{file.filePath}</p>}
      </button>

      {file && (
        <IKImage
          path={file.filePath}
          // transformation={[{ width: "300", height: "300", crop: "scale" }]}
          className="uploaded-image"
          alt={file.filePath}
          width={500}
          height={300}
        />
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;
