
const { PhantomWalletAdapter } = solanaWalletAdapterWallets;
const { Jupiter, TOKEN_LIST_URL } = jupiterCore;

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
      <td><button onclick="buyCoin('${coin.baseToken.address}', '${coin.baseToken.symbol}')">Buy</button></td>
    `;
    coinList.appendChild(row);
  });
}

loadCoins();

async function buyCoin(outputMintAddress, symbol) {
  if (!wallet.connected) {
    alert("Please connect your wallet first!");
    return;
  }

  try {
    const amountSol = parseFloat(document.getElementById('amountInput').value);
    const slippage = parseFloat(document.getElementById('slippageInput').value);

    if (isNaN(amountSol) || amountSol <= 0) {
      alert("Invalid amount!");
      return;
    }

    alert(`Preparing swap for ${symbol}: ${amountSol} SOL with ${slippage}% slippage...`);

    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));

    const jupiter = await Jupiter.load({
      connection,
      cluster: "mainnet-beta",
      user: wallet,
      wrapUnwrapSOL: true
    });

    await jupiter.loadTokens(TOKEN_LIST_URL['mainnet-beta']);

    const inputMint = jupiter.tokens.SOL.mintAddress;
    const outputMint = outputMintAddress;

    const amount = amountSol * solanaWeb3.LAMPORTS_PER_SOL;

    const routes = await jupiter.computeRoutes({
      inputMint,
      outputMint,
      amount,
      slippage: slippage,
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
    addTxToHistory(symbol, txid);

  } catch (err) {
    console.error("Swap failed:", err);
    alert("Swap failed!");
  }
}

function addTxToHistory(symbol, txid) {
  const txList = document.getElementById('txList');
  const li = document.createElement('li');
  li.innerHTML = `${symbol} - <a href="https://solscan.io/tx/${txid}" target="_blank">${txid}</a>`;
  txList.prepend(li);
}

// === Auto-Sniper Placeholder ===
let autoSniperEnabled = false;

document.getElementById('autoSniper').addEventListener('click', () => {
  autoSniperEnabled = !autoSniperEnabled;
  document.getElementById('autoSniper').innerText = autoSniperEnabled ? "Auto-Sniper Mode: ON" : "Auto-Sniper Mode: OFF";
  if (autoSniperEnabled) {
    alert("Auto-Sniper activated! (Simulation Mode)");
    startAutoSniper();
  } else {
    alert("Auto-Sniper deactivated.");
  }
});

function startAutoSniper() {
  // Placeholder: In real use, you would monitor Pump.fun or Raydium for new coins
  setInterval(() => {
    if (autoSniperEnabled) {
      console.log("Auto-Sniper scanning...");
      // You could implement API call here and auto-buy
    }
  }, 10000);
}
