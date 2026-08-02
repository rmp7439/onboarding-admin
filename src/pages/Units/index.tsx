import { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { UnitFormDialog, DeleteUnitDialog } from "./components/Dialogs";
import { useUnits, useCreateUnit, useUpdateUnit, useDeleteUnit } from "../../hooks/useUnits";
import { useToast } from "../../hooks/useToast";
import { type Unit } from "../../types/unit";

export default function Units() {
  const { data: units, isLoading, isError, refetch } = useUnits();
  const { toast } = useToast();

  const createMutation = useCreateUnit();
  const updateMutation = useUpdateUnit();
  const deleteMutation = useDeleteUnit();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleOpenForm = (unit?: Unit) => { setSelectedUnit(unit || null); setApiError(null); setFormOpen(true); };
  const handleOpenDelete = (unit: Unit) => { setSelectedUnit(unit); setDeleteOpen(true); };
  const extractError = (err: any) => err?.response?.data?.error || err.message || "An unexpected error occurred.";

  const handleSaveUnit = (payload: { name: string; requiredFields: string[] }) => {
    setApiError(null);
    if (selectedUnit) {
      updateMutation.mutate({ id: selectedUnit.id, payload }, {
        onSuccess: () => { toast("Unit updated successfully", "success"); setFormOpen(false); },
        onError: (err) => setApiError(extractError(err))
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { toast("Unit created successfully", "success"); setFormOpen(false); },
        onError: (err) => setApiError(extractError(err))
      });
    }
  };

  const handleDeleteUnit = () => {
    if (!selectedUnit) return;
    deleteMutation.mutate(selectedUnit.id, {
      onSuccess: () => { toast("Unit deleted successfully", "success"); setDeleteOpen(false); },
      onError: (err) => toast(extractError(err), "error")
    });
  };

  const filteredUnits = units?.filter(unit => unit.name !== "Development") || [];

  if (isLoading) return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><Skeleton className="h-10 w-48" /><Skeleton className="h-10 w-32" /></div>
      <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
    </div>
  );

  if (isError || !units) return <ErrorState title="Failed to load units" onRetry={refetch} />;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 transition-colors">Units</h1>
        <Button onClick={() => handleOpenForm()} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" /> Add Unit
        </Button>
      </div>

      <Card className="shadow-sm bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700 shadow-sm">
                <TableHead className="font-semibold text-gray-700 dark:text-slate-300 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Name</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-slate-300 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Date</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-slate-300 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10 text-gray-500 dark:text-slate-400">No units found.</TableCell>
                </TableRow>
              ) : (
                filteredUnits.map((unit) => (
                  <TableRow key={unit.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/60 transition-colors border-gray-200 dark:border-slate-700">
                    <TableCell className="py-5 align-middle text-center font-semibold text-gray-900 dark:text-slate-100 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        <span>{unit.name}</span>
                        {unit.isProtected && (
                          <Badge variant="default" className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-[10px] px-1.5 py-0 border border-gray-200 dark:border-slate-700">Protected</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-gray-600 dark:text-slate-400 whitespace-nowrap">{new Date(unit.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="py-5 align-middle text-center whitespace-nowrap">
                      <div className="flex justify-center items-center gap-2">
                        <Button variant="ghost" className="h-9 px-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors" onClick={() => handleOpenForm(unit)}>
                          <Edit className="mr-1.5 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="ghost" className="h-9 px-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed" disabled={unit.isProtected} onClick={() => handleOpenDelete(unit)}>
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

      <UnitFormDialog open={formOpen} onOpenChange={setFormOpen} unit={selectedUnit} onSave={handleSaveUnit} isLoading={createMutation.isPending || updateMutation.isPending} error={apiError} />
      <DeleteUnitDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDeleteUnit} isLoading={deleteMutation.isPending} />
    </div>
  );
}