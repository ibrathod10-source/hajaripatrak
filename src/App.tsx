import React, { useState, useEffect, useMemo } from 'react';
import { AttendanceDatabase, AttendanceStatus, SchoolInfo, Student } from './types';
import {
  formatGujaratiDate,
  getStoredAttendance,
  getStoredSchoolInfo,
  getStoredStudents,
  getTodayDateKey,
  saveAttendance,
  saveStudents,
} from './utils/storage';
import { INITIAL_STUDENTS } from './data/initialStudents';
import { soundFX } from './utils/audio';
import { SchoolHeader } from './components/SchoolHeader';
import { StatsBar } from './components/StatsBar';
import { AttendanceCard } from './components/AttendanceCard';
import { WhatsAppModal } from './components/WhatsAppModal';
import { RegisterTableModal } from './components/RegisterTableModal';
import { StudentListView } from './components/StudentListView';
import { StudentModal } from './components/StudentModal';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  const [schoolInfo] = useState<SchoolInfo>(getStoredSchoolInfo());
  const [students, setStudents] = useState<Student[]>(getStoredStudents());
  const [attendanceDb, setAttendanceDb] = useState<AttendanceDatabase>(getStoredAttendance());

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState<'grid' | 'register' | 'students'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'P' | 'A' | 'L' | 'male' | 'female'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('dhinkwa_sound_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  // Sync sound settings with audio utility
  useEffect(() => {
    soundFX.enabled = soundEnabled;
    try {
      localStorage.setItem('dhinkwa_sound_enabled', String(soundEnabled));
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  // Current ISO date string YYYY-MM-DD
  const currentDateKey = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [currentDate]);

  // Initialize today's attendance if empty (defaults everyone to 'P' for easy negative marking)
  useEffect(() => {
    setAttendanceDb((prevDb) => {
      if (!prevDb[currentDateKey]) {
        const initialDayRecord: { [studentId: string]: AttendanceStatus } = {};
        students.forEach((s) => {
          initialDayRecord[s.id] = 'P';
        });
        const updated = { ...prevDb, [currentDateKey]: initialDayRecord };
        saveAttendance(updated);
        return updated;
      }
      return prevDb;
    });
  }, [currentDateKey, students]);

  // Current day attendance record
  const currentAttendance = useMemo(() => {
    return attendanceDb[currentDateKey] || {};
  }, [attendanceDb, currentDateKey]);

  // Toggle single student's status on photo tap
  const handleToggleStatus = (studentId: string) => {
    const current = currentAttendance[studentId] ?? 'P';
    const next: AttendanceStatus = current === 'P' ? 'A' : current === 'A' ? 'L' : 'P';

    soundFX.playStatus(next);

    setAttendanceDb((prev) => {
      const updatedDay = { ...(prev[currentDateKey] || {}), [studentId]: next };
      const updated = { ...prev, [currentDateKey]: updatedDay };
      saveAttendance(updated);
      return updated;
    });
  };

  // Set explicit status for a student
  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    soundFX.playStatus(status);
    setAttendanceDb((prev) => {
      const updatedDay = { ...(prev[currentDateKey] || {}), [studentId]: status };
      const updated = { ...prev, [currentDateKey]: updatedDay };
      saveAttendance(updated);
      return updated;
    });
  };

  // Bulk: Mark all present
  const handleMarkAllPresent = () => {
    soundFX.playStatus('P');
    setAttendanceDb((prev) => {
      const updatedDay: { [studentId: string]: AttendanceStatus } = {};
      students.forEach((s) => {
        updatedDay[s.id] = 'P';
      });
      const updated = { ...prev, [currentDateKey]: updatedDay };
      saveAttendance(updated);
      return updated;
    });
  };

  // Bulk: Mark all absent
  const handleMarkAllAbsent = () => {
    soundFX.playStatus('A');
    setAttendanceDb((prev) => {
      const updatedDay: { [studentId: string]: AttendanceStatus } = {};
      students.forEach((s) => {
        updatedDay[s.id] = 'A';
      });
      const updated = { ...prev, [currentDateKey]: updatedDay };
      saveAttendance(updated);
      return updated;
    });
  };

  // Register cell direct update
  const handleUpdateRegister = (dateIso: string, studentId: string, status: AttendanceStatus) => {
    soundFX.playStatus(status);
    setAttendanceDb((prev) => {
      const updatedDay = { ...(prev[dateIso] || {}), [studentId]: status };
      const updated = { ...prev, [dateIso]: updatedDay };
      saveAttendance(updated);
      return updated;
    });
  };

  // Add or Edit student
  const handleSaveStudent = (savedStudent: Student) => {
    setStudents((prev) => {
      let updated: Student[];
      const exists = prev.some((s) => s.id === savedStudent.id);
      if (exists) {
        updated = prev.map((s) => (s.id === savedStudent.id ? savedStudent : s));
      } else {
        updated = [...prev, savedStudent];
      }
      // Sort by roll number
      updated.sort((a, b) => a.rollNo - b.rollNo);
      saveStudents(updated);
      return updated;
    });
  };

  // Delete student
  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => {
      const updated = prev.filter((s) => s.id !== studentId);
      saveStudents(updated);
      return updated;
    });
  };

  // Reset to default 24 students
  const handleResetDefaults = () => {
    setStudents(INITIAL_STUDENTS);
    saveStudents(INITIAL_STUDENTS);
  };

  // Export JSON backup
  const handleExportData = () => {
    const backup = {
      schoolInfo,
      students,
      attendanceDb,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dhinkwa_attendance_std6A_${currentDateKey}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (data.students && Array.isArray(data.students)) {
          setStudents(data.students);
          saveStudents(data.students);
        }
        if (data.attendanceDb) {
          setAttendanceDb(data.attendanceDb);
          saveAttendance(data.attendanceDb);
        }
        alert('ડેટા સફળતાપૂર્વક રીસ્ટોર કરવામાં આવ્યો છે!');
      } catch (err) {
        alert('ફાઇલ રીડ કરવામાં ભૂલ આવી. માન્ય JSON બેકઅપ ફાઇલ પસંદ કરો.');
      }
    };
    reader.readAsText(file);
  };

  // Filtered students for grid view
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search query match
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        s.rollNo.toString() === q ||
        s.grNo.includes(q);

      if (!matchSearch) return false;

      // Status/Gender filter
      const st = currentAttendance[s.id] ?? 'P';
      if (filterStatus === 'all') return true;
      if (filterStatus === 'P') return st === 'P';
      if (filterStatus === 'A') return st === 'A';
      if (filterStatus === 'L') return st === 'L';
      if (filterStatus === 'male') return s.gender === 'male';
      if (filterStatus === 'female') return s.gender === 'female';
      return true;
    });
  }, [students, searchQuery, filterStatus, currentAttendance]);

  const { formatted, dayName } = formatGujaratiDate(currentDate);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-blue-100">
      {/* Top Header */}
      <SchoolHeader
        schoolInfo={schoolInfo}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        activeView={activeView}
        onViewChange={setActiveView}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
        onOpenAddStudentModal={() => {
          setStudentToEdit(null);
          setIsStudentModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Instructions Banner */}
        {activeView === 'grid' && (
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-700/60 rounded-xl text-yellow-300 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold flex items-center gap-2">
                  ફોટા પર ક્લિક કરીને હાજરી પૂરો
                  <span className="text-[11px] font-normal px-2 py-0.5 bg-emerald-500/30 text-emerald-300 rounded-md border border-emerald-400/40">
                    ૧-ક્લિક ટોગલ
                  </span>
                </h1>
                <p className="text-xs text-blue-200">
                  વિદ્યાર્થીના ફોટા પર ક્લિક કરો: લીલો (હાજર) → લાલ (ગેરહાજર) → પીળો (રજા).
                </p>
              </div>
            </div>

            <div className="text-xs text-blue-200/90 font-medium bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 shrink-0">
              તારીખ: {formatted} ({dayName})
            </div>
          </div>
        )}

        {/* View 1: Photo Grid View */}
        {activeView === 'grid' && (
          <>
            {/* Stats and Filter Bar */}
            <StatsBar
              students={students}
              currentAttendance={currentAttendance}
              onMarkAllPresent={handleMarkAllPresent}
              onMarkAllAbsent={handleMarkAllAbsent}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
            />

            {/* Attendance Photo Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
              {filteredStudents.map((student) => (
                <AttendanceCard
                  key={student.id}
                  student={student}
                  status={currentAttendance[student.id] ?? 'P'}
                  onToggleStatus={handleToggleStatus}
                  onSetStatus={handleSetStatus}
                  onEditStudent={(s) => {
                    setStudentToEdit(s);
                    setIsStudentModalOpen(true);
                  }}
                />
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500 text-sm font-medium">
                  પસંદ કરેલ ફિલ્ટર મુજબ કોઈ વિદ્યાર્થી મળ્યા નથી.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                  }}
                  className="mt-3 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  તમામ ફિલ્ટર દૂર કરો
                </button>
              </div>
            )}
          </>
        )}

        {/* View 2: Monthly Register Table */}
        {activeView === 'register' && (
          <RegisterTableModal
            schoolInfo={schoolInfo}
            students={students}
            attendanceDb={attendanceDb}
            onUpdateAttendance={handleUpdateRegister}
          />
        )}

        {/* View 3: Student Roster Management */}
        {activeView === 'students' && (
          <StudentListView
            students={students}
            onAddStudent={() => {
              setStudentToEdit(null);
              setIsStudentModalOpen(true);
            }}
            onEditStudent={(s) => {
              setStudentToEdit(s);
              setIsStudentModalOpen(true);
            }}
            onDeleteStudent={handleDeleteStudent}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onResetDefaults={handleResetDefaults}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {schoolInfo.name} · તાલુકો: {schoolInfo.taluka} · જિલ્લો: {schoolInfo.district} (U-DISE: {schoolInfo.diseCode})
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ગુજરાત પ્રાથમિક શિક્ષણ વિભાગ ડિજિટલ હાજરી પ્રણાલી
          </span>
        </div>
      </footer>

      {/* WhatsApp Sharing Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        schoolInfo={schoolInfo}
        currentDate={currentDate}
        students={students}
        currentAttendance={currentAttendance}
      />

      {/* Student Add/Edit Modal */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
        totalExistingStudents={students.length}
      />
    </div>
  );
}
