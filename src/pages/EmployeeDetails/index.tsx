import { User } from "lucide-react";
import { InfoCard } from "./components/InfoCard";
import { DetailRow } from "./components/DetailRow";
import { DocumentCard } from "./components/DocumentCard";
import { ActionPanel } from "./components/ActionPanel";
import { mockEmployee, requiredDocs, optionalDocs } from "./mockData";

export default function EmployeeDetails() {
  const { employmentInfo, personalInfo, identityInfo, addressInfo, bankInfo, emergencyContact } = mockEmployee;

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Employee Details</h1>
        <p className="text-gray-500 mt-1">Review employee information before approval</p>
      </div>

      <div className="flex items-start gap-6">
        
        {/* LEFT COLUMN: 70% */}
        <div className="w-[70%] space-y-6">
          
          <InfoCard title="1. Employment Information">
            <div className="grid grid-cols-4 gap-6">
              <DetailRow label="Employee Code" value={employmentInfo.code} />
              <DetailRow label="Joining Date" value={employmentInfo.joiningDate} />
              <DetailRow label="Unit" value={employmentInfo.unit} />
              <DetailRow label="Status" value={employmentInfo.status} />
            </div>
          </InfoCard>

          <InfoCard title="2. Personal Information">
            <div className="grid grid-cols-4 gap-6 gap-y-8">
              <DetailRow label="First Name" value={personalInfo.firstName} />
              <DetailRow label="Surname" value={personalInfo.surname} />
              <DetailRow label="Father Name" value={personalInfo.fatherName} />
              <DetailRow label="Husband Name" value={personalInfo.husbandName} />
              <DetailRow label="Gender" value={personalInfo.gender} />
              <DetailRow label="Blood Group" value={personalInfo.bloodGroup} />
              <DetailRow label="Date of Birth" value={personalInfo.dob} />
              <DetailRow label="Phone Number" value={personalInfo.phone} />
            </div>
          </InfoCard>

          <InfoCard title="3. Identity Information">
            <div className="grid grid-cols-4 gap-6">
              <DetailRow label="Aadhaar Number" value={identityInfo.aadhaar} />
              <DetailRow label="PAN Number" value={identityInfo.pan} />
              <DetailRow label="UAN" value={identityInfo.uan} />
              <DetailRow label="ESIC" value={identityInfo.esic} />
            </div>
          </InfoCard>

          <InfoCard title="4. Address Information">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <DetailRow label="Permanent Address" value={addressInfo.permanent} />
              <DetailRow label="Current Address" value={addressInfo.current} />
            </div>
            <div className="grid grid-cols-3 gap-6">
              <DetailRow label="City" value={addressInfo.city} />
              <DetailRow label="State" value={addressInfo.state} />
              <DetailRow label="PIN Code" value={addressInfo.pinCode} />
            </div>
          </InfoCard>

          <InfoCard title="5. Bank Information">
            <div className="grid grid-cols-3 gap-6 gap-y-8">
              <DetailRow label="Bank Name" value={bankInfo.bankName} />
              <DetailRow label="Account Number" value={bankInfo.accountNumber} />
              <DetailRow label="IFSC Code" value={bankInfo.ifsc} />
              <DetailRow label="Branch" value={bankInfo.branch} />
              <DetailRow label="MICR" value={bankInfo.micr} />
            </div>
          </InfoCard>

          <InfoCard title="6. Emergency Contact">
            <div className="grid grid-cols-3 gap-6">
              <DetailRow label="Contact Name" value={emergencyContact.name} />
              <DetailRow label="Relationship" value={emergencyContact.relationship} />
              <DetailRow label="Phone Number" value={emergencyContact.phone} />
            </div>
          </InfoCard>

          <InfoCard title="7. Uploaded Documents">
            <div className="grid grid-cols-2 gap-4">
              {requiredDocs.map((doc, i) => (
                <DocumentCard key={i} name={doc} />
              ))}
              {optionalDocs.map((doc, i) => (
                <DocumentCard key={`opt-${i}`} name={doc} isOptional />
              ))}
            </div>
          </InfoCard>

        </div>

        {/* RIGHT COLUMN: 30% */}
        <div className="w-[30%] space-y-6 sticky top-6">
          
          {/* Selfie Panel */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
            <div className="h-32 w-32 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center mb-4 overflow-hidden">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{personalInfo.firstName} {personalInfo.surname}</h3>
            <p className="text-sm text-gray-500">{employmentInfo.unit}</p>
          </div>

          {/* Quick Actions Panel */}
          <ActionPanel status={employmentInfo.status} />

        </div>

      </div>
    </div>
  );
}