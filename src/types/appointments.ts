export type AppointmentStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "completed"
  | "cancelled";

export type Appointment = {
  id: string;
  fullName: string;
  phone: string | null;
  projectType: string;
  preferredDate: string;
  preferredTime: string;
  note: string | null;
  status: AppointmentStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
};

export type AppointmentRequest = {
  fullName: string;
  phone?: string;
  projectType: string;
  preferredDate: string;
  preferredTime: string;
  note?: string;
  website?: string;
};

export type AppointmentCreateResult = {
  status: "received";
};
