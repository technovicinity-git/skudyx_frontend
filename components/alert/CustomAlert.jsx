import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

const CustomAlert = ({
  open,
  title,
  message,
  logo = "/assets/images/logo_small_green.png",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <Box display="flex" flexDirection="column" alignItems="center" p={2}>
        {logo && (
          <Box mb={2}>
            <img src={logo} alt="logo" style={{ width: 60, height: 60 }} />
          </Box>
        )}
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          {title}
        </DialogTitle>
        <DialogContent>
          <Typography align="center" variant="body1">
            {message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 1, pb: 2 }}>
          <Button variant="outlined" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="contained" color="error" onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CustomAlert;
