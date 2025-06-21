// src/pages/AdminPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";

const ADMIN_SECRET = "sunrisers";

const AdminPage = () => {
  const [pendingNotes, setPendingNotes] = useState([]);
  const [approvedNotes, setApprovedNotes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchPendingNotes = async () => {
    try {
      const res = await axios.get(
        "https://notes-nest-b.onrender.com/api/notes/pending",
        {
          headers: { "x-admin-secret": ADMIN_SECRET },
        }
      );
      setPendingNotes(res.data);
    } catch (err) {
      console.error("Error fetching pending notes:", err);
    }
  };

  const fetchApprovedNotes = async () => {
    try {
      const res = await axios.get(
        "https://notes-nest-b.onrender.com/api/notes/approved"
      );
      setApprovedNotes(res.data);
    } catch (err) {
      console.error("Error fetching approved notes:", err);
    }
  };

  useEffect(() => {
    const storedSecret = localStorage.getItem("admin-secret");

    if (storedSecret !== ADMIN_SECRET) {
      const entered = prompt("Enter Admin Secret to access this page:");
      if (entered === ADMIN_SECRET) {
        localStorage.setItem("admin-secret", entered);
        fetchPendingNotes();
        fetchApprovedNotes();
      } else {
        alert("Unauthorized access.");
        window.location.href = "/";
      }
    } else {
      fetchPendingNotes();
      fetchApprovedNotes();
    }
  }, []);

  const handleDialogOpen = (action, noteId) => {
    setDialogAction(action);
    setSelectedNoteId(noteId);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDialogAction(null);
    setSelectedNoteId(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedNoteId || !dialogAction) return;

    try {
      if (dialogAction === "approve") {
        await axios.patch(
          `https://notes-nest-b.onrender.com/api/notes/approve/${selectedNoteId}`,
          {},
          {
            headers: { "x-admin-secret": ADMIN_SECRET },
          }
        );
        setSnackbar({
          open: true,
          message: "Note approved successfully.",
          severity: "success",
        });
        setPendingNotes(
          pendingNotes.filter((note) => note._id !== selectedNoteId)
        );
        fetchApprovedNotes();
      } else if (dialogAction === "reject" || dialogAction === "delete") {
        await axios.delete(
          `https://notes-nest-b.onrender.com/api/notes/delete/${selectedNoteId}`,
          {
            headers: { "x-admin-secret": ADMIN_SECRET },
          }
        );
        setSnackbar({
          open: true,
          message:
            dialogAction === "reject" ? "Note rejected." : "Note deleted.",
          severity: dialogAction === "reject" ? "info" : "warning",
        });
        setPendingNotes(
          pendingNotes.filter((note) => note._id !== selectedNoteId)
        );
        setApprovedNotes(
          approvedNotes.filter((note) => note._id !== selectedNoteId)
        );
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Action failed. Please try again.",
        severity: "error",
      });
      console.error(err);
    }

    handleDialogClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-secret");
    window.location.href = "/";
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Admin Panel
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Stack>

      <Typography variant="h5" gutterBottom>
        Pending Notes
      </Typography>
      <Grid container spacing={3} mb={5}>
        {pendingNotes.length === 0 ? (
          <Typography sx={{ mx: "auto" }}>No pending notes found.</Typography>
        ) : (
          pendingNotes.map((note) => (
            <Grid item xs={12} md={6} lg={4} key={note._id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">{note.title}</Typography>
                  <Typography variant="body2">
                    <strong>Subject:</strong> {note.subject}
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    <strong>Contributor:</strong> {note.contributor}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleDialogOpen("approve", note._id)}
                      fullWidth
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => handleDialogOpen("reject", note._id)}
                      fullWidth
                    >
                      Reject
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Typography variant="h5" gutterBottom>
        Approved Notes
      </Typography>
      <Grid container spacing={3}>
        {approvedNotes.length === 0 ? (
          <Typography sx={{ mx: "auto" }}>No approved notes found.</Typography>
        ) : (
          approvedNotes.map((note) => (
            <Grid item xs={12} md={6} lg={4} key={note._id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6">{note.title}</Typography>
                  <Typography variant="body2">
                    <strong>Subject:</strong> {note.subject}
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    <strong>Contributor:</strong> {note.contributor}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDialogOpen("delete", note._id)}
                    fullWidth
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogAction === "approve"
            ? "Confirm Approval"
            : dialogAction === "delete"
            ? "Confirm Deletion"
            : "Confirm Rejection"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {dialogAction} this note? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleConfirmAction}
            color={
              dialogAction === "approve"
                ? "success"
                : dialogAction === "delete"
                ? "error"
                : "warning"
            }
            variant="contained"
          >
            {dialogAction === "approve"
              ? "Approve"
              : dialogAction === "delete"
              ? "Delete"
              : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPage;
