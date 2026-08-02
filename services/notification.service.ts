import { connectToDatabase } from "@/lib/mongodb";
import { Notification, type INotification } from "@/models";

type NotificationInput = Omit<INotification, "createdAt" | "updatedAt">;
type NotificationUpdate = Partial<NotificationInput>;

export async function listActiveNotifications(): Promise<INotification[]> {
  await connectToDatabase();
  return Notification.find({ isActive: true }).sort({ createdAt: -1 }).limit(50).lean();
}

export async function getAllNotifications(): Promise<INotification[]> {
  await connectToDatabase();
  return Notification.find().sort({ createdAt: -1 }).limit(200).lean();
}

export async function createNotification(data: NotificationInput): Promise<INotification> {
  await connectToDatabase();
  return Notification.create(data);
}

export async function markNotificationAsRead(id: string, userId: string): Promise<INotification | null> {
  await connectToDatabase();
  return Notification.findByIdAndUpdate(
    id,
    { $addToSet: { readBy: userId as never } },
    { new: true }
  ).lean();
}

export async function deleteNotification(id: string): Promise<INotification | null> {
  await connectToDatabase();
  return Notification.findByIdAndDelete(id).lean();
}
