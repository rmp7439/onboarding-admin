import { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { Card } from "../../components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { BankFormDialog, DeleteBankDialog } from "./components/Dialogs";
import {
  useBanks,
  useCreateBank,
  useUpdateBank,
  useDeleteBank,
} from "../../hooks/useBanks";
import { useToast } from "../../hooks/useToast";

export default function Banks() {
  const { data: banks, isLoading, isError, refetch } = useBanks();
  const { toast } = useToast();

  const createMutation = useCreateBank();
  const updateMutation = useUpdateBank();
  const deleteMutation = useDeleteBank();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleOpenForm = (bank?: any) => {
    setSelectedBank(bank || null);
    setApiError(null);
    setFormOpen(true);
  };

  const handleOpenDelete = (bank: any) => {
    setSelectedBank(bank);
    setDeleteOpen(true);
  };

  const extractError = (err: any) =>
    err?.response?.data?.error ||
    err.message ||
    "An unexpected error occurred.";

  const handleSaveBank = (payload: { name: string }) => {
    setApiError(null);
    if (selectedBank) {
      updateMutation.mutate(
        { id: selectedBank.id, payload },
        {
          onSuccess: () => {
            toast("Bank updated successfully", "success");
            setFormOpen(false);
          },
          onError: (err) => setApiError(extractError(err)),
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast("Bank created successfully", "success");
          setFormOpen(false);
        },
        onError: (err) => setApiError(extractError(err)),
      });
    }
  };

  const handleDeleteBank = () => {
    if (!selectedBank) return;
    deleteMutation.mutate(selectedBank.id, {
      onSuccess: () => {
        toast("Bank deleted successfully", "success");
        setDeleteOpen(false);
      },
      onError: (err) => toast(extractError(err), "error"),
    });
  };

  if (isLoading) return <Skeleton className="h-96 w-full mt-10" />;
  if (isError || !banks)
    return <ErrorState title="Failed to load banks" onRetry={refetch} />;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banks</h1>
        </div>
        <Button
          onClick={() => handleOpenForm()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Bank
        </Button>
      </div>

      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-200 shadow-sm">
                <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                  Bank Name
                </TableHead>
                <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                  Created Date
                </TableHead>
                <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-10 text-gray-500"
                  >
                    No banks found.
                  </TableCell>
                </TableRow>
              ) : (
                banks.map((bank) => (
                  <TableRow
                    key={bank.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <TableCell className="py-5 align-middle text-center font-semibold text-slate-900 whitespace-nowrap">
                      {bank.name}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-600 whitespace-nowrap">
                      {new Date(bank.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center whitespace-nowrap">
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="ghost"
                          className="h-9 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          onClick={() => handleOpenForm(bank)}
                        >
                          <Edit className="mr-1.5 h-4 w-4" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                          onClick={() => handleOpenDelete(bank)}
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

      <BankFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        bank={selectedBank}
        onSave={handleSaveBank}
        isLoading={createMutation.isPending || updateMutation.isPending}
        error={apiError}
      />

      <DeleteBankDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteBank}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}