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

  const handleOpenForm = (unit?: Unit) => {
    setSelectedUnit(unit || null);
    setApiError(null);
    setFormOpen(true);
  };

  const handleOpenDelete = (unit: Unit) => {
    setSelectedUnit(unit);
    setDeleteOpen(true);
  };

  const extractError = (err: any) => err?.response?.data?.error || err.message || "An unexpected error occurred.";

  const handleSaveUnit = (name: string) => {
    setApiError(null);
    if (selectedUnit) {
      updateMutation.mutate(
        { id: selectedUnit.id, name },
        {
          onSuccess: () => { toast("Unit updated successfully", "success"); setFormOpen(false); },
          onError: (err) => setApiError(extractError(err))
        }
      );
    } else {
      createMutation.mutate(name, {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center"><Skeleton className="h-10 w-48" /><Skeleton className="h-10 w-32" /></div>
        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  if (isError || !units) {
    return <ErrorState title="Failed to load units" onRetry={refetch} />;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Unit Management</h1>
        <Button onClick={() => handleOpenForm()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Add Unit
        </Button>
      </div>

      <Card className="shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unit Name</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-gray-500">No units found.</TableCell>
              </TableRow>
            ) : (
              units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex items-center space-x-2">
                      <span>{unit.name}</span>
                      {unit.isProtected && (
                        <Badge variant="default" className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0 border border-slate-200">
                          Protected
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(unit.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed" 
                        disabled={unit.isProtected}
                        onClick={() => handleOpenForm(unit)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed" 
                        disabled={unit.isProtected}
                        onClick={() => handleOpenDelete(unit)}
                      >
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

      <UnitFormDialog 
        open={formOpen} onOpenChange={setFormOpen} unit={selectedUnit} 
        onSave={handleSaveUnit} isLoading={createMutation.isPending || updateMutation.isPending} error={apiError} 
      />

      <DeleteUnitDialog 
        open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDeleteUnit} isLoading={deleteMutation.isPending} 
      />
    </div>
  );
}