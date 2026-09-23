import React from 'react';
import { AttendanceStatus, Student } from '../types';
import { StudentAvatar } from './StudentAvatar';
import { Check, X, Clock, Sparkles } from 'lucide-react';

interface AttendanceCardProps {
  student: Student;
  status: AttendanceStatus | undefined;
  onToggleStatus: (studentId: string) => void;
  onSetStatus: (studentId: string, status: AttendanceStatus) => void;
  onEditStudent?: (student: Student) => void;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  student,
  status = 'P',
  onToggleStatus,
  onSetStatus,
  onEditStudent,
}) => {
  const isPresent = status === 'P';
  const isAbsent = status === 'A';
  const isLeave = status === 'L';

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
        isPresent
          ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-200'
          : isAbsent
          ? 'bg-rose-50/40 border-rose-300 ring-1 ring-rose-200'
          : 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-200'
      }`}
    >
      {/* Top Bar: Roll Number & Gender indicator */}
      <div className="flex items-center justify-between px-3.5 pt-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
              isPresent
                ? 'bg-emerald-600 text-white'
                : isAbsent
                ? 'bg-rose-600 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            રોલ #{student.rollNo.toString().padStart(2, '0')}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            G.R. {student.grNo}
          </span>
        </div>

        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
            student.gender === 'female'
              ? 'bg-pink-100 text-pink-700'
              : 'bg-sky-100 text-sky-700'
          }`}
        >
          {student.gender === 'female' ? 'કન્યા' : 'કુમાર'}
        </span>
      </div>

      {/* Main Interactive Photo Area - TEACHER CLICKS PHOTO TO MARK ATTENDANCE */}
      <div className="flex flex-col items-center p-3 text-center">
        <button
          type="button"
          onClick={() => onToggleStatus(student.id)}
          aria-label={`રોલ ${student.rollNo} ${student.name} ની હાજરી બદલવા ફોટા પર ક્લિક કરો (હાલ: ${
            isPresent ? 'હાજર' : isAbsent ? 'ગેરહાજર' : 'રજા'
          })`}
          className="relative group/photo focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 rounded-2xl cursor-pointer transition-transform active:scale-95 touch-manipulation"
        >
          {/* Avatar Component */}
          <div
            className={`relative p-1 rounded-2xl transition-all ${
              isPresent
                ? 'ring-4 ring-emerald-500 shadow-emerald-200 shadow-md'
                : isAbsent
                ? 'ring-4 ring-rose-500 shadow-rose-200 shadow-md grayscale-[35%]'
                : 'ring-4 ring-amber-500 shadow-amber-200 shadow-md'
            }`}
          >
            <StudentAvatar
              avatarId={student.avatarId}
              photoUrl={student.photoUrl}
              gender={student.gender}
              name={student.name}
              size="lg"
            />

            {/* Tap Hint Overlay on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-white p-2">
              <Sparkles className="w-5 h-5 mb-1 text-yellow-300 animate-pulse" />
              <span className="text-xs font-semibold leading-tight">
                ક્લિક કરો
              </span>
              <span className="text-[10px] text-slate-200">સ્થિતિ બદલો</span>
            </div>

            {/* Status Stamp Icon on Avatar Corner */}
            <div
              className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white transition-transform ${
                isPresent
                  ? 'bg-emerald-600 scale-100'
                  : isAbsent
                  ? 'bg-rose-600 scale-100'
                  : 'bg-amber-600 scale-100'
              }`}
            >
              {isPresent && <Check className="w-4 h-4 stroke-[3]" />}
              {isAbsent && <X className="w-4 h-4 stroke-[3]" />}
              {isLeave && <Clock className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>
        </button>

        {/* Student Name Display */}
        <div className="mt-3 w-full">
          <h3
            className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug cursor-pointer hover:text-emerald-700"
            onClick={() => onToggleStatus(student.id)}
            title={student.name}
          >
            {student.name}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-1">
            {student.englishName}
          </p>
        </div>

        {/* Current State Text Indicator */}
        <div className="mt-2">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
              isPresent
                ? 'bg-emerald-100 text-emerald-800'
                : isAbsent
                ? 'bg-rose-100 text-rose-800 font-bold'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isPresent ? '● હાજર (Present)' : isAbsent ? '▲ ગેરહાજર (Absent)' : '■ રજા (Leave)'}
          </span>
        </div>
      </div>

      {/* Quick Action Bar for Instant One-Tap Direct Choice */}
      <div className="grid grid-cols-3 gap-1 p-2 pt-0 border-t border-slate-200/60 bg-white/60 rounded-b-2xl">
        <button
          type="button"
          onClick={() => onSetStatus(student.id, 'P')}
          className={`py-1.5 px-1 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-0.5 ${
            isPresent
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
          title="હાજર માર્ક કરો"
        >
          <Check className="w-3.5 h-3.5" />
          <span>હાજર</span>
        </button>

        <button
          type="button"
          onClick={() => onSetStatus(student.id, 'A')}
          className={`py-1.5 px-1 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-0.5 ${
            isAbsent
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
          }`}
          title="ગેરહાજર માર્ક કરો"
        >
          <X className="w-3.5 h-3.5" />
          <span>ગેરહાજર</span>
        </button>

        <button
          type="button"
          onClick={() => onSetStatus(student.id, 'L')}
          className={`py-1.5 px-1 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-0.5 ${
            isLeave
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
          }`}
          title="રજા / પ્રવાસ"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>રજા</span>
        </button>
      </div>
    </div>
  );
};
