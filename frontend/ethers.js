import { ethers } from "./libs/ethers.min.js";

const connectBtn = document.getElementById("connectBtn");
const accountSpan = document.getElementById("account");
const unlockTimeSpan = document.getElementById("unlockTime");
const balanceSpan = document.getElementById("balance");

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_unlockTime",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "when",
                "type": "uint256"
            }
        ],
        "name": "Withdrawal",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unlockTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let provider;
let signer;
let contract;

async function updateContractData() {
    try {
        await provider.getNetwork();

        const code = await provider.getCode(CONTRACT_ADDRESS);
        console.log("Contract bytecode length:", code.length);

        if (code === "0x" || code === "0x0") {
            console.error(
                "Contract is not deployed on the current network. " +
                "Try resetting the MetaMask account or switching networks."
            );
            return;
        }

        const unlockTime = await contract.unlockTime();
        unlockTimeSpan.innerText = new Date(
            Number(unlockTime) * 1000
        ).toLocaleString();

        const balance = await provider.getBalance(CONTRACT_ADDRESS);
        balanceSpan.innerText = ethers.formatEther(balance);

    } catch (error) {
        console.error("Failed to read contract data:", error);
    }
}

connectBtn.onclick = async () => {
    if (!window.ethereum) {
        alert("MetaMask was not detected. Please install the MetaMask extension.");
        return;
    }

    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        const account = await signer.getAddress();
        accountSpan.innerText = account;

        // Create contract 
        contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
        );

        await updateContractData();

    } catch (error) {
        console.error("Wallet connection failed:", error);
        alert("Connection error: " + error.message);
    }
};
