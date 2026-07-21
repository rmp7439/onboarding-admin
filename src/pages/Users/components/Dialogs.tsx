import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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

const userSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number."),
  password: z.string().optional(),
  active: z.boolean(),
  // REMOVED .default([]) to fix the TypeScript Resolver error
  unitIds: z.array(z.string()) 
});

export type UserFormValues = z.infer<typeof userSchema>;

export function UserFormDialog({
  open, onOpenChange, user, onSave, isLoading, error
}: {
  open: boolean; onOpenChange: (open: boolean) => void; user?: User | null; 
  onSave: (data: UserFormValues) => void; isLoading?: boolean; error?: string | null;
}) {
  const isEdit = !!user;
  const { data: units = [], isLoading: isLoadingUnits } = useUnits();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", mobile: "", password: "", active: true, unitIds: [] }
  });

  useEffect(() => {
    if (open) {
      reset(user ? { 
        name: user.name, 
        mobile: user.mobile, 
        active: user.active, 
        password: "",
        unitIds: user.units?.map(u => u.unit.id) || []
      } : { 
        name: "", 
        mobile: "", 
        active: true, 
        password: "",
        unitIds: []
      });
    }
  }, [open, user, reset]);

  const onSubmit = (data: UserFormValues) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit User" : "Add User"}</DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
        <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register("name")} disabled={isLoading} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input id="mobile" {...register("mobile")} disabled={isLoading} maxLength={10} placeholder="e.g. 9876543210" />
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

          <div className="space-y-2 border-t border-gray-100 pt-4 mt-2">
            <Label>Assign Units</Label>
            {isLoadingUnits ? (
              <div className="flex items-center justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
            ) : (
              <div className="space-y-3 max-h-40 overflow-y-auto p-1 bg-gray-50 rounded-md border border-gray-100">
                {units.length === 0 ? (
                  <p className="text-sm text-gray-500 p-2">No units available in the system.</p>
                ) : (
                  <Controller
                    name="unitIds"
                    control={control}
                    render={({ field }) => (
                      <>
                        {units.map((unit) => {
                          const isChecked = field.value.includes(unit.id);
                          return (
                            <div key={unit.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 cursor-pointer" 
                              onClick={() => {
                                const newValue = isChecked ? field.value.filter(id => id !== unit.id) : [...field.value, unit.id];
                                field.onChange(newValue);
                              }}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                              />
                              <Label className="cursor-pointer">{unit.name}</Label>
                            </div>
                          );
                        })}
                      </>
                    )}
                  />
                )}
              </div>
            )}
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
        <Button type="submit" form="user-form" isLoading={isLoading}>Save User</Button>
      </DialogFooter>
    </Dialog>
  );
}

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