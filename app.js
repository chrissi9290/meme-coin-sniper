// Globale Variablen
let walletConnected = false;
let publicKey = null;
let connection = null;

document.getElementById('connectWallet').addEventListener('click', async () => {
    if (!window.solana || !window.solana.isPhantom) {
        document.getElementById('walletInfo').innerText = 'Phantom Wallet nicht gefunden. Bitte installiere die Erweiterung!';
        return;
    }

    try {
        const provider = window.solana;
        await provider.connect();
        publicKey = provider.publicKey.toString();
        document.getElementById('walletInfo').innerText = `Verbunden mit Wallet: ${publicKey}`;
        walletConnected = true;

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
    }
});

// Token-Liste von DEXscreener abrufen (mit Fallback)
async function fetchTokens() {
    const tokenList = document.getElementById('tokenList');
    tokenList.innerHTML = 'Lade Token...';

    try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana');
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

// Raydium Swap-Funktion
async function performRaydiumSwap(isBuy, tokenAddress, amountSol) {
    if (!walletConnected || !connection || !publicKey) {
        alert('Bitte erst die Wallet verbinden!');
        return;
    }

    try {
        const amountLamports = amountSol * SolanaWeb3.LAMPORTS_PER_SOL;
        const tokenMint = new SolanaWeb3.PublicKey(tokenAddress);
        const wallet = new SolanaWeb3.PublicKey(publicKey);

        // Beispiel-Pool-ID (muss durch echte Pool-ID ersetzt werden)
        const poolId = new SolanaWeb3.PublicKey('58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2'); // Beispiel: SOL-USDC Pool
        const raydium = window.raydium;

        // Transaktion vorbereiten
        const tx = new SolanaWeb3.Transaction();

        // Vereinfachter Swap (Platzhalter, echte Logik folgt)
        // Hinweis: Für echte Swaps müssen wir Pool-Daten abrufen und raydium SDK nutzen
        tx.add(
            SolanaWeb3.SystemProgram.transfer({
                fromPubkey: wallet,
                toPubkey: poolId, // Sollte Pool-Adresse sein
                lamports: amountLamports
            })
        );

        // Transaktion signieren und senden
        const signedTx = await window.solana.signTransaction(tx);
        const txId = await connection.sendRawTransaction(signedTx.serialize());
        
        document.getElementById('tradeResult').innerText = `${isBuy ? 'Kauf' : 'Verkauf'} ausgeführt. TxID: ${txId}`;
    } catch (err) {
        console.error('Swap-Fehler:', err);
        document.getElementById('tradeResult').innerText = `Fehler beim Swap: ${err.message}`;
    }
}

// Kauf-Button
document.getElementById('buyButton').addEventListener('click', async () => {
    const tokenAddress = document.getElementById('tokenAddress').value;
    const amount = parseFloat(document.getElementById('amount').value);
    if (!tokenAddress || !amount) {
        alert('Bitte Token-Adresse und Menge eingeben!');
        return;
    }
    await performRaydiumSwap(true, tokenAddress, amount);
});

// Verkauf-Button
document.getElementById('sellButton').addEventListener('click', async () => {
    const tokenAddress = document.getElementById('tokenAddress').value;
    const amount = parseFloat(document.getElementById('amount').value);
    if (!tokenAddress || !amount) {
        alert('Bitte Token-Adresse und Menge eingeben!');
        return;
    }
    await performRaydiumSwap(false, tokenAddress, amount);
});
