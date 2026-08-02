import { connectToDatabase } from "@/lib/mongodb";
import { Blog, type IBlog } from "@/models";

type BlogInput = Omit<IBlog, "createdAt" | "updatedAt">;
type BlogUpdate = Partial<BlogInput>;

export async function listPublishedBlogs(): Promise<IBlog[]> {
  await connectToDatabase();
  return Blog.find({ status: "published" }).sort({ publishedAt: -1 }).lean();
}

export async function getAllBlogs(): Promise<IBlog[]> {
  await connectToDatabase();
  return Blog.find().sort({ createdAt: -1 }).lean();
}

export async function getBlogBySlug(slug: string): Promise<IBlog | null> {
  await connectToDatabase();
  return Blog.findOne({ slug, status: "published" }).lean();
}

export async function incrementBlogViews(id: string): Promise<void> {
  await connectToDatabase();
  await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } });
}

export async function createBlog(data: BlogInput): Promise<IBlog> {
  await connectToDatabase();
  return Blog.create(data);
}

export async function updateBlog(id: string, data: BlogUpdate): Promise<IBlog | null> {
  await connectToDatabase();
  return Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteBlog(id: string): Promise<IBlog | null> {
  await connectToDatabase();
  return Blog.findByIdAndDelete(id).lean();
}
