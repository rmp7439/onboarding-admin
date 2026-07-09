import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { logout } from '../../services/authService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog';
import { Button } from '../ui/Button';

export default function Header() {
  const { clearAuth } = useAuth();
  const { toast } = useToast();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <h2 className="text-xl font-semibold text-gray-800">
          Employee Onboarding Admin
        </h2>
        
        <div className="flex items-center space-x-4">
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
    </>
  );
}