import React from 'react';
import { AttendanceStatus, Student } from '../types';
import { CheckCheck, RotateCcw, Search, Users, UserCheck, UserX, AlertCircle } from 'lucide-react';

interface StatsBarProps {
  students: Student[];
  currentAttendance: { [studentId: string]: AttendanceStatus };
  onMarkAllPresent: () => void;
  onMarkAllAbsent: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: 'all' | 'P' | 'A' | 'L' | 'male' | 'female';
  onFilterChange: (filter: 'all' | 'P' | 'A' | 'L' | 'male' | 'female') => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  students,
  currentAttendance,
  onMarkAllPresent,
  onMarkAllAbsent,
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
}) => {
  const totalStudents = students.length;

  let presentCount = 0;
  let absentCount = 0;
  let leaveCount = 0;

  let presentBoys = 0;
  let presentGirls = 0;
  let totalBoys = 0;
  let totalGirls = 0;

  const absentRollNumbers: number[] = [];

  students.forEach((std) => {
    if (std.gender === 'male') totalBoys++;
    if (std.gender === 'female') totalGirls++;

    const status = currentAttendance[std.id] ?? 'P';
    if (status === 'P') {
      presentCount++;
      if (std.gender === 'male') presentBoys++;
      if (std.gender === 'female') presentGirls++;
    } else if (status === 'A') {
      absentCount++;
      absentRollNumbers.push(std.rollNo);
    } else if (status === 'L') {
      leaveCount++;
    }
  });

  const presentPercentage =
    totalStudents > 0 ? Math.round((presentCount / totalStudents) * 1000) / 10 : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-4">
      {/* Top Section: Metrics counters (Anti-slop clean typography with tabular numbers) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Total Students */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">કુલ સંખ્યા</span>
            <Users className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalStudents}
            </span>
            <span className="text-xs text-slate-500">વિદ્યાર્થી</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            કુમાર: {totalBoys} · કન્યા: {totalGirls}
          </div>
        </div>

        {/* Present Students */}
        <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-bold">હાજર (Present)</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
              {presentCount}
            </span>
            <span className="text-xs font-bold text-emerald-800">
              ({presentPercentage}%)
            </span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">
            કુમાર: {presentBoys} · કન્યા: {presentGirls}
          </div>
        </div>

        {/* Absent Students */}
        <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200">
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-bold">ગેરહાજર (Absent)</span>
            <UserX className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-700">
              {absentCount}
            </span>
            <span className="text-xs text-rose-600">
              ({totalStudents > 0 ? (100 - presentPercentage).toFixed(1) : 0}%)
            </span>
          </div>
          <div className="text-[11px] text-rose-600 mt-0.5 line-clamp-1">
            {absentRollNumbers.length > 0
              ? `રોલ નં: ${absentRollNumbers.join(', ')}`
              : 'કોઈ ગેરહાજર નથી'}
          </div>
        </div>

        {/* Leave Students */}
        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-bold">રજા / પરવાનગી</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-700">
              {leaveCount}
            </span>
            <span className="text-xs text-amber-600">વિદ્યાર્થી</span>
          </div>
          <div className="text-[11px] text-amber-600 mt-0.5">
            વિશેષ રજા / પ્રવાસ
          </div>
        </div>

        {/* Bulk Action Controls */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex flex-row lg:flex-col justify-center gap-2">
          <button
            type="button"
            onClick={onMarkAllPresent}
            className="flex-1 lg:flex-none py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="બધા વિદ્યાર્થીઓને એકસાથે હાજર કરો"
          >
            <CheckCheck className="w-4 h-4" />
            <span>બધા હાજર કરો</span>
          </button>

          <button
            type="button"
            onClick={onMarkAllAbsent}
            className="flex-1 lg:flex-none py-2 px-3 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="બધાને ગેરહાજર તરીકે રીસેટ કરો"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>બધા ગેરહાજર</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Search & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="વિદ્યાર્થીનું નામ અથવા રોલ નંબર શોધો..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Segmented Buttons (Functional Filter Controls allowed per Constitution) */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            બધા ({totalStudents})
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('A')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'A'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            ગેરહાજર ({absentCount})
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('P')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'P'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            હાજર ({presentCount})
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('male')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'male'
                ? 'bg-white text-sky-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            કુમાર ({totalBoys})
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('female')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'female'
                ? 'bg-white text-pink-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            કન્યા ({totalGirls})
          </button>
        </div>
      </div>
    </div>
  );
};
