// src/pages/UploadPage.js
import React, { useState } from "react";
import logo from "../assets/logo.gif";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "History",
  "Geography",
  "Economics",
];

const categories = ["Lecture Notes", "Assignments", "Exam Papers", "Others"];

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [contributor, setContributor] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [category, setCategory] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    success: true,
    message: "",
  });

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !subject || !contributor || !driveLink || !category) {
      return setSnackbar({
        open: true,
        success: false,
        message: "❌ Please fill all fields.",
      });
    }

    const data = {
      title,
      subject,
      contributor,
      driveLink,
      category,
    };

    try {
      await axios.post(`${backendUrl}/api/notes/upload`, data, {
        headers: { "Content-Type": "application/json" },
      });

      setSnackbar({
        open: true,
        success: true,
        message: "✅ Note uploaded successfully. Awaiting approval!",
      });

      // Reset form
      setTitle("");
      setSubject("");
      setContributor("");
      setDriveLink("");
      setCategory("");
    } catch (error) {
      console.error("Upload failed", error);
      setSnackbar({
        open: true,
        success: false,
        message: "❌ Failed to upload note. Please try again.",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 600,
          borderRadius: 4,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        {/* ✅ Logo and Heading */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <img
            src={logo}
            alt="Notes Nest Logo"
            style={{ height: 80, marginBottom: 10 }}
          />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Upload Notes
          </Typography>
        </Box>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "gray", mb: 3 }}
        >
          Help others by sharing quality study material.
        </Typography>

        {/* ✅ Upload Form */}
        <form onSubmit={handleUpload}>
          <TextField
            label="Title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            select
            label="Subject"
            fullWidth
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{ mb: 2 }}
          >
            {subjects.map((subj, index) => (
              <MenuItem key={index} value={subj}>
                {subj}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Your Name"
            fullWidth
            variant="outlined"
            value={contributor}
            onChange={(e) => setContributor(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Drive Link"
            fullWidth
            required
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            select
            label="Category"
            fullWidth
            variant="outlined"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ mb: 3 }}
          >
            {categories.map((cat, idx) => (
              <MenuItem key={idx} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: "bold",
              background: "linear-gradient(to right, #1976d2, #42a5f5)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(to right, #1565c0, #2196f3)",
              },
            }}
          >
            Upload Note
          </Button>
        </form>
      </Paper>

      {/* ✅ Snackbar Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.success ? "success" : "error"}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadPage;
