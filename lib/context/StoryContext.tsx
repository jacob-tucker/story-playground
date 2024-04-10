"use client";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { PropsWithChildren, createContext } from "react";
import { useContext, useState } from "react";
import { useEffect } from "react";
import {
  createPublicClient,
  createWalletClient,
  Address,
  custom,
  defineChain,
} from "viem";
import { sepolia } from "viem/chains";
import {
  sepoliaDefaultNftContractAbi,
  storyDefaultNftContractAbi,
} from "../defaultNftContractAbi";

const network: "sepolia" | "story" = "story";
const chainId = {
  sepolia: "0xaa36a7",
  story: 1513,
}[network];
const nftContractAddress = {
  sepolia: "0xe8E8dd120b067ba86cf82B711cC4Ca9F22C89EDc",
  story: "0x83DD606d14CcEb629dE9Bf8Aad7aE63767dB476f",
}[network];
const storyChain = defineChain({
  id: 1513,
  name: "Story Network",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://story-network.rpc.caldera.xyz/http"],
      webSocket: ["wss://story-network.rpc.caldera.xyz/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://story-network.explorer.caldera.xyz",
    },
  },
});
const contractAbi = {
  sepolia: sepoliaDefaultNftContractAbi,
  story: storyDefaultNftContractAbi,
}[network];

const defaultValue: {
  txLoading: boolean;
  txHash: string;
  txName: string;
  setTxLoading: any;
  setTxHash: any;
  setTxName: any;
  client: StoryClient | null;
  walletAddress: string;
  initializeStoryClient: any;
  logout: any;
  mintNFT: any;
} = {
  txLoading: false,
  txHash: "",
  client: null,
  walletAddress: "",
  txName: "",
  setTxLoading: () => {},
  setTxHash: () => {},
  setTxName: () => {},
  initializeStoryClient: async () => {},
  logout: () => {},
  mintNFT: async () => {},
};

export const StoryContext = createContext(defaultValue);

export const useStory = () => useContext(StoryContext);

export default function StoryProvider({ children }: PropsWithChildren) {
  const [client, setClient] = useState<StoryClient | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txName, setTxName] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  const initializeStoryClient = async () => {
    if (!client || !walletAddress) {
      const [account]: [Address] = await window.ethereum!.request({
        method: "eth_requestAccounts",
      });
      const config: StoryConfig = {
        account: account,
        transport: custom(window.ethereum!),
        chainId: "1513",
      };
      const client = StoryClient.newClient(config);
      setWalletAddress(account);
      setClient(client);
    }
    // const chainId = await window.ethereum!.request({ method: "eth_chainId" });
    // console.log(chainId);
    // if (chainId !== sepoliaChainId) {
    //   await window.ethereum!.request({
    //     method: "wallet_switchEthereumChain",
    //     params: [{ chainId: sepoliaChainId }],
    //   });
    // }
  };

  const logout = () => {
    setWalletAddress("");
    setClient(null);
  };

  const mintNFT = async (to: Address, uri: string) => {
    console.log("Minting a new NFT...");
    console.log({ to });
    const walletClient = createWalletClient({
      account: walletAddress as Address,
      chain: network === "story" ? storyChain : sepolia,
      transport: custom(window.ethereum!),
    });
    const publicClient = createPublicClient({
      transport: custom(window.ethereum!),
      chain: network === "story" ? storyChain : sepolia,
    });

    const { request } = await publicClient.simulateContract({
      address: nftContractAddress as `0x${string}`,
      functionName: "mintId",
      args: network === "story" ? [to, 2007] : [to, uri],
      abi: contractAbi,
    });
    const hash = await walletClient.writeContract(request);
    console.log(`Minted NFT successful with hash: ${hash}`);

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const tokenId = Number(receipt.logs[0].topics[3]).toString();
    console.log(`Minted NFT tokenId: ${tokenId}`);
    return tokenId;
  };

  useEffect(() => {
    if (!client || !walletAddress) {
      initializeStoryClient();
    }
  }, []);

  return (
    <StoryContext.Provider
      value={{
        client,
        walletAddress,
        txLoading,
        txHash,
        txName,
        setTxLoading,
        setTxName,
        setTxHash,
        initializeStoryClient,
        logout,
        mintNFT,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}
