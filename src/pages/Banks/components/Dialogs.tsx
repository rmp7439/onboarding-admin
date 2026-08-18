import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { AlertCircle } from "lucide-react";

export function BankFormDialog({
  open, onOpenChange, bank, onSave, isLoading, error
}: {
  open: boolean; onOpenChange: (open: boolean) => void; bank?: { id: string; name: string } | null; 
  onSave: (payload: { name: string }) => void; isLoading?: boolean; error?: string | null;
}) {
  const [name, setName] = useState("");
  const isEdit = !!bank;

  useEffect(() => {
    if (open) {
      setName(bank ? bank.name : "");
    }
  }, [open, bank]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSave({ name: name.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Bank" : "Add Bank"}</DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-4">
        <form id="bank-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name *</Label>
            <Input 
              id="bankName" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              disabled={isLoading}
              required 
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
        <Button type="submit" form="bank-form" disabled={!name.trim()} isLoading={isLoading}>Save</Button>
      </DialogFooter>
    </Dialog>
  );
}

export function DeleteBankDialog({
  open, onOpenChange, onConfirm, isLoading
}: {
  open: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void; isLoading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Delete Bank?</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <p className="text-sm text-gray-500 dark:text-slate-400">This action cannot be undone. Are you sure you want to delete this bank? It will no longer be available for selection during employee registration.</p>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
        <Button onClick={onConfirm} isLoading={isLoading} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
      </DialogFooter>
    </Dialog>
  );
}