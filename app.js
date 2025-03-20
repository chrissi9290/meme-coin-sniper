// Debugging: Prüfe, ob SolanaWeb3 verfügbar ist
console.log('Prüfe SolanaWeb3:', window.SolanaWeb3);

// Globale Variablen
let walletConnected = false;
let publicKey = null;
let connection = null;

document.getElementById('connectWallet').addEventListener('click', async () => {
    if (!window.solana || !window.solana.isPhantom) {
        document.getElementById('walletInfo').innerText = 'Phantom Wallet nicht gefunden. Bitte installiere die Erweiterung!';
        return;
    }

    if (!window.SolanaWeb3) {
        document.getElementById('walletInfo').innerText = 'SolanaWeb3-Bibliothek nicht geladen. Überprüfe den CDN-Link oder die Konsole!';
        console.error('SolanaWeb3 nicht definiert. Lokale Datei:', 'solana-web3.js');
        console.log('Verfügbare globale Objekte:', Object.keys(window));
        return;
    }

    try {
        const provider = window.solana;
        await provider.connect();
        publicKey = provider.publicKey.toString();
        document.getElementById('walletInfo').innerText = `Verbunden mit Wallet: ${publicKey}`;
        walletConnected = true;

        connection = new window.SolanaWeb3.Connection(window.SolanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
        const balance = await connection.getBalance(new window.SolanaWeb3.PublicKey(publicKey));
        document.getElementById('balance').innerText = `SOL-Guthaben: ${(balance / window.SolanaWeb3.LAMPORTS_PER_SOL).toFixed(2)}`;
    } catch (err) {
        console.error('Wallet-Verbindungsfehler:', err);
        document.getElementById('walletInfo').innerText = `Fehler bei der Wallet-Verbindung: ${err.message}`;
    }
});

// Token-Liste von DEXscreener abrufen (mit Fallback)
async function fetchTokens() {
    const tokenList = document.getElementById('tokenList');
    tokenList.innerHTML = 'Lade Token...';

    try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/search?q=SOL');
        if (!response.ok) throw new Error(`HTTP-Fehler: ${response.status}`);
        const data = await response.json();

        tokenList.innerHTML = '';
        data.pairs.slice(0, 5).forEach(token => {
            const tokenDiv = document.createElement('div');
            tokenDiv.className = 'token';
            tokenDiv.innerHTML = `
                <strong>${token.baseToken.symbol}</strong> 
                - Preis: $${token.priceUsd} 
                - Adresse: ${token.baseToken.address}
                <button onclick="selectToken('${token.baseToken.address}')">Auswählen</button>
            `;
            tokenList.appendChild(tokenDiv);
        });
    } catch (err) {
        console.error('Token-Ladefehler:', err);
        tokenList.innerHTML = '';
        const fallbackTokens = [
            { symbol: 'TEST1', priceUsd: '0.01', address: '11111111111111111111111111111111' },
            { symbol: 'TEST2', priceUsd: '0.02', address: '22222222222222222222222222222222' }
        ];
        fallbackTokens.forEach(token => {
            const tokenDiv = document.createElement('div');
            tokenDiv.className = 'token';
            tokenDiv.innerHTML = `
                <strong>${token.symbol}</strong> 
                - Preis: $${token.priceUsd} 
                - Adresse: ${token.address}
                <button onclick="selectToken('${token.address}')">Auswählen</button>
            `;
            tokenList.appendChild(tokenDiv);
        });
        tokenList.insertAdjacentHTML('beforeend', '<p>(Fehler beim Laden von DEXscreener, Fallback verwendet)</p>');
    }
}

function selectToken(address) {
    document.getElementById('tokenAddress').value = address;
}

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
