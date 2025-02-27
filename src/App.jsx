import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { AppKitProvider } from "./config";
import NavigationBar from "./components/NavigationBar";
import LandingPage from "./components/LandingPage";
import CreateChama from "./pages/CreateChama";
import JoinChama from "./pages/JoinChama";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";

function App() {
  return (
    <AppKitProvider>
      <Router>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          {/* Navigation Bar */}
          <NavigationBar />

          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/create-chama" element={<CreateChama />} />
              <Route path="/join-chama" element={<JoinChama />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Box>

          {/* Footer */}
          <Footer />
        </Box>
      </Router>
    </AppKitProvider>
  );
}

export default App;
