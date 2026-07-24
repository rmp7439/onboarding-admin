import { useState, useEffect } from "react";
import { Eye, Check, X, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmployeeFilters } from "./components/EmployeeFilters";
import { Pagination } from "./components/Pagination";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { RejectDialog, ReturnForCorrectionDialog } from "../EmployeeDetails/components/Dialogs";
import { useEmployees } from "../../hooks/useEmployees";
import { useUpdateEmployeeStatus, useReturnEmployeeForCorrection } from "../../hooks/useEmployeeMutations";
import { useToast } from "../../hooks/useToast";
import { type EmployeeStatus } from "../../types/employee";

export default function Employees() {
  const navigate = useNavigate();
  const updateStatusMutation = useUpdateEmployeeStatus();
  const returnMutation = useReturnEmployeeForCorrection();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [statusFilter] = useState("ALL");
  const [unitFilter] = useState("ALL");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    data: employees,
    isLoading,
    isError,
    refetch,
  } = useEmployees(debouncedSearch);

  const getStatusBadge = (status: EmployeeStatus) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="success">APPROVED</Badge>;
      case "PENDING":
        return <Badge variant="warning">PENDING</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">REJECTED</Badge>;
      case "RETURNED_FOR_CORRECTION":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">RETURNED</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleStatusUpdate = (id: string, status: EmployeeStatus) => {
    updateStatusMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast(
            `Employee ${status === "APPROVED" ? "Approved" : "Rejected"} successfully.`,
            "success",
          );
        },
        onError: (err: any) => {
          toast(err.message || "Failed to update status", "error");
        },
      },
    );
  };

  const handleRejectSubmit = (reason: string) => {
    if (!rejectingId) return;
    updateStatusMutation.mutate(
      { id: rejectingId, status: "REJECTED", rejectReason: reason },
      {
        onSuccess: () => {
          toast("Employee Rejected successfully.", "success");
          setRejectingId(null);
        },
        onError: (err: any) => {
          toast(err.message || "Failed to update status", "error");
        },
      },
    );
  };

  const handleReturnSubmit = (remark: string) => {
    if (!returningId) return;
    returnMutation.mutate(
      { id: returningId, remark },
      {
        onSuccess: () => {
          toast("Employee returned for correction successfully.", "success");
          setReturningId(null);
        },
        onError: (err: any) => {
          toast(err.message || "Failed to return application", "error");
        },
      }
    );
  };

  const filteredEmployees =
    employees?.filter((emp) => {
      const matchesDate = !joiningDate || emp.joiningDate === joiningDate;
      const matchesStatus =
        statusFilter === "ALL" || emp.status === statusFilter;
      const matchesUnit = unitFilter === "ALL" || emp.unit === unitFilter;
      return matchesDate && matchesStatus && matchesUnit;
    }) || [];

  const handleRefresh = () => {
    setSearchQuery("");
    setJoiningDate("");
    refetch();
  };

  return (
    <div className="space-y-8 pb-8">
      <EmployeeFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        joiningDate={joiningDate}
        setJoiningDate={setJoiningDate}
        onRefresh={handleRefresh}
      />

      <Card className="flex flex-col shadow-sm">
        <div className="flex-1 overflow-x-auto">
          {isLoading ? (
            <LoadingSkeleton />
          ) : isError ? (
            <ErrorState onRetry={refetch} />
          ) : filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-gray-400 mb-2">No employees found.</div>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or search query.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 border-b border-slate-200 shadow-sm">
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Employee Code
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Unit
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Phone Number
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Gender
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Highest Education
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Marital Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Driving Licence
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    A/C Holder Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Bank Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    IFSC
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    MICR
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Nominee Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Nominee Relation
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Nominee Mobile
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Nominee %
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <TableCell className="py-5 align-middle text-center font-medium text-slate-700 whitespace-nowrap">
                      {employee.code || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center font-semibold text-slate-900 whitespace-nowrap">
                      {employee.name || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500 whitespace-nowrap">
                      {employee.unit || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500 whitespace-nowrap">
                      {employee.phone || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500 whitespace-nowrap">
                      {employee.gender || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500 whitespace-nowrap">
                      {employee.education || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500 whitespace-nowrap">
                      {employee.maritalStatus || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500 whitespace-nowrap">
                      {employee.drivingLicence || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500 whitespace-nowrap">
                      {employee.accountHolderName || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500 whitespace-nowrap">
                      {employee.bankName || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500 whitespace-nowrap">
                      {employee.ifsc || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500 whitespace-nowrap">
                      {employee.micr || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500 whitespace-nowrap">
                      {employee.nomineeName || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500 whitespace-nowrap">
                      {employee.nomineeRelation || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500 whitespace-nowrap">
                      {employee.nomineeMobile || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500 whitespace-nowrap">
                      {employee.nomineePercentage ? `${employee.nomineePercentage}%` : "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center whitespace-nowrap">
                      <div className="flex justify-center">
                        {employee.status
                          ? getStatusBadge(employee.status)
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center whitespace-nowrap">
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="ghost"
                          className="h-9 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          onClick={() => navigate(`/employees/${employee.id}`)}
                        >
                          <Eye className="mr-1.5 h-4 w-4" /> View
                        </Button>
                        <Button
                          variant="ghost"
                          disabled={
                            employee.status === "APPROVED" ||
                            updateStatusMutation.isPending
                          }
                          className="h-9 px-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                          onClick={() =>
                            handleStatusUpdate(employee.id, "APPROVED")
                          }
                        >
                          <Check className="mr-1.5 h-4 w-4" /> Approve
                        </Button>
                        <Button
                          variant="ghost"
                          disabled={
                            employee.status === "REJECTED" ||
                            updateStatusMutation.isPending
                          }
                          className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                          onClick={() => setRejectingId(employee.id)}
                        >
                          <X className="mr-1.5 h-4 w-4" /> Reject
                        </Button>
                        <Button
                          variant="ghost"
                          disabled={
                            employee.status === "APPROVED" ||
                            employee.status === "RETURNED_FOR_CORRECTION" ||
                            returnMutation.isPending
                          }
                          className="h-9 px-3 text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                          onClick={() => setReturningId(employee.id)}
                        >
                          <RotateCcw className="mr-1.5 h-4 w-4" /> Return
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <Pagination />
      </Card>

      <RejectDialog
        open={!!rejectingId}
        onOpenChange={(open) => !open && setRejectingId(null)}
        onConfirm={handleRejectSubmit}
        isLoading={updateStatusMutation.isPending}
      />

      <ReturnForCorrectionDialog
        open={!!returningId}
        onOpenChange={(open) => !open && setReturningId(null)}
        onConfirm={handleReturnSubmit}
        isLoading={returnMutation.isPending}
        error={
          returnMutation.isError
            ? (returnMutation.error as any)?.response?.data?.error || returnMutation.error.message || "Failed to return application."
            : null
        }
      />
    </div>
  );
}