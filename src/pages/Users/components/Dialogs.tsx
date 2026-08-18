import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Select } from "../../../components/ui/Select";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { type User } from "../../../types/user";
import { useUnits } from "../../../hooks/useUnits";

// ---------------------------------------------------------------------------
// 1. CREATE / EDIT USER DIALOG
// ---------------------------------------------------------------------------

const userSchema = z.object({
  userId: z.string().min(1, "User ID is required").trim(),
  name: z.string().min(1, "Name is required").trim(),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number."),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  active: z.boolean(),
  unitIds: z.array(z.string()) 
}).refine((data) => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
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
  const [unitSearch, setUnitSearch] = useState("");

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { userId: "", name: "", mobile: "", password: "", confirmPassword: "", active: true, unitIds: [] }
  });

  useEffect(() => {
    if (open) {
      setUnitSearch("");
      reset(user ? { 
        userId: user.userId,
        name: user.name, 
        mobile: user.mobile, 
        active: user.active, 
        password: "",
        confirmPassword: "",
        unitIds: user.units?.map(u => u.unit.id) || []
      } : { 
        userId: "",
        name: "", 
        mobile: "", 
        active: true, 
        password: "",
        confirmPassword: "",
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
            <Label htmlFor="userId">User ID (Login ID) *</Label>
            <Input id="userId" {...register("userId")} disabled={isLoading} placeholder="e.g. FM-1001" />
            {errors.userId && <p className="text-xs text-red-500">{errors.userId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register("name")} disabled={isLoading} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Contact Mobile Number *</Label>
            <Input id="mobile" {...register("mobile")} disabled={isLoading} maxLength={10} placeholder="e.g. 9876543210" />
            {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-slate-700 pt-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="password">{isEdit ? "New Password" : "Password *"}</Label>
              <Input id="password" type="password" {...register("password")} disabled={isLoading} />
              {!isEdit && !errors.password && <p className="text-xs text-gray-500 dark:text-slate-400">Required for new users.</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...register("confirmPassword")} disabled={isLoading} />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-100 dark:border-slate-700 pt-4 mt-2">
            <Label htmlFor="active">Status</Label>
            <Select id="active" {...register("active")} disabled={isLoading} onChange={(e) => reset(prev => ({ ...prev, active: e.target.value === 'true' }))}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assign Units</Label>
            {isLoadingUnits ? (
              <div className="flex items-center justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-gray-400 dark:text-slate-500" /></div>
            ) : units.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400 p-2 border border-gray-100 dark:border-slate-700 rounded-md bg-gray-50 dark:bg-slate-800/50">No units available in the system.</p>
            ) : (
              <Controller
                name="unitIds"
                control={control}
                render={({ field }) => {
                  const allUnitsSelected = units.length > 0 && units.every(unit => field.value.includes(unit.id));
                  const someUnitsSelected = field.value.length > 0 && field.value.length < units.length;
                  
                  const handleSelectAll = () => {
                    if (allUnitsSelected) {
                      field.onChange([]);
                    } else {
                      field.onChange(units.map((u) => u.id));
                    }
                  };

                  const filteredUnits = units.filter((unit) =>
                    unit.name.toLowerCase().includes(unitSearch.trim().toLowerCase())
                  );

                  return (
                    <div className="space-y-3">
                      <div 
                        className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700/50 cursor-pointer border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50" 
                        onClick={handleSelectAll}
                      >
                        <input
                          type="checkbox"
                          checked={allUnitsSelected}
                          ref={(input) => {
                            if (input) {
                              input.indeterminate = someUnitsSelected;
                            }
                          }}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                        />
                        <Label className="cursor-pointer font-semibold">Select All</Label>
                      </div>

                      <div className="relative flex items-center">
                        <Search className="absolute left-3 h-4 w-4 text-gray-500 dark:text-slate-400 z-10" />
                        <Input
                          value={unitSearch}
                          onChange={(e) => setUnitSearch(e.target.value)}
                          placeholder="Search units..."
                          className="pl-9"
                          disabled={isLoading || isLoadingUnits}
                        />
                      </div>

                      <div className="space-y-1 max-h-40 overflow-y-auto p-1 bg-gray-50 dark:bg-slate-800/50 rounded-md border border-gray-100 dark:border-slate-700">
                        {filteredUnits.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-slate-400 p-2">No units match your search.</p>
                        ) : (
                          filteredUnits.map((unit) => {
                            const isChecked = field.value.includes(unit.id);
                            return (
                              <div key={unit.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700/50 cursor-pointer" 
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
                          })
                        )}
                      </div>
                    </div>
                  );
                }}
              />
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

// ---------------------------------------------------------------------------
// 2. DELETE USER DIALOG
// ---------------------------------------------------------------------------

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
        <p className="text-sm text-gray-500 dark:text-slate-400">This action cannot be undone. Are you sure you want to delete this user?</p>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
        <Button onClick={onConfirm} isLoading={isLoading} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
      </DialogFooter>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// 3. RESET PASSWORD DIALOG
// ---------------------------------------------------------------------------

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordDialog({
  open, onOpenChange, user, onConfirm, isLoading, error
}: {
  open: boolean; onOpenChange: (open: boolean) => void; user: User | null;
  onConfirm: (password: string) => void; isLoading?: boolean; error?: string | null;
}) {
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" }
  });

  useEffect(() => {
    if (!open) reset({ password: "", confirmPassword: "" });
  }, [open, reset]);

  const onSubmit = (data: ResetPasswordValues) => {
    onConfirm(data.password);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Reset Password</DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-4">
        <form id="reset-password-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-gray-100 dark:border-slate-700">
            <div className="space-y-1">
              <Label className="text-gray-500 dark:text-slate-400">Name</Label>
              <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{user.name}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-500 dark:text-slate-400">User ID</Label>
              <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{user.userId}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password *</Label>
            <Input id="new-password" type="password" {...register("password")} disabled={isLoading} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">Confirm Password *</Label>
            <Input id="confirm-new-password" type="password" {...register("confirmPassword")} disabled={isLoading} />
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
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
        <Button type="submit" form="reset-password-form" isLoading={isLoading} disabled={!isValid}>
          Reset Password
        </Button>
      </DialogFooter>
    </Dialog>
  );
}