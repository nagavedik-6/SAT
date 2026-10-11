import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, RotateCcw } from 'lucide-react';

export default function Toast({ toast, onClose, onUndo }) {
  if (!toast) return null;

  return (
    <div className={`toast-notification toast-${toast.type || 'info'}`}>
      <div className="toast-icon">
        {toast.type === 'success' && <CheckCircle2 size={18} />}
        {toast.type === 'error' && <AlertCircle size={18} />}
        {toast.type === 'info' && <Info size={18} />}
      </div>
      <div className="toast-text">
        <p className="toast-message">{toast.message}</p>
      </div>

      {toast.canUndo && onUndo && (
        <button type="button" className="toast-undo-btn" onClick={onUndo}>
          <RotateCcw size={13} />
          <span>Undo</span>
        </button>
      )}

      <button type="button" className="toast-close-btn" onClick={onClose}>
        <X size={15} />
      </button>
    </div>
  );
}
