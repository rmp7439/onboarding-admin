export const mockEmployee = {
  employmentInfo: {
    code: "Pending Assignment",
    joiningDate: "2023-11-15",
    unit: "Engineering",
    status: "PENDING"
  },
  personalInfo: {
    firstName: "Sarah",
    surname: "Jenkins",
    fatherName: "Robert Jenkins",
    husbandName: "N/A",
    gender: "Female",
    bloodGroup: "O+",
    dob: "1992-05-14",
    phone: "+1 555-0123"
  },
  identityInfo: {
    aadhaar: "[Aadhaar Redacted]",
    pan: "ABCDE1234F",
    uan: "100987654321",
    esic: "2001234567"
  },
  addressInfo: {
    permanent: "123 Elm Street, Maplewood District",
    current: "456 Oak Lane, Apt 4B, Tech Park Area",
    city: "Metropolis",
    state: "Stateville",
    pinCode: "543210"
  },
  bankInfo: {
    bankName: "Global Horizon Bank",
    accountNumber: "XXXXXXXX4321",
    ifsc: "GHB0001234",
    branch: "Central Metropolis",
    micr: "123456789"
  },
  emergencyContact: {
    name: "James Jenkins",
    relationship: "Brother",
    phone: "+1 555-0987"
  }
};

export const requiredDocs = [
  "Aadhaar Card",
  "PAN Card",
  "Driving Licence",
  "Bank Passbook / Cancelled Cheque",
  "Education Proof",
  "Voter ID"
];

export const optionalDocs = ["Discharge Book"];