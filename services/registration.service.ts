import "server-only";
import { connectToDatabase } from "@/lib/mongodb";
import { Course, Student } from "@/models";
import {
  createCertificateForRegistration,
  getCertificateCompanyView,
  getPublicCertificateView,
  type CertificateView,
} from "@/services/certificate.service";
import { isValidEmail, isValidPhone } from "@/lib/validators";
import type { CertificateCompanyPreview } from "@/components/certificates/preview-types";
import { CERTIFICATE_TYPES, GENDERS } from "@/components/certificates/preview-types";

const PHOTO_PATTERN = /^data:image\/(png|jpeg|jpg|webp);base64,/i;

export interface StudentRegistrationInput {
  name: string;
  fatherName?: string;
  motherName?: string;
  gender?: string;
  dateOfBirth?: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  photo?: string;
  certificateType: string;
  courseId: string;
  technology?: string;
  projectName?: string;
  trainerName?: string;
  duration: string;
  startDate: string;
  endDate: string;
}

export interface RegistrationResult {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  student?: { id: string; name: string; email: string; phone: string };
  certificate?: CertificateView;
}

interface ValidationState {
  errors: Record<string, string>;
}

function validatePersonal(input: StudentRegistrationInput, state: ValidationState): void {
  const { errors } = state;

  if (!input.name?.trim() || input.name.trim().length < 2) {
    errors.name = "Full name is required (min 2 characters).";
  }
  if (!input.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(input.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!input.phone?.trim()) {
    errors.phone = "Mobile number is required.";
  } else if (!isValidPhone(input.phone.trim())) {
    errors.phone = "Please enter a valid mobile number.";
  }
  if (input.gender && !(GENDERS as readonly string[]).includes(input.gender)) {
    errors.gender = "Please select a valid gender.";
  }
  if (input.dateOfBirth) {
    const dob = new Date(input.dateOfBirth);
    if (Number.isNaN(dob.getTime())) {
      errors.dateOfBirth = "Please enter a valid date of birth.";
    } else if (dob.getTime() > Date.now()) {
      errors.dateOfBirth = "Date of birth cannot be in the future.";
    }
  }
  if (input.pincode && !/^[0-9]{6}$/.test(input.pincode.trim())) {
    errors.pincode = "Pincode must be a valid 6-digit code.";
  }
  if (input.photo && !PHOTO_PATTERN.test(input.photo.trim())) {
    errors.photo = "Photo must be a PNG, JPG or WebP image.";
  } else if (input.photo && input.photo.length > 2_000_000) {
    errors.photo = "Photo file is too large. Please upload a smaller image.";
  }
}

function validateTraining(input: StudentRegistrationInput, state: ValidationState): void {
  const { errors } = state;

  if (!(CERTIFICATE_TYPES as readonly string[]).includes(input.certificateType)) {
    errors.certificateType = "Please select a valid certificate type.";
  }
  if (!input.courseId) {
    errors.courseId = "Please select a course.";
  }
  if (!input.duration?.trim()) {
    errors.duration = "Duration is required.";
  }
  if (!input.startDate) {
    errors.startDate = "Start date is required.";
  }
  if (!input.endDate) {
    errors.endDate = "End date is required.";
  } else if (input.startDate) {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      errors.endDate = "Please enter valid dates.";
    } else if (end < start) {
      errors.endDate = "End date cannot be before the start date.";
    }
  }
}

export async function registerStudent(input: StudentRegistrationInput): Promise<RegistrationResult> {
  await connectToDatabase();

  const state: ValidationState = { errors: {} };
  validatePersonal(input, state);
  validateTraining(input, state);

  if (Object.keys(state.errors).length > 0) {
    return { ok: false, fieldErrors: state.errors };
  }

  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim().replace(/[\s()-]/g, "");

  const [emailTaken, phoneTaken, course] = await Promise.all([
    Student.exists({ email }),
    Student.exists({ phone }),
    Course.findById(input.courseId).lean(),
  ]);

  if (emailTaken) {
    return { ok: false, fieldErrors: { email: "This email is already registered." } };
  }
  if (phoneTaken) {
    return { ok: false, fieldErrors: { phone: "This mobile number is already registered." } };
  }
  if (!course) {
    return { ok: false, fieldErrors: { courseId: "Selected course does not exist." } };
  }

  const student = await Student.create({
    name: input.name.trim(),
    fatherName: input.fatherName?.trim() || undefined,
    motherName: input.motherName?.trim() || undefined,
    gender: input.gender || undefined,
    dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
    email,
    phone,
    address: input.address?.trim() || undefined,
    city: input.city?.trim() || undefined,
    state: input.state?.trim() || undefined,
    pincode: input.pincode?.trim() || undefined,
    photo: input.photo?.trim() || undefined,
    course: input.courseId,
    status: "active",
  } as unknown as Parameters<typeof Student.create>[0]);

  const certificate = await createCertificateForRegistration({
    studentId: String(student._id),
    courseId: input.courseId,
    fatherName: input.fatherName?.trim() || undefined,
    technology: input.technology?.trim() || undefined,
    projectName: input.projectName?.trim() || undefined,
    trainerName: input.trainerName?.trim() || undefined,
    type: input.certificateType as "training" | "internship" | "experience" | "appreciation",
    issueDate: new Date(),
    startDate: new Date(input.startDate),
    endDate: new Date(input.endDate),
    duration: input.duration.trim(),
  });

  return {
    ok: true,
    student: { id: String(student._id), name: student.name, email, phone },
    certificate,
  };
}

export interface RegistrationLookup {
  certificate: CertificateView;
  student: { name: string; fatherName?: string; email: string; phone: string };
}

export async function getRegistrationByReference(
  reference: string
): Promise<RegistrationLookup | null> {
  await connectToDatabase();
  const certificate = await getPublicCertificateView(reference);
  if (!certificate) return null;

  const student = await Student.findById(certificate.studentId)
    .select("name fatherName email phone")
    .lean();
  if (!student) return null;

  return {
    certificate,
    student: {
      name: student.name,
      fatherName: student.fatherName,
      email: student.email,
      phone: student.phone,
    },
  };
}

export interface ReceiptLookupData {
  company: CertificateCompanyPreview;
  student: {
    name: string;
    fatherName?: string;
    email: string;
    phone: string;
    courseTitle: string;
    technology?: string;
    certificateType: string;
    duration: string;
    startDate: Date;
    endDate: Date;
    issueDate: Date;
    certificateNo: string;
    referenceNo: string;
  };
}

export async function getReceiptData(reference: string): Promise<ReceiptLookupData | null> {
  const lookup = await getRegistrationByReference(reference);
  if (!lookup) return null;

  const [company, course] = await Promise.all([
    getCertificateCompanyView(),
    Course.findById(lookup.certificate.courseId).select("title").lean(),
  ]);

  return {
    company: {
      name: company.name,
      tagline: company.tagline,
      logo: company.logo,
      email: company.email,
      website: company.website,
      addressLines: company.addressLines,
      msmeNumber: company.msmeNumber,
    },
    student: {
      name: lookup.student.name,
      fatherName: lookup.student.fatherName,
      email: lookup.student.email,
      phone: lookup.student.phone,
      courseTitle: (course as { title?: string } | null)?.title ?? "",
      technology: lookup.certificate.technology,
      certificateType: lookup.certificate.type,
      duration: lookup.certificate.duration,
      startDate: new Date(lookup.certificate.startDate),
      endDate: new Date(lookup.certificate.endDate),
      issueDate: new Date(lookup.certificate.issueDate),
      certificateNo: lookup.certificate.certificateNo,
      referenceNo: lookup.certificate.referenceNo,
    },
  };
}
