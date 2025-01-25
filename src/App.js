import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);

  // Verifică dacă MetaMask este disponibil și conectează contul
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Solicită accesul la conturile MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        // Verifică rețeaua MetaMask pentru a asigura că suntem pe Sepolia
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        setNetwork(network);

        if (network.name !== 'sepolia') {
          alert('Please switch to the Sepolia network in MetaMask!');
          return;
        }

        // Obține balanța contului pe Sepolia
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
        to: "0xC3BcD54b99c40e7886a85A1fA827A82E78A6dd52", // Înlocuiește cu adresa destinatarului
        value: ethers.parseEther("0.01"), // Suma în ETH de trimis
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
          provider.getNetwork().then((network) => {
            setNetwork(network);
            if (network.name === 'sepolia') {
              provider.getBalance(accounts[0]).then((balance) => {
                setBalance(ethers.formatEther(balance));
              });
            } else {
              alert('Please switch to the Sepolia network in MetaMask!');
            }
          });
        }
      });
    }
  }, []);


  return (
    <div className="App">
      <div className="content">
        <h1 className="title">UNICEF Fundraiser</h1>
        <div className="grid">
          <div className="text-content">
            <p className="mission">
              We are a Bucharest-based fundraising NGO that seeks to raise funds through blockchain 
              and transfer them to a bigger organization that can handle our cause.
              <br />
              We want to help raise money for helping vulnerable children all across the UN.
            </p>

            {account ? (
              <div className="info">
                <p><strong>You are connected as:</strong> {account}</p>
                <p><strong>You are using the network:</strong> {network ? network.name : "Loading..."}</p>
                <p><strong>Your Ethereum balance:</strong> {balance} ETH</p>
                <div className="button-container">
                  <button className="btn-primary" onClick={sendTransaction}>
                    Send 0.01 ETH
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn-primary" onClick={connectWallet}>
                Connect MetaMask
              </button>
            )}
          </div>
          <img
            src={require("./img/unicef.png")}
            alt="UNICEF Logo"
            className="image"
          />
        </div>
      </div>
    </div>
  );


}

export default App;
