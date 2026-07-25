import { useState } from "react";
import { Edit, Trash2, Plus, Key, ShieldAlert } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { useToast } from "../../hooks/useToast";
import { useAdmins, useCreateAdmin, useUpdateAdmin, useDeleteAdmin, useResetAdminPassword } from "../../hooks/useAdmins";
import { AdminFormDialog, DeleteAdminDialog, ResetAdminPasswordDialog, type AdminFormValues } from "./components/Dialogs";

export default function Admins() {
  const { data: admins, isLoading, isError, refetch } = useAdmins();
  const { toast } = useToast();

  const createMutation = useCreateAdmin();
  const updateMutation = useUpdateAdmin();
  const deleteMutation = useDeleteAdmin();
  const resetPasswordMutation = useResetAdminPassword();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const extractError = (err: any) => err?.response?.data?.error || err.message || "An unexpected error occurred.";

  const handleOpenForm = (admin?: any) => {
    setSelectedAdmin(admin || null);
    setApiError(null);
    setFormOpen(true);
  };

  const handleSaveAdmin = (data: AdminFormValues) => {
    setApiError(null);
    
    if (!selectedAdmin && !data.password) {
      setApiError("Password is required to create a new admin.");
      return;
    }

    const payload = { name: data.name, username: data.username, active: data.active, password: data.password };
    if (!payload.password) delete payload.password;

    if (selectedAdmin) {
      updateMutation.mutate({ id: selectedAdmin.id, payload }, {
        onSuccess: () => { toast("Admin updated successfully", "success"); setFormOpen(false); },
        onError: (err) => setApiError(extractError(err))
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { toast("Admin created successfully", "success"); setFormOpen(false); },
        onError: (err) => setApiError(extractError(err))
      });
    }
  };

  const handleDeleteAdmin = () => {
    if (!selectedAdmin) return;
    deleteMutation.mutate(selectedAdmin.id, {
      onSuccess: () => { toast("Admin deleted successfully", "success"); setDeleteOpen(false); },
      onError: (err) => toast(extractError(err), "error")
    });
  };

  const handleResetPassword = (password: string) => {
    if (!selectedAdmin) return;
    setApiError(null);
    resetPasswordMutation.mutate(
      { id: selectedAdmin.id, password },
      {
        onSuccess: () => {
          toast("Password reset successfully.", "success");
          setResetPasswordOpen(false);
        },
        onError: (err) => setApiError(extractError(err))
      }
    );
  };

  if (isLoading) return <Skeleton className="h-96 w-full mt-10" />;
  if (isError) return <ErrorState title="Failed to load Admins" onRetry={refetch} />;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-blue-600" /> System Admins
          </h1>
          <p className="text-sm text-gray-500">Manage web dashboard administrators (DEV Only)</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Add Admin
        </Button>
      </div>

      <Card className="flex flex-col shadow-sm">
        <div className="flex-1 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-200 shadow-sm">
                <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Username</TableHead>
                <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Name</TableHead>
                <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Role</TableHead>
                <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Created On</TableHead>
                <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!admins || admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    No admins found.
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin: any) => (
                  <TableRow key={admin.id} className="hover:bg-slate-50/60 transition-colors">
                    <TableCell className="py-5 align-middle text-center font-medium text-slate-900 whitespace-nowrap">
                      {admin.username}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-600 whitespace-nowrap">
                      {admin.name}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center whitespace-nowrap">
                      <div className="flex justify-center">
                        <Badge variant={admin.role === "DEV" ? "default" : "success"} className={admin.role === "DEV" ? "bg-purple-100 text-purple-800" : ""}>
                          {admin.role === "DEV" ? "DEV (Owner)" : "ADMIN"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center whitespace-nowrap">
                      <div className="flex justify-center">
                        <Badge variant={admin.active ? "success" : "destructive"}>
                          {admin.active ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-600 whitespace-nowrap">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center whitespace-nowrap">
                      <div className="flex justify-center items-center gap-2">
                        <Button 
                          variant="ghost" 
                          className="h-9 px-3 text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed" 
                          disabled={admin.role === "DEV"}
                          onClick={() => { setSelectedAdmin(admin); setResetPasswordOpen(true); }}
                        >
                          <Key className="mr-1.5 h-4 w-4" /> Reset Pwd
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="h-9 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed" 
                          disabled={admin.role === "DEV"}
                          onClick={() => handleOpenForm(admin)}
                        >
                          <Edit className="mr-1.5 h-4 w-4" /> Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed" 
                          disabled={admin.role === "DEV"}
                          onClick={() => { setSelectedAdmin(admin); setDeleteOpen(true); }}
                        >
                          <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AdminFormDialog 
        open={formOpen} onOpenChange={setFormOpen} admin={selectedAdmin} 
        onSave={handleSaveAdmin} isLoading={createMutation.isPending || updateMutation.isPending} error={apiError} 
      />

      <DeleteAdminDialog 
        open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDeleteAdmin} isLoading={deleteMutation.isPending} 
      />

      <ResetAdminPasswordDialog
        open={resetPasswordOpen} onOpenChange={setResetPasswordOpen} admin={selectedAdmin}
        onConfirm={handleResetPassword} isLoading={resetPasswordMutation.isPending} error={apiError}
      />
    </div>
  );
}