// Globale Variablen
let walletConnected = false;
let publicKey = null;
let connection = null;
let keypair = null; // Speichert die generierte Wallet

// Neue Wallet erstellen
document.getElementById('createWallet').addEventListener('click', () => {
    if (!window.SolanaWeb3) {
        document.getElementById('walletInfo').innerText = 'SolanaWeb3-Bibliothek nicht geladen. Überprüfe die lokale Datei!';
        console.error('SolanaWeb3 nicht definiert. Datei:', 'solana-web3.js');
        return;
    }

    try {
        // Generiere ein neues Keypair
        keypair = window.SolanaWeb3.Keypair.generate();
        publicKey = keypair.publicKey.toString();
        const privateKey = Buffer.from(keypair.secretKey).toString('hex');

        document.getElementById('walletInfo').innerText = `
            Neue Wallet erstellt!\n
            Öffentliche Adresse: ${publicKey}\n
            Privater Schlüssel: ${privateKey}\n
            SPEICHERE DEN PRIVATEN SCHLÜSSEL SICHER! Er wird nicht gespeichert.
        `;
        walletConnected = true;

        // Verbindung zur Blockchain herstellen
        connection = new window.SolanaWeb3.Connection(window.SolanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
        connection.getBalance(keypair.publicKey).then(balance => {
            document.getElementById('balance').innerText = `SOL-Guthaben: ${(balance / window.SolanaWeb3.LAMPORTS_PER_SOL).toFixed(2)}`;
        }).catch(err => {
            console.error('Balance-Fehler:', err);
        });
    } catch (err) {
        console.error('Wallet-Erstellungsfehler:', err);
        document.getElementById('walletInfo').innerText = `Fehler bei der Wallet-Erstellung: ${err.message}`;
    }
});

// Bestehende Wallet verbinden (z. B. Phantom)
document.getElementById('connectWallet').addEventListener('click', async () => {
    if (!window.solana || !window.solana.isPhantom) {
        document.getElementById('walletInfo').innerText = 'Phantom Wallet nicht gefunden. Bitte installiere die Erweiterung!';
        return;
    }

    if (!window.SolanaWeb3) {
        document.getElementById('walletInfo').innerText = 'SolanaWeb3-Bibliothek nicht geladen. Überprüfe die lokale Datei!';
        console.error('SolanaWeb3 nicht definiert. Datei:', 'solana-web3.js');
        return;
    }

    try {
        const provider = window.solana;
        await provider.connect();
        publicKey = provider.publicKey.toString();
        document.getElementById('walletInfo').innerText = `Verbunden mit Wallet: ${publicKey}`;
        walletConnected = true;
        keypair = null; // Kein Keypair bei Phantom-Verbindung

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
        alert('Bitte erst eine Wallet erstellen oder verbinden!');
        return;
    }
    const tokenAddress = document.getElementById('tokenAddress').value;
    const amount = document.getElementById('amount').value;
    document.getElementById('tradeResult').innerText = `Kauf von ${amount} SOL für Token ${tokenAddress} wird vorbereitet (noch nicht implementiert)`;
});

document.getElementById('sellButton').addEventListener('click', () => {
    if (!walletConnected) {
        alert('Bitte erst eine Wallet erstellen oder verbinden!');
        return;
    }
    const tokenAddress = document.getElementById('tokenAddress').value;
    const amount = document.getElementById('amount').value;
    document.getElementById('tradeResult').innerText = `Verkauf von ${amount} SOL für Token ${tokenAddress} wird vorbereitet (noch nicht implementiert)`;
});'amount').value;
    document.getElementById('tradeResult').innerText = `Verkauf von ${amount} SOL für Token ${tokenAddress} wird vorbereitet (noch nicht implementiert)`;
});
