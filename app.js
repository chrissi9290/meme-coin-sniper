// Wallet-Verbindung
let walletConnected = false;
let publicKey = null;
let connection = null;

document.getElementById('connectWallet').addEventListener('click', async () => {
    if (window.solana) {
        try {
            const provider = window.solana;
            const response = await provider.connect();
            publicKey = response.publicKey.toString();
            document.getElementById('walletInfo').innerText = `Verbunden mit Wallet: ${publicKey}`;
            walletConnected = true;

            // Verbindung zur Solana-Blockchain herstellen
            connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
            const balance = await connection.getBalance(new solanaWeb3.PublicKey(publicKey));
            document.getElementById('balance').innerText = `SOL-Guthaben: ${(balance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(2)}`;
        } catch (err) {
            console.error(err);
            document.getElementById('walletInfo').innerText = 'Fehler bei der Wallet-Verbindung';
        }
    } else {
        document.getElementById('walletInfo').innerText = 'Kein Solana-Wallet gefunden (z.B. Phantom installieren)';
    }
});

// Token-Liste von DEXscreener abrufen
async function fetchTokens() {
    try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/solana');
        const data = await response.json();
        const tokenList = document.getElementById('tokenList');
        tokenList.innerHTML = '';

        // Beispiel: Nur die ersten 5 Token anzeigen
        data.pairs.slice(0, 5).forEach(token => {
            const tokenDiv = document.createElement('div');
            tokenDiv.className = 'token';
            tokenDiv.innerHTML = `
                <strong>${token.baseToken.symbol}</strong> 
                - Preis: $${token.priceUsd} 
                - Adresse: ${token.baseToken.address}
            `;
            tokenList.appendChild(tokenDiv);
        });
    } catch (err) {
        console.error(err);
        document.getElementById('tokenList').innerText = 'Fehler beim Laden der Token';
    }
}

// Token-Liste beim Laden der Seite abrufen
fetchTokens();

// Platzhalter für Handelsfunktionen
document.getElementById('buyButton').addEventListener('click', () => {
    if (!walletConnected) {
        alert('Bitte erst die Wallet verbinden!');
        return;
    }
    const tokenAddress = document.getElementById('tokenAddress').value;
    const amount = document.getElementById('amount').value;
    document.getElementById('tradeResult').innerText = `Kauf von ${amount} SOL für Token ${tokenAddress} wird vorbereitet (noch nicht implementiert)`;
});

document.getElementById('sellButton').addEventListener('click', () => {
    if (!walletConnected) {
        alert('Bitte erst die Wallet verbinden!');
        return;
    }
    const tokenAddress = document.getElementById('tokenAddress').value;
    const amount = document.getElementById('amount').value;
    document.getElementById('tradeResult').innerText = `Verkauf von ${amount} SOL für Token ${tokenAddress} wird vorbereitet (noch nicht implementiert)`;
});
