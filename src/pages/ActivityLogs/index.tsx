import { useState } from "react";
import { History, Search, Eye } from "lucide-react";
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
import { Input } from "../../components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/Dialog";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { useActivityLogs } from "../../hooks/useActivityLogs";

export default function ActivityLogs() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    action: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedChanges, setSelectedChanges] = useState<any[] | null>(null);

  const { data, isLoading, isError, refetch } = useActivityLogs({
    ...filters,
    search: debouncedSearch,
  });

  // Handle search delay to avoid excessive API calls
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
    setTimeout(() => setDebouncedSearch(e.target.value), 500);
  };

  const getActionBadge = (action: string) => {
    if (action.includes("CREATED"))
      return <Badge variant="success">{action}</Badge>;
    if (action.includes("DELETED") || action.includes("DISABLED"))
      return <Badge variant="destructive">{action}</Badge>;
    return <Badge className="bg-blue-100 text-blue-800">{action}</Badge>;
  };

  if (isLoading) return <Skeleton className="h-96 w-full mt-10" />;
  if (isError)
    return (
      <ErrorState title="Failed to load Activity Logs" onRetry={refetch} />
    );

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <History className="h-6 w-6 text-gray-700" /> Activity Logs
          </h1>
          <p className="text-sm text-gray-500">
            Immutable audit trail of administrative actions.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by actor or target name..."
            className="pl-9"
            value={filters.search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Data Table */}
      <Card className="shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="font-semibold text-center align-middle whitespace-nowrap">
                Timestamp
              </TableHead>
              <TableHead className="font-semibold text-center align-middle whitespace-nowrap">
                Actor
              </TableHead>
              <TableHead className="font-semibold text-center align-middle whitespace-nowrap">
                Action
              </TableHead>
              <TableHead className="font-semibold text-center align-middle whitespace-nowrap">
                Target
              </TableHead>
              <TableHead className="font-semibold text-center align-middle whitespace-nowrap">
                Changes
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center align-middle py-10 text-gray-500"
                >
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              data?.logs.map((log: any) => (
                <TableRow key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <TableCell className="py-4 text-center align-middle text-sm text-gray-600 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="py-4 text-center align-middle">
                    <div className="flex flex-col items-center justify-center">
                      <div className="font-medium text-gray-900">
                        {log.actorName}
                      </div>
                      <Badge className="mt-1 text-[10px] px-1 py-0">
                        {log.actorRole}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center align-middle whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      {getActionBadge(log.action)}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center align-middle">
                    {log.targetName ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="font-medium text-gray-900">
                          {log.targetName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.targetType}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4 text-center align-middle">
                    <div className="flex justify-center items-center">
                      {log.changes && log.changes.length > 0 ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedChanges(log.changes)}
                          className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" /> View
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Changes Modal */}
      <Dialog
        open={!!selectedChanges}
        onOpenChange={() => setSelectedChanges(null)}
      >
        <DialogHeader>
          <DialogTitle>Field Changes</DialogTitle>
        </DialogHeader>
        <DialogContent className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {selectedChanges?.map((change: any, i: number) => (
              <div
                key={i}
                className="bg-gray-50 p-3 rounded border border-gray-200"
              >
                <div className="font-semibold text-gray-800 text-sm mb-2 uppercase">
                  {change.field}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-red-50 text-red-800 p-2 rounded border border-red-100">
                    <span className="block text-[10px] uppercase font-bold text-red-500 mb-1">
                      Old Value
                    </span>
                    <span className="break-all">
                      {change.old ?? <i className="text-red-400">null</i>}
                    </span>
                  </div>
                  <div className="bg-emerald-50 text-emerald-800 p-2 rounded border border-emerald-100">
                    <span className="block text-[10px] uppercase font-bold text-emerald-500 mb-1">
                      New Value
                    </span>
                    <span className="break-all">
                      {change.new ?? <i className="text-emerald-400">null</i>}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}