const { WalletAdapterNetwork } = solanaWalletAdapterBase;
const { PhantomWalletAdapter } = solanaWalletAdapterWallets;
const { Wallets } = solanaWalletAdapter;
const network = WalletAdapterNetwork.Mainnet;

const wallet = new PhantomWalletAdapter();

document.getElementById('connectWallet').addEventListener('click', async () => {
  try {
    await wallet.connect();
    const publicKey = wallet.publicKey.toString();
    document.getElementById('walletAddress').innerText = `Connected: ${publicKey}`;
    console.log("Wallet connected:", publicKey);
  } catch (err) {
    console.error('Wallet connection failed:', err);
    alert("Wallet connection failed. Make sure Phantom is installed!");
  }
});
