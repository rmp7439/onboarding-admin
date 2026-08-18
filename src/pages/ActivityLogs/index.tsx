import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/Dialog";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { Pagination } from "../../components/ui/Pagination";
import { useActivityLogs } from "../../hooks/useActivityLogs";

export default function ActivityLogs() {
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: "", action: "" });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedChanges, setSelectedChanges] = useState<any[] | null>(null);

  const { data, isLoading, isError, refetch } = useActivityLogs({ ...filters, search: debouncedSearch });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
    setTimeout(() => setDebouncedSearch(e.target.value), 500);
  };

  const getActionBadge = (action: string) => {
    const badgeClass = "min-w-[160px] flex justify-center";
    if (action.includes("CREATED")) return <Badge variant="success" className={badgeClass}>{action}</Badge>;
    if (action.includes("DELETED") || action.includes("DISABLED")) return <Badge variant="destructive" className={badgeClass}>{action}</Badge>;
    return <Badge className={`bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800 ${badgeClass}`}>{action}</Badge>;
  };

  if (isLoading) return <Skeleton className="h-96 w-full mt-10" />;
  if (isError) return <ErrorState title="Failed to load Activity Logs" onRetry={refetch} />;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-950 dark:text-slate-100 transition-colors">Activity Logs</h1>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm flex items-center gap-4 transition-colors">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-slate-400" />
          <Input
            placeholder="Search by actor or target name..."
            className="pl-9"
            value={filters.search}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Card className="shadow-sm flex flex-col">
        <div className="flex-1 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 shadow-sm">
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Timestamp</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Actor</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Action</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Target</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 h-12 uppercase text-xs tracking-wider align-middle !text-center whitespace-nowrap">Changes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center align-middle py-10 text-gray-500 dark:text-slate-400">No logs found.</TableCell>
                </TableRow>
              ) : (
                data?.logs.map((log: any) => (
                  <TableRow key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors">
                    <TableCell className="py-5 text-center align-middle text-sm text-gray-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="py-5 text-center align-middle">
                      <div className="flex flex-col items-center justify-center">
                        <div className="font-medium text-gray-900 dark:text-slate-100">
                          {log.actorRole === "DEV" ? "Developer" : log.actorName}
                        </div>
                        <Badge className="mt-1.5 text-[10px] px-2 py-0">{log.actorRole}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 text-center align-middle whitespace-nowrap">
                      <div className="flex items-center justify-center">{getActionBadge(log.action)}</div>
                    </TableCell>
                    <TableCell className="py-5 text-center align-middle">
                      {log.targetName ? (
                        <div className="flex flex-col items-center justify-center">
                          <div className="font-medium text-gray-900 dark:text-slate-100">{log.targetName}</div>
                          <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">{log.targetType}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-slate-500 italic">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="py-5 text-center align-middle">
                      <div className="flex items-center justify-center">
                        {log.changes && log.changes.length > 0 ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedChanges(log.changes)}
                            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" /> View
                          </Button>
                        ) : (
                          <span className="text-gray-400 dark:text-slate-500 text-sm">-</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data?.logs && data.logs.length > 0 && (
          <Pagination
            currentPage={data.currentPage || filters.page}
            totalPages={data.pages || 1}
            onPageChange={(newPage) => setFilters((prev) => ({ ...prev, page: newPage }))}
          />
        )}
      </Card>

      <Dialog open={!!selectedChanges} onOpenChange={() => setSelectedChanges(null)}>
        <DialogHeader>
          <DialogTitle>Field Changes</DialogTitle>
        </DialogHeader>
        <DialogContent className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {selectedChanges?.map((change: any, i: number) => (
              <div key={i} className="bg-gray-50 dark:bg-slate-800 p-3 rounded border border-gray-200 dark:border-slate-700">
                <div className="font-semibold text-gray-800 dark:text-slate-200 text-sm mb-2 uppercase">{change.field}</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-400 p-2 rounded border border-red-100 dark:border-red-900">
                    <span className="block text-[10px] uppercase font-bold text-red-500 mb-1">Old Value</span>
                    <span className="break-all">{change.old ?? <i className="text-red-400">null</i>}</span>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 p-2 rounded border border-emerald-100 dark:border-emerald-900">
                    <span className="block text-[10px] uppercase font-bold text-emerald-500 mb-1">New Value</span>
                    <span className="break-all">{change.new ?? <i className="text-emerald-400">null</i>}</span>
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