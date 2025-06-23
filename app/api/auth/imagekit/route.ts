import config from "@/lib/config";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const {env:{imageKit:{publicKey, privateKey, urlEndpoint}}} = config;

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

// Allowlist both domains
const allowedOrigins = [
  "https://www.coinchain.tech",
  "https://coinchain.tech",
];

function getCorsOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return allowedOrigins.includes(origin || "") ? origin : null;
}

export async function GET(request: Request) {
  console.log("Incoming origin:", request.headers.get("origin"));

  const origin = getCorsOrigin(request);
  const res = NextResponse.json(imagekit.getAuthenticationParameters());

  if (origin) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }

  res.headers.set("Access-Control-Allow-Methods", "GET");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return res;

}

export async function OPTIONS(request: Request) {
  const origin = getCorsOrigin(request);
  const res = new NextResponse(null, { status: 204 });

  if (origin) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }

  res.headers.set("Access-Control-Allow-Methods", "GET");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return res;
}