import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { AlertCircle } from "lucide-react";

export function ConfirmationDialog({ 
  open, onOpenChange, title, actionText, isDestructive, onConfirm, isLoading, error 
}: { 
  open: boolean; onOpenChange: (open: boolean) => void; title: string; actionText: string; isDestructive?: boolean; onConfirm: () => void; isLoading?: boolean; error?: string | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-4">
        <p className="text-sm text-gray-500">This action cannot be easily undone. Are you sure you want to proceed?</p>
        {error && (
          <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
        <Button 
          isLoading={isLoading}
          onClick={onConfirm}
          className={isDestructive ? "bg-red-600 text-white hover:bg-red-700" : ""}
        >
          {actionText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export function EmployeeCodeDialog({ 
  open, onOpenChange, onSave, isLoading, error 
}: { 
  open: boolean; onOpenChange: (open: boolean) => void; onSave: (code: string) => void; isLoading?: boolean; error?: string | null;
}) {
  const [code, setCode] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSave = () => {
    if (!code.trim()) {
      setValidationError("Employee Code is required.");
      return;
    }
    if (code.length < 4) {
      setValidationError("Code must be at least 4 characters.");
      return;
    }
    if (code.length > 15) {
      setValidationError("Code cannot exceed 15 characters.");
      return;
    }
    setValidationError("");
    onSave(code);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) { setCode(""); setValidationError(""); }
      onOpenChange(val);
    }}>
      <DialogHeader>
        <DialogTitle>Assign Employee Code</DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="empCode">Employee Code</Label>
          <Input 
            id="empCode" 
            placeholder="e.g., EMP-1050" 
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setValidationError("");
            }}
            disabled={isLoading}
          />
          {validationError && <p className="text-sm text-red-600">{validationError}</p>}
        </div>
        {error && (
          <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
        <Button isLoading={isLoading} onClick={handleSave}>Save Code</Button>
      </DialogFooter>
    </Dialog>
  );
}

export function RejectDialog({ 
  open, onOpenChange, onConfirm, isLoading, error 
}: { 
  open: boolean; onOpenChange: (open: boolean) => void; onConfirm: (reason: string) => void; isLoading?: boolean; error?: string | null;
}) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) setReason("");
      onOpenChange(val);
    }}>
      <DialogHeader>
        <DialogTitle>Reject Employee</DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reason">Reason for rejection</Label>
          <textarea
            id="reason"
            className="flex min-h-[100px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Reason for rejection"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isLoading}
            maxLength={250}
          />
        </div>
        {error && (
          <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
        <Button 
          isLoading={isLoading} 
          onClick={handleConfirm}
          disabled={!reason.trim()}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Reject
        </Button>
      </DialogFooter>
    </Dialog>
  );
}