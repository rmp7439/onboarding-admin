import { apiClient } from "../api/axios";
import {
  type EmployeeStatus,
  type Employee,
  type EmployeeDetailsData,
} from "../types/employee";

export const getEmployees = async (search?: string): Promise<Employee[]> => {
  const params = search ? { search } : undefined;
  const { data } = await apiClient.get("/employees", { params });
  return data.data.map((emp: any) => ({
    id: emp.id,
    code: emp.employeeCode || "Pending Assignment",
    name: `${emp.firstName} ${emp.surname}`,
    unit: emp.unit, // Replaced 'N/A' placeholder mapping
    phone: emp.mobile,
    status: emp.status,
    rejectReason: emp.rejectReason,
    correctionRemark: emp.correctionRemark,
    joiningDate: new Date(emp.joiningDate).toISOString().split("T")[0],
  }));
};

export const getEmployeeById = async (
  id: string,
): Promise<EmployeeDetailsData> => {
  const { data } = await apiClient.get(`/employee/${id}`);
  const emp = data.data;

  return {
    id: emp.id,
    selfieUrl: emp.selfieUrl,
    employmentInfo: {
      code: emp.employeeCode || "Pending Assignment",
      joiningDate: new Date(emp.joiningDate).toISOString().split("T")[0],
      unit: emp.unit, // Replaced 'N/A' placeholder mapping
      status: emp.status,
      rejectReason: emp.rejectReason,
      correctionRemark: emp.correctionRemark,
    },
    personalInfo: {
      firstName: emp.firstName,
      surname: emp.surname,
      fatherName: emp.fatherName,
      husbandName: emp.husbandName,
      gender: emp.gender,
      bloodGroup: emp.bloodGroup,
      maritalStatus: emp.maritalStatus ? emp.maritalStatus.charAt(0).toUpperCase() + emp.maritalStatus.slice(1).toLowerCase() : "",
      education: emp.education ? emp.education.replace(/_/g, ' ').replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) : "",
      dob: new Date(emp.dateOfBirth).toISOString().split("T")[0],
      phone: emp.mobile,
    },
    identityInfo: {
      aadhaar: emp.aadhaar,
      pan: emp.pan,
      uan: emp.uan,
      esic: emp.esic,
      drivingLicence: emp.drivingLicence,
    },
    addressInfo: {
      permanent: emp.permanentAddress,
      current: emp.currentAddress,
      city: emp.city,
      state: emp.state,
      pinCode: emp.pinCode,
    },
    bankInfo: {
      bankName: emp.bankName,
      accountNumber: emp.accountNumber,
      ifsc: emp.ifsc,
      branch: emp.branch,
      micr: emp.micr,
    },
    emergencyContact: {
      name: emp.emergencyName,
      relationship: emp.emergencyRelation,
      phone: emp.emergencyPhone,
    },
    documents:
      emp.documents?.map((doc: any) => ({
        id: doc.id,
        type: doc.type,
        originalFilename: doc.originalFilename,
      })) || [],
  };
};

export const updateEmployeeStatus = async ({
  id,
  status,
  rejectReason
}: {
  id: string;
  status: EmployeeStatus;
  rejectReason?: string;
}) => {
  const { data } = await apiClient.patch("/employee/status", { id, status, rejectReason});
  return data.data;
};

export const assignEmployeeCode = async ({
  id,
  employeeCode,
}: {
  id: string;
  employeeCode: string;
}) => {
  const { data } = await apiClient.patch("/employee/code", {
    id,
    employeeCode,
  });
  return data.data;
};

export const returnEmployeeForCorrection = async ({
  id,
  remark,
}: {
  id: string;
  remark: string;
}) => {
  const { data } = await apiClient.patch(`/employee/${id}/return`, {
    remark,
  });
  return data.data;
};