 const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Market } = require('@project-serum/serum');
const fetch = require('node-fetch');
const fs = require('fs');

// Solana Connection
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Load Wallet
const secretKey = JSON.parse(fs.readFileSync('wallet.json'));
const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));

// Trading Parameters
const TP_PERCENT = 1.2;  // 20% Gewinn
const SL_PERCENT = 0.9;  // 10% Stop-Loss
const BASE_TRADE_AMOUNT = 1; // In SOL

async function getTokenPrice(tokenAddress) {
    try {
        const res = await fetch(`https://api.raydium.io/token/${tokenAddress}`);
        const data = await res.json();
        return data.price;
    } catch (error) {
        console.error('Fehler beim Abrufen des Token-Preises:', error);
        return null;
    }
}

async function tradeMemeCoin(tokenAddress) {
    const price = await getTokenPrice(tokenAddress);
    if (!price) return;

    const buyPrice = price;
    const sellPrice = buyPrice * TP_PERCENT;
    const stopLossPrice = buyPrice * SL_PERCENT;

    console.log(`Kaufe ${tokenAddress} für Preis: ${buyPrice}`);
    await buyToken(tokenAddress, BASE_TRADE_AMOUNT);

    while (true) {
        const currentPrice = await getTokenPrice(tokenAddress);
        if (!currentPrice) continue;

        if (currentPrice >= sellPrice) {
            console.log(`Verkaufe ${tokenAddress} mit Gewinn bei: ${currentPrice}`);
            await sellToken(tokenAddress, BASE_TRADE_AMOUNT);
            break;
        } else if (currentPrice <= stopLossPrice) {
            console.log(`Verkaufe ${tokenAddress} mit Verlust bei: ${currentPrice}`);
            await sellToken(tokenAddress, BASE_TRADE_AMOUNT);
            break;
        }
        await new Promise(r => setTimeout(r, 5000));
    }
}

async function buyToken(tokenAddress, amount) {
    console.log(`Kaufauftrag für ${tokenAddress} | Menge: ${amount} SOL`);
    // Implementiere Kauf-Logik mit Raydium API
}

async function sellToken(tokenAddress, amount) {
    console.log(`Verkaufsauftrag für ${tokenAddress} | Menge: ${amount} SOL`);
    // Implementiere Verkaufs-Logik mit Raydium API
}

module.exports = { tradeMemeCoin };

