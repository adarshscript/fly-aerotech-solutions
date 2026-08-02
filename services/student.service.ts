import { connectToDatabase } from "@/lib/mongodb";
import { Certificate, Course, Student, type IStudent } from "@/models";

type StudentInput = Omit<IStudent, "createdAt" | "updatedAt">;
type StudentUpdate = Omit<Partial<StudentInput>, "course"> & { course?: string };

export async function listStudents(): Promise<IStudent[]> {
  await connectToDatabase();
  return Student.find().sort({ createdAt: -1 }).lean();
}

export async function listActiveStudents(): Promise<IStudent[]> {
  await connectToDatabase();
  return Student.find({ status: { $in: ["active", "completed"] } }).sort({ name: 1 }).lean();
}

export async function getStudentByReference(referenceNo: string): Promise<IStudent | null> {
  await connectToDatabase();
  return Student.findOne({ referenceNo }).lean();
}

export async function getStudentById(id: string): Promise<IStudent | null> {
  await connectToDatabase();
  return Student.findById(id).lean();
}

export async function createStudent(data: StudentInput): Promise<IStudent> {
  await connectToDatabase();
  return Student.create(data);
}

export async function updateStudent(id: string, data: StudentUpdate): Promise<IStudent | null> {
  await connectToDatabase();
  return Student.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteStudent(id: string): Promise<IStudent | null> {
  await connectToDatabase();
  return Student.findByIdAndDelete(id).lean();
}

export async function studentExistsByEmail(email: string): Promise<boolean> {
  await connectToDatabase();
  const normalized = email.trim().toLowerCase();
  return (await Student.exists({ email: normalized })) !== null;
}

export async function studentExistsByPhone(phone: string): Promise<boolean> {
  await connectToDatabase();
  const normalized = phone.replace(/[\s()-]/g, "");
  return (await Student.exists({ phone: normalized })) !== null;
}

export interface StudentCertificateInfo {
  id: string;
  certificateNo: string;
  referenceNo: string;
  status: string;
  isVerified: boolean;
}

export interface StudentAdminView {
  id: string;
  name: string;
  fatherName?: string;
  motherName?: string;
  gender?: string;
  dateOfBirth?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  photo?: string;
  courseId: string;
  courseTitle: string;
  status: string;
  referenceNo: string;
  enrollmentDate: string;
  createdAt: string;
  updatedAt?: string;
  certificate?: StudentCertificateInfo | null;
}

export interface StudentListResult {
  students: StudentAdminView[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function listStudentsAdmin(input: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<StudentListResult> {
  await connectToDatabase();

  const page = Math.max(1, input.page ?? 1);
  const limit = Math.min(50, Math.max(1, input.limit ?? 10));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (input.status && input.status !== "all") {
    filter.status = input.status;
  }
  if (input.search?.trim()) {
    const q = { $regex: escapeRegex(input.search.trim()), $options: "i" };
    const matchingCertificates = await Certificate.find({
      $or: [{ referenceNo: q }, { certificateNo: q }],
    })
      .select("student")
      .lean();
    const certificateStudentIds = matchingCertificates.map((doc) => String(doc.student));
    const orClauses: Record<string, unknown>[] = [
      { name: q },
      { email: q },
      { phone: q },
      { referenceNo: q },
      { city: q },
    ];
    if (certificateStudentIds.length > 0) {
      orClauses.push({ _id: { $in: certificateStudentIds } });
    }
    filter.$or = orClauses;
  }

  const [docs, total] = await Promise.all([
    Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Student.countDocuments(filter),
  ]);

  const studentIds = docs.map((doc) => String(doc._id));
  const certificates = await Certificate.find({
    student: { $in: studentIds },
  } as unknown as Parameters<typeof Certificate.find>[0])
    .select("student certificateNo referenceNo status isVerified")
    .lean();
  const certificateByStudent = new Map(
    certificates.map((doc) => [String(doc.student), doc])
  );

  const courseIds = [...new Set(docs.map((doc) => String(doc.course)))];
  const courses = await Course.find({ _id: { $in: courseIds } }).select("title").lean();
  const courseById = new Map(courses.map((doc) => [String(doc._id), doc.title]));

  return {
    students: docs.map((doc) => {
      const certificate = certificateByStudent.get(String(doc._id));
      const studentId = String(doc._id);
      const course = courseById.get(String(doc.course));
      return {
        id: studentId,
        name: doc.name,
        fatherName: doc.fatherName,
        motherName: doc.motherName,
        gender: doc.gender,
        dateOfBirth: doc.dateOfBirth ? new Date(doc.dateOfBirth).toISOString() : undefined,
        email: doc.email,
        phone: doc.phone,
        address: doc.address,
        city: doc.city,
        state: doc.state,
        pincode: doc.pincode,
        photo: doc.photo,
        courseId: String(doc.course),
        courseTitle: course ?? "",
        status: doc.status,
        referenceNo: doc.referenceNo,
        enrollmentDate: doc.enrollmentDate ? new Date(doc.enrollmentDate).toISOString() : "",
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
        certificate: certificate
          ? {
              id: String(certificate._id),
              certificateNo: certificate.certificateNo,
              referenceNo: certificate.referenceNo,
              status: certificate.status,
              isVerified: certificate.isVerified,
            }
          : null,
      };
    }),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    limit,
  };
}

export async function getStudentAdminViewById(id: string): Promise<StudentAdminView | null> {
  await connectToDatabase();
  const doc = await Student.findById(id).lean();
  if (!doc) return null;

  const [certificate, course] = await Promise.all([
    Certificate.findOne({
      student: String(doc._id),
    } as unknown as Parameters<typeof Certificate.findOne>[0]).lean(),
    Course.findById(doc.course).select("title").lean(),
  ]);

  const studentId = String(doc._id);
  return {
    id: studentId,
    name: doc.name,
    fatherName: doc.fatherName,
    motherName: doc.motherName,
    gender: doc.gender,
    dateOfBirth: doc.dateOfBirth ? new Date(doc.dateOfBirth).toISOString() : undefined,
    email: doc.email,
    phone: doc.phone,
    address: doc.address,
    city: doc.city,
    state: doc.state,
    pincode: doc.pincode,
    photo: doc.photo,
    courseId: String(doc.course),
    courseTitle: (course as { title?: string } | null)?.title ?? "",
    status: doc.status,
    referenceNo: doc.referenceNo,
    enrollmentDate: doc.enrollmentDate ? new Date(doc.enrollmentDate).toISOString() : "",
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
    certificate: certificate
      ? {
          id: String(certificate._id),
          certificateNo: certificate.certificateNo,
          referenceNo: certificate.referenceNo,
          status: certificate.status,
          isVerified: certificate.isVerified,
        }
      : null,
  };
}
