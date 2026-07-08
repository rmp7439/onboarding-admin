export const statsData = [
  { title: "Total Employees", value: "128", description: "Across all active units" },
  { title: "Pending Approvals", value: "17", description: "Awaiting HR review" },
  { title: "Approved Employees", value: "101", description: "Successfully onboarded" },
  { title: "Rejected Employees", value: "10", description: "Did not meet requirements" },
];

export type EmployeeStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Employee {
  code: string;
  name: string;
  unit: string;
  phone: string;
  status: EmployeeStatus;
  joiningDate: string;
}

export const recentEmployees: Employee[] = [
  { code: "EMP-1042", name: "Sarah Jenkins", unit: "Engineering", phone: "+1 555-0123", status: "APPROVED", joiningDate: "2023-10-15" },
  { code: "EMP-1043", name: "Michael Chen", unit: "Marketing", phone: "+1 555-0124", status: "PENDING", joiningDate: "2023-10-18" },
  { code: "EMP-1044", name: "Emily Rodriguez", unit: "Sales", phone: "+1 555-0125", status: "APPROVED", joiningDate: "2023-10-20" },
  { code: "EMP-1045", name: "David Kim", unit: "Product", phone: "+1 555-0126", status: "REJECTED", joiningDate: "2023-10-21" },
  { code: "EMP-1046", name: "Jessica Taylor", unit: "Engineering", phone: "+1 555-0127", status: "PENDING", joiningDate: "2023-10-22" },
  { code: "EMP-1047", name: "Robert Wilson", unit: "Finance", phone: "+1 555-0128", status: "APPROVED", joiningDate: "2023-10-23" },
  { code: "EMP-1048", name: "Amanda Martinez", unit: "Operations", phone: "+1 555-0129", status: "PENDING", joiningDate: "2023-10-24" },
  { code: "EMP-1049", name: "James Anderson", unit: "Sales", phone: "+1 555-0130", status: "APPROVED", joiningDate: "2023-10-25" },
];