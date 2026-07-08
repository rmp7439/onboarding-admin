import { FileText, Download, Eye, ShieldCheck } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface DocumentCardProps {
  name: string;
  isOptional?: boolean;
}

export function DocumentCard({ name, isOptional = false }: DocumentCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-semibold text-gray-900">{name}</h4>
            <span title="Verified Placeholder" className="flex items-center">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {isOptional ? "Optional Document" : "Required Document"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}