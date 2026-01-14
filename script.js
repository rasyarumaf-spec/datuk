const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const walletInfoEl = document.getElementById("walletInfo");

const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

function formatAvaxBalance(balanceWei) {
  const balance = parseInt(balanceWei, 16);
  return (balance / 1e18).toFixed(4);
}

function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Wallet tidak terdeteksi!");
    return;
  }

  try {
    statusEl.textContent = "Connecting...";
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const address = accounts[0];

    // Update UI & State
    connectBtn.disabled = true;
    connectBtn.innerText = "Connected";
    walletInfoEl.style.display = "block";
    addressEl.textContent = shortenAddress(address);

    // Cek Network
    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
      networkEl.textContent = "✅ Avalanche Fuji";
      statusEl.textContent = "Connected";
      
      const balanceWei = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      balanceEl.textContent = formatAvaxBalance(balanceWei) + " AVAX";
    } else {
      networkEl.textContent = "❌ Wrong Network";
      statusEl.textContent = "Switch Network";
      balanceEl.textContent = "-";
    }
  } catch (error) {
    statusEl.textContent = "Error ❌";
    console.error(error);
  }
}

connectBtn.addEventListener("click", connectWallet);