import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Select } from "../../../components/ui/Select";
import { AlertCircle, Loader2 } from "lucide-react";
import { type User } from "../../../types/user";
import { useUnits } from "../../../hooks/useUnits";

// --- User Form Dialog (Add & Edit) ---
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobile: z.string().min(10, "Mobile number is required"),
  password: z.string().optional(),
  active: z.boolean(),
});

type UserFormValues = z.infer<typeof userSchema>;

export function UserFormDialog({
  open, onOpenChange, user, onSave, isLoading, error
}: {
  open: boolean; onOpenChange: (open: boolean) => void; user?: User | null; 
  onSave: (data: UserFormValues) => void; isLoading?: boolean; error?: string | null;
}) {
  const isEdit = !!user;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", mobile: "", password: "", active: true }
  });

  useEffect(() => {
    if (open) {
      reset(user ? { name: user.name, mobile: user.mobile, active: user.active, password: "" } : { name: "", mobile: "", active: true, password: "" });
    }
  }, [open, user, reset]);

  const onSubmit = (data: UserFormValues) => {
    if (!isEdit && !data.password) {
      // Manual error if creating and no password
      return;
    }
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit User" : "Add User"}</DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-4">
        <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register("name")} disabled={isLoading} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input id="mobile" {...register("mobile")} disabled={isLoading} />
            {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{isEdit ? "Password (leave blank to keep current)" : "Password *"}</Label>
            <Input id="password" type="password" {...register("password")} disabled={isLoading} />
            {!isEdit && !errors.password && <p className="text-xs text-gray-500">Required for new users.</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="active">Status</Label>
            <Select id="active" {...register("active")} disabled={isLoading} onChange={(e) => reset(prev => ({ ...prev, active: e.target.value === 'true' }))}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
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
        <Button type="submit" form="user-form" isLoading={isLoading}>Save</Button>
      </DialogFooter>
    </Dialog>
  );
}

// --- Delete Dialog ---
export function DeleteUserDialog({
  open, onOpenChange, onConfirm, isLoading
}: {
  open: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void; isLoading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Delete User?</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <p className="text-sm text-gray-500">This action cannot be undone. Are you sure you want to delete this user?</p>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
        <Button onClick={onConfirm} isLoading={isLoading} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
      </DialogFooter>
    </Dialog>
  );
}

// --- Assign Units Dialog ---
export function AssignUnitsDialog({
  open, onOpenChange, user, onSave, isLoading, error
}: {
  open: boolean; onOpenChange: (open: boolean) => void; user: User | null; 
  onSave: (unitIds: string[]) => void; isLoading?: boolean; error?: string | null;
}) {
  const { data: units = [], isLoading: isLoadingUnits } = useUnits();
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);

  useEffect(() => {
    if (open && user) {
      setSelectedUnitIds(user.units?.map(u => u.unit.id) || []);
    }
  }, [open, user]);

  const toggleUnit = (unitId: string) => {
    setSelectedUnitIds(prev => prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Assign Units for {user?.name}</DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-4">
        {isLoadingUnits ? (
          <div className="flex items-center justify-center p-6"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto p-1">
            {units.length === 0 ? (
              <p className="text-sm text-gray-500">No units available in the system.</p>
            ) : (
              units.map((unit) => (
                <div key={unit.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer" onClick={() => toggleUnit(unit.id)}>
                  <input
                    type="checkbox"
                    checked={selectedUnitIds.includes(unit.id)}
                    onChange={() => {}}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                  />
                  <Label className="cursor-pointer">{unit.name}</Label>
                </div>
              ))
            )}
          </div>
        )}
        {error && (
          <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading || isLoadingUnits}>Cancel</Button>
        <Button onClick={() => onSave(selectedUnitIds)} isLoading={isLoading} disabled={isLoadingUnits}>Save</Button>
      </DialogFooter>
    </Dialog>
  );
}