// src/components/Footer.js
import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        mt: 6,
        py: 3,
        px: 2,
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        borderTop: "1px solid #ddd",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Notes Nest. Made with ❤️ by Akhil Reddy.
      </Typography>
    </Box>
  );
};

export default Footer;
