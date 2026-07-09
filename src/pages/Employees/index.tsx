import { useState } from "react";
import { Eye, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
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
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [unitFilter, setUnitFilter] = useState("ALL");

  const getStatusBadge = (status: EmployeeStatus) => {
    switch (status) {
      case "APPROVED": return <Badge variant="success">APPROVED</Badge>;
      case "PENDING": return <Badge variant="warning">PENDING</Badge>;
      case "REJECTED": return <Badge variant="destructive">REJECTED</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const filteredEmployees = employees?.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "ALL" || emp.status === statusFilter;
    const matchesUnit = unitFilter === "ALL" || emp.unit === unitFilter;

    return matchesSearch && matchesStatus && matchesUnit;
  }) || [];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Employees</h1>
        <p className="text-gray-500 mt-1">Manage employee registrations and approvals</p>
      </div>

      <Card className="flex flex-col shadow-sm">
        <EmployeeFilters 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          unitFilter={unitFilter}
          setUnitFilter={setUnitFilter}
        />

        <div className="flex-1">
          {isLoading ? (
            <LoadingSkeleton />
          ) : isError ? (
            <ErrorState onRetry={refetch} />
          ) : filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-gray-400 mb-2">No employees found.</div>
              <p className="text-sm text-gray-500">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold">Employee Code</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Unit</TableHead>
                  <TableHead className="font-semibold">Phone Number</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Joining Date</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium text-gray-900">{employee.code || "-"}</TableCell>
                    <TableCell>{employee.name || "-"}</TableCell>
                    <TableCell className="text-gray-500">{employee.unit || "-"}</TableCell>
                    <TableCell className="text-gray-500">{employee.phone || "-"}</TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell className="text-gray-500">{employee.joiningDate || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => navigate(`/employees/${employee.id}`)}
                        >
                          <Eye className="mr-1 h-4 w-4" /> View
                        </Button>
                        <Button variant="ghost" className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                          <Check className="mr-1 h-4 w-4" /> Approve
                        </Button>
                        <Button variant="ghost" className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <X className="mr-1 h-4 w-4" /> Reject
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