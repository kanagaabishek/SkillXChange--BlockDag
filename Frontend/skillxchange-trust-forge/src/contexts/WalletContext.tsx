import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers, BrowserProvider } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  provider: BrowserProvider | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const isConnected = !!account;

  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        
        setAccount(address);
        setBalance(ethers.formatEther(balance));
        setProvider(provider);
      } else {
        alert('Please install MetaMask to connect your wallet');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0');
    setProvider(null);
  };

  useEffect(() => {
    // Check if wallet is already connected
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      provider.listAccounts().then(async accounts => {
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          setProvider(provider);
          provider.getBalance(address).then(balance => {
            setBalance(ethers.formatEther(balance));
          });
        }
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{
      account,
      isConnected,
      balance,
      connectWallet,
      disconnectWallet,
      provider
    }}>
      {children}
    </WalletContext.Provider>
  );
};