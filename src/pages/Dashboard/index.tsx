import { Users, Clock, CheckCircle2, XCircle, FileText, Settings as SettingsIcon, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { useDashboard } from "../../hooks/useDashboard";
import type { EmployeeStatus, Employee } from "../../types/employee";

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useDashboard();

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
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 pb-8">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
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
    { title: "Total Employees", value: stats.total, description: "Across all active units" },
    { title: "Pending Approvals", value: stats.pending, description: "Awaiting HR review" },
    { title: "Approved Employees", value: stats.approved, description: "Successfully onboarded" },
    { title: "Rejected Employees", value: stats.rejected, description: "Did not meet requirements" },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Employee Onboarding Overview</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-6">
        {formattedStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              {statIcons[index]}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-4 gap-6">
        
        {/* Recent Employees Table */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Recent Employees</CardTitle>
          </CardHeader>
          <CardContent>
            {recentEmployees.length === 0 ? (
              <div className="text-center text-slate-500 py-10">No recent employees found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Joining Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEmployees.map((employee: Employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium text-slate-900">{employee.code}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell className="text-slate-500">{employee.unit}</TableCell>
                      <TableCell className="text-slate-500">{employee.phone}</TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell className="text-right text-slate-500">{employee.joiningDate}</TableCell>
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
            <Button variant="outline" className="w-full justify-between group">
              <span className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-slate-500" />
                View Employees
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900" />
            </Button>
            
            <Button variant="outline" className="w-full justify-between group">
              <span className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-slate-500" />
                Generate Report
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900" />
            </Button>
            
            <Button variant="outline" className="w-full justify-between group">
              <span className="flex items-center">
                <SettingsIcon className="mr-2 h-4 w-4 text-slate-500" />
                Settings
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}