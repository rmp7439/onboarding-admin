import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

export default function Settings() {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage application preferences and system configurations</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-lg text-gray-800">General Configuration</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500">
            System settings module is currently pending backend integration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}