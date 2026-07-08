interface DetailRowProps {
  label: string;
  value: string | React.ReactNode;
}

export function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value || "-"}</span>
    </div>
  );
}