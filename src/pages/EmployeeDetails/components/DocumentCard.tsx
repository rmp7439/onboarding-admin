import { useState } from 'react';
import { FileText, Download, Eye, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { downloadEmployeeDocument } from "../../../services/documentService";
import { useToast } from "../../../hooks/useToast";

interface DocumentInfo {
  id: string;
  originalFilename: string;
}

interface DocumentCardProps {
  type: string;
  name: string;
  documents: DocumentInfo[];
  employeeCode: string;
}

export function DocumentCard({ type, name, documents, employeeCode }: DocumentCardProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const getFileName = () => {
    const prefix = employeeCode && employeeCode !== "Pending Assignment" ? employeeCode : "EMP";
    let suffix = type;
    if (type === 'AADHAAR') suffix = 'AADHAAR_CARD';
    if (type === 'PAN') suffix = 'PAN_CARD';
    if (type === 'DRIVING_LICENSE') suffix = 'DRIVING_LICENCE';
    if (type === 'VOTER_ID') suffix = 'VOTER_ID';
    if (type === 'DISCHARGE_BOOK') suffix = 'DISCHARGE_BOOK';
    if (type === 'BANK_PASSBOOK') suffix = 'BANK_PASSBOOK';
    if (type === 'EDUCATION') suffix = 'EDUCATION_DOCUMENT';
    
    return `${prefix}_${suffix}.pdf`;
  };

  // Safely inject jsPDF via CDN to avoid package.json/build dependencies 
  const loadJsPDF = async (): Promise<any> => {
    if ((window as any).jspdf) return (window as any).jspdf.jsPDF;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => resolve((window as any).jspdf.jsPDF);
      script.onerror = () => reject(new Error('Failed to load PDF library'));
      document.head.appendChild(script);
    });
  };

  const generatePDF = async () => {
    const JsPDFClass = await loadJsPDF();
    const pdf = new JsPDFClass({ orientation: "portrait", unit: "px", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      const blob = await downloadEmployeeDocument(doc.id);
      
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const img = new Image();
      img.src = base64;
      await new Promise((resolve) => { img.onload = resolve; });

      // Calculate the size to perfectly fit A4 bounds without cropping
      const imgRatio = img.width / img.height;

      let finalWidth = pdfWidth;
      let finalHeight = pdfWidth / imgRatio;

      if (finalHeight > pdfHeight) {
        finalHeight = pdfHeight;
        finalWidth = finalHeight * imgRatio;
      }

      // Centers the image on the PDF canvas perfectly
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      if (i > 0) pdf.addPage();
      
      const formatMatch = base64.match(/data:image\/(.*);base64/);
      let format = formatMatch ? formatMatch[1].toUpperCase() : 'JPEG';
      
      // Strict format fallback to keep jsPDF happy
      if (format === 'PNG') format = 'PNG';
      else if (format === 'WEBP') format = 'WEBP';
      else format = 'JPEG'; 

      pdf.addImage(base64, format, x, y, finalWidth, finalHeight);
    }
    return pdf;
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const pdf = await generatePDF();
      pdf.save(getFileName());
    } catch (error) {
      toast("Failed to download document.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = async () => {
    try {
      setIsDownloading(true);
      const pdf = await generatePDF();
      const pdfBlob = pdf.output("blob");
      const url = window.URL.createObjectURL(pdfBlob);
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
            <h4 className="text-sm font-semibold text-gray-900 truncate uppercase">{name}</h4>
            <span title="Verified System Document" className="flex items-center shrink-0">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate max-w-[200px]">
            {documents.length} page{documents.length !== 1 ? 's' : ''} attached
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