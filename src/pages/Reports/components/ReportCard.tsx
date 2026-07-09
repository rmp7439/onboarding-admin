import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";

interface ReportCardProps {
  title: string;
  children: React.ReactNode;
  action: React.ReactNode;
}

export function ReportCard({ title, children, action }: ReportCardProps) {
  return (
    <Card className="flex flex-col shadow-sm">
      <CardHeader className="pb-3 border-b border-gray-100">
        <CardTitle className="text-lg text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-6 space-y-6">
        <div className="space-y-4 flex-1">
          {children}
        </div>
        <div className="pt-4 border-t border-gray-100">
          {action}
        </div>
      </CardContent>
    </Card>
  );
}