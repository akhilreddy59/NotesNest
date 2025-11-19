// src/pages/NotesList.js
import React, { useEffect, useState, useMemo, useCallback } from "react";
import logo from "../assets/logo.gif";

import {
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import Fuse from "fuse.js";
import axios from "axios";

const NotesList = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";

  // Helper to build API URLs. If no backendUrl is provided, use relative paths
  const apiUrl = (path) => {
    if (!path.startsWith("/")) path = "/" + path;
    if (backendUrl) return backendUrl.replace(/\/+$/, "") + path;
    return path; // relative path (e.g. /api/notes/approved)
  };

  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);

  const subjects = [...new Set(notes.map((note) => note.subject))];

  const fuse = useMemo(() => {
    return new Fuse(notes, {
      keys: ["title", "description", "subject", "contributor"],
      threshold: 0.4,
    });
  }, [notes]);

  const [error, setError] = useState(null);
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  // FIXED: apiUrl added to dependency array
  const fetchNotes = useCallback(
    async (retryCount = 0) => {
      try {
        const res = await axios.get(apiUrl("/api/notes/approved"), {
          timeout: 10000,
        });
        setNotes(res.data);
        setFilteredNotes(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching notes:", err);

        if (retryCount < maxRetries) {
          console.log(`Retrying... Attempt ${retryCount + 1} of ${maxRetries}`);
          setTimeout(
            () => fetchNotes(retryCount + 1),
            retryDelay * (retryCount + 1)
          );
        } else {
          const status = err?.response?.status || "N/A";
          const message =
            err?.response?.data?.message || err.message || "Unknown error";
          setError(`Unable to fetch notes. ${message} (status: ${status})`);
        }
      }
    },
    [apiUrl, backendUrl, maxRetries, retryDelay] // ✅ FIXED
  );

  useEffect(() => {
    setLoading(true);
    fetchNotes().finally(() => setLoading(false));
  }, [fetchNotes]);

  useEffect(() => {
    let results = notes;

    if (searchQuery) {
      results = fuse.search(searchQuery).map((res) => res.item);
    }

    if (selectedSubject) {
      results = results.filter((note) => note.subject === selectedSubject);
    }

    setFilteredNotes(results);
  }, [searchQuery, selectedSubject, notes, fuse]);

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <img
          src={logo}
          alt="Notes Nest Logo"
          style={{ height: 80, marginBottom: 10 }}
        />
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Browse Notes
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid flex={1} minWidth={{ xs: "100%", md: "50%" }}>
          <TextField
            fullWidth
            label="Search notes..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid flex={1} minWidth={{ xs: "100%", md: "33.33%" }}>
          <TextField
            select
            fullWidth
            label="Filter by subject"
            variant="outlined"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <MenuItem value="">All Subjects</MenuItem>
            {subjects.map((subject, index) => (
              <MenuItem key={index} value={subject}>
                {subject}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography color="error" align="center">
            {error}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                setLoading(true);
                fetchNotes().finally(() => setLoading(false));
              }}
              sx={{ ml: 0 }}
            >
              Retry
            </Button>
            <Button
              variant="text"
              color="secondary"
              href={apiUrl("/api/notes/approved")}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ ml: 2 }}
            >
              Open backend endpoint
            </Button>
          </Box>
          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 1, color: "gray" }}
          >
            If this persists, verify that `REACT_APP_BACKEND_URL` is set and the
            backend is reachable.
          </Typography>
        </Box>
      ) : filteredNotes.length === 0 ? (
        <Typography variant="body1" sx={{ mx: "auto", mt: 5 }}>
          No notes found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredNotes.map((note) => (
            <Grid
              key={note._id}
              flex={1}
              minWidth={{ xs: "100%", sm: "50%", md: "33.33%" }}
            >
              <Card elevation={4} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {note.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Subject:</strong> {note.subject}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Contributor:</strong> {note.contributor}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    href={note.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default NotesList;
