export async function GET() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether,ethereum,binancecoin&vs_currencies=usd&include_24hr_change=true"
  );
  const data = await res.json();
  return Response.json(data);
}
