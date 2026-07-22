import { useState } from "react";
import { Edit, Trash2, Plus, Key } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { UserFormDialog, DeleteUserDialog, ResetPasswordDialog, type UserFormValues } from "./components/Dialogs";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useAssignUnits, useResetPassword } from "../../hooks/useUsers";
import { useToast } from "../../hooks/useToast";
import { type User } from "../../types/user";

export default function Users() {
  const { data: users, isLoading, isError, refetch } = useUsers();
  const { toast } = useToast();

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const assignUnitsMutation = useAssignUnits();
  const resetPasswordMutation = useResetPassword();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleOpenForm = (user?: User) => {
    setSelectedUser(user || null);
    setApiError(null);
    setFormOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleOpenResetPassword = (user: User) => {
    setSelectedUser(user);
    setApiError(null);
    setResetPasswordOpen(true);
  };

  const extractError = (err: any) => err?.response?.data?.error || err.message || "An unexpected error occurred.";

  const handleSaveUser = (data: UserFormValues) => {
    setApiError(null);
    
    if (!selectedUser && !data.password) {
      setApiError("Password is required to create a new user.");
      return;
    }

    // Exclude confirmPassword from the API payload
    const { unitIds, confirmPassword, ...userData } = data;
    if (!userData.password) delete userData.password;

    if (selectedUser) {
      updateMutation.mutate(
        { id: selectedUser.id, payload: userData },
        {
          onSuccess: () => {
            assignUnitsMutation.mutate(
              { id: selectedUser.id, unitIds },
              {
                onSuccess: () => {
                  toast("User and units updated successfully", "success");
                  setFormOpen(false);
                },
                onError: (err) => setApiError(extractError(err))
              }
            );
          },
          onError: (err) => setApiError(extractError(err))
        }
      );
    } else {
      createMutation.mutate(userData, {
        onSuccess: (newUser) => {
          assignUnitsMutation.mutate(
            { id: newUser.id, unitIds },
            {
              onSuccess: () => {
                toast("User created and units assigned successfully", "success");
                setFormOpen(false);
              },
              onError: (err) => setApiError(extractError(err))
            }
          );
        },
        onError: (err) => setApiError(extractError(err))
      });
    }
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    deleteMutation.mutate(selectedUser.id, {
      onSuccess: () => { toast("User deleted successfully", "success"); setDeleteOpen(false); },
      onError: (err) => toast(extractError(err), "error")
    });
  };

  const handleResetPassword = (password: string) => {
    if (!selectedUser) return;
    setApiError(null);
    resetPasswordMutation.mutate(
      { id: selectedUser.id, password },
      {
        onSuccess: () => {
          toast("Password reset successfully.", "success");
          setResetPasswordOpen(false);
        },
        onError: (err) => setApiError(extractError(err))
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center"><Skeleton className="h-10 w-48" /><Skeleton className="h-10 w-32" /></div>
        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  if (isError || !users) {
    return <ErrorState title="Failed to load users" onRetry={refetch} />;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Users</h1>
        <Button onClick={() => handleOpenForm()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Add User
        </Button>
      </div>

      <Card className="shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact (Mobile)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Units</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">No users found.</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-gray-900">{user.userId}</TableCell>
                  <TableCell className="text-gray-900">{user.name}</TableCell>
                  <TableCell className="text-gray-600">{user.mobile}</TableCell>
                  <TableCell>
                    <Badge variant={user.active ? "success" : "destructive"}>
                      {user.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 max-w-[250px] truncate">
                    {user.units && user.units.length > 0
                      ? user.units.map((u) => u.unit.name).join(", ")
                      : <span className="text-gray-400 italic">None</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-50" onClick={() => handleOpenResetPassword(user)}>
                        <Key className="h-4 w-4 mr-1" /> Reset Pwd
                      </Button>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50" onClick={() => handleOpenForm(user)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleOpenDelete(user)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <UserFormDialog 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        user={selectedUser} 
        onSave={handleSaveUser} 
        isLoading={createMutation.isPending || updateMutation.isPending || assignUnitsMutation.isPending} 
        error={apiError} 
      />

      <DeleteUserDialog 
        open={deleteOpen} 
        onOpenChange={setDeleteOpen} 
        onConfirm={handleDeleteUser} 
        isLoading={deleteMutation.isPending} 
      />

      <ResetPasswordDialog
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
        user={selectedUser}
        onConfirm={handleResetPassword}
        isLoading={resetPasswordMutation.isPending}
        error={apiError}
      />
    </div>
  );
}