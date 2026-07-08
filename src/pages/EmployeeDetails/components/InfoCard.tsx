import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 border-b border-gray-100 mb-4">
        <CardTitle className="text-lg text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}