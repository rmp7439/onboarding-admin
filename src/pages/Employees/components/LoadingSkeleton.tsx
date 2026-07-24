import { Skeleton } from "../../../components/ui/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/Table";

export function LoadingSkeleton() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Employee Code</TableHead>
            <TableHead className="whitespace-nowrap">Name</TableHead>
            <TableHead className="whitespace-nowrap">Unit</TableHead>
            <TableHead className="whitespace-nowrap">Phone Number</TableHead>
            <TableHead className="whitespace-nowrap">Gender</TableHead>
            <TableHead className="whitespace-nowrap">Highest Education</TableHead>
            <TableHead className="whitespace-nowrap">Marital Status</TableHead>
            <TableHead className="whitespace-nowrap">Driving Licence</TableHead>
            <TableHead className="whitespace-nowrap">A/C Holder Name</TableHead>
            <TableHead className="whitespace-nowrap">Bank Name</TableHead>
            <TableHead className="whitespace-nowrap">IFSC</TableHead>
            <TableHead className="whitespace-nowrap">MICR</TableHead>
            <TableHead className="whitespace-nowrap">Nominee Name</TableHead>
            <TableHead className="whitespace-nowrap">Nominee Relation</TableHead>
            <TableHead className="whitespace-nowrap">Nominee Mobile</TableHead>
            <TableHead className="whitespace-nowrap">Nominee %</TableHead>
            <TableHead className="whitespace-nowrap">Status</TableHead>
            <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-28" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-12" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}