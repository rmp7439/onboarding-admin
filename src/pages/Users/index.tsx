import { useState } from "react";
import { Edit, Trash2, MapPin, Plus } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { UserFormDialog, DeleteUserDialog, AssignUnitsDialog } from "./components/Dialogs";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useAssignUnits } from "../../hooks/useUsers";
import { useToast } from "../../hooks/useToast";
import { type User } from "../../types/user";

export default function Users() {
  const { data: users, isLoading, isError, refetch } = useUsers();
  const { toast } = useToast();

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const assignUnitsMutation = useAssignUnits();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

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

  const handleOpenAssign = (user: User) => {
    setSelectedUser(user);
    setApiError(null);
    setAssignOpen(true);
  };

  const extractError = (err: any) => err?.response?.data?.error || err.message || "An unexpected error occurred.";

  const handleSaveUser = (data: any) => {
    setApiError(null);
    if (!selectedUser && !data.password) {
      setApiError("Password is required to create a new user.");
      return;
    }

    // Clean up empty password field during updates
    const payload = { ...data };
    if (!payload.password) delete payload.password;

    if (selectedUser) {
      updateMutation.mutate(
        { id: selectedUser.id, payload },
        {
          onSuccess: () => { toast("User updated successfully", "success"); setFormOpen(false); },
          onError: (err) => setApiError(extractError(err))
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { toast("User created successfully", "success"); setFormOpen(false); },
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

  const handleAssignUnits = (unitIds: string[]) => {
    if (!selectedUser) return;
    setApiError(null);
    assignUnitsMutation.mutate(
      { id: selectedUser.id, unitIds },
      {
        onSuccess: () => { toast("Units assigned successfully", "success"); setAssignOpen(false); },
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
              <TableHead>Name</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Units</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-500">No users found.</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
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
                      <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-50" onClick={() => handleOpenAssign(user)}>
                        <MapPin className="h-4 w-4 mr-1" /> Assign Units
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
        open={formOpen} onOpenChange={setFormOpen} user={selectedUser} 
        onSave={handleSaveUser} isLoading={createMutation.isPending || updateMutation.isPending} error={apiError} 
      />

      <DeleteUserDialog 
        open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDeleteUser} isLoading={deleteMutation.isPending} 
      />

      <AssignUnitsDialog 
        open={assignOpen} onOpenChange={setAssignOpen} user={selectedUser} 
        onSave={handleAssignUnits} isLoading={assignUnitsMutation.isPending} error={apiError} 
      />
    </div>
  );
}