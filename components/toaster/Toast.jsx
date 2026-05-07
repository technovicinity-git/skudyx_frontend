// components/Toast.tsx
import React from "react";
import { Snackbar, Alert, AlertTitle, Typography, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import Image from "next/image";

// export type ToastType = "success" | "error" | "warning" | "info";

const Toast = ({ open, onClose, message, type, title }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon fontSize="inherit" />;
      case "error":
        return <ErrorIcon fontSize="inherit" />;
      case "warning":
        return <WarningIcon fontSize="inherit" />;
      default:
        return <InfoIcon fontSize="inherit" />;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        "& .MuiPaper-root": {
          minWidth: "350px",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Alert
        severity={type}
        onClose={onClose}
        icon={false}
        sx={{
          width: "100%",
          alignItems: "flex-start",
          padding: "16px",
          borderRadius: "12px",
        }}
      >
        <Box display="flex" gap={2}>
          {/* Your logo - replace with your actual logo path */}
          <Box
            sx={{
              width: 44,
              height: 44,
              position: "relative",
              alignSelf: "flex-start",
              flexShrink: 0,
            }}
          >
            <Image
              src={"/assets/images/small-logo.png"}
              alt="Company Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </Box>

          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Box
                sx={{
                  color:
                    type === "success"
                      ? "#4caf50"
                      : type === "error"
                        ? "#f44336"
                        : type === "warning"
                          ? "#ff9800"
                          : "#2196f3",
                  display: "flex",
                  fontSize: "20px",
                }}
              >
                {getIcon()}
              </Box>
              {title && (
                <AlertTitle
                  sx={{
                    margin: 0,
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {title}
                </AlertTitle>
              )}
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {message}
            </Typography>
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default Toast;
