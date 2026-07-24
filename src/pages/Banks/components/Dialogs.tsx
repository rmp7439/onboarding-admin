import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Select } from "../../../components/ui/Select";
import { AlertCircle } from "lucide-react";
import { type Bank } from "../../../types/bank";

export function BankFormDialog({
  open, onOpenChange, bank, onSave, isLoading, error
}: {
  open: boolean; onOpenChange: (open: boolean) => void; bank?: Bank | null; 
  onSave: (payload: { name: string; isActive: boolean }) => void; isLoading?: boolean; error?: string | null;
}) {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const isEdit = !!bank;

  useEffect(() => {
    if (open) {
      setName(bank ? bank.name : "");
      setIsActive(bank ? bank.isActive : true);
    }
  }, [open, bank]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSave({ name: name.trim(), isActive });
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
          {isEdit && (
            <div className="space-y-2">
              <Label htmlFor="activeStatus">Status</Label>
              <Select id="activeStatus" value={isActive.toString()} onChange={(e) => setIsActive(e.target.value === 'true')} disabled={isLoading}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </div>
          )}
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
        <p className="text-sm text-gray-500">This action cannot be undone. Are you sure you want to delete this bank? If employees are currently tied to this bank, it is highly recommended to mark the bank as "Inactive" instead.</p>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
        <Button onClick={onConfirm} isLoading={isLoading} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
      </DialogFooter>
    </Dialog>
  );
}