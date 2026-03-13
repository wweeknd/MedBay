// ==================== USER TYPES ====================
export type UserRole = 'patient' | 'doctor';

export interface UserBase {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== PATIENT TYPES ====================
export interface PatientProfile extends UserBase {
  role: 'patient';
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  bloodGroup: string;
  phone: string;
  address: string;
  emergencyContacts: EmergencyContact[];
  allergies: string[];
  chronicConditions: string[];
  currentMedications: Medication[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes: string;
  effectiveness?: 'very-effective' | 'effective' | 'somewhat-effective' | 'not-effective';
  sideEffects?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  type: 'prescription' | 'lab-report' | 'scan' | 'discharge-summary' | 'other';
  description: string;
  fileURL: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  doctor?: string;
  hospital?: string;
  tags: string[];
}

export interface MedicalHistoryEntry {
  id: string;
  patientId: string;
  date: string;
  title: string;
  description: string;
  type: 'diagnosis' | 'procedure' | 'hospitalization' | 'vaccination' | 'checkup' | 'other';
  doctor?: string;
  hospital?: string;
  attachments?: string[];
}

// ==================== DOCTOR TYPES ====================
export interface DoctorProfile extends UserBase {
  role: 'doctor';
  specialization: string;
  qualifications: string[];
  yearsOfExperience: number;
  hospital: string;
  clinicAddress: string;
  consultationFee: number;
  phone: string;
  bio: string;
  achievements: string[];
  languages: string[];
  treatmentPhilosophy?: string;
  schedule: DoctorSchedule;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
}

export interface DoctorSchedule {
  [day: string]: {
    available: boolean;
    slots: TimeSlot[];
  };
}

export interface TimeSlot {
  start: string;
  end: string;
}

// ==================== CONSULTATION TYPES ====================
export type AccessLevel = 'full' | 'limited' | 'temporary';
export type ConsultationStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  status: ConsultationStatus;
  accessLevel: AccessLevel;
  reason: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  prescription?: string;
  treatmentNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== MESSAGING TYPES ====================
export interface Message {
  id: string;
  consultationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  type: 'text' | 'file' | 'prescription';
  fileURL?: string;
  fileName?: string;
  createdAt: string;
  read: boolean;
}

export interface ChatThread {
  id: string;
  consultationId: string;
  participants: {
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
  };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

// ==================== REVIEW TYPES ====================
export interface Review {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  consultationId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ==================== EMERGENCY CARD ====================
export interface EmergencyCard {
  patientId: string;
  name: string;
  dateOfBirth: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContacts: EmergencyContact[];
  currentMedications: string[];
  shareToken: string;
}
