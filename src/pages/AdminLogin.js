// src/pages/AdminLogin.js
import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin");
      } else {
        setError(data.message || "Invalid password");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #e0f7fa, #ffffff)",
        p: 2,
      }}
    >
      <Paper
        elevation={5}
        sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 4 }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <LockIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h5" fontWeight="bold" mt={1}>
            Admin Login
          </Typography>
        </Box>

        <form onSubmit={handleLogin}>
          <TextField
            label="Enter Admin Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ py: 1.2, fontWeight: "bold" }}
          >
            Login
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
