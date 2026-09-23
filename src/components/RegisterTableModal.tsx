import React, { useState } from 'react';
import { AttendanceDatabase, AttendanceStatus, SchoolInfo, Student } from '../types';
import { ChevronLeft, ChevronRight, Printer, Check, X, Clock } from 'lucide-react';

interface RegisterTableModalProps {
  schoolInfo: SchoolInfo;
  students: Student[];
  attendanceDb: AttendanceDatabase;
  onUpdateAttendance: (dateIso: string, studentId: string, status: AttendanceStatus) => void;
}

export const RegisterTableModal: React.FC<RegisterTableModalProps> = ({
  schoolInfo,
  students,
  attendanceDb,
  onUpdateAttendance,
}) => {
  const [activeDate, setActiveDate] = useState(new Date());

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth(); // 0-indexed

  const monthNamesGujarati = [
    'જાન્યુઆરી',
    'ફેબ્રુઆરી',
    'માર્ચ',
    'એપ્રિલ',
    'મે',
    'જૂન',
    'જુલાઈ',
    'ઓગસ્ટ',
    'સપ્ટેમ્બર',
    'ઓક્ટોબર',
    'નવેમ્બર',
    'ડિસેમ્બર',
  ];

  // Days in selected month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setActiveDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setActiveDate(new Date(year, month + 1, 1));
  };

  // Helper to format ISO date string YYYY-MM-DD
  const getDateIso = (day: number): string => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const isSunday = (day: number): boolean => {
    return new Date(year, month, day).getDay() === 0;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6 space-y-6">
      {/* Month Navigation & Print Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            માસિક વિદ્યાર્થી હાજરી પત્રક (Register View)
          </h2>
          <p className="text-xs text-slate-500">
            {schoolInfo.name} · તા. {schoolInfo.taluka}, જી. {schoolInfo.district} · DISE: {schoolInfo.diseCode} · {schoolInfo.standard} ({schoolInfo.division})
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Switcher */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition-colors"
              title="ગત માસ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800">
              {monthNamesGujarati[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition-colors"
              title="આગામી માસ"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>પત્રક પ્રિન્ટ કરો</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
        <span className="font-semibold text-slate-800">સંકેત વિગત:</span>
        <span className="inline-flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center">P</span>
          હાજર (Present)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center justify-center">A</span>
          ગેરહાજર (Absent)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center">L</span>
          રજા (Leave)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-slate-200 text-slate-500 font-bold text-[10px] flex items-center justify-center">ર</span>
          રવિવાર (Sunday)
        </span>
        <span className="text-[11px] text-slate-400 ml-auto italic">
          * કોઈપણ તારીખના ખાના પર ક્લિક કરીને હાજરી બદલી શકાય છે
        </span>
      </div>

      {/* Register Table Container */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
              <th className="p-2 text-center font-bold border-r border-slate-300 sticky left-0 bg-slate-100 z-10 w-12">
                રોલ
              </th>
              <th className="p-2 font-bold border-r border-slate-300 sticky left-12 bg-slate-100 z-10 min-w-[180px]">
                વિદ્યાર્થીનું નામ
              </th>
              {daysArray.map((day) => {
                const sun = isSunday(day);
                return (
                  <th
                    key={day}
                    className={`p-1.5 text-center font-mono font-semibold border-r border-slate-300 min-w-[28px] ${
                      sun ? 'bg-rose-50/70 text-rose-700' : 'text-slate-800'
                    }`}
                  >
                    {day}
                  </th>
                );
              })}
              <th className="p-2 text-center font-bold border-r border-slate-300 bg-emerald-50 text-emerald-800 min-w-[50px]">
                કુલ હાજર
              </th>
              <th className="p-2 text-center font-bold border-r border-slate-300 bg-rose-50 text-rose-800 min-w-[50px]">
                ગેરહાજર
              </th>
              <th className="p-2 text-center font-bold bg-blue-50 text-blue-800 min-w-[54px]">
                ટકા (%)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {students.map((student) => {
              let studentPresentDays = 0;
              let studentAbsentDays = 0;
              let recordedWorkingDays = 0;

              return (
                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                  {/* Roll No */}
                  <td className="p-2 text-center font-mono font-bold text-slate-800 border-r border-slate-200 sticky left-0 bg-white z-10">
                    {student.rollNo.toString().padStart(2, '0')}
                  </td>

                  {/* Student Name */}
                  <td className="p-2 border-r border-slate-200 sticky left-12 bg-white z-10">
                    <div className="font-semibold text-slate-900 truncate max-w-[180px]" title={student.name}>
                      {student.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {student.gender === 'female' ? 'કન્યા' : 'કુમાર'} · G.R. {student.grNo}
                    </div>
                  </td>

                  {/* Days 1 to 31 */}
                  {daysArray.map((day) => {
                    const dateIso = getDateIso(day);
                    const sun = isSunday(day);
                    const dayRecord = attendanceDb[dateIso];
                    const status = dayRecord ? dayRecord[student.id] : undefined;

                    if (!sun && status) {
                      recordedWorkingDays++;
                      if (status === 'P') studentPresentDays++;
                      else if (status === 'A') studentAbsentDays++;
                    }

                    const nextStatus: AttendanceStatus =
                      status === 'P' ? 'A' : status === 'A' ? 'L' : 'P';

                    return (
                      <td
                        key={day}
                        onClick={() => {
                          if (!sun) {
                            onUpdateAttendance(dateIso, student.id, nextStatus);
                          }
                        }}
                        className={`p-1 text-center font-mono border-r border-slate-200 select-none cursor-pointer transition-colors ${
                          sun
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed font-medium'
                            : status === 'P'
                            ? 'bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100'
                            : status === 'A'
                            ? 'bg-rose-50 text-rose-700 font-bold hover:bg-rose-100'
                            : status === 'L'
                            ? 'bg-amber-50 text-amber-700 font-bold hover:bg-amber-100'
                            : 'text-slate-300 hover:bg-slate-50'
                        }`}
                        title={sun ? 'રવિવાર' : `${day} તારીખે ક્લિક કરીને સ્થિતિ બદલો`}
                      >
                        {sun ? 'ર' : status || '-'}
                      </td>
                    );
                  })}

                  {/* Student Totals */}
                  <td className="p-2 text-center font-mono font-bold bg-emerald-50/50 text-emerald-800 border-r border-slate-200">
                    {studentPresentDays}
                  </td>
                  <td className="p-2 text-center font-mono font-bold bg-rose-50/50 text-rose-800 border-r border-slate-200">
                    {studentAbsentDays}
                  </td>
                  <td className="p-2 text-center font-mono font-bold bg-blue-50/50 text-blue-800">
                    {recordedWorkingDays > 0
                      ? `${((studentPresentDays / recordedWorkingDays) * 100).toFixed(0)}%`
                      : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Signature Section for official Print / PDF */}
      <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs font-semibold text-slate-700">
        <div>
          <div className="h-12"></div>
          <div className="border-t border-dashed border-slate-400 pt-2">
            વર્ગશિક્ષકની સહી<br />
            ({schoolInfo.teacherName})
          </div>
        </div>
        <div>
          <div className="h-12"></div>
          <div className="border-t border-dashed border-slate-400 pt-2">
            આચાર્યશ્રીની સહી અને સિક્કો<br />
            ({schoolInfo.name})
          </div>
        </div>
      </div>
    </div>
  );
};
