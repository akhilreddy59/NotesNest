// src/components/Navbar.js
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ✅ Only allow Admin Panel if the correct admin secret is in localStorage
  useEffect(() => {
    const storedSecret = localStorage.getItem("admin-secret");
    if (storedSecret === "notesnest123") {
      setIsAdmin(true);
    }
  }, []);

  const navLinks = [
    { label: "Browse Notes", path: "/" },
    { label: "Upload", path: "/upload" },
    ...(isAdmin ? [{ label: "Admin", path: "/admin" }] : []),
  ];

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const linkStyle = (path) => ({
    color: "white",
    textTransform: "none",
    fontWeight: location.pathname === path ? 700 : 400,
    borderBottom: location.pathname === path ? "2px solid white" : "none",
    borderRadius: 0,
  });

  return (
    <>
      <AppBar position="sticky" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notes Nest
          </Typography>

          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <Box
                  sx={{ width: 200 }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                >
                  <List>
                    {navLinks.map((link) => (
                      <ListItem
                        button
                        key={link.path}
                        component={Link}
                        to={link.path}
                      >
                        <ListItemText primary={link.label} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={linkStyle(link.path)}
                  color="inherit"
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
