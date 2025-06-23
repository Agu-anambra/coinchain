import { NextResponse } from "next/server";
import config from "@/lib/config";
import ImageKit from "imagekit";

const {
  env: {
    imageKit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });

const allowedOrigins = [
  "https://www.coinchain.tech",
  "https://coinchain.tech",
];

function getCorsOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return allowedOrigins.includes(origin ?? "") ? origin : null;
}

export async function GET(request: Request) {
  const origin = getCorsOrigin(request);

  const headers = new Headers({
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  const res = new NextResponse(
    JSON.stringify(imagekit.getAuthenticationParameters()),
    {
      status: 200,
      headers, // ✅ all headers passed here
    }
  );

  return res;
}

export async function OPTIONS(request: Request) {
  const origin = getCorsOrigin(request);

  const headers = new Headers({
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  return new NextResponse(null, {
    status: 204,
    headers, // ✅ pass headers here too
  });
}
