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

export const mockUnits = ["Engineering", "Sales", "Marketing", "HR", "Finance"];

export const mockEmployees: Employee[] = [
  { id: "1", code: "EMP-1001", name: "Alice Johnson", unit: "Engineering", phone: "+1 555-0101", status: "APPROVED", joiningDate: "2023-01-10" },
  { id: "2", code: "EMP-1002", name: "Bob Smith", unit: "Sales", phone: "+1 555-0102", status: "PENDING", joiningDate: "2023-02-15" },
  { id: "3", code: "EMP-1003", name: "Charlie Davis", unit: "Marketing", phone: "+1 555-0103", status: "REJECTED", joiningDate: "2023-03-20" },
  { id: "4", code: "EMP-1004", name: "Diana Prince", unit: "HR", phone: "+1 555-0104", status: "APPROVED", joiningDate: "2023-04-05" },
  { id: "5", code: "EMP-1005", name: "Ethan Hunt", unit: "Finance", phone: "+1 555-0105", status: "PENDING", joiningDate: "2023-05-12" },
  { id: "6", code: "EMP-1006", name: "Fiona Gallagher", unit: "Engineering", phone: "+1 555-0106", status: "APPROVED", joiningDate: "2023-06-18" },
  { id: "7", code: "EMP-1007", name: "George Miller", unit: "Sales", phone: "+1 555-0107", status: "APPROVED", joiningDate: "2023-07-22" },
  { id: "8", code: "EMP-1008", name: "Hannah Abbott", unit: "Marketing", phone: "+1 555-0108", status: "PENDING", joiningDate: "2023-08-30" },
  { id: "9", code: "EMP-1009", name: "Ian Wright", unit: "HR", phone: "+1 555-0109", status: "REJECTED", joiningDate: "2023-09-14" },
  { id: "10", code: "EMP-1010", name: "Julia Roberts", unit: "Finance", phone: "+1 555-0110", status: "APPROVED", joiningDate: "2023-10-01" },
  { id: "11", code: "EMP-1011", name: "Kevin Hart", unit: "Engineering", phone: "+1 555-0111", status: "PENDING", joiningDate: "2023-10-05" },
  { id: "12", code: "EMP-1012", name: "Laura Croft", unit: "Sales", phone: "+1 555-0112", status: "APPROVED", joiningDate: "2023-10-10" },
  { id: "13", code: "EMP-1013", name: "Michael Scott", unit: "HR", phone: "+1 555-0113", status: "PENDING", joiningDate: "2023-10-15" },
  { id: "14", code: "EMP-1014", name: "Nina Dobrev", unit: "Marketing", phone: "+1 555-0114", status: "APPROVED", joiningDate: "2023-10-18" },
  { id: "15", code: "EMP-1015", name: "Oscar Isaac", unit: "Finance", phone: "+1 555-0115", status: "REJECTED", joiningDate: "2023-10-20" },
  { id: "16", code: "EMP-1016", name: "Paul Rudd", unit: "Engineering", phone: "+1 555-0116", status: "APPROVED", joiningDate: "2023-10-22" },
  { id: "17", code: "EMP-1017", name: "Quinn Fabray", unit: "Sales", phone: "+1 555-0117", status: "PENDING", joiningDate: "2023-10-25" },
  { id: "18", code: "EMP-1018", name: "Rachel Green", unit: "Marketing", phone: "+1 555-0118", status: "APPROVED", joiningDate: "2023-10-28" },
  { id: "19", code: "EMP-1019", name: "Steve Rogers", unit: "HR", phone: "+1 555-0119", status: "PENDING", joiningDate: "2023-11-01" },
  { id: "20", code: "EMP-1020", name: "Tony Stark", unit: "Engineering", phone: "+1 555-0120", status: "APPROVED", joiningDate: "2023-11-05" },
];