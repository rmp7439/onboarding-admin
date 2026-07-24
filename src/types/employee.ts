export type EmployeeStatus = "PENDING" | "APPROVED" | "REJECTED" | "RETURNED_FOR_CORRECTION";

export interface DocumentInfo {
  id: string;
  type: string;
  originalFilename: string;
}

export interface Employee {
  id: string;
  code: string;
  name: string;
  unit: string;
  phone: string;
  status: EmployeeStatus;
  rejectReason?: string | null;
  correctionRemark?: string | null;
  joiningDate: string;
}

export interface EmployeeDetailsData {
  id: string;
  documents?: DocumentInfo[];
  selfieUrl?: string | null;
  employmentInfo?: {
    code?: string;
    joiningDate?: string;
    unit?: string;
    status?: EmployeeStatus;
    rejectReason?: string | null;
    correctionRemark?: string | null;
  };
  personalInfo?: {
    firstName?: string;
    surname?: string;
    fatherName?: string;
    husbandName?: string;
    gender?: string;
    bloodGroup?: string;
    maritalStatus?: string;
    education?: string;
    dob?: string;
    phone?: string;
  };
  identityInfo?: {
    aadhaar?: string;
    pan?: string;
    uan?: string;
    esic?: string;
    drivingLicence?: string;
  };
  addressInfo?: {
    permanent?: string;
    current?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    permanentPoliceStation?: string; 
    currentCity?: string;            
    currentState?: string;           
    currentPinCode?: string;         
  };
  bankInfo?: {
    accountHolderName?: string; 
    bankName?: string;
    accountNumber?: string;
    ifsc?: string;
    micr?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  nomineeInfo?: {         
    name?: string;
    relationship?: string;
    phone?: string;
    percentage?: number;
  };
}