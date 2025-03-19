const { PhantomWalletAdapter } = solanaWalletAdapterWallets;

const wallet = new PhantomWalletAdapter();

// Check if Phantom installed
if (!wallet.ready) {
  alert("Please install Phantom Wallet extension!");
}

document.getElementById('connectWallet').addEventListener('click', async () => {
  try {
    await wallet.connect();
    const publicKey = wallet.publicKey.toString();
    document.getElementById('walletAddress').innerText = `Connected: ${publicKey}`;
    console.log("Wallet connected:", publicKey);
  } catch (err) {
    console.error('Wallet connection failed:', err);
    alert("Wallet connection failed!");
});
