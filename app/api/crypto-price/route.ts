export async function GET() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,polkadot,solana,dogecoin,tron,ripple,usd-coin,litecoin,matic-network&vs_currencies=usd&include_24hr_change=true"
  );

  const data = await res.json();
  return Response.json(data);
}
