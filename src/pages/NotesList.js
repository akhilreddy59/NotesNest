// src/pages/NotesList.js
import React, { useEffect, useState, useMemo } from "react";
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

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/notes/approved")
      .then((res) => {
        setNotes(res.data);
        setFilteredNotes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notes:", err);
        setLoading(false);
      });
  }, []);

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

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
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

        <Grid item xs={12} md={4}>
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
      ) : filteredNotes.length === 0 ? (
        <Typography variant="body1" sx={{ mx: "auto", mt: 5 }}>
          No notes found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredNotes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note._id}>
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
                    href={`http://localhost:5000/${note.file}`}
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
