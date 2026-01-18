// Импорт Ethers.js
import { ethers } from "./libs/ethers.min.js";

// DOM элементы
const connectBtn = document.getElementById("connectBtn");
const accountSpan = document.getElementById("account");
const unlockTimeSpan = document.getElementById("unlockTime");
const balanceSpan = document.getElementById("balance");

// Адрес и ABI контракта Lock.sol
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

let provider, signer, contract;

// Функция обновления данных с контракта
async function updateContractData() {
    try {
        // Чтение unlockTime
        const unlockTime = await contract.unlockTime();
        unlockTimeSpan.innerText = unlockTime.toString();

        // Чтение баланса контракта
        const balance = await provider.getBalance(CONTRACT_ADDRESS);
        balanceSpan.innerText = ethers.formatEther(balance);
    } catch (err) {
        console.error("Ошибка при чтении контракта:", err);
    }
}

// Кнопка подключения MetaMask
connectBtn.onclick = async () => {
    if (!window.ethereum) {
        alert("MetaMask не найден! Установите расширение.");
        return;
    }

    try {
        // Запрашиваем доступ к аккаунту
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        const account = await signer.getAddress();
        accountSpan.innerText = account;

        // Создаём контракт
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        // Получаем данные с контракта
        await updateContractData();

    } catch (err) {
        console.error("Ошибка подключения:", err);
        alert("Ошибка подключения: " + err.message);
    }
};
