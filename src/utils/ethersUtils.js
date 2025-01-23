import { ethers } from 'ethers';

export async function connectMetaMask() {
  if (window.ethereum) {
    try {
      // Solicită accesul la conturile MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      console.log('Connected to MetaMask with account:', account);

      const balance = await provider.getBalance(account);
      console.log('Balance:', ethers.formatEther(balance));

      return { account, provider, signer };
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  } else {
    alert('MetaMask is not installed');
  }
}

export async function donate(signer, amount, contractAddress, abi) {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  try {
    const tx = await contract.donate({ value: ethers.parseUnits(amount.toString(), 'ether') });
    await tx.wait();
    console.log('Donation successful:', tx);
  } catch (error) {
    console.error('Donation failed:', error);
  }
}
