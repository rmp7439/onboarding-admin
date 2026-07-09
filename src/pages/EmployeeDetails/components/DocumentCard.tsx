import { useState } from 'react';
import { FileText, Download, Eye, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { downloadEmployeeDocument } from "../../../services/documentService";
import { useToast } from "../../../hooks/useToast";

interface DocumentCardProps {
  id: string;
  name: string;
  originalFilename: string;
}

export function DocumentCard({ id, name, originalFilename }: DocumentCardProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const blob = await downloadEmployeeDocument(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalFilename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast("Failed to download document.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = async () => {
    try {
      setIsDownloading(true);
      const blob = await downloadEmployeeDocument(id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      toast("Failed to preview document.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-md shrink-0">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-semibold text-gray-900 truncate">{name}</h4>
            <span title="Verified System Document" className="flex items-center shrink-0">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate max-w-[200px]" title={originalFilename}>
            {originalFilename}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
          onClick={handlePreview}
          disabled={isDownloading}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}