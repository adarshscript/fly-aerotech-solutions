import { connectToDatabase } from "@/lib/mongodb";
import { Student, type IStudent } from "@/models";

type StudentInput = Omit<IStudent, "createdAt" | "updatedAt">;
type StudentUpdate = Partial<StudentInput>;

export async function listStudents(): Promise<IStudent[]> {
  await connectToDatabase();
  return Student.find().sort({ createdAt: -1 }).lean();
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
