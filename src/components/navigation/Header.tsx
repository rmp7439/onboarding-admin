import { useState } from 'react';
import { LogOut, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { logout, changePassword } from '../../services/authService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Header() {
  const { clearAuth } = useAuth();
  const { toast } = useToast();
  
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      clearAuth();
      toast("Successfully logged out", "success");
    } catch (error) {
      toast("Logout failed. Please try again.", "error");
    } finally {
      setIsLoggingOut(false);
      setIsLogoutOpen(false);
    }
  };

  const handlePasswordChange = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);
    setPasswordError(null);
    try {
      await changePassword({ 
        currentPassword: data.currentPassword, 
        newPassword: data.newPassword 
      });
      toast("Password changed successfully", "success");
      setIsPasswordOpen(false);
      reset();
    } catch (error: any) {
      const msg = error.response?.data?.error || error.message || "Failed to change password";
      setPasswordError(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <h2 className="text-xl font-semibold text-gray-800">
          Employee Onboarding Admin
        </h2>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => {
              setIsPasswordOpen(true);
              reset();
              setPasswordError(null);
            }}
          >
            <KeyRound className="h-4 w-4 mr-2" />
            Change Password
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => setIsLogoutOpen(true)}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Logout Dialog */}
      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-gray-500">Are you sure you want to log out of the admin portal? You will need to sign in again to access the dashboard.</p>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsLogoutOpen(false)} disabled={isLoggingOut}>Cancel</Button>
          <Button variant="default" className="bg-red-600 text-white hover:bg-red-700" isLoading={isLoggingOut} onClick={handleLogout}>
            Log Out
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordOpen} onOpenChange={(open) => {
        if (!open) reset();
        setIsPasswordOpen(open);
      }}>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <DialogContent className="space-y-4">
          <form id="change-password-form" onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                {...register("currentPassword")} 
                disabled={isChangingPassword}
              />
              {errors.currentPassword && <p className="text-xs text-red-500">{errors.currentPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword" 
                type="password" 
                {...register("newPassword")} 
                disabled={isChangingPassword}
              />
              {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                {...register("confirmPassword")} 
                disabled={isChangingPassword}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            {passwordError && (
              <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span>{passwordError}</span>
              </div>
            )}
          </form>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsPasswordOpen(false)} disabled={isChangingPassword}>Cancel</Button>
          <Button type="submit" form="change-password-form" isLoading={isChangingPassword}>
            Update Password
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}