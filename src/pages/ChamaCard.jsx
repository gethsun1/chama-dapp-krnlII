import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

const ChamaCard = ({ chama }) => (
  <Card
    sx={{
      mb: 2,
      borderRadius: 2,
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: 6,
      },
    }}
  >
    <CardContent>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        {chama.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Cycle: {chama.cycle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Contribution: {chama.contribution}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Penalty: {chama.penalty}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Next Due: {chama.nextDue}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Total Contributions: {chama.total}
      </Typography>
      <Box textAlign="center">
        <Button variant="contained" color="primary" sx={{ mt: 1 }}>
          Contribute Now
        </Button>
      </Box>
    </CardContent>
  </Card>
);

export default ChamaCard;
