import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";

export function ConfirmationDialog({ 
  open, onOpenChange, title, actionText, isDestructive 
}: { 
  open: boolean; onOpenChange: (open: boolean) => void; title: string; actionText: string; isDestructive?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <p className="text-sm text-gray-500">This action cannot be easily undone. Are you sure you want to proceed?</p>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button variant={isDestructive ? "outline" : "default"} className={isDestructive ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700" : ""}>
          {actionText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export function EmployeeCodeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Assign Employee Code</DialogTitle>
      </DialogHeader>
      <DialogContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="empCode">Employee Code</Label>
          <Input id="empCode" placeholder="e.g., EMP-1050" />
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button>Save Code</Button>
      </DialogFooter>
    </Dialog>
  );
}