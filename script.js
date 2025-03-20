// Gebühren verwalten
let totalFees = parseFloat(localStorage.getItem('totalFees')) || 0;
document.getElementById('total-fees').textContent = totalFees.toFixed(2);

function chargeFee() {
    const fee = 0.01; // 0,01 MEMEFEE pro Klick
    totalFees += fee;
    localStorage.setItem('totalFees', totalFees);
    document.getElementById('total-fees').textContent = totalFees.toFixed(2);
}

// Raydium Daten laden
fetch('https://api.raydium.io/v2/ammV3/ammPools')
    .then(response => response.json())
    .then(data => {
        const pools = data.data.slice(0, 10); // Nur die ersten 10 Pools
        const container = document.getElementById('raydium-pools');
        pools.forEach(pool => {
            const card = document.createElement('div');
            card.className = 'token-card';
            card.innerHTML = `
                <p>${pool.baseMint} / ${pool.quoteMint}</p>
                <p>Preis: ${pool.price.toFixed(6)}</p>
                <a href="https://raydium.io/swap/?inputMint=${pool.baseMint}&outputMint=${pool.quoteMint}" target="_blank" onclick="chargeFee()">Handeln</a>
            `;
            container.appendChild(card);
        });
    })
    .catch(error => console.error('Fehler beim Laden von Raydium:', error));

// DEXscreener Daten laden (angenommene API)
fetch('https://api.dexscreener.com/latest/dex/pairs/solana')
    .then(response => response.json())
    .then(data => {
        const pairs = data.pairs.slice(0, 10); // Nur die ersten 10 Paare
        const container = document.getElementById('dexscreener-pairs');
        pairs.forEach(pair => {
            const card = document.createElement('div');
            card.className = 'token-card';
            card.innerHTML = `
                <p>${pair.baseToken.symbol} / ${pair.quoteToken.symbol}</p>
                <p>Preis: $${pair.priceUsd}</p>
                <a href="${pair.url}" target="_blank" onclick="chargeFee()">Ansehen</a>
            `;
            container.appendChild(card);
        });
    })
    .catch(error => console.error('Fehler beim Laden von DEXscreener:', error));
            container.appendChild(card);
        });
    })
    .catch(error => console.error('Fehler beim Laden von DEXscreener:', error));
