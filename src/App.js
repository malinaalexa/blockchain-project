import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [donations, setDonations] = useState([]); // For storing recent donations
  const [donationAmount, setDonationAmount] = useState(""); // For user input of donation amount

  const contractAddress = "0x42E8D3E90Bd0251C1C1aEf382c82e092bDACC736";  // Replace with your contract address
  const contractABI = [
    "event DonationReceived(address indexed donor, uint256 amount)", // ABI event
    "function donate() external payable", // Add donate function to ABI
  ];

  // Connect wallet and check network
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        setNetwork(network);

        if (network.name !== 'sepolia') {
          alert('Please switch to the Sepolia network in MetaMask!');
          return;
        }

        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance)); // Convert balance to Ether
      } catch (error) {
        console.log("Error connecting to MetaMask:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Handle donation input change
  const handleDonationChange = (event) => {
    setDonationAmount(event.target.value);
  };

  // Send donation via contract
  const sendTransaction = async () => {
    if (!account || !donationAmount) {
      alert("Please connect your wallet and enter an amount to donate.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Instantiate contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const donationInWei = ethers.parseEther(donationAmount); // Convert user input to Wei

      const tx = await contract.donate({
        value: donationInWei, // Use user-provided donation amount
      });

      console.log("Donation sent:", tx);

      await tx.wait(); // Wait for transaction confirmation
      alert("Donation sent and confirmed!");
    } catch (error) {
      console.log("Transaction failed:", error);
      alert("Transaction failed, please try again.");
    }
  };

  // Listen to the DonationReceived event to update donations state
  useEffect(() => {
    if (window.ethereum && account) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      // Listen for the DonationReceived event
      contract.on('DonationReceived', (donor, amount) => {
        console.log(`Donation received from ${donor}: ${ethers.formatEther(amount)} ETH`);
        
        // Add donation to state
        setDonations((prevDonations) => [
          ...prevDonations,
          { donor, amount: ethers.formatEther(amount) },
        ]);
      });

      return () => {
        contract.removeAllListeners('DonationReceived');
      };
    }
  }, [account]);

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

                {/* Donation input field */}
                <div>
                  <input
                    type="text"
                    placeholder="Enter donation amount (ETH)"
                    value={donationAmount}
                    onChange={handleDonationChange}
                  />
                </div>

                <div className="button-container">
                  <button className="btn-primary" onClick={sendTransaction}>
                    Donate {donationAmount} ETH
                  </button>
                </div>

                <h3>Recent Donations:</h3>

                  {donations.map((donation, index) => (
                    <p key={index}>
                      Donor: {donation.donor} | Amount: {donation.amount} ETH
                    </p>
                  ))}

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
