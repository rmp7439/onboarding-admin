import { useState } from "react";
import { LogOut, KeyRound, AlertCircle, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useTheme } from "../../hooks/useTheme";
import { logout, changePassword } from "../../services/authService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Header() {
  const { clearAuth } = useAuth();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
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
        newPassword: data.newPassword,
      });
      toast("Password changed successfully", "success");
      setIsPasswordOpen(false);
      reset();
    } catch (error: any) {
      setPasswordError(
        error.response?.data?.error ||
          error.message ||
          "Failed to change password",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-6 shrink-0 transition-colors duration-200">
        <Link
          to="/dashboard"
          className="group flex items-center gap-3 rounded-md transition-all duration-200 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100 transition-colors group-hover:text-gray-900 dark:group-hover:text-white">
            Employee Onboarding Admin
          </h2>
        </Link>

        <div className="flex items-center space-x-2">
          {/* Restored Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Restored Semantic Action Buttons */}
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800"
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
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-slate-800"
            onClick={() => setIsLogoutOpen(true)}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Are you sure you want to log out of the admin portal? You will need
            to sign in again to access the dashboard.
          </p>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsLogoutOpen(false)}
            disabled={isLoggingOut}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            isLoading={isLoggingOut}
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={isPasswordOpen}
        onOpenChange={(open) => {
          if (!open) reset();
          setIsPasswordOpen(open);
        }}
      >
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <DialogContent className="space-y-4">
          <form
            id="change-password-form"
            onSubmit={handleSubmit(handlePasswordChange)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...register("currentPassword")}
                disabled={isChangingPassword}
              />
              {errors.currentPassword && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword")}
                disabled={isChangingPassword}
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                disabled={isChangingPassword}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {passwordError && (
              <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}
          </form>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsPasswordOpen(false)}
            disabled={isChangingPassword}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="change-password-form"
            isLoading={isChangingPassword}
          >
            Update Password
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}