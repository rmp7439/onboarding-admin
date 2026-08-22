import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { User, Download } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { downloadEmployeeSelfie } from "../../services/documentService";
import { useToast } from "../../hooks/useToast";
import { InfoCard } from "./components/InfoCard";
import { DetailRow } from "./components/DetailRow";
import { DocumentCard } from "./components/DocumentCard";
import { ActionPanel } from "./components/ActionPanel";
import { EmployeeDetailsSkeleton } from "./components/EmployeeDetailsSkeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { useEmployee } from "../../hooks/useEmployee";
import { triggerDownload } from "../../hooks/useReports";
import { EditEmployeeDialog } from "./components/EditEmployeeDialog";
import { useAdminUpdateEmployee } from "../../hooks/useEmployeeMutations";

/**
 * Transforms a legacy circular photo (with white/transparent corners) into a 
 * true square passport-style photo by extracting the maximum inscribed square.
 */
async function convertCircularBlobToSquarePassport(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const sourceUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.crossOrigin = "anonymous"; // Handle safe extraction

    img.onload = () => {
      try {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const diameter = Math.min(width, height);

        // Quick heuristic: Check if corners are white or transparent to detect the legacy circular mask
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
        
        let isLegacyCircular = false;
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0);
          const offset = Math.floor(diameter * 0.05); // Sample 5% inward
          
          const isWhiteOrTrans = (data: Uint8ClampedArray) => {
            const [r, g, b, a] = data;
            return (r > 240 && g > 240 && b > 240) || a < 10;
          };
          
          const corners = [
            tempCtx.getImageData(offset, offset, 1, 1).data,
            tempCtx.getImageData(width - offset, offset, 1, 1).data,
            tempCtx.getImageData(offset, height - offset, 1, 1).data,
            tempCtx.getImageData(width - offset, height - offset, 1, 1).data
          ];
          
          isLegacyCircular = corners.every(isWhiteOrTrans);
        }

        let sx = 0, sy = 0, sWidth = width, sHeight = height;

        if (isLegacyCircular) {
          // CASE B: Circular photo -> Extract the largest square INSCRIBED inside the circle
          const squareSide = Math.floor(diameter / Math.sqrt(2));
          const circleLeft = (width - diameter) / 2;
          const circleTop = (height - diameter) / 2;

          sx = circleLeft + (diameter - squareSide) / 2;
          sy = circleTop + (diameter - squareSide) / 2;
          sWidth = squareSide;
          sHeight = squareSide;
        } else {
          // CASE A: True square/rectangle -> Standard center crop
          sWidth = diameter;
          sHeight = diameter;
          sx = (width - diameter) / 2;
          sy = (height - diameter) / 2;
        }

        // Export to a clean 600x600 passport-style canvas
        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("Canvas context unavailable");

        // Draw ONLY the calculated photographic region
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 600, 600);

        canvas.toBlob(
          (croppedBlob) => {
            URL.revokeObjectURL(sourceUrl);
            if (croppedBlob) resolve(croppedBlob);
            else reject(new Error("Failed to create blob"));
          },
          "image/jpeg",
          0.92
        );
      } catch (e) {
        URL.revokeObjectURL(sourceUrl);
        reject(e);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = sourceUrl;
  });
}

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: employee, isLoading, isError, refetch } = useEmployee(id);
  const { toast } = useToast();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const updateMutation = useAdminUpdateEmployee();

  const handleEditSubmit = (payload: any) => {
    setEditError(null);
    updateMutation.mutate(
      { id: employee!.id, payload },
      {
        onSuccess: () => { toast("Employee details updated successfully.", "success"); setIsEditOpen(false); },
        onError: (err: any) => { setEditError(err?.response?.data?.error || err.message || "Failed to update employee."); }
      }
    );
  };

  const groupedDocuments = useMemo(() => {
    if (!employee?.documents) return {};
    return employee.documents.reduce((acc: any, doc: any) => {
      if (!acc[doc.type]) acc[doc.type] = [];
      acc[doc.type].push(doc);
      return acc;
    }, {});
  }, [employee?.documents]);

  const handleDownloadSelfie = async () => {
    if (!employee?.id) return;
    try {
      const originalBlob = await downloadEmployeeSelfie(employee.id);
      
      // Transform the incoming blob strictly prior to download
      const passportBlob = await convertCircularBlobToSquarePassport(originalBlob);
      
      triggerDownload(
        passportBlob, 
        `selfie-${employee.personalInfo?.firstName || "employee"}.jpg`
      );
    } catch (error) { 
      toast("Failed to download selfie", "error"); 
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED": return <Badge variant="success">APPROVED</Badge>;
      case "PENDING": return <Badge variant="warning">PENDING</Badge>;
      case "REJECTED": return <Badge variant="destructive">REJECTED</Badge>;
      case "RETURNED_FOR_CORRECTION": return <Badge className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 hover:bg-amber-200 border border-amber-200 dark:border-amber-800/50">RETURNED</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) return <EmployeeDetailsSkeleton />;
  if (isError || !employee) return <div className="pt-8"><ErrorState title="Employee Not Found" message="The employee record you are looking for does not exist or failed to load." onRetry={refetch} /></div>;

  const { employmentInfo, personalInfo, identityInfo, addressInfo, bankInfo, emergencyContact, nomineeInfo } = employee;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="w-full lg:w-[70%] space-y-6">
          {employmentInfo?.status === "REJECTED" && (
            <InfoCard title="Application Rejected">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-md">
                <p className="text-sm font-medium text-red-800 dark:text-red-400">
                  {employmentInfo?.rejectReason || "No rejection reason provided."}
                </p>
              </div>
            </InfoCard>
          )}

          <InfoCard title="Overview">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center overflow-hidden shrink-0">
                  {employee.selfieUrl ? (
                    <img src={employee.selfieUrl} alt="Employee" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-gray-400 dark:text-slate-500" />
                  )}
                </div>
                {employee.selfieUrl && (
                  <Button variant="outline" size="sm" onClick={handleDownloadSelfie} className="w-full text-xs">
                    <Download className="mr-2 h-3 w-3" /> Download
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 flex-1 w-full">
                <DetailRow label="Employee Code" value={employmentInfo?.code || "-"} />
                <DetailRow label="Name" value={`${personalInfo?.firstName || ""} ${personalInfo?.surname || ""}`} />
                <DetailRow label="Unit" value={employmentInfo?.unit || "-"} />
                <DetailRow label="Status" value={getStatusBadge(employmentInfo?.status || "UNKNOWN")} />
                <DetailRow label="Joining Date" value={employmentInfo?.joiningDate || "-"} />
                <DetailRow label="Phone Number" value={personalInfo?.phone || "-"} />
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Personal Information">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <DetailRow label="Date of Birth" value={personalInfo?.dob || "-"} />
              <DetailRow label="Gender" value={personalInfo?.gender || "-"} />
              <DetailRow label="Blood Group" value={personalInfo?.bloodGroup || "-"} />
              <DetailRow label="Marital Status" value={personalInfo?.maritalStatus || "-"} />
            </div>
          </InfoCard>

          <InfoCard title="Government IDs">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
              <DetailRow label="Aadhaar" value={identityInfo?.aadhaar || "-"} />
              <DetailRow label="PAN" value={identityInfo?.pan || "-"} />
              <DetailRow label="UAN" value={identityInfo?.uan || "-"} />
              <DetailRow label="ESIC" value={identityInfo?.esic || "-"} />
              <DetailRow label="Driving Licence" value={identityInfo?.drivingLicence || "-"} />
            </div>
          </InfoCard>

          <InfoCard title="Address">
            <div className="mb-8">
              <h4 className="text-md font-semibold text-gray-700 dark:text-slate-300 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">Permanent Address</h4>
              <div className="grid grid-cols-1 mb-4"><DetailRow label="Address" value={addressInfo?.permanent || "-"} /></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <DetailRow label="Police Station" value={addressInfo?.permanentPoliceStation || "-"} />
                <DetailRow label="City" value={addressInfo?.city || "-"} />
                <DetailRow label="State" value={addressInfo?.state || "-"} />
                <DetailRow label="PIN Code" value={addressInfo?.pinCode || "-"} />
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-700 dark:text-slate-300 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">Current Address</h4>
              <div className="grid grid-cols-1 mb-4"><DetailRow label="Address" value={addressInfo?.current || "-"} /></div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                <DetailRow label="City" value={addressInfo?.currentCity || "-"} />
                <DetailRow label="State" value={addressInfo?.currentState || "-"} />
                <DetailRow label="PIN Code" value={addressInfo?.currentPinCode || "-"} />
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Bank Details">
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
              <DetailRow label="Account Holder Name" value={bankInfo?.accountHolderName || "-"} />
              <DetailRow label="Bank Name" value={bankInfo?.bankName || "-"} />
              <DetailRow label="Account Number" value={bankInfo?.accountNumber || "-"} />
              <DetailRow label="IFSC Code" value={bankInfo?.ifsc || "-"} />
              <DetailRow label="MICR Code" value={bankInfo?.micr || "-"} />
            </div>
          </InfoCard>

          <InfoCard title="Emergency Contact">
            <div className="grid grid-cols-3 gap-6">
              <DetailRow label="Contact Name" value={emergencyContact?.name || "-"} />
              <DetailRow label="Relationship" value={emergencyContact?.relationship || "-"} />
              <DetailRow label="Phone Number" value={emergencyContact?.phone || "-"} />
            </div>
          </InfoCard>

          <InfoCard title="Nominee Details">
            <div className="grid grid-cols-3 gap-6">
              <DetailRow label="Nominee Name" value={nomineeInfo?.name || "-"} />
              <DetailRow label="Relationship" value={nomineeInfo?.relationship || "-"} />
              <DetailRow label="Phone Number" value={nomineeInfo?.phone || "-"} />
            </div>
          </InfoCard>

          <InfoCard title="Uploaded Documents">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.keys(groupedDocuments).length > 0 ? (
                Object.entries(groupedDocuments).map(([type, docs]: [string, any]) => (
                  <DocumentCard
                    key={type} type={type} name={type.replace(/_/g, " ")} documents={docs}
                    employeeCode={employmentInfo?.code || "EMP"} employeeId={employee.id}
                    employeeName={`${personalInfo?.firstName || ""} ${personalInfo?.surname || ""}`}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-slate-400 py-4 col-span-2">No documents have been uploaded for this employee.</p>
              )}
            </div>
          </InfoCard>
        </div>

        <div className="w-full lg:w-[30%] space-y-6 sticky top-6">
          <ActionPanel employeeId={employee.id} status={employmentInfo?.status || "UNKNOWN"} onEditClick={() => setIsEditOpen(true)} />
        </div>
      </div>

      <EditEmployeeDialog open={isEditOpen} onOpenChange={setIsEditOpen} employee={employee} onSave={handleEditSubmit} isLoading={updateMutation.isPending} error={editError} />
    </div>
  );
}