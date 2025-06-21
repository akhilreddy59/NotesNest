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
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

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
  const [file, setFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    success: true,
    message: "",
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      alert("❌ File size exceeds 5MB. Please upload a smaller file.");
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (
      !title ||
      !subject ||
      !contributor ||
      !file ||
      !driveLink ||
      !category
    ) {
      return setSnackbar({
        open: true,
        success: false,
        message: "Please fill all fields and select a file.",
      });
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("contributor", contributor);
    formData.append("driveLink", driveLink);
    formData.append("category", category);
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/notes/upload", formData);
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
      setFile(null);
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
        <form onSubmit={handleUpload} encType="multipart/form-data">
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
            label="Google Drive Link"
            fullWidth
            variant="outlined"
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
            sx={{ mb: 2 }}
          >
            {categories.map((cat, idx) => (
              <MenuItem key={idx} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 2, textTransform: "none", fontWeight: "bold" }}
          >
            Choose File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          {file && (
            <>
              <Chip
                label={file.name}
                color="primary"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              {file.type === "application/pdf" && (
                <Box mt={2}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Preview:
                  </Typography>
                  <iframe
                    src={URL.createObjectURL(file)}
                    title="PDF Preview"
                    width="100%"
                    height="300px"
                    style={{ border: "1px solid #ccc", borderRadius: 8 }}
                  />
                </Box>
              )}
            </>
          )}

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
