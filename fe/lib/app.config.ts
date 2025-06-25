export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: UNSPLASH_ACCESS_KEY,
} = process.env;

export const Endpoints = {
  APPOINTMENT: `${ENDPOINT}/api/appointment`,
  DOCTORS: `${ENDPOINT}/api/doctors`,
  LABORATORY_TEST: `${ENDPOINT}/api/laboratorytest`,
  MEDICAL_HISTORY: `${ENDPOINT}/api/medicalhistory`,
};
