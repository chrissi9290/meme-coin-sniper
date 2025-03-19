const { PhantomWalletAdapter } = solanaWalletAdapterWallets;
const { Jupiter, TOKEN_LIST_URL } = jupiterCore;

// === Wallet Setup ===
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

// === DexScreener Coin List ===
async function loadCoins() {
  const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana');
  const data = await response.json();

  const coinList = document.getElementById('coinList');
  coinList.innerHTML = '';

  data.pairs.slice(0, 5).forEach(coin => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${coin.baseToken.name}</td>
      <td>${coin.baseToken.symbol}</td>
      <td>$${Number(coin.priceUsd).toFixed(4)}</td>
      <td>$${(coin.liquidity.usd).toLocaleString()}</td>
      <td><button onclick="buyCoin('${coin.baseToken.address}')">Buy</button></td>
    `;
    coinList.appendChild(row);
  });
}

loadCoins();

// === Buy Coin Function ===
async function buyCoin(outputMintAddress) {
  if (!wallet.connected) {
    alert("Please connect your wallet first!");
    return;
  }

  try {
    alert(`Preparing swap for token: ${outputMintAddress}...`);

    // Create connection to Solana
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));

    // Load Jupiter
    const jupiter = await Jupiter.load({
      connection,
      cluster: "mainnet-beta",
      user: wallet,
      wrapUnwrapSOL: true
    });

    // Load Token List
    await jupiter.loadTokens(TOKEN_LIST_URL['mainnet-beta']);

    // Input = SOL
    const inputMint = jupiter.tokens.SOL.mintAddress;
    const outputMint = outputMintAddress; // Target token

    const amount = 0.01 * solanaWeb3.LAMPORTS_PER_SOL; // Example: Swap 0.01 SOL

    const routes = await jupiter.computeRoutes({
      inputMint,
      outputMint,
      amount,
      slippage: 1, // 1% slippage
      forceFetch: true
    });

    if (!routes.routesInfos || routes.routesInfos.length === 0) {
      alert("No route found!");
      return;
    }

    const { execute } = await jupiter.exchange({ routeInfo: routes.routesInfos[0] });
    const txid = await execute();

    alert(`Swap successful! TX ID: ${txid}`);
    console.log("Transaction ID:", txid);
  } catch (err) {
    console.error("Swap failed:", err);
    alert("Swap failed!");
  }
}

