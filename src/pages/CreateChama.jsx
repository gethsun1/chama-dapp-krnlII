// src/pages/CreateChama.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Slider,
  MenuItem,
  IconButton,
  Fade,
  Snackbar,
  Alert,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add, Remove } from '@mui/icons-material';
import {
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
} from '@reown/appkit/react';
import { Contract, BrowserProvider, parseUnits } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { ChamaFactoryABI, contractAddress } from '../contracts/ChamaFactoryConfig';

const EXPECTED_CHAIN_ID = 534351;

const CreateChama = () => {
  // State variables to handle user input and form visibility
  const [chamaName, setChamaName] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [contributionCycle, setContributionCycle] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [penalty, setPenalty] = useState(0);
  const [maxMembers, setMaxMembers] = useState(1);
  const [rules, setRules] = useState('');
  const [formVisible, setFormVisible] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  
  // Hooks to manage wallet connection and network state
  const { isConnected, address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { walletProvider } = useAppKitProvider('eip155');
  
  // Hook for navigation after form submission
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("[DEBUG] Wallet Status:", {
      isConnected,
      chainId,
      expectedChain: EXPECTED_CHAIN_ID,
      address,
      walletProvider,
    });
  }, [isConnected, chainId, address, walletProvider]);
  
  // Increment or decrement max members count
  const handleIncrementMaxMembers = () => setMaxMembers(prev => prev + 1);
  const handleDecrementMaxMembers = () => {
    if (maxMembers > 1) setMaxMembers(prev => prev - 1);
  };
  
  // Map contribution cycles to duration in seconds
  const getCycleDuration = (cycle) => {
    const durations = {
      daily: 86400,
      weekly: 604800,
      monthly: 2592000,
    };
    return durations[cycle.toLowerCase()] || 86400;
  };

  // Convert cycle duration into a human-readable format
  const getHumanReadableCycle = (cycle) => {
    const mapping = {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
    };
    return mapping[cycle.toLowerCase()] || `${cycle} seconds`;
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("[SUBMIT] Initiating creation...");
      if (!isConnected) {
        alert("Please connect your wallet.");
        return;
      }
      if (chainId !== EXPECTED_CHAIN_ID) {
        alert("Please switch to the Scroll Sepolia Testnet.");
        return;
      }
      if (!contributionCycle || !depositAmount || !contributionAmount) {
        alert("Missing required fields");
        return;
      }
      
      // Convert values to proper format for smart contract
      const depositInWei = parseUnits(depositAmount, 18);
      const contributionInWei = parseUnits(contributionAmount, 18);
      const cycleDurationNumeric = getCycleDuration(contributionCycle);
      
      console.log("[VALUES] Converted:", {
        depositInWei: depositInWei.toString(),
        contributionInWei: contributionInWei.toString(),
        penalty: Math.round(penalty),
        maxMembers,
        cycleDuration: cycleDurationNumeric,
      });
      
      if (!walletProvider) {
        throw new Error("No injected provider found via AppKit");
      }
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      
      const contract = new Contract(contractAddress, ChamaFactoryABI, signer);
      const tx = await contract.createChama(
        chamaName.trim(),
        description.trim(),
        depositInWei,
        contributionInWei,
        BigInt(Math.round(penalty)),
        BigInt(maxMembers),
        BigInt(cycleDurationNumeric)
      );
      await tx.wait();
      
      // Notify user and redirect after successful transaction
      setToastOpen(true);
      setTimeout(() => {
        navigate("/join-chama");
      }, 2000);
    } catch (error) {
      console.error("[ERROR]", error);
      alert(`Submission failed: ${error.shortMessage || error.message}`);
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Fade in={formVisible} timeout={1000}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #ffffff, #f7f9fc)' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
            Create Your Chama
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField label="Chama Name" fullWidth required value={chamaName} onChange={(e) => setChamaName(e.target.value)} />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              <Button variant="outlined" color="secondary">Cancel</Button>
              <Button type="submit" variant="contained" color="primary">Create Chama</Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default CreateChama;
