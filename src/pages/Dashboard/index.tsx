import { Users, Clock, CheckCircle2, XCircle, FileText, ChevronRight, CalendarPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
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
      case "APPROVED": return <Badge variant="success">APPROVED</Badge>;
      case "PENDING": return <Badge variant="warning">PENDING</Badge>;
      case "REJECTED": return <Badge variant="destructive">REJECTED</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const statIcons = [
    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400" />,
    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
    <CalendarPlus className="h-5 w-5 text-purple-500 dark:text-purple-400" />,
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 pb-8">
        <div><Skeleton className="h-10 w-48 mb-2" /><Skeleton className="h-4 w-64" /></div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (<Skeleton key={i} className="h-28 w-full rounded-xl" />))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return <div className="pt-8"><ErrorState title="Failed to Load Dashboard" message="We could not fetch your dashboard statistics. Please check your connection." onRetry={refetch} /></div>;
  }

  const { stats, recentEmployees } = data;
  const formattedStats = [
    { title: "Total Employees", value: stats.total },
    { title: "Pending Approvals", value: stats.pending },
    { title: "Approved", value: stats.approved },
    { title: "Rejected", value: stats.rejected },
    { title: "Today's Entries", value: stats.todayRegistrations },
  ];

  return (
    <div className="space-y-8 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {formattedStats.map((stat, index) => (
          <Card key={index} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400">{stat.title}</CardTitle>
              {statIcons[index]}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-slate-100">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="col-span-1 lg:col-span-3 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
          <CardHeader className="border-b border-gray-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-lg text-gray-900 dark:text-slate-100">Recent Employees</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentEmployees.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-slate-400 py-10">No recent employees found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700">
                    <TableHead className="!text-center text-gray-700 dark:text-slate-300 font-semibold">Employee Code</TableHead>
                    <TableHead className="!text-center text-gray-700 dark:text-slate-300 font-semibold">Name</TableHead>
                    <TableHead className="!text-center text-gray-700 dark:text-slate-300 font-semibold">Unit</TableHead>
                    <TableHead className="!text-center text-gray-700 dark:text-slate-300 font-semibold">Phone Number</TableHead>
                    <TableHead className="!text-center text-gray-700 dark:text-slate-300 font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEmployees.map((employee: Employee) => (
                    <TableRow key={employee.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 border-gray-200 dark:border-slate-700">
                      <TableCell className="text-center font-medium text-gray-900 dark:text-slate-100">{employee.code}</TableCell>
                      <TableCell className="text-center text-gray-700 dark:text-slate-300">{employee.name}</TableCell>
                      <TableCell className="text-center text-gray-500 dark:text-slate-400">{employee.unit}</TableCell>
                      <TableCell className="text-center text-gray-500 dark:text-slate-400">{employee.phone}</TableCell>
                      <TableCell className="text-center">{getStatusBadge(employee.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 h-fit bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
          <CardHeader className="border-b border-gray-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-lg text-gray-900 dark:text-slate-100">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3 pt-6">
            <Button variant="outline" className="w-full justify-between group cursor-pointer bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-900 dark:text-slate-100" onClick={() => navigate("/employees")}>
              <span className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-gray-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                View Employees
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400 dark:text-slate-500 group-hover:text-gray-900 dark:group-hover:text-slate-100 transition-colors" />
            </Button>
            <Button variant="outline" className="w-full justify-between group cursor-pointer bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-900 dark:text-slate-100" onClick={() => navigate("/reports")}>
              <span className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-gray-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                Generate Report
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400 dark:text-slate-500 group-hover:text-gray-900 dark:group-hover:text-slate-100 transition-colors" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}