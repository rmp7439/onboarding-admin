import { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { BankFormDialog, DeleteBankDialog } from "./components/Dialogs";
import { useBanks, useCreateBank, useUpdateBank, useDeleteBank } from "../../hooks/useBanks";
import { useToast } from "../../hooks/useToast";

export default function Banks() {
  const { data: banks, isLoading, isError, refetch } = useBanks();
  const { toast } = useToast();

  const createMutation = useCreateBank();
  const updateMutation = useUpdateBank();
  const deleteMutation = useDeleteBank();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<{ id: string; name: string } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleOpenForm = (bank?: any) => { setSelectedBank(bank || null); setApiError(null); setFormOpen(true); };
  const handleOpenDelete = (bank: any) => { setSelectedBank(bank); setDeleteOpen(true); };
  const extractError = (err: any) => err?.response?.data?.error || err.message || "An unexpected error occurred.";

  const handleSaveBank = (payload: { name: string }) => {
    setApiError(null);
    if (selectedBank) {
      updateMutation.mutate({ id: selectedBank.id, payload }, {
        onSuccess: () => { toast("Bank updated successfully", "success"); setFormOpen(false); },
        onError: (err) => setApiError(extractError(err)),
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { toast("Bank created successfully", "success"); setFormOpen(false); },
        onError: (err) => setApiError(extractError(err)),
      });
    }
  };

  const handleDeleteBank = () => {
    if (!selectedBank) return;
    deleteMutation.mutate(selectedBank.id, {
      onSuccess: () => { toast("Bank deleted successfully", "success"); setDeleteOpen(false); },
      onError: (err) => toast(extractError(err), "error"),
    });
  };

  if (isLoading) return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><Skeleton className="h-10 w-48" /><Skeleton className="h-10 w-32" /></div>
      <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
    </div>
  );
  
  if (isError || !banks) return <ErrorState title="Failed to load banks" onRetry={refetch} />;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 transition-colors">Banks</h1></div>
        <Button onClick={() => handleOpenForm()} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" /> Add Bank
        </Button>
      </div>

      <Card className="shadow-sm bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700 shadow-sm">
                <TableHead className="font-semibold text-gray-700 dark:text-slate-300 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Bank Name</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-slate-300 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Created Date</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-slate-300 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10 text-gray-500 dark:text-slate-400">No banks found.</TableCell>
                </TableRow>
              ) : (
                banks.map((bank) => (
                  <TableRow key={bank.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/60 transition-colors border-gray-200 dark:border-slate-700">
                    <TableCell className="py-5 align-middle text-center font-semibold text-gray-900 dark:text-slate-100 whitespace-nowrap">{bank.name}</TableCell>
                    <TableCell className="py-5 align-middle text-center text-gray-600 dark:text-slate-400 whitespace-nowrap">{new Date(bank.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="py-5 align-middle text-center whitespace-nowrap">
                      <div className="flex justify-center items-center gap-2">
                        <Button variant="ghost" className="h-9 px-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors" onClick={() => handleOpenForm(bank)}>
                          <Edit className="mr-1.5 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="ghost" className="h-9 px-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors" onClick={() => handleOpenDelete(bank)}>
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

      <BankFormDialog open={formOpen} onOpenChange={setFormOpen} bank={selectedBank} onSave={handleSaveBank} isLoading={createMutation.isPending || updateMutation.isPending} error={apiError} />
      <DeleteBankDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDeleteBank} isLoading={deleteMutation.isPending} />
    </div>
  );
}