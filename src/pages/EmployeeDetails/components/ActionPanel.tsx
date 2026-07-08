import { useState } from "react";
import { Check, X, Tag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { ConfirmationDialog, EmployeeCodeDialog } from "./Dialogs";

export function ActionPanel({ status }: { status: string }) {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  return (
    <Card className="shadow-sm border-blue-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-gray-800">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-500">Current Status</span>
          <Badge variant="warning">{status}</Badge>
        </div>
        
        <div className="space-y-3">
          <Button className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setIsApproveOpen(true)}>
            <Check className="mr-2 h-4 w-4" /> Approve Employee
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => setIsRejectOpen(true)}>
            <X className="mr-2 h-4 w-4" /> Reject Employee
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => setIsCodeOpen(true)}>
            <Tag className="mr-2 h-4 w-4" /> Assign Employee Code
          </Button>
        </div>
      </CardContent>

      <ConfirmationDialog open={isApproveOpen} onOpenChange={setIsApproveOpen} title="Approve this employee?" actionText="Approve" />
      <ConfirmationDialog open={isRejectOpen} onOpenChange={setIsRejectOpen} title="Reject this employee?" actionText="Reject" isDestructive />
      <EmployeeCodeDialog open={isCodeOpen} onOpenChange={setIsCodeOpen} />
    </Card>
  );
}