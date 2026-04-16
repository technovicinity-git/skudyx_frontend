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
import Button from "@/components/common/Button";
import { useWithdrawMoney } from "@/hook/transaction";
import { useGetMyBanks } from "@/hook/bank";
import { useToast } from "@/lib/Provider/toastProvider";
import { useQueryClient } from "@tanstack/react-query";

const CURRENCIES = ["USD"];

export default function WithdrawMoneyModal({ open, onClose }) {
  const [currency, setCurrency] = React.useState("USD");
  const [amount, setAmount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [bankAccountNumber, setBankAccountNumber] = React.useState("");

  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { withdrawMoney, isLoading, error } = useWithdrawMoney({
    onSuccess: () => {
      queryClient.invalidateQueries(["myTransactions"]);
      showToast("Money withdrawn successfully!", "success", "Success");
      onClose();
    },
    onError: (err) => {
      showToast(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
        "error",
        "Error"
      );
    },
  });

  const { myBanks } = useGetMyBanks();

  const bankOptions =
    myBanks?.map((bank) => ({
      value: bank._id,
      label: `${bank.bank_name} - ${bank.account_number} (${bank.account_name})`,
    })) || [];

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

    withdrawMoney({
      currency,
      amount: parseFloat(amount),
      bank_id: bankAccountNumber,
      description: description.trim() || undefined,
      transaction_type: "withdraw",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Withdraw Money</DialogTitle>
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
          select
          label="Bank Account"
          value={bankAccountNumber}
          onChange={(e) => setBankAccountNumber(e.target.value)}
          fullWidth
          margin="normal"
          disabled={isLoading || !bankOptions.length}
        >
          {bankOptions.length > 0 ? (
            bankOptions.map((bank) => (
              <MenuItem key={bank.value} value={bank.value}>
                {bank.label}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled value="">
              No bank accounts available
            </MenuItem>
          )}
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
            "Withdraw"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
