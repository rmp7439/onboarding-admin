import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { AlertCircle } from "lucide-react";
import { type Unit } from "../../../types/unit";

export function UnitFormDialog({
  open, onOpenChange, unit, onSave, isLoading, error
}: {
  open: boolean; onOpenChange: (open: boolean) => void; unit?: Unit | null; 
  onSave: (name: string) => void; isLoading?: boolean; error?: string | null;
}) {
  const [name, setName] = useState("");
  const isEdit = !!unit;

  useEffect(() => {
    if (open) {
      setName(unit ? unit.name : "");
    }
  }, [open, unit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSave(name.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Unit" : "Add Unit"}</DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-4">
        <form id="unit-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unitName">Unit Name *</Label>
            <Input 
              id="unitName" 
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
        <Button type="submit" form="unit-form" disabled={!name.trim()} isLoading={isLoading}>Save</Button>
      </DialogFooter>
    </Dialog>
  );
}

export function DeleteUnitDialog({
  open, onOpenChange, onConfirm, isLoading
}: {
  open: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void; isLoading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Delete Unit?</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <p className="text-sm text-gray-500">This action cannot be undone. Are you sure you want to delete this unit? It will be unassigned from all users.</p>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
        <Button onClick={onConfirm} isLoading={isLoading} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
      </DialogFooter>
    </Dialog>
  );
}