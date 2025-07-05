export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: UNSPLASH_ACCESS_KEY,
} = process.env;

export const Endpoints = {
  APPOINTMENT: `${ENDPOINT}/api/Appointment`,
  DOCTORS: `${ENDPOINT}/api/Doctors`,
  LABORATORY_TEST: `${ENDPOINT}/api/LaboratoryTest`,
  MEDICAL_HISTORY: `${ENDPOINT}/api/MedicalHistory`,
  MEDICINE: `${ENDPOINT}/api/Medicine`,
  MEDICINE_INVENTORY_ENTRY: `${ENDPOINT}/api/MedicineInventoryEntry`,
  PRESCRIPTION: `${ENDPOINT}/api/Prescription`,
  USERS: `${ENDPOINT}/api/Admin/users-with-roles`,
  LABORATORY_TEST_REPORT: `${ENDPOINT}/api/LaboratoryTestReport`,
  REGISTER: `${ENDPOINT}/api/register`,
};
