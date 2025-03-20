// Pump.fun Daten laden (via PumpPortal REST API)
async function loadPumpfunTokens() {
    try {
        const response = await fetch('https://pumpportal.fun/api/data/created-tokens');
        const tokens = await response.json();
        const latestTokens = tokens.slice(0, 5); // Nur die neuesten 5 Tokens
        const container = document.getElementById('pumpfun-tokens');
        container.innerHTML = '';

        latestTokens.forEach(token => {
            const card = document.createElement('div');
            card.className = 'token-card';
            card.innerHTML = `
                <p>${token.name} (${token.symbol})</p>
                <p>Adresse: ${token.mint.slice(0, 8)}...</p>
                <a href="https://pump.fun/${token.mint}" target="_blank">Handeln</a>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Fehler beim Laden der Pump.fun-Daten:', error);
        document.getElementById('pumpfun-tokens').innerHTML = '<p>Daten konnten nicht geladen werden.</p>';
    }
}

// Raydium Daten laden
async function loadRaydiumPools() {
    try {
        const response = await fetch('https://api.raydium.io/v2/ammV3/ammPools');
        const data = await response.json();
        const pools = data.slice(0, 10); // Nur die ersten 10 Pools
        const container = document.getElementById('raydium-pools');
        container.innerHTML = '';

        pools.forEach(pool => {
            const card = document.createElement('div');
            card.className = 'token-card';
            card.innerHTML = `
                <p>${pool.baseMint.slice(0, 8)}... / ${pool.quoteMint.slice(0, 8)}...</p>
                <p>Preis: ${pool.price.toFixed(6)} SOL</p>
                <a href="https://raydium.io/swap/?inputMint=${pool.baseMint}&outputMint=${pool.quoteMint}" target="_blank">Handeln</a>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Fehler beim Laden der Raydium-Daten:', error);
        document.getElementById('raydium-pools').innerHTML = '<p>Daten konnten nicht geladen werden.</p>';
    }
}

// DEXscreener Daten laden (Hypothetisch, API muss angepasst werden)
async function loadDexscreenerTokens() {
    try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/search?q=solana');
        const data = await response.json();
        const tokens = data.pairs.slice(0, 5); // Nur die ersten 5 Tokens
        const container = document.getElementById('dexscreener-tokens');
        container.innerHTML = '';

        tokens.forEach(token => {
            const card = document.createElement('div');
            card.className = 'token-card';
            card.innerHTML = `
                <p>${token.baseToken.symbol} / ${token.quoteToken.symbol}</p>
                <p>Preis: $${token.priceUsd}</p>
                <a href="${token.url}" target="_blank">Details</a>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Fehler beim Laden der DEXscreener-Daten:', error);
        document.getElementById('dexscreener-tokens').innerHTML = '<p>Daten konnten nicht geladen werden. API muss überprüft werden.</p>';
    }
}

// Funktionen beim Laden der Seite ausführen
window.onload = () => {
    loadPumpfunTokens();
    loadRaydiumPools();
    loadDexscreenerTokens();
};
