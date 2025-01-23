import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  // Get the Sepolia RPC URL from environment variable
  const SEPOLIA_RPC_URL = process.env.REACT_APP_SEPOLIA_URL;

  // Log the URL in the app to ensure it's defined
  useEffect(() => {
    console.log("Sepolia RPC URL:", SEPOLIA_RPC_URL);
  }, [SEPOLIA_RPC_URL]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance)); // Convert the balance to Ether
      } catch (error) {
        console.log("Error connecting to MetaMask:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const sendTransaction = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      const signer = provider.getSigner();

      const tx = await signer.sendTransaction({
        to: "0xRecipientAddressHere", // Replace with recipient's address
        value: ethers.parseEther("0.1"), // The amount to send (0.1 ETH)
      });

      console.log("Transaction sent:", tx);
      alert("Transaction sent!");
    } catch (error) {
      console.log("Transaction failed:", error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
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
