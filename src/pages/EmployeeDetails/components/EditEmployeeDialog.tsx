import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Select } from "../../../components/ui/Select";
import { AlertCircle } from "lucide-react";
import { type EmployeeDetailsData } from "../../../types/employee";
import { useUnits } from "../../../hooks/useUnits";

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeDetailsData | null;
  onSave: (payload: any) => void;
  isLoading: boolean;
  error: string | null;
}

export function EditEmployeeDialog({ open, onOpenChange, employee, onSave, isLoading, error }: EditEmployeeDialogProps) {
  const { register, handleSubmit, reset } = useForm();
  const { data: units = [] } = useUnits();

  useEffect(() => {
    if (open && employee) {
      reset({
        unit: employee.employmentInfo?.unit || "",
        joiningDate: employee.employmentInfo?.joiningDate || "",
        firstName: employee.personalInfo?.firstName || "",
        surname: employee.personalInfo?.surname || "",
        fatherName: employee.personalInfo?.fatherName || "",
        husbandName: employee.personalInfo?.husbandName || "",
        gender: employee.personalInfo?.gender?.toUpperCase() || "",
        bloodGroup: employee.personalInfo?.bloodGroup || "",
        maritalStatus: employee.personalInfo?.maritalStatus?.toUpperCase() || "",
        education: employee.personalInfo?.education?.toUpperCase().replace(" ", "_") || "",
        dateOfBirth: employee.personalInfo?.dob || "",
        mobile: employee.personalInfo?.phone || "",
        aadhaar: employee.identityInfo?.aadhaar || "",
        pan: employee.identityInfo?.pan || "",
        uan: employee.identityInfo?.uan || "",
        esic: employee.identityInfo?.esic || "",
        drivingLicence: employee.identityInfo?.drivingLicence || "",
        permanentAddress: employee.addressInfo?.permanent || "",
        city: employee.addressInfo?.city || "",
        state: employee.addressInfo?.state || "",
        pinCode: employee.addressInfo?.pinCode || "",
        permanentPoliceStation: employee.addressInfo?.permanentPoliceStation || "",
        currentAddress: employee.addressInfo?.current || "",
        currentCity: employee.addressInfo?.currentCity || "",
        currentState: employee.addressInfo?.currentState || "",
        currentPinCode: employee.addressInfo?.currentPinCode || "",
        accountHolderName: employee.bankInfo?.accountHolderName || "",
        bankName: employee.bankInfo?.bankName || "",
        accountNumber: employee.bankInfo?.accountNumber || "",
        ifsc: employee.bankInfo?.ifsc || "",
        micr: employee.bankInfo?.micr || "",
        emergencyName: employee.emergencyContact?.name || "",
        emergencyRelation: employee.emergencyContact?.relationship || "",
        emergencyPhone: employee.emergencyContact?.phone || "",
        nomineeName: employee.nomineeInfo?.name || "",
        nomineeRelation: employee.nomineeInfo?.relationship || "",
        nomineeMobile: employee.nomineeInfo?.phone || "",
      });
    }
  }, [open, employee, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Edit Employee Details</DialogTitle>
      </DialogHeader>
      <DialogContent className="max-h-[80vh] overflow-y-auto pr-4">
        <form id="edit-employee-form" onSubmit={handleSubmit(onSave)} className="space-y-6">
          
          {/* Employment */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Employment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Unit</Label>
                <Select {...register("unit")} disabled={isLoading}>
                  <option value="">Select Unit</option>
                  {units.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Joining Date</Label>
                <Input type="date" {...register("joiningDate")} disabled={isLoading} />
              </div>
            </div>
          </div>

          {/* Personal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>First Name</Label><Input {...register("firstName")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>Surname</Label><Input {...register("surname")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>Father's Name</Label><Input {...register("fatherName")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>Husband's Name</Label><Input {...register("husbandName")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>Date of Birth</Label><Input type="date" {...register("dateOfBirth")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>Mobile Number</Label><Input {...register("mobile")} disabled={isLoading} maxLength={10} /></div>
            </div>
          </div>

          {/* Identity */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Identity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Aadhaar</Label><Input {...register("aadhaar")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>PAN</Label><Input {...register("pan")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>UAN</Label><Input {...register("uan")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>ESIC</Label><Input {...register("esic")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>Driving Licence</Label><Input {...register("drivingLicence")} disabled={isLoading} /></div>
            </div>
          </div>

          {/* Address Details - Restored completely distinct sections */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Address Details</h3>
            
            <h4 className="text-sm font-semibold text-gray-700 mt-2">Permanent Address</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1"><Label>Address</Label><Input {...register("permanentAddress")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>State</Label><Input {...register("state")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>City</Label><Input {...register("city")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>PIN Code</Label><Input {...register("pinCode")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>Police Station</Label><Input {...register("permanentPoliceStation")} disabled={isLoading} /></div>
            </div>

            <h4 className="text-sm font-semibold text-gray-700 mt-4">Current Address</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1"><Label>Address</Label><Input {...register("currentAddress")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>State</Label><Input {...register("currentState")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>City</Label><Input {...register("currentCity")} disabled={isLoading} /></div>
              <div className="space-y-1"><Label>PIN Code</Label><Input {...register("currentPinCode")} disabled={isLoading} /></div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </DialogContent>
      <DialogFooter className="mt-4 border-t pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
        <Button type="submit" form="edit-employee-form" isLoading={isLoading}>Save Changes</Button>
      </DialogFooter>
    </Dialog>
  );
}