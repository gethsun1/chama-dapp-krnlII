// src/pages/CreateChama.jsx
import React, { useState } from 'react';
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
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add, Remove } from '@mui/icons-material';

const CreateChama = () => {
  // State for form fields
  const [chamaName, setChamaName] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [contributionCycle, setContributionCycle] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [penalty, setPenalty] = useState(0);
  const [maxMembers, setMaxMembers] = useState(1);
  const [rules, setRules] = useState('');
  const [formVisible, setFormVisible] = useState(true); // For fade-in animation

  // Handlers for maximum members stepper
  const handleIncrementMaxMembers = () => {
    setMaxMembers((prev) => prev + 1);
  };

  const handleDecrementMaxMembers = () => {
    if (maxMembers > 1) {
      setMaxMembers((prev) => prev - 1);
    }
  };

  // Handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement your submission logic, e.g., smart contract interaction
    console.log({
      chamaName,
      description,
      startDateTime,
      contributionCycle,
      depositAmount,
      contributionAmount,
      penalty,
      maxMembers,
      rules,
    });
  };

  // Handler for cancellation (e.g., navigating back)
  const handleCancel = () => {
    // Implement navigation logic or form reset
    console.log('Creation cancelled');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Fade in={formVisible} timeout={1000}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff, #f7f9fc)',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
            Create Your Chama
          </Typography>
          <Typography variant="body2" gutterBottom color="text.secondary" sx={{ mb: 3 }}>
            Fill out the details below to launch your decentralized savings group.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Chama Name"
                  fullWidth
                  required
                  value={chamaName}
                  onChange={(e) => setChamaName(e.target.value)}
                  inputProps={{ 'aria-label': 'Chama Name' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description & Goals"
                  fullWidth
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  inputProps={{ 'aria-label': 'Description and Goals' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Start Date & Time"
                    value={startDateTime}
                    onChange={(newValue) => setStartDateTime(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        inputProps={{
                          ...params.inputProps,
                          'aria-label': 'Start Date and Time',
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contribution Cycle"
                  select
                  fullWidth
                  required
                  value={contributionCycle}
                  onChange={(e) => setContributionCycle(e.target.value)}
                  inputProps={{ 'aria-label': 'Contribution Cycle' }}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Deposit Amount"
                  type="number"
                  fullWidth
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  inputProps={{ 'aria-label': 'Deposit Amount', min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contribution Amount per Cycle"
                  type="number"
                  fullWidth
                  required
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  inputProps={{ 'aria-label': 'Contribution Amount per Cycle', min: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Penalty Slash (in %): {penalty}%
                </Typography>
                <Slider
                  value={penalty}
                  onChange={(e, newValue) => setPenalty(newValue)}
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                  aria-labelledby="penalty-slider"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Maximum Members
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    onClick={handleDecrementMaxMembers}
                    aria-label="Decrease maximum members"
                  >
                    <Remove />
                  </IconButton>
                  <Typography
                    variant="body1"
                    sx={{ mx: 2 }}
                    aria-label="Maximum Members Count"
                  >
                    {maxMembers}
                  </Typography>
                  <IconButton
                    onClick={handleIncrementMaxMembers}
                    aria-label="Increase maximum members"
                  >
                    <Add />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Rules & Regulations"
                  fullWidth
                  multiline
                  rows={3}
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  inputProps={{ 'aria-label': 'Rules and Regulations' }}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'scale(1.02)' },
                }}
                aria-label="Cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'scale(1.02)' },
                }}
                aria-label="Create Chama"
              >
                Create Chama
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default CreateChama;
