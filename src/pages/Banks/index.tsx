import { useState } from "react";
import { Edit, Trash2, Plus, Landmark } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { BankFormDialog, DeleteBankDialog } from "./components/Dialogs";
import { useBanks, useCreateBank, useUpdateBank, useDeleteBank } from "../../hooks/useBanks";
import { useToast } from "../../hooks/useToast";
import { type Bank } from "../../types/bank";

export default function Banks() {
  const { data: banks, isLoading, isError, refetch } = useBanks();
  const { toast } = useToast();

  const createMutation = useCreateBank();
  const updateMutation = useUpdateBank();
  const deleteMutation = useDeleteBank();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleOpenForm = (bank?: Bank) => {
    setSelectedBank(bank || null);
    setApiError(null);
    setFormOpen(true);
  };

  const handleOpenDelete = (bank: Bank) => {
    setSelectedBank(bank);
    setDeleteOpen(true);
  };

  const extractError = (err: any) => err?.response?.data?.error || err.message || "An unexpected error occurred.";

  const handleSaveBank = (payload: { name: string; isActive: boolean }) => {
    setApiError(null);
    if (selectedBank) {
      updateMutation.mutate(
        { id: selectedBank.id, payload },
        {
          onSuccess: () => { toast("Bank updated successfully", "success"); setFormOpen(false); },
          onError: (err) => setApiError(extractError(err))
        }
      );
    } else {
      createMutation.mutate(payload.name, {
        onSuccess: () => { toast("Bank created successfully", "success"); setFormOpen(false); },
        onError: (err) => setApiError(extractError(err))
      });
    }
  };

  const handleDeleteBank = () => {
    if (!selectedBank) return;
    deleteMutation.mutate(selectedBank.id, {
      onSuccess: () => { toast("Bank deleted successfully", "success"); setDeleteOpen(false); },
      onError: (err) => toast(extractError(err), "error")
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center"><Skeleton className="h-10 w-48" /><Skeleton className="h-10 w-32" /></div>
        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  if (isError || !banks) {
    return <ErrorState title="Failed to load banks" onRetry={refetch} />;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Landmark className="h-6 w-6 text-blue-600" />
          Bank Master
        </h1>
        <Button onClick={() => handleOpenForm()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Add Bank
        </Button>
      </div>

      <Card className="shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bank Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-500">No banks found.</TableCell>
              </TableRow>
            ) : (
              banks.map((bank) => (
                <TableRow key={bank.id}>
                  <TableCell className="font-medium text-gray-900">{bank.name}</TableCell>
                  <TableCell>
                    <Badge variant={bank.isActive ? "success" : "destructive"}>
                      {bank.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(bank.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50" onClick={() => handleOpenForm(bank)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleOpenDelete(bank)}>
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

      <BankFormDialog 
        open={formOpen} onOpenChange={setFormOpen} bank={selectedBank} 
        onSave={handleSaveBank} isLoading={createMutation.isPending || updateMutation.isPending} error={apiError} 
      />

      <DeleteBankDialog 
        open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDeleteBank} isLoading={deleteMutation.isPending} 
      />
    </div>
  );
}