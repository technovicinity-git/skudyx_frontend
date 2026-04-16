import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAddMoneyUsingCard } from "@/hook/transaction";
import Button from "@/components/common/Button";

const CURRENCIES = ["USD"];

export default function AddMoneyModal({ open, onClose }) {
  const [currency, setCurrency] = React.useState("USD");
  const [amount, setAmount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const { addMoneyUsingCard, isLoading, error, errorMessage } =
    useAddMoneyUsingCard({
      onSuccess: (data) => {
        window.location.href = data.data.data.url;
      },
    });

  useEffect(() => {
    if (!open) {
      setCurrency("USD");
      setAmount("");
      setDescription("");
      setFormError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setFormError("Please enter a valid amount greater than 0");
      return;
    }

    setFormError("");

    addMoneyUsingCard({
      currency,
      amount: parseFloat(amount),
      description: description.trim() || undefined,
      transaction_type: "deposit",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Money</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {typeof error === "string"
              ? error
              : "Something went wrong. Please try again."}
          </Alert>
        )}

        {formError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        <TextField
          select
          label="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          fullWidth
          margin="normal"
          disabled={true}
        >
          {CURRENCIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Amount"
          type="number"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
        />

        <TextField
          label="Description (optional)"
          fullWidth
          multiline
          maxRows={3}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
      </DialogContent>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <DialogActions className="my-2">
        <Button
          onClick={onClose}
          color="inherit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="solid"
          disabled={isLoading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Add Money"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
