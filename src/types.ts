export type AttendanceStatus = 'P' | 'A' | 'L'; // P = Present (હાજર), A = Absent (ગેરહાજર), L = Leave (રજા)

export interface Student {
  id: string;
  rollNo: number;
  grNo: string;
  name: string; // Gujarati full name
  englishName: string;
  gender: 'male' | 'female'; // કુમાર / કન્યા
  avatarId: string; // avatar style identifier or color
  photoUrl?: string; // custom uploaded photo or data URL
  dob?: string;
  parentPhone?: string;
  address?: string;
}

export interface DailyAttendanceRecord {
  [studentId: string]: AttendanceStatus;
}

export interface AttendanceDatabase {
  [dateIso: string]: DailyAttendanceRecord;
}

export interface SchoolInfo {
  name: string;
  taluka: string;
  district: string;
  diseCode: string;
  standard: string;
  division: string;
  academicYear: string;
  teacherName: string;
}
