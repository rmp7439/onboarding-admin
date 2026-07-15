import { useParams } from "react-router-dom";
import { User, Download } from "lucide-react";
import { Button } from "../../components/ui/Button";
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

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: employee, isLoading, isError, refetch } = useEmployee(id);
  const { toast } = useToast();

  if (isLoading) return <EmployeeDetailsSkeleton />;

  if (isError || !employee) {
    return (
      <div className="pt-8">
        <ErrorState
          title="Employee Not Found"
          message="The employee record you are looking for does not exist or failed to load."
          onRetry={refetch}
        />
      </div>
    );
  }

  const {
    employmentInfo,
    personalInfo,
    identityInfo,
    addressInfo,
    bankInfo,
    emergencyContact,
  } = employee;

  const handleDownloadSelfie = async () => {
    if (!employee?.id) return;
    try {
      const blob = await downloadEmployeeSelfie(employee.id);
      triggerDownload(blob, `selfie-${employee.personalInfo?.firstName}.jpg`);
    } catch (error) {
      toast("Failed to download selfie", "error");
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-start gap-6">
        <div className="w-[70%] space-y-6">
          <InfoCard title="1. Employment Information">
            <div className="grid grid-cols-4 gap-6">
              <DetailRow
                label="Employee Code"
                value={employmentInfo?.code || "-"}
              />
              <DetailRow
                label="Joining Date"
                value={employmentInfo?.joiningDate || "-"}
              />
              <DetailRow label="Unit" value={employmentInfo?.unit || "-"} />
              <DetailRow label="Status" value={employmentInfo?.status || "-"} />
            </div>
          </InfoCard>

          <InfoCard title="2. Personal Information">
            <div className="grid grid-cols-4 gap-6 gap-y-8">
              <DetailRow
                label="First Name"
                value={personalInfo?.firstName || "-"}
              />
              <DetailRow label="Surname" value={personalInfo?.surname || "-"} />
              <DetailRow
                label="Father Name"
                value={personalInfo?.fatherName || "-"}
              />
              <DetailRow
                label="Husband Name"
                value={personalInfo?.husbandName || "-"}
              />
              <DetailRow label="Gender" value={personalInfo?.gender || "-"} />
              <DetailRow
                label="Blood Group"
                value={personalInfo?.bloodGroup || "-"}
              />
              <DetailRow
                label="Date of Birth"
                value={personalInfo?.dob || "-"}
              />
              <DetailRow
                label="Phone Number"
                value={personalInfo?.phone || "-"}
              />
            </div>
          </InfoCard>

          <InfoCard title="3. Identity Information">
            <div className="grid grid-cols-4 gap-6">
              <DetailRow
                label="Aadhaar Number"
                value={identityInfo?.aadhaar || "-"}
              />
              <DetailRow label="PAN Number" value={identityInfo?.pan || "-"} />
              <DetailRow label="UAN" value={identityInfo?.uan || "-"} />
              <DetailRow label="ESIC" value={identityInfo?.esic || "-"} />
            </div>
          </InfoCard>

          <InfoCard title="4. Address Information">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <DetailRow
                label="Permanent Address"
                value={addressInfo?.permanent || "-"}
              />
              <DetailRow
                label="Current Address"
                value={addressInfo?.current || "-"}
              />
            </div>
            <div className="grid grid-cols-3 gap-6">
              <DetailRow label="City" value={addressInfo?.city || "-"} />
              <DetailRow label="State" value={addressInfo?.state || "-"} />
              <DetailRow label="PIN Code" value={addressInfo?.pinCode || "-"} />
            </div>
          </InfoCard>

          <InfoCard title="5. Bank Information">
            <div className="grid grid-cols-3 gap-6 gap-y-8">
              <DetailRow label="Bank Name" value={bankInfo?.bankName || "-"} />
              <DetailRow
                label="Account Number"
                value={bankInfo?.accountNumber || "-"}
              />
              <DetailRow label="IFSC Code" value={bankInfo?.ifsc || "-"} />
              <DetailRow label="Branch" value={bankInfo?.branch || "-"} />
              <DetailRow label="MICR" value={bankInfo?.micr || "-"} />
            </div>
          </InfoCard>

          <InfoCard title="6. Emergency Contact">
            <div className="grid grid-cols-3 gap-6">
              <DetailRow
                label="Contact Name"
                value={emergencyContact?.name || "-"}
              />
              <DetailRow
                label="Relationship"
                value={emergencyContact?.relationship || "-"}
              />
              <DetailRow
                label="Phone Number"
                value={emergencyContact?.phone || "-"}
              />
            </div>
          </InfoCard>

          <InfoCard title="7. Uploaded Documents">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {employee.documents && employee.documents.length > 0 ? (
                employee.documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    id={doc.id}
                    name={doc.type.replace(/_/g, " ")}
                    originalFilename={doc.originalFilename}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 py-4 col-span-2">
                  No documents have been uploaded for this employee.
                </p>
              )}
            </div>
          </InfoCard>
        </div>

        <div className="w-[30%] space-y-6 sticky top-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center mb-4 overflow-hidden">
              {employee.selfieUrl ? (
                <img
                  src={employee.selfieUrl}
                  alt="Employee"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {personalInfo?.firstName || "Unknown"}{" "}
              {personalInfo?.surname || ""}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {employmentInfo?.unit || "No Unit Assigned"}
            </p>

            {/* Selfie Download Button */}
            {employee.selfieFilename && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadSelfie}
                className="w-full mt-2"
              >
                <Download className="mr-2 h-4 w-4" /> Download Selfie
              </Button>
            )}
          </div>
          <ActionPanel
            employeeId={employee.id}
            status={employmentInfo?.status || "UNKNOWN"}
          />
        </div>
      </div>
    </div>
  );
}
