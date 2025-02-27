// src/pages/JoinChama.jsx
import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
} from "@mui/material";
import { MonetizationOn, Groups, CalendarToday } from "@mui/icons-material";
import dummyChamas from "./dummyChamas"; // Importing Chamas data

const JoinChama = () => {
  const [open, setOpen] = useState(false);
  const [selectedChama, setSelectedChama] = useState(null);

  const handleOpen = (chama) => {
    setSelectedChama(chama);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedChama(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Available Chamas
      </Typography>
      <Grid container spacing={4}>
        {dummyChamas.map((chama) => (
          <Grid item xs={12} sm={6} md={4} key={chama.id}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  {chama.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mt: 1, mb: 2 }}
                >
                  {chama.description}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2">
                    {chama.contributionCycle}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <MonetizationOn fontSize="small" color="action" />
                  <Typography variant="body2">
                    Deposit: {chama.depositAmount}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Groups fontSize="small" color="action" />
                  <Typography variant="body2">
                    Max Members: {chama.maxMembers}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleOpen(chama)}
                  sx={{
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  Join
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Animated Dialog for Chama Details */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <Fade in={open} timeout={500}>
          <Box>
            <DialogTitle sx={{ fontWeight: "bold" }}>
              {selectedChama?.name}
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" gutterBottom>
                {selectedChama?.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contribution Cycle:
                </Typography>
                <Typography variant="body2">
                  {selectedChama?.contributionCycle}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Deposit Amount:
                </Typography>
                <Typography variant="body2">
                  {selectedChama?.depositAmount}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contribution:
                </Typography>
                <Typography variant="body2">
                  {selectedChama?.contributionAmount}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Penalty:
                </Typography>
                <Typography variant="body2">
                  {selectedChama?.penaltyPercentage}%
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Maximum Members:
                </Typography>
                <Typography variant="body2">
                  {selectedChama?.maxMembers}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button variant="contained" color="primary">
                Confirm Join
              </Button>
            </DialogActions>
          </Box>
        </Fade>
      </Dialog>
    </Container>
  );
};

export default JoinChama;
