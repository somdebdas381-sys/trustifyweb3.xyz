import React, { createContext, useState } from 'react';
import { buildFakeContracts } from '../utils/contract';

export const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState(() => buildFakeContracts());

  const addContract = (newContract) => {
    setContracts([newContract, ...contracts]);
  };

  const updateContractStatus = (id, newStatus) => {
    setContracts(contracts.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const assignFreelancer = (id, freelancerAddress) => {
    setContracts(contracts.map(c => c.id === id ? { ...c, freelancer: freelancerAddress } : c));
  };

  return (
    <ContractContext.Provider value={{ contracts, addContract, updateContractStatus, assignFreelancer }}>
      {children}
    </ContractContext.Provider>
  );
};
