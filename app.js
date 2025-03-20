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

        connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
        const balance = await connection.getBalance(new solanaWeb3.PublicKey(publicKey));
        document.getElementById('balance').innerText = `SOL-Guthaben: ${(balance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(2)}`;
    } catch (err) {
        console.error('Wallet-Verbindungsfehler:', err);
        document.getElementById('walletInfo').innerText = `Fehler bei der Wallet-Verbindung: ${err.message}`;
    }
});
