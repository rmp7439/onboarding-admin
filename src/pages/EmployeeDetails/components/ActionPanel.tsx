import { useState } from "react";
import { Check, X, Tag, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import {
  ConfirmationDialog,
  EmployeeCodeDialog,
  RejectDialog,
  DeleteEmployeeDialog,
} from "./Dialogs";
import {
  useUpdateEmployeeStatus,
  useAssignEmployeeCode,
  useDeleteEmployee,
} from "../../../hooks/useEmployeeMutations";
import { useToast } from "../../../hooks/useToast";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function ActionPanel({
  employeeId,
  status,
  onEditClick,
}: {
  employeeId: string;
  status: string;
  onEditClick: () => void;
}) {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  const { toast } = useToast();
  const updateStatusMutation = useUpdateEmployeeStatus();
  const assignCodeMutation = useAssignEmployeeCode();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const deleteMutation = useDeleteEmployee();

  const canDelete = user?.username === "dev" || user?.username === "nikhil";

  const handleDelete = () => {
    setDeleteError(null);
    deleteMutation.mutate(employeeId, {
      onSuccess: () => {
        toast("Employee permanently deleted.", "success");
        setIsDeleteOpen(false);
        navigate("/employees");
      },
      onError: (err: any) => {
        setDeleteError(getErrorMessage(err));
      },
    });
  };

  const handleApprove = () => {
    updateStatusMutation.mutate(
      { id: employeeId, status: "APPROVED" },
      {
        onSuccess: () => {
          toast("Employee Approved successfully.", "success");
          setIsApproveOpen(false);
        },
      },
    );
  };

  const handleReject = (reason: string) => {
    updateStatusMutation.mutate(
      { id: employeeId, status: "REJECTED", rejectReason: reason },
      {
        onSuccess: () => {
          toast("Employee Rejected successfully.", "success");
          setIsRejectOpen(false);
        },
      },
    );
  };

  const handleAssignCode = (code: string) => {
    assignCodeMutation.mutate(
      { id: employeeId, employeeCode: code },
      {
        onSuccess: () => {
          toast("Employee Code Assigned successfully.", "success");
          setIsCodeOpen(false);
        },
      },
    );
  };

  const getErrorMessage = (error: any) =>
    error?.response?.data?.message ||
    error?.message ||
    "An unexpected network error occurred.";

  return (
    <Card className="shadow-sm border-blue-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-gray-800">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-500">
            Current Status
          </span>
          <Badge
            variant={
              status === "APPROVED"
                ? "success"
                : status === "REJECTED"
                  ? "destructive"
                  : "warning"
            }
          >
            {status}
          </Badge>
        </div>

        {canDelete && (
          <div className="pt-4 mt-4 border-t border-gray-100">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Employee
            </Button>
          </div>
        )}

        <div className="space-y-3">
          <Button
            className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => setIsApproveOpen(true)}
          >
            <Check className="mr-2 h-4 w-4" /> Approve Employee
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            onClick={onEditClick}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Details
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => setIsRejectOpen(true)}
          >
            <X className="mr-2 h-4 w-4" /> Reject Employee
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setIsCodeOpen(true)}
          >
            <Tag className="mr-2 h-4 w-4" /> Assign Employee Code
          </Button>
        </div>
      </CardContent>

      <ConfirmationDialog
        open={isApproveOpen}
        onOpenChange={setIsApproveOpen}
        title="Approve this employee?"
        actionText="Approve"
        onConfirm={handleApprove}
        isLoading={updateStatusMutation.isPending}
        error={
          updateStatusMutation.isError
            ? getErrorMessage(updateStatusMutation.error)
            : null
        }
      />

      <RejectDialog
        open={isRejectOpen}
        onOpenChange={setIsRejectOpen}
        onConfirm={handleReject}
        isLoading={updateStatusMutation.isPending}
        error={
          updateStatusMutation.isError
            ? getErrorMessage(updateStatusMutation.error)
            : null
        }
      />

      <EmployeeCodeDialog
        open={isCodeOpen}
        onOpenChange={setIsCodeOpen}
        onSave={handleAssignCode}
        isLoading={assignCodeMutation.isPending}
        error={
          assignCodeMutation.isError
            ? getErrorMessage(assignCodeMutation.error)
            : null
        }
      />

      <DeleteEmployeeDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        error={deleteError}
      />
    </Card>
  );
}