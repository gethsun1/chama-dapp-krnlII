// src/hooks/useJoinedChamas.js
import { useState, useEffect } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import ChamaFactoryABI from "../contracts/ChamaFactoryABI.json";

const contractAddress = "0x154d1E286A9A3c1d4B1e853A9a7e61b1e934B756";

const useJoinedChamas = () => {
  const { isConnected, address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const [joinedChamas, setJoinedChamas] = useState([]);

  useEffect(() => {
    if (!isConnected || !address || !walletProvider) return;

    const fetchJoinedChamas = async () => {
      try {
        const provider = new BrowserProvider(walletProvider);
        const contract = new Contract(contractAddress, ChamaFactoryABI, provider);
        const chamaCount = await contract.chamaCount();
        const joined = [];
        // Iterate over all chamas (assuming IDs start at 1)
        for (let i = 1; i <= Number(chamaCount); i++) {
          const memberStatus = await contract.isMember(i, address);
          if (memberStatus) {
            const chamaData = await contract.chamas(i);
            joined.push({
              id: Number(chamaData.id),
              creator: chamaData.creator,
              name: chamaData.name,
              description: chamaData.description,
              // Convert wei to ETH using formatUnits
              depositAmount: formatUnits(chamaData.depositAmount, 18),
              contributionAmount: formatUnits(chamaData.contributionAmount, 18),
              penalty: chamaData.penalty.toString(),
              maxMembers: chamaData.maxMembers.toString(),
              membersCount: chamaData.membersCount.toString(),
              cycleDuration: chamaData.cycleDuration.toString(),
              currentRound: chamaData.currentRound.toString(),
              currentCycle: chamaData.currentCycle.toString(),
              nextCycleStart: chamaData.nextCycleStart.toString(),
              isActive: chamaData.isActive,
              members: chamaData.members,
            });
          }
        }
        setJoinedChamas(joined);
      } catch (error) {
        console.error("Error fetching joined chamas:", error);
      }
    };

    fetchJoinedChamas();
  }, [isConnected, address, walletProvider]);

  return joinedChamas;
};

export default useJoinedChamas;
