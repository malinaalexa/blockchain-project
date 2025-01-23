import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  // Verifică dacă MetaMask este disponibil și conectează contul
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Solicită accesul la conturile MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        // Creează un provider cu MetaMask și obține balanța contului
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance)); // Convertim balanța în Ether
      } catch (error) {
        console.log("Error connecting to MetaMask:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Tranzacționează din contul conectat
  const sendTransaction = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: "0xRecipientAddressHere", // Înlocuiește cu adresa destinatarului
        value: ethers.parseEther("0.1"), // Suma în ETH de trimis
      });

      console.log("Transaction sent:", tx);
      alert("Transaction sent!");
    } catch (error) {
      console.log("Transaction failed:", error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      // Căutăm contul MetaMask la încărcarea aplicației
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const provider = new ethers.BrowserProvider(window.ethereum);
          provider.getBalance(accounts[0]).then((balance) => {
            setBalance(ethers.formatEther(balance));
          });
        }
      });
    }
  }, []);

  return (
    <div className="App">
      <h1>Fundraiser App</h1>
      {account ? (
        <div>
          <p>Connected as: {account}</p>
          <p>Balance: {balance} ETH</p>
          <button onClick={sendTransaction}>Send 0.1 ETH</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
}

export default App;
