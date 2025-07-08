'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner';


const TOKENS = ['USDT', 'BTC', 'ETH', 'BNB', 'DOT', 'SOL', 'DOGE', 'TRX', 'XRP', 'USDC', 'LTC', 'MATIC'];
// const TOKENS = ['USDT', 'BTC', 'ETH', 'BNB'];

const page = () => {
  
  const [addresses, setAddresses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load all wallet addresses
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch('/api/wallet/all');
        const data = await res.json();
        const grouped: Record<string, string> = {};
        for (const row of data) {
          grouped[row.token] = row.address;
        }
        setAddresses(grouped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch('/api/wallet/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addresses),
      });
      toast.success('Wallet addresses updated');
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="auto p-6 rounded shadow space-y-6">
      <h1 className="text-2xl font-bold">Admin Wallet Update</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {TOKENS.map((token) => (
            <div
              key={token}
              className="bg-primary-admin p-5 rounded-xl text-white shadow flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02] min-w-[280px] sm:min-w-xs md:min-w-[280px] lg:min-w-lg space-y-1"
            >
            {/* <div key={token} className=""> */}
              <label className="block font-medium">{token} Address</label>
              <input
                value={addresses[token] || ''}
                onChange={(e) =>
                  setAddresses({ ...addresses, [token]: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder={`Enter ${token} wallet address`}
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="col-span-full px-4 py-2 bg-primary-admin/90 cursor-pointer rounded-xl shadow-2xl text-white hover:bg-primary-admin transition"
          >
            {saving ? 'Saving...' : 'Save Addresses'}
          </button>
    </div>
      )}
    </div>
  )
}

export default page