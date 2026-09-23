import React, { useState } from 'react';
import { AttendanceStatus, SchoolInfo, Student } from '../types';
import { formatGujaratiDate } from '../utils/storage';
import { Check, Copy, MessageSquare, Send, X } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolInfo: SchoolInfo;
  currentDate: Date;
  students: Student[];
  currentAttendance: { [studentId: string]: AttendanceStatus };
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  schoolInfo,
  currentDate,
  students,
  currentAttendance,
}) => {
  const [copied, setCopied] = useState(false);
  const [extraNote, setExtraNote] = useState('');

  if (!isOpen) return null;

  const { formatted, dayName } = formatGujaratiDate(currentDate);

  const totalStudents = students.length;
  let presentCount = 0;
  let absentCount = 0;
  let leaveCount = 0;
  let presentBoys = 0;
  let presentGirls = 0;
  let totalBoys = 0;
  let totalGirls = 0;

  const absentStudents: Student[] = [];
  const leaveStudents: Student[] = [];

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
      absentStudents.push(std);
    } else if (status === 'L') {
      leaveCount++;
      leaveStudents.push(std);
    }
  });

  const percentage =
    totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : '0';

  // Construct official WhatsApp message
  let text = `*દૈનિક વિદ્યાર્થી હાજરી રિપોર્ટ*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🏫 *${schoolInfo.name}*\n`;
  text += `📍 તા. ${schoolInfo.taluka}, જી. ${schoolInfo.district}\n`;
  text += `🔢 U-DISE કોડ: *${schoolInfo.diseCode}*\n`;
  text += `📚 ધોરણ: *${schoolInfo.standard} (${schoolInfo.division})*\n`;
  text += `📅 તારીખ: *${formatted} (${dayName})*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📊 *હાજરી પત્રક વિગત:*\n`;
  text += `• કુલ સંખ્યા: *${totalStudents}* (કુમાર: ${totalBoys}, કન્યા: ${totalGirls})\n`;
  text += `• કુલ હાજર: *${presentCount}* (કુમાર: ${presentBoys}, કન્યા: ${presentGirls})\n`;
  text += `• કુલ ગેરહાજર: *${absentCount}*\n`;
  if (leaveCount > 0) {
    text += `• રજા / પરવાનગી: *${leaveCount}*\n`;
  }
  text += `• હાજરી ટકાવારી: *${percentage}%*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━\n`;

  if (absentStudents.length > 0) {
    text += `❌ *ગેરહાજર વિદ્યાર્થીઓની યાદી:*\n`;
    absentStudents.forEach((std, i) => {
      text += `${i + 1}. રોલ #${std.rollNo.toString().padStart(2, '0')} - ${std.name}\n`;
    });
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
  } else {
    text += `🎉 *આજે વર્ગમાં ૧૦૦% હાજરી છે!*\n━━━━━━━━━━━━━━━━━━━━\n`;
  }

  if (leaveStudents.length > 0) {
    text += `⏱ *રજા પર રહેલા વિદ્યાર્થીઓ:*\n`;
    leaveStudents.forEach((std, i) => {
      text += `${i + 1}. રોલ #${std.rollNo.toString().padStart(2, '0')} - ${std.name}\n`;
    });
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
  }

  if (extraNote.trim()) {
    text += `📝 *નોંધ:* ${extraNote.trim()}\n━━━━━━━━━━━━━━━━━━━━\n`;
  }

  text += `શિક્ષક: ${schoolInfo.teacherName}\n`;
  text += `ઢીંકવા પ્રાથમિક શાળા ડિજિટલ રજિસ્ટર`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSendWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-200" />
            <div>
              <h2 className="text-base font-bold leading-tight">
                દૈનિક હાજરી રિપોર્ટ (WhatsApp / CRC / BRC)
              </h2>
              <p className="text-xs text-emerald-100">
                {schoolInfo.name} · {formatted}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-800 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Note Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              વિશેષ નોંધ (વૈકલ્પિક)
            </label>
            <input
              type="text"
              value={extraNote}
              onChange={(e) => setExtraNote(e.target.value)}
              placeholder="દા.ત. તમામ વિદ્યાર્થીઓએ મધ્યાહન ભોજન લીધું છે..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-600">મેસેજ પ્રિવ્યૂ:</span>
              <span className="text-[11px] text-slate-400">CRC/BRC ગ્રૂપ માટે તૈયાર</span>
            </div>
            <pre className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-sans text-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto select-all shadow-inner">
              {text}
            </pre>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
              copied
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>કોપી થઈ ગયું! ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>મેસેજ કોપી કરો</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>WhatsApp પર મોકલો</span>
          </button>
        </div>
      </div>
    </div>
  );
};
