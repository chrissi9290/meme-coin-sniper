// Globale Variablen
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
        console.error(err);
        document.getElementById('tokenList').innerText = 'Fehler beim Laden der Token';
    }
}

// Token-Adresse in Handelsbereich einfügen
function selectToken(address) {
    document.getElementById('tokenAddress').value = address;
}

// Token-Liste laden
fetchTokens();

// Raydium Swap-Funktion (vereinfacht)
async function performRaydiumSwap(isBuy, tokenAddress, amountSol) {
    if (!walletConnected || !connection || !publicKey) {
        alert('Bitte erst die Wallet verbinden!');
        return;
    }

    try {
        // Beispiel: SOL zu Token tauschen (kaufen)
        const amountLamports = amountSol * solanaWeb3.LAMPORTS_PER_SOL;
        const tokenMint = new solanaWeb3.PublicKey(tokenAddress);
        const wallet = new solanaWeb3.PublicKey(publicKey);

        // Raydium-Setup (vereinfacht, Pool-ID müsste spezifisch sein)
        const raydium = window.raydium; // Von Raydium SDK geladen
        const tx = new solanaWeb3.Transaction();

        // Dummy-Beispiel: Hier müssten echte Pool-Daten und Swap-Instruction hinzugefügt werden
        // Dies ist ein Platzhalter – echte Implementierung benötigt Pool-Details
        tx.add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: wallet,
                toPubkey: wallet, // Dummy, sollte Pool-Adresse sein
                lamports: amountLamports
            })
        );

        // Transaktion signieren und senden
        const signedTx = await window.solana.signTransaction(tx);
        const txId = await connection.sendRawTransaction(signedTx.serialize());
        
        document.getElementById('tradeResult').innerText = `${isBuy ? 'Kauf' : 'Verkauf'} wird ausgeführt. TxID: ${txId}`;
    } catch (err) {
        console.error(err);
        document.getElementById('tradeResult').innerText = `Fehler: ${err.message}`;
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
