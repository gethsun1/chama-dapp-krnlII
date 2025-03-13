// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Fade,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { WhatsApp, Telegram, Twitter, Email, ContentCopy } from "@mui/icons-material";
import ChamaCard from "./ChamaCard";
import { useAppKitAccount } from "@reown/appkit/react";
import useJoinedChamas from "../hooks/useJoinedChamas";

const Dashboard = () => {
  const { isConnected, address } = useAppKitAccount();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  
 
  const joinedChamas = useJoinedChamas();

 
  const contributionData = [
    { name: "Jan", amount: 2.5 },
    { name: "Feb", amount: 3.0 },
    { name: "Mar", amount: 3.5 },
  ];
  const pieData = [
    { name: "Held Deposit", value: 1 },
    { name: "Contributions", value: 4.2 },
  ];
  const COLORS = ["#0088FE", "#00C49F"];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setOpenSnackbar(true);
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* User Overview */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(0,123,255,0.1), rgba(0,123,255,0.05))",
              p: 2,
            }}
          >
            <CardContent>
              <Avatar sx={{ width: 56, height: 56, mb: 2, bgcolor: "primary.main" }}>
                {isConnected && address ? address.charAt(2).toUpperCase() : "U"}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {isConnected && address ? "On-Chain User" : "Loading..."}
              </Typography>
              <Box display="flex" alignItems="center" sx={{ mt: 1, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Wallet: {isConnected ? address : "Not connected"}
                </Typography>
                <IconButton
                  size="small"
                  onClick={copyToClipboard}
                  sx={{ ml: 1, transition: "transform 0.3s", "&:hover": { transform: "scale(1.1)" } }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>
              {/* Dummy user data for demo - replace with real analytics when available */}
              <Typography variant="body2">
                Total Balance: 5.2 ETH
              </Typography>
              <Typography variant="body2">
                Deposit Held: 1.0 ETH
              </Typography>
              <Typography variant="body2">
                Next Contribution: 0.2 ETH due in 5 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Chamas */}
        <Grid item xs={12} md={8}>
          <Fade in timeout={1000}>
            <Box>
              {joinedChamas && joinedChamas.length > 0 ? (
                joinedChamas.map((chama) => (
                  <ChamaCard key={chama.id} chama={chama} />
                ))
              ) : (
                <Typography variant="body2">You haven't joined any Chamas yet.</Typography>
              )}
            </Box>
          </Fade>
        </Grid>

        {/* Analytics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contribution History
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={contributionData}>
                  <XAxis dataKey="name" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#82ca9d" animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Funds Allocation
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Invite Members */}
      <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {}}
          sx={{
            transition: "transform 0.3s",
            "&:hover": { transform: "scale(1.02)" },
          }}
        >
          Invite Members
        </Button>
      </Box>

      {/* Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Wallet address copied to clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
