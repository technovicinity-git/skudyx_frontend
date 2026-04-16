"use client";

import React from "react";
import Button from "../common/Button";

const SettingModalFooter = ({
  onCancel,
  onSave,
  cancelText = "Cancel",
  saveText = "Save",
  saveDisabled = false,
  className = "",
  isLoading = false,
}) => {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white rounded-b-2xl ${className}`}
    >
      <Button onClick={onCancel} variant="outline">
        {cancelText}
      </Button>

      <Button
        onClick={onSave}
        disabled={saveDisabled || isLoading}
        variant="solid"
      >
        {isLoading ? "Saving..." : saveText}
      </Button>
    </div>
  );
};

export default SettingModalFooter;
