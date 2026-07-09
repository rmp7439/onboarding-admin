import { useState } from "react";
import { Eye, Check, X } from "lucide-react";
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
import { useEmployees } from "../../hooks/useEmployees";
import { type EmployeeStatus } from "../../types/employee";

export default function Employees() {
  const navigate = useNavigate();
  const { data: employees, isLoading, isError, refetch } = useEmployees();

  // Split state to feed the independent UI inputs
  const [employeeCode, setEmployeeCode] = useState("");
  const [joiningDate, setJoiningDate] = useState("");

  // Keep these states hidden from UI but active in logic to preserve functionality
  const [statusFilter] = useState("ALL");
  const [unitFilter] = useState("ALL");

  const getStatusBadge = (status: EmployeeStatus) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="success">APPROVED</Badge>;
      case "PENDING":
        return <Badge variant="warning">PENDING</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">REJECTED</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredEmployees =
    employees?.filter((emp) => {
      const matchesCode =
        !employeeCode ||
        emp.code?.toLowerCase().includes(employeeCode.toLowerCase());
      const matchesDate = !joiningDate || emp.joiningDate === joiningDate;
      const matchesStatus =
        statusFilter === "ALL" || emp.status === statusFilter;
      const matchesUnit = unitFilter === "ALL" || emp.unit === unitFilter;

      return matchesCode && matchesDate && matchesStatus && matchesUnit;
    }) || [];

  return (
    <div className="space-y-8 pb-8">
      <EmployeeFilters
        employeeCode={employeeCode}
        setEmployeeCode={setEmployeeCode}
        joiningDate={joiningDate}
        setJoiningDate={setJoiningDate}
      />

      <Card className="flex flex-col shadow-sm">
        <div className="flex-1">
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
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center">
                    Employee Code
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center">
                    Unit
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center">
                    Phone Number
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 h-12 uppercase text-xs tracking-wider align-middle !text-center">
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
                    <TableCell className="py-5 align-middle text-center font-medium text-slate-700">
                      {employee.code || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center font-semibold text-slate-900">
                      {employee.name || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500">
                      {employee.unit || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center text-slate-500">
                      {employee.phone || "-"}
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center">
                      <div className="flex justify-center">
                        {employee.status
                          ? getStatusBadge(employee.status)
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell className="py-5 align-middle text-center">
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
                          disabled={employee.status !== "PENDING"}
                          className="h-9 px-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors disabled:bg-transparent disabled:text-emerald-600"
                        >
                          <Check className="mr-1.5 h-4 w-4" /> Approve
                        </Button>
                        <Button
                          variant="ghost"
                          disabled={employee.status !== "PENDING"}
                          className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors disabled:bg-transparent disabled:text-red-600"
                        >
                          <X className="mr-1.5 h-4 w-4" /> Reject
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
    </div>
  );
}