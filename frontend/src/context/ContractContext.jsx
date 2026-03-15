import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import EscrowFreelanceABI from '../EscrowFreelance.json';

export const ContractContext = createContext();

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");

  const getContract = useCallback(async () => {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { contract: new ethers.Contract(CONTRACT_ADDRESS, EscrowFreelanceABI.abi, signer), signer, provider };
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const { contract, signer, provider } = await getContract();
      const address = await signer.getAddress();
      setAccount(address.toLowerCase());

      const ethBalance = await provider.getBalance(address);
      const formattedBalance = ethers.formatEther(ethBalance);
      setBalance(formattedBalance);

      const count = await contract.getJobCount();
      const jobs = [];
      for (let i = 0; i < Number(count); i++) {
        const job = await contract.getJob(i);
        jobs.push({
          id: i.toString(),
          client: job.client,
          freelancer: job.freelancer === ethers.ZeroAddress ? null : job.freelancer,
          amount: ethers.formatEther(job.amount),
          title: job.description,
          status: job.paid ? "Paid" : (job.completed ? "Completed" : (job.accepted ? "Funded" : "Pending")),
          domain: "Blockchain Development",
          deadline: "TBD"
        });
      }
      setContracts(jobs.reverse());
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [getContract]);

  useEffect(() => {
    fetchJobs();

    // Add interval to refresh balance and jobs every 10 seconds
    const interval = setInterval(fetchJobs, 10000);

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', fetchJobs);
      window.ethereum.on('chainChanged', () => window.location.reload());
      return () => {
        window.ethereum.removeListener('accountsChanged', fetchJobs);
        clearInterval(interval);
      };
    }
    return () => clearInterval(interval);
  }, [fetchJobs]);

  const addContract = async (newContract) => {
    try {
      const { contract } = await getContract();
      const tx = await contract.createJob(
        newContract.title,
        ethers.parseEther(newContract.amount),
        { value: ethers.parseEther(newContract.amount) }
      );
      await tx.wait();
      fetchJobs();
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  };

  const updateContractStatus = async (id, action) => {
    try {
      const { contract } = await getContract();
      let tx;
      if (action === "complete") {
        tx = await contract.markCompleted(id);
      } else if (action === "release") {
        tx = await contract.releasePayment(id);
      }
      if (tx) {
        await tx.wait();
        fetchJobs();
      }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error);
      throw error;
    }
  };

  const assignFreelancer = async (id) => {
    try {
      const { contract } = await getContract();
      const tx = await contract.acceptJob(id);
      await tx.wait();
      fetchJobs();
    } catch (error) {
      console.error("Error accepting job:", error);
      throw error;
    }
  };

  const switchAccount = async () => {
    try {
      if (!window.ethereum) return;
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      await fetchJobs();
    } catch (error) {
      console.error("Error requesting account switch:", error);
    }
  };

  return (
    <ContractContext.Provider value={{
      contracts,
      loading,
      account,
      balance,
      addContract,
      updateContractStatus,
      assignFreelancer,
      fetchJobs,
      switchAccount
    }}>
      {children}
    </ContractContext.Provider>
  );
};
