import Button from "@/components/common/Button";
import Loader from "@/components/loader/Loader";
import { useGetAdminBank } from "@/hook/bank";
import { useAddMoneyUsingBankTransfer } from "@/hook/transaction";
import { useToast } from "@/lib/Provider/toastProvider";
import {
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";

const CURRENCIES = ["USD"];

export default function BankTransferModal({ open, onClose }) {
  const [currency, setCurrency] = React.useState("USD");
  const [amount, setAmount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [bank_name, setBankName] = React.useState("");
  const [account_number, setBankAccountNumber] = React.useState("");
  const [bank_branch_name, setBranchName] = React.useState("");
  const [account_name, setAccountName] = React.useState("");
  const [bank_transaction_id, setBankTransactionId] = React.useState("");
  const [payment_date, setPaymentDate] = React.useState("");

  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const {
    adminBank,
    isLoading: isLoadingAdminBank,
    errorMessage: adminBankError,
  } = useGetAdminBank();

  const { addMoneyUsingBankTransfer, isLoading, errorMessage } =
    useAddMoneyUsingBankTransfer({
      onSuccess: () => {
        queryClient.invalidateQueries(["myTransactions"]);
        showToast("Money add request sent successfully!", "success", "Success");
        onClose();
      },
    });

  useEffect(() => {
    if (!open) {
      setCurrency("USD");
      setAmount("");
      setBankName("");
      setBranchName("");
      setBankAccountNumber("");
      setAccountName("");
      setBankTransactionId("");
      setPaymentDate("");
      setDescription("");
      setFormError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setFormError("Please enter a valid amount greater than 0");
      return;
    }
    if (
      !bank_name ||
      !account_number ||
      !bank_branch_name ||
      !account_name ||
      !bank_transaction_id ||
      !payment_date
    ) {
      setFormError("Please fill in all required fields");
      return;
    }

    setFormError("");

    addMoneyUsingBankTransfer({
      currency,
      amount: parseFloat(amount),
      bank_name,
      account_number,
      bank_branch_name,
      account_name,
      bank_transaction_id,
      payment_date,
      description: description.trim() || undefined,
      transaction_type: "deposit",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Money Using Bank Transfer</DialogTitle>

      <DialogContent dividers>
        {formError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {isLoadingAdminBank ? (
          <Loader fullScreen />
        ) : adminBankError ? (
          <div className="text-red-500 p-2 bg-red-100 border border-red-400">
            {adminBankError}
          </div>
        ) : (
          <div className="w-full bg-white p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Admin Account Info
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Account Name:</p>
                <p className="text-base font-medium text-gray-900">
                  {adminBank?.account_name}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Account Number:</p>
                <p className="text-base font-medium text-gray-900">
                  {adminBank?.account_number}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Bank Name:</p>
                <p className="text-base font-medium text-gray-900">
                  {adminBank?.bank_name}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Bank Branch Name:</p>
                <p className="text-base font-medium text-gray-900">
                  {adminBank?.bank_branch_name}
                </p>
              </div>
            </div>
          </div>
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
          label="Bank Name"
          fullWidth
          margin="normal"
          value={bank_name}
          onChange={(e) => setBankName(e.target.value)}
          disabled={isLoading}
        />
        <TextField
          label="Branch Name"
          fullWidth
          margin="normal"
          value={bank_branch_name}
          onChange={(e) => setBranchName(e.target.value)}
          disabled={isLoading}
        />

        <TextField
          label="Bank Account Number"
          fullWidth
          margin="normal"
          value={account_number}
          onChange={(e) => setBankAccountNumber(e.target.value)}
          disabled={isLoading}
        />
        <TextField
          label="Account Name"
          fullWidth
          margin="normal"
          value={account_name}
          onChange={(e) => setAccountName(e.target.value)}
          disabled={isLoading}
        />

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
          label="Transaction Number"
          type="text"
          fullWidth
          margin="normal"
          value={bank_transaction_id}
          onChange={(e) => setBankTransactionId(e.target.value)}
          disabled={isLoading}
        />

        <TextField
          label="Payment Date"
          type="date"
          fullWidth
          margin="normal"
          value={payment_date}
          onChange={(e) => setPaymentDate(e.target.value)}
          disabled={isLoading}
          InputLabelProps={{ shrink: true }}
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
            "Sent Request"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
