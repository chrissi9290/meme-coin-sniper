const { PhantomWalletAdapter } = solanaWalletAdapterWallets;

const wallet = new PhantomWalletAdapter();

document.getElementById('connectWallet').addEventListener('click', async () => {
  try {
    await wallet.connect();
    const publicKey = wallet.publicKey.toString();
    document.getElementById('walletAddress').innerText = `Connected: ${publicKey}`;
    console.log("Wallet connected:", publicKey);
  } catch (err) {
    console.error('Wallet connection failed', err);
  }
});

// === DexScreener Integration ===
async function loadCoins() {
  const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana');
  const data = await response.json();

  const coinList = document.getElementById('coinList');
  coinList.innerHTML = '';

  // Wir nehmen z.B. die ersten 10 Coins
  data.pairs.slice(0, 10).forEach(coin => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${coin.baseToken.name}</td>
      <td>${coin.baseToken.symbol}</td>
      <td>$${Number(coin.priceUsd).toFixed(4)}</td>
      <td>$${(coin.liquidity.usd).toLocaleString()}</td>
      <td><button onclick="buyCoin('${coin.baseToken.symbol}')">Buy</button></td>
    `;
    coinList.appendChild
