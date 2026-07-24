import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Select } from "../../../components/ui/Select";
import { AlertCircle } from "lucide-react";

// --- 1. Create / Edit Admin Form ---
const adminSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().min(1, "Email is required").email("Invalid email format").trim(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  active: z.boolean(),
}).refine((data) => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type AdminFormValues = z.infer<typeof adminSchema>;

export function AdminFormDialog({
  open, onOpenChange, admin, onSave, isLoading, error
}: {
  open: boolean; onOpenChange: (open: boolean) => void; admin?: any; 
  onSave: (data: AdminFormValues) => void; isLoading?: boolean; error?: string | null;
}) {
  const isEdit = !!admin;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", active: true }
  });

  useEffect(() => {
    if (open) {
      reset(admin ? { 
        name: admin.name, 
        email: admin.email, 
        active: admin.active, 
        password: "",
        confirmPassword: ""
      } : { 
        name: "", 
        email: "", 
        active: true, 
        password: "",
        confirmPassword: ""
      });
    }
  }, [open, admin, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Admin" : "Add Admin"}</DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-4">
        <form id="admin-form" onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register("name")} disabled={isLoading} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" {...register("email")} disabled={isLoading} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="password">{isEdit ? "New Password" : "Password *"}</Label>
              <Input id="password" type="password" {...register("password")} disabled={isLoading} />
              {!isEdit && !errors.password && <p className="text-xs text-gray-500">Required for new admins.</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...register("confirmPassword")} disabled={isLoading} />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-4 mt-2">
            <Label htmlFor="active">Status</Label>
            <Select id="active" {...register("active")} disabled={isLoading} onChange={(e) => reset(prev => ({ ...prev, active: e.target.value === 'true' }))}>
              <option value="true">Active</option>
              <option value="false">Disabled</option>
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
        <Button type="submit" form="admin-form" isLoading={isLoading}>Save Admin</Button>
      </DialogFooter>
    </Dialog>
  );
}

// --- 2. Delete Admin Dialog ---
export function DeleteAdminDialog({
  open, onOpenChange, onConfirm, isLoading
}: {
  open: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void; isLoading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Delete Admin?</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <p className="text-sm text-gray-500">This action cannot be undone. Are you sure you want to delete this admin account?</p>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
        <Button onClick={onConfirm} isLoading={isLoading} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
      </DialogFooter>
    </Dialog>
  );
}

// --- 3. Reset Password Dialog ---
const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function ResetAdminPasswordDialog({
  open, onOpenChange, admin, onConfirm, isLoading, error
}: {
  open: boolean; onOpenChange: (open: boolean) => void; admin: any;
  onConfirm: (password: string) => void; isLoading?: boolean; error?: string | null;
}) {
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" }
  });

  useEffect(() => {
    if (!open) reset({ password: "", confirmPassword: "" });
  }, [open, reset]);

  if (!admin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Reset Admin Password</DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-4">
        <form id="reset-admin-password-form" onSubmit={handleSubmit((data) => onConfirm(data.password))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-gray-100">
            <div className="space-y-1">
              <Label className="text-gray-500">Name</Label>
              <div className="text-sm font-medium text-gray-900">{admin.name}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-500">Email</Label>
              <div className="text-sm font-medium text-gray-900">{admin.email}</div>
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
        <Button type="submit" form="reset-admin-password-form" isLoading={isLoading} disabled={!isValid}>
          Reset Password
        </Button>
      </DialogFooter>
    </Dialog>
  );
}