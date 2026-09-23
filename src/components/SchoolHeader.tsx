import React from 'react';
import { SchoolInfo } from '../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Printer,
  Share2,
  TableProperties,
  LayoutGrid,
  UserPlus,
} from 'lucide-react';
import { formatGujaratiDate } from '../utils/storage';

interface SchoolHeaderProps {
  schoolInfo: SchoolInfo;
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
  activeView: 'grid' | 'register' | 'students';
  onViewChange: (view: 'grid' | 'register' | 'students') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenWhatsAppModal: () => void;
  onOpenAddStudentModal: () => void;
}

export const SchoolHeader: React.FC<SchoolHeaderProps> = ({
  schoolInfo,
  currentDate,
  onDateChange,
  activeView,
  onViewChange,
  soundEnabled,
  onToggleSound,
  onOpenWhatsAppModal,
  onOpenAddStudentModal,
}) => {
  const { formatted, dayName } = formatGujaratiDate(currentDate);

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    onDateChange(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    onDateChange(next);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const handleNativeDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const [year, month, day] = e.target.value.split('-').map(Number);
    const selected = new Date(year, month - 1, day);
    onDateChange(selected);
  };

  const dateInputValue = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

  const isToday =
    currentDate.toDateString() === new Date().toDateString();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            {/* School Crest SVG Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-sky-900 flex items-center justify-center text-amber-300 shadow-sm shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight block">
                {schoolInfo.name}
              </span>
              <span className="text-[11px] text-slate-500 block leading-tight">
                તા. {schoolInfo.taluka}, જી. {schoolInfo.district} · DISE: {schoolInfo.diseCode}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links / View Switcher */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onViewChange('grid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'grid'
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>ફોટો હાજરી પત્રક</span>
            </button>

            <button
              onClick={() => onViewChange('register')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'register'
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TableProperties className="w-4 h-4" />
              <span>માસિક પત્રક (રજિસ્ટર)</span>
            </button>

            <button
              onClick={() => onViewChange('students')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'students'
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>વિદ્યાર્થી યાદી ({schoolInfo.standard}-{schoolInfo.division})</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'અવાજ બંધ કરો' : 'અવાજ ચાલુ કરો'}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                soundEnabled
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-slate-400 bg-slate-50 border-slate-200 hover:text-slate-600'
              }`}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={() => window.print()}
              title="પ્રિન્ટ કાઢો"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>પ્રિન્ટ</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              type="button"
              onClick={onOpenWhatsAppModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp રિપોર્ટ</span>
              <span className="sm:hidden">શેર</span>
            </button>

            {/* Add Student Button */}
            <button
              type="button"
              onClick={onOpenAddStudentModal}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">નવો વિદ્યાર્થી</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Bar & Classroom Bar */}
      <div className="bg-slate-50/80 border-t border-slate-200/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Class Tag Details */}
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span className="bg-blue-700 text-white font-bold px-2.5 py-1 rounded-md">
              {schoolInfo.standard} ({schoolInfo.division})
            </span>
            <span>શૈક્ષણિક વર્ષ {schoolInfo.academicYear}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">ફોટો પર ક્લિક કરીને હાજરી પૂરો</span>
          </div>

          {/* Date Selector Navigation */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button
              type="button"
              onClick={handlePrevDay}
              title="અગાઉનો દિવસ"
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-2.5">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              <label htmlFor="date-input" className="sr-only">તારીખ પસંદ કરો</label>
              <input
                id="date-input"
                type="date"
                value={dateInputValue}
                onChange={handleNativeDateInput}
                className="text-xs font-bold text-slate-800 bg-transparent cursor-pointer border-none focus:outline-hidden"
              />
              <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                {dayName} ({formatted})
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextDay}
              title="આગામી દિવસ"
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isToday && (
              <button
                type="button"
                onClick={handleToday}
                className="ml-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
              >
                આજે
              </button>
            )}
          </div>

          {/* Mobile Tab Switcher */}
          <div className="flex md:hidden w-full items-center justify-around gap-1 pt-1 border-t border-slate-200">
            <button
              onClick={() => onViewChange('grid')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg text-center ${
                activeView === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              ફોટો ગ્રીડ
            </button>
            <button
              onClick={() => onViewChange('register')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg text-center ${
                activeView === 'register' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              માસિક પત્રક
            </button>
            <button
              onClick={() => onViewChange('students')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg text-center ${
                activeView === 'students' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              વિદ્યાર્થીઓ
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
