// Wallet-Verbindung
document.getElementById('connectWallet').addEventListener('click', async () => {
    if (window.solana) {
        try {
            const provider = window.solana;
            const response = await provider.connect();
            const publicKey = response.publicKey.toString();
            document.getElementById('walletInfo').innerText = `Connected to wallet: ${publicKey}`;
            const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
            const balance = await connection.getBalance(new solanaWeb3.PublicKey(publicKey));
            document.getElementById('balance').innerText = `SOL Balance: ${(balance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(2)}`;
        } catch (err) {
            console.error(err);
        }
    } else {
        document.getElementById('walletInfo').innerText = 'No Solana wallet found';
    }
});

// Token-Liste von DEXscreener abrufen
async function fetchTokens() {
    const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/solana');
    const data = await response.json();
    const tokenList = document.getElementById('tokenList');
    tokenList.innerHTML = '';
    data.pairs.forEach(token => {
        const tokenDiv = document.createElement('div');
        tokenDiv.innerHTML = `<strong>${token.baseToken.symbol}</strong> - Preis: ${token.priceUsd}`;
        tokenList.appendChild(tokenDiv);
    });
}

// Token-Liste laden
fetchTokens();
