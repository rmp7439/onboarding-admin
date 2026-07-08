import { Download } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface DownloadButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  label: string;
}

export function DownloadButton({ isLoading, label, ...props }: DownloadButtonProps) {
  return (
    <Button isLoading={isLoading} {...props}>
      {!isLoading && <Download className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  );
}