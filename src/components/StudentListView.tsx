import React, { useState } from 'react';
import { Student } from '../types';
import { StudentAvatar } from './StudentAvatar';
import { Edit2, Trash2, UserPlus, Phone, Download, Upload } from 'lucide-react';

interface StudentListViewProps {
  students: Student[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetDefaults: () => void;
}

export const StudentListView: React.FC<StudentListViewProps> = ({
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onExportData,
  onImportData,
  onResetDefaults,
}) => {
  const [search, setSearch] = useState('');

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toString().includes(search) ||
      s.grNo.includes(search)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            વિદ્યાર્થી યાદી વ્યવસ્થાપન (ધોરણ ૬-અ)
          </h2>
          <p className="text-xs text-slate-500">
            કુલ {students.length} વિદ્યાર્થીઓ નોંધાયેલા છે (કુમાર: {students.filter((s) => s.gender === 'male').length}, કન્યા: {students.filter((s) => s.gender === 'female').length})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAddStudent}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>નવો વિદ્યાર્થી ઉમેરો</span>
          </button>

          <button
            type="button"
            onClick={onExportData}
            title="બેકઅપ ડાઉનલોડ કરો"
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>બેકઅપ ડાઉનલોડ</span>
          </button>

          <label className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>બેકઅપ રીસ્ટોર</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportData}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="નામ અથવા રોલ નંબર વડે શોધો..."
          className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-3 text-center w-16">રોલ નં</th>
              <th className="p-3 w-16">ફોટો</th>
              <th className="p-3">વિદ્યાર્થીનું નામ</th>
              <th className="p-3">G.R. નં</th>
              <th className="p-3">જાતિ</th>
              <th className="p-3">સંપર્ક</th>
              <th className="p-3 text-right">ક્રિયાઓ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 text-center font-mono font-bold text-slate-800">
                  #{student.rollNo.toString().padStart(2, '0')}
                </td>
                <td className="p-2">
                  <StudentAvatar
                    name={student.name}
                    avatarId={student.avatarId}
                    gender={student.gender}
                    photoUrl={student.photoUrl}
                    size="sm"
                  />
                </td>
                <td className="p-3">
                  <div className="font-bold text-slate-900">{student.name}</div>
                  <div className="text-[11px] text-slate-400">{student.englishName}</div>
                </td>
                <td className="p-3 font-mono text-slate-600">{student.grNo}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      student.gender === 'female'
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {student.gender === 'female' ? 'કન્યા' : 'કુમાર'}
                  </span>
                </td>
                <td className="p-3">
                  {student.parentPhone ? (
                    <span className="flex items-center gap-1 font-mono text-slate-600 text-xs">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {student.parentPhone}
                    </span>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEditStudent(student)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="વિદ્યાર્થી માહિતી સુધારો"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`શું તમે ખરેખર ${student.name} ને હટાવવા માંગો છો?`)) {
                          onDeleteStudent(student.id);
                        }
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="વિદ્યાર્થી હટાવો"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  કોઈ વિદ્યાર્થી મળ્યા નથી.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
        <span>ઢીંકવા પ્રાથમિક શાળા તા. હાલોલ જી. પંચમહાલ (DISE: 24170302402)</span>
        <button
          type="button"
          onClick={() => {
            if (confirm('શું તમે ડિફોલ્ટ ૨૪ વિદ્યાર્થીઓની યાદી ફરીથી લોડ કરવા માંગો છો?')) {
              onResetDefaults();
            }
          }}
          className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
        >
          મૂળ વિદ્યાર્થી યાદી રીસેટ કરો
        </button>
      </div>
    </div>
  );
};
