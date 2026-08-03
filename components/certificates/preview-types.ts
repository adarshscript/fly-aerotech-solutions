export interface CertificateCompanyPreview {
  name: string;
  tagline: string;
  logo: string;
  email: string;
  website: string;
  addressLines: string[];
  msmeNumber: string;
}

export interface CertificateSignaturePreview {
  name: string;
  title: string;
  imageUrl?: string;
}

export interface CertificateStampPreview {
  enabled: boolean;
  imageUrl?: string;
}

export interface CertificatePreviewData {
  studentName: string;
  fatherName?: string;
  courseTitle: string;
  technology?: string;
  type: string;
  duration: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  referenceNo: string;
  certificateNo: string;
  qrImageUrl?: string;
  company: CertificateCompanyPreview;
  authorizedSignature: CertificateSignaturePreview;
  officialStamp: CertificateStampPreview;
}

export const CERTIFICATE_TYPE_LABELS: Record<string, string> = {
  training: "Training",
  internship: "Internship",
  experience: "Experience",
  appreciation: "Appreciation",
};

export const CERTIFICATE_TEMPLATES = ["classic", "modern", "minimal"] as const;

export const CERTIFICATE_TYPES = ["training", "internship", "experience", "appreciation"] as const;

export const GENDERS = ["male", "female", "other"] as const;

export const STUDENT_STATUSES = ["pending", "active", "completed", "dropped"] as const;

export const LOGO_PLACEHOLDER = "/certificate/logo-placeholder.svg";
export const SIGNATURE_PLACEHOLDER = "/assets/signature.png";
export const STAMP_PLACEHOLDER = "/assets/stamp.png";
export const QR_PLACEHOLDER = "/certificate/qr-placeholder.svg";

export const CERTIFICATE_LOCATION = "Vadodara, Gujarat, India";

export function formatCertificateDate(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

interface PreviewCertificateSource {
  referenceNo?: string;
  certificateNo?: string;
  studentName?: string;
  fatherName?: string;
  type: string;
  courseTitle?: string;
  technology?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  issueDate?: string;
  qrImageUrl?: string;
  logo?: string;
  authorizedSignature?: { name?: string; title?: string; imageUrl?: string };
  officialStamp?: { enabled?: boolean; imageUrl?: string };
}

export function buildCertificatePreviewData(
  certificate: PreviewCertificateSource,
  company: CertificateCompanyPreview
): CertificatePreviewData {
  return {
    studentName: certificate.studentName ?? "",
    fatherName: certificate.fatherName,
    courseTitle: certificate.courseTitle ?? "",
    technology: certificate.technology,
    type: certificate.type,
    duration: certificate.duration ?? "",
    startDate: certificate.startDate ?? "",
    endDate: certificate.endDate ?? "",
    issueDate: certificate.issueDate ?? "",
    referenceNo: certificate.referenceNo ?? "",
    certificateNo: certificate.certificateNo ?? "",
    qrImageUrl: certificate.qrImageUrl,
    company: {
      ...company,
      logo: certificate.logo || company.logo,
    },
    authorizedSignature: {
      name: certificate.authorizedSignature?.name ?? "",
      title: certificate.authorizedSignature?.title ?? "",
      imageUrl: certificate.authorizedSignature?.imageUrl,
    },
    officialStamp: {
      enabled: certificate.officialStamp?.enabled ?? false,
      imageUrl: certificate.officialStamp?.imageUrl,
    },
  };
}
