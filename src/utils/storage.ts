import { AttendanceDatabase, SchoolInfo, Student } from '../types';
import { DEFAULT_SCHOOL_INFO, INITIAL_STUDENTS } from '../data/initialStudents';

const STUDENTS_STORAGE_KEY = 'dhinkwa_students_v1';
const ATTENDANCE_STORAGE_KEY = 'dhinkwa_attendance_v1';
const SCHOOL_INFO_STORAGE_KEY = 'dhinkwa_school_info_v1';

export const getStoredStudents = (): Student[] => {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load students from localStorage', e);
  }
  return INITIAL_STUDENTS;
};

export const saveStudents = (students: Student[]): void => {
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students to localStorage', e);
  }
};

export const getStoredAttendance = (): AttendanceDatabase => {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load attendance from localStorage', e);
  }
  return {};
};

export const saveAttendance = (database: AttendanceDatabase): void => {
  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(database));
  } catch (e) {
    console.error('Failed to save attendance to localStorage', e);
  }
};

export const getStoredSchoolInfo = (): SchoolInfo => {
  try {
    const raw = localStorage.getItem(SCHOOL_INFO_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load school info from localStorage', e);
  }
  return DEFAULT_SCHOOL_INFO;
};

export const saveSchoolInfo = (info: SchoolInfo): void => {
  try {
    localStorage.setItem(SCHOOL_INFO_STORAGE_KEY, JSON.stringify(info));
  } catch (e) {
    console.error('Failed to save school info to localStorage', e);
  }
};

export const formatGujaratiDate = (date: Date): { formatted: string; dayName: string } => {
  const dayNames = [
    'રવિવાર',
    'સોમવાર',
    'મંગળવાર',
    'બુધવાર',
    'ગુરુવાર',
    'શુક્રવાર',
    'શનિવાર',
  ];
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return {
    formatted: `${day}/${month}/${year}`,
    dayName: dayNames[date.getDay()],
  };
};

export const getTodayDateKey = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
