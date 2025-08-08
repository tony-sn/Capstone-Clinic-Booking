export const GenderOptions = ["Male", "Female", "Other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
export const publicNav = [
  "Home",
  "Benefits",
  "Process",
  "Testimonials",
  "Services",
  "FAQ",
];

export const privateNav = [
  "Lab Tests",
  "Test Reports",
  "Med History",
  "Prescriptions",
  "Medicines",
];

export const userItems = [
  {
    parent: "Appointments",
    children: [
      {
        label: "Appointments",
        href: "/appointments",
        desc: "List of appointments",
      },
    ],
  },
];

export const navigationItems = [
  {
    parent: "Reports",
    children: [
      {
        label: "Lab Tests",
        href: "/laboratory-tests",
        desc: "Show all laboratory tests",
      },
      {
        label: "Lab Test Reports",
        href: "/laboratory-test-reports",
        desc: "Show all laboratory test reports",
      },
      {
        label: "Revenue",
        href: "/revenue-report",
        desc: "View clinic revenue",
      },
      {
        label: "Medical History",
        href: "/medical-histories",
        desc: "View medical histories",
      },
    ],
  },
  {
    parent: "Medicines",
    children: [
      {
        label: "Medicines",
        href: "/medicines",
        desc: "List of medicines",
      },
      {
        label: "Prescriptions",
        href: "/prescriptions",
        desc: "List of prescriptions at the clinic",
      },
      {
        label: "Medicine Inventory",
        href: "/medicine-inventory-entries",
        desc: "List of medicine inventory entries",
      },
    ],
  },
  {
    parent: "Users",
    children: [
      {
        label: "Admin",
        href: "/admin",
        desc: "Admin dashboard",
      },
      {
        label: "Appointments",
        href: "/appointments",
        desc: "List of appointments",
      },
      {
        label: "Doctors",
        href: "/doctors",
        desc: "List of doctors",
      },
      {
        label: "Patients",
        href: "/patients",
        desc: "List of patients",
      },
      ,
    ],
  },
];

export const SESSION_COOKIE_NAME = ".AspNetCore.Identity.Application";
export const ROLE = "ROLE";
