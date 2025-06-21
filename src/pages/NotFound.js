// src/pages/NotFound.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFound;
