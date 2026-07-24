import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { AlertCircle } from "lucide-react";
import { type Unit } from "../../../types/unit";

const CONFIGURABLE_FIELDS = [
  { key: 'aadhaar', label: 'Aadhaar' },
  { key: 'pan', label: 'PAN' },
  { key: 'uan', label: 'UAN' },
  { key: 'esic', label: 'ESIC' },
  { key: 'drivingLicence', label: 'Driving Licence' },
  { key: 'gender', label: 'Gender' },
  { key: 'education', label: 'Highest Education' },
  { key: 'maritalStatus', label: 'Marital Status' },
  { key: 'accountHolderName', label: 'Account Holder Name' },
  { key: 'bankName', label: 'Bank Name' },
  { key: 'accountNumber', label: 'Account Number' },
  { key: 'ifsc', label: 'IFSC Code' },
  { key: 'micr', label: 'MICR Code' },
  { key: 'nomineeName', label: 'Nominee Name' },
  { key: 'nomineeRelation', label: 'Nominee Relationship' },
  { key: 'nomineeMobile', label: 'Nominee Mobile' },
  { key: 'nomineePercentage', label: 'Nominee Percentage' },
];

export function UnitFormDialog({
  open, onOpenChange, unit, onSave, isLoading, error
}: {
  open: boolean; onOpenChange: (open: boolean) => void; unit?: Unit | null; 
  onSave: (payload: { name: string; requiredFields: string[] }) => void; isLoading?: boolean; error?: string | null;
}) {
  const [name, setName] = useState("");
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const isEdit = !!unit;

  useEffect(() => {
    if (open) {
      setName(unit ? unit.name : "");
      setRequiredFields(unit?.requiredFields || []);
    }
  }, [open, unit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSave({ name: name.trim(), requiredFields });
  };

  const toggleField = (key: string) => {
    setRequiredFields(prev => 
      prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Unit" : "Add Unit"}</DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
        <form id="unit-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unitName">Unit Name *</Label>
            <Input 
              id="unitName" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              disabled={isLoading || unit?.isProtected}
              required 
            />
            {unit?.isProtected && (
              <p className="text-xs text-amber-600">The name of this system unit cannot be changed.</p>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <Label>Required Employee Fields</Label>
            <p className="text-xs text-gray-500 mb-2">Select the fields that must be mandatory for employees in this unit.</p>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-3 bg-gray-50 rounded-md border border-gray-100">
              {CONFIGURABLE_FIELDS.map(field => (
                <div key={field.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`field-${field.key}`}
                    checked={requiredFields.includes(field.key)}
                    onChange={() => toggleField(field.key)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                  />
                  <Label htmlFor={`field-${field.key}`} className="cursor-pointer font-normal text-sm leading-tight">
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
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