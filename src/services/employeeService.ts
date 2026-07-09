import { apiClient } from "../api/axios";
import {
  type EmployeeStatus,
  type Employee,
  type EmployeeDetailsData,
} from "../types/employee";

export const getEmployees = async (): Promise<Employee[]> => {
  const { data } = await apiClient.get("/employees");
  return data.data.map((emp: any) => ({
    id: emp.id,
    code: emp.employeeCode || "Pending Assignment",
    name: `${emp.firstName} ${emp.surname}`,
    unit: "N/A",
    phone: emp.mobile,
    status: emp.status,
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
    employmentInfo: {
      code: emp.employeeCode || "Pending Assignment",
      joiningDate: new Date(emp.joiningDate).toISOString().split("T")[0],
      unit: "N/A",
      status: emp.status,
    },
    personalInfo: {
      firstName: emp.firstName,
      surname: emp.surname,
      fatherName: emp.fatherName,
      husbandName: emp.husbandName,
      gender: emp.gender,
      bloodGroup: emp.bloodGroup,
      dob: new Date(emp.dateOfBirth).toISOString().split("T")[0],
      phone: emp.mobile,
    },
    identityInfo: {
      aadhaar: emp.aadhaar,
      pan: emp.pan,
      uan: emp.uan,
      esic: emp.esic,
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
    selfieFilename: emp.selfieFilename,
  };
};

export const updateEmployeeStatus = async ({
  id,
  status,
}: {
  id: string;
  status: EmployeeStatus;
}) => {
  const { data } = await apiClient.patch("/employee/status", { id, status });
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