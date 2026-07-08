export type EmployeeStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Employee {
  id: string;
  code: string;
  name: string;
  unit: string;
  phone: string;
  status: EmployeeStatus;
  joiningDate: string;
}

export interface EmployeeDetailsData {
  id: string;
  employmentInfo?: {
    code?: string;
    joiningDate?: string;
    unit?: string;
    status?: EmployeeStatus;
  };
  personalInfo?: {
    firstName?: string;
    surname?: string;
    fatherName?: string;
    husbandName?: string;
    gender?: string;
    bloodGroup?: string;
    dob?: string;
    phone?: string;
  };
  identityInfo?: {
    aadhaar?: string;
    pan?: string;
    uan?: string;
    esic?: string;
  };
  addressInfo?: {
    permanent?: string;
    current?: string;
    city?: string;
    state?: string;
    pinCode?: string;
  };
  bankInfo?: {
    bankName?: string;
    accountNumber?: string;
    ifsc?: string;
    branch?: string;
    micr?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
}