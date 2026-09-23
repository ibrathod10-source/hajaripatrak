import React, { useState, useRef } from 'react';
import { Student } from '../types';
import { StudentAvatar } from './StudentAvatar';
import { Camera, Upload, X, Check, Trash2 } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  studentToEdit?: Student | null;
  totalExistingStudents: number;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
  totalExistingStudents,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rollNo, setRollNo] = useState<number>(
    studentToEdit ? studentToEdit.rollNo : totalExistingStudents + 1
  );
  const [grNo, setGrNo] = useState<string>(
    studentToEdit ? studentToEdit.grNo : (1440 + totalExistingStudents + 1).toString()
  );
  const [name, setName] = useState<string>(studentToEdit ? studentToEdit.name : '');
  const [englishName, setEnglishName] = useState<string>(
    studentToEdit ? studentToEdit.englishName : ''
  );
  const [gender, setGender] = useState<'male' | 'female'>(
    studentToEdit ? studentToEdit.gender : 'male'
  );
  const [parentPhone, setParentPhone] = useState<string>(
    studentToEdit?.parentPhone || ''
  );
  const [photoUrl, setPhotoUrl] = useState<string>(
    studentToEdit?.photoUrl || ''
  );
  const [avatarId, setAvatarId] = useState<string>(
    studentToEdit ? studentToEdit.avatarId : 'boy-1'
  );

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setPhotoUrl(loadEvt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const student: Student = {
      id: studentToEdit ? studentToEdit.id : `std-${Date.now()}`,
      rollNo: Number(rollNo),
      grNo: grNo.trim(),
      name: name.trim(),
      englishName: englishName.trim() || name.trim(),
      gender,
      avatarId,
      photoUrl: photoUrl || undefined,
      parentPhone: parentPhone.trim() || undefined,
    };

    onSave(student);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-blue-700 text-white flex items-center justify-between">
          <h2 className="text-base font-bold">
            {studentToEdit ? 'વિદ્યાર્થી માહિતી સુધારો' : 'નવો વિદ્યાર્થી ઉમેરો (ધોરણ ૬-અ)'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-blue-800 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Photo & Avatar Section */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="relative mb-3">
              <StudentAvatar
                name={name || 'Student'}
                avatarId={avatarId}
                gender={gender}
                photoUrl={photoUrl}
                size="lg"
              />
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="absolute -top-1 -right-1 p-1 bg-rose-600 text-white rounded-full shadow-sm hover:bg-rose-700"
                  title="ફોટો હટાવો"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>ફોટો અપલોડ કરો</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextId = `${gender === 'female' ? 'girl' : 'boy'}-${(Math.floor(Math.random() * 8) + 1)}`;
                  setAvatarId(nextId);
                  setPhotoUrl('');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>અવતાર બદલો</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              * ફોટો અપલોડ કરી શકો છો અથવા ડીજીટલ અવતાર પસંદ કરી શકો છો
            </p>
          </div>

          {/* Roll No & GR No */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                રોલ નંબર (Roll No) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={rollNo}
                onChange={(e) => setRollNo(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                G.R. નંબર (જી.આર. નં.)
              </label>
              <input
                type="text"
                value={grNo}
                onChange={(e) => setGrNo(e.target.value)}
                placeholder="દા.ત. 1425"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              જાતિ (Gender) *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                  gender === 'male'
                    ? 'bg-sky-50 text-sky-800 border-sky-400 ring-1 ring-sky-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                કુમાર (Boy)
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                  gender === 'female'
                    ? 'bg-pink-50 text-pink-800 border-pink-400 ring-1 ring-pink-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                કન્યા (Girl)
              </button>
            </div>
          </div>

          {/* Gujarati Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              વિદ્યાર્થીનું પૂરું નામ (ગુજરાતીમાં) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="દા.ત. બારિયા આશિષકુમાર રમેશભાઈ"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* English Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              વિદ્યાર્થીનું નામ (અંગ્રેજીમાં)
            </label>
            <input
              type="text"
              value={englishName}
              onChange={(e) => setEnglishName(e.target.value)}
              placeholder="e.g. Baria Ashishkumar R."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Parent Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              વાલીનો મોબાઈલ નંબર
            </label>
            <input
              type="tel"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              placeholder="દા.ત. 9879012345"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Footer Save */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>સાચવો</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
