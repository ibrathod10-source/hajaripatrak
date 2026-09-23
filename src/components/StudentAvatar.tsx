import React from 'react';

interface StudentAvatarProps {
  photoUrl?: string;
  avatarId: string;
  gender: 'male' | 'female';
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  photoUrl,
  avatarId,
  gender,
  name,
  size = 'lg',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-24 h-24 md:w-28 md:h-28 text-lg',
    xl: 'w-32 h-32 md:w-36 md:h-36 text-2xl',
  };

  // If user provided a real photo (uploaded or captured)
  if (photoUrl) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center shadow-inner ${sizeClasses[size]} ${className}`}
      >
        <img
          src={photoUrl}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback gracefully to SVG avatar if image link breaks
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Pre-configured character styles for Indian primary school students
  const boyPalettes = [
    { bg: 'from-amber-100 to-amber-200', hair: '#1e293b', skin: '#d97706', shirt: '#0284c7' },
    { bg: 'from-sky-100 to-sky-200', hair: '#0f172a', skin: '#b45309', shirt: '#0369a1' },
    { bg: 'from-emerald-100 to-emerald-200', hair: '#1e1b4b', skin: '#ca8a04', shirt: '#0284c7' },
    { bg: 'from-indigo-100 to-indigo-200', hair: '#172554', skin: '#d97706', shirt: '#075985' },
    { bg: 'from-slate-100 to-slate-200', hair: '#020617', skin: '#b45309', shirt: '#0284c7' },
  ];

  const girlPalettes = [
    { bg: 'from-rose-100 to-rose-200', hair: '#1e1b4b', skin: '#d97706', shirt: '#0284c7', ribbon: '#dc2626' },
    { bg: 'from-purple-100 to-purple-200', hair: '#0f172a', skin: '#b45309', shirt: '#0369a1', ribbon: '#e11d48' },
    { bg: 'from-amber-100 to-amber-200', hair: '#172554', skin: '#ca8a04', shirt: '#0284c7', ribbon: '#db2777' },
    { bg: 'from-teal-100 to-teal-200', hair: '#020617', skin: '#d97706', shirt: '#075985', ribbon: '#dc2626' },
    { bg: 'from-pink-100 to-pink-200', hair: '#1e293b', skin: '#b45309', shirt: '#0284c7', ribbon: '#e11d48' },
  ];

  // Hash student name or avatarId to get consistent palette
  const hash = Math.abs(
    (name + avatarId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );
  
  const palette = gender === 'female' 
    ? girlPalettes[hash % girlPalettes.length]
    : boyPalettes[hash % boyPalettes.length];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${palette.bg} flex items-center justify-center select-none shadow-sm ${sizeClasses[size]} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background ambient glow */}
        <circle cx="50" cy="50" r="46" fill="white" fillOpacity="0.4" />

        {/* Uniform Shirt (Gujarat Govt School Sky-Blue Uniform) */}
        <path
          d="M20 96 C20 74, 30 68, 50 68 C70 68, 80 74, 80 96 Z"
          fill={palette.shirt}
        />
        {/* Uniform Collar */}
        <path
          d="M40 68 L50 82 L60 68 L50 74 Z"
          fill="#0c4a6e"
        />
        <path
          d="M34 68 L44 76 L38 68 Z"
          fill="#f8fafc"
        />
        <path
          d="M66 68 L56 76 L62 68 Z"
          fill="#f8fafc"
        />

        {/* Neck */}
        <rect x="44" y="56" width="12" height="14" rx="4" fill={palette.skin} />

        {gender === 'female' ? (
          <>
            {/* Girl Braids / Hair Back */}
            <path
              d="M24 45 C18 60, 20 80, 26 84 C28 85, 32 82, 30 70 Z"
              fill={palette.hair}
            />
            <path
              d="M76 45 C82 60, 80 80, 74 84 C72 85, 68 82, 70 70 Z"
              fill={palette.hair}
            />
            {/* Red Hair Ribbon / Ties */}
            <circle cx="26" cy="74" r="3" fill="#dc2626" />
            <circle cx="74" cy="74" r="3" fill="#dc2626" />

            {/* Face */}
            <circle cx="50" cy="46" r="21" fill={palette.skin} />

            {/* Hair Front / Parting */}
            <path
              d="M29 42 C32 26, 68 26, 71 42 C71 31, 62 25, 50 25 C38 25, 29 31, 29 42 Z"
              fill={palette.hair}
            />
            <path
              d="M30 38 C40 32, 48 38, 50 43 C50 35, 38 32, 30 38 Z"
              fill={palette.hair}
            />
            <path
              d="M70 38 C60 32, 52 38, 50 43 C50 35, 62 32, 70 38 Z"
              fill={palette.hair}
            />

            {/* Traditional Bindi (small red dot, subtle) */}
            <circle cx="50" cy="38" r="1.5" fill="#b91c1c" />

            {/* Smiling Eyes */}
            <ellipse cx="42" cy="44" rx="2.5" ry="3" fill="#1e293b" />
            <ellipse cx="58" cy="44" rx="2.5" ry="3" fill="#1e293b" />
            <circle cx="43" cy="43" r="1" fill="white" />
            <circle cx="59" cy="43" r="1" fill="white" />

            {/* Sweet Smile */}
            <path
              d="M44 53 Q50 59 56 53"
              stroke="#991b1b"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cheeks */}
            <circle cx="38" cy="50" r="3" fill="#f43f5e" fillOpacity="0.25" />
            <circle cx="62" cy="50" r="3" fill="#f43f5e" fillOpacity="0.25" />
          </>
        ) : (
          <>
            {/* Boy Face */}
            <circle cx="50" cy="46" r="21" fill={palette.skin} />

            {/* Boy Neat Side-Part Hair */}
            <path
              d="M28 42 C28 24, 72 24, 72 42 C68 28, 56 26, 48 26 C36 26, 30 32, 28 42 Z"
              fill={palette.hair}
            />
            <path
              d="M28 38 C35 30, 60 28, 70 36 C64 30, 42 29, 28 38 Z"
              fill={palette.hair}
            />

            {/* Ears */}
            <circle cx="28" cy="47" r="4.5" fill={palette.skin} />
            <circle cx="72" cy="47" r="4.5" fill={palette.skin} />

            {/* Bright Eyes */}
            <ellipse cx="42" cy="44" rx="2.5" ry="3" fill="#0f172a" />
            <ellipse cx="58" cy="44" rx="2.5" ry="3" fill="#0f172a" />
            <circle cx="43" cy="43" r="1" fill="white" />
            <circle cx="59" cy="43" r="1" fill="white" />

            {/* Cheerful Boy Smile */}
            <path
              d="M43 53 Q50 60 57 53"
              stroke="#7c2d12"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}
      </svg>
    </div>
  );
};
