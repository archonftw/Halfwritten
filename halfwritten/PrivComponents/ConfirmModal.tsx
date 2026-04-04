"use client";

import { FC } from "react";

type ConfirmModalProps = {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal: FC<ConfirmModalProps> = ({ title = "Confirm", message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="rounded-2xl bg-zinc-950 border border-red-500/20 p-6 w-96 text-center shadow-[0_0_30px_rgba(220,38,38,0.3)]">
        <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>
        <p className="mb-6 text-zinc-400">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-2 text-sm font-semibold text-zinc-200 hover:border-red-500/20 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-2xl border border-red-500/20 bg-red-700 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;