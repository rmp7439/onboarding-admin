import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronRight,
  CalendarPlus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
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
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { useDashboard } from "../../hooks/useDashboard";
import type { EmployeeStatus, Employee } from "../../types/employee";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useDashboard();
  const navigate = useNavigate();

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

  const statIcons = [
    <Users className="h-5 w-5 text-blue-600" />,
    <Clock className="h-5 w-5 text-amber-500" />,
    <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    <XCircle className="h-5 w-5 text-red-500" />,
    <CalendarPlus className="h-5 w-5 text-purple-500" />,
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 pb-8">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        {/* Adjusted skeleton to 5 columns for the new stat */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="pt-8">
        <ErrorState
          title="Failed to Load Dashboard"
          message="We could not fetch your dashboard statistics. Please check your connection."
          onRetry={refetch}
        />
      </div>
    );
  }

  const { stats, recentEmployees } = data;

  const formattedStats = [
    {
      title: "Total Employees",
      value: stats.total,
    },
    {
      title: "Pending Approvals",
      value: stats.pending,
    },
    {
      title: "Approved",
      value: stats.approved,
    },
    {
      title: "Rejected",
      value: stats.rejected,
    },
    {
      title: "Today's Entries",
      value: stats.todayRegistrations,
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {formattedStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              {statIcons[index]}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="col-span-1 lg:col-span-3">
          {/* ... existing table code remains exactly identical ... */}
          <CardHeader>
            <CardTitle className="text-lg">Recent Employees</CardTitle>
          </CardHeader>
          <CardContent>
            {recentEmployees.length === 0 ? (
              <div className="text-center text-slate-500 py-10">
                No recent employees found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="!text-center">
                      Employee Code
                    </TableHead>
                    <TableHead className="!text-center">Name</TableHead>
                    <TableHead className="!text-center">Unit</TableHead>
                    <TableHead className="!text-center">Phone Number</TableHead>
                    <TableHead className="!text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEmployees.map((employee: Employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="text-center font-medium text-slate-900">
                        {employee.code}
                      </TableCell>
                      <TableCell className="text-center">
                        {employee.name}
                      </TableCell>
                      <TableCell className="text-center text-slate-500">
                        {employee.unit}
                      </TableCell>
                      <TableCell className="text-center text-slate-500">
                        {employee.phone}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(employee.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Sidebar */}
        <Card className="col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between group hover:shadow-sm hover:bg-slate-50 transition-all active:scale-[0.98] cursor-pointer"
              onClick={() => navigate("/employees")}
            >
              <span className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                View Employees
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between group hover:shadow-sm hover:bg-slate-50 transition-all active:scale-[0.98] cursor-pointer"
              onClick={() => navigate("/reports")}
            >
              <span className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                Generate Report
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}