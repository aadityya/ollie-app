interface IconProps {
  size?: number;
  className?: string;
}

export function BabyFaceIcon({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
      {/* Head */}
      <circle cx="32" cy="34" r="24" fill="#FFE0CC" />
      {/* Hair tuft */}
      <path d="M26 12 C28 8, 36 8, 38 12 C36 10, 28 10, 26 12Z" fill="#8D6E63" />
      <path d="M22 14 C24 9, 30 7, 32 10" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M32 10 C34 7, 40 9, 42 14" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Eyes */}
      <circle cx="24" cy="34" r="3" fill="#5D4037" />
      <circle cx="40" cy="34" r="3" fill="#5D4037" />
      <circle cx="25" cy="33" r="1" fill="white" />
      <circle cx="41" cy="33" r="1" fill="white" />
      {/* Cheeks */}
      <circle cx="18" cy="40" r="4" fill="#FFB8CC" opacity="0.5" />
      <circle cx="46" cy="40" r="4" fill="#FFB8CC" opacity="0.5" />
      {/* Smile */}
      <path d="M26 42 Q32 48 38 42" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function DropletIcon({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
      <path
        d="M32 8 C32 8, 12 32, 12 42 C12 53 21 58 32 58 C43 58 52 53 52 42 C52 32 32 8 32 8Z"
        fill="#B8DCF5"
        stroke="#90CAF9"
        strokeWidth="2"
      />
      <ellipse cx="24" cy="40" rx="4" ry="6" fill="white" opacity="0.4" />
    </svg>
  );
}

export function PoopIcon({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
      <path
        d="M20 54 C14 54, 10 48, 14 44 C10 42, 12 36, 18 36 C16 32, 20 28, 26 30 C24 24, 28 20, 34 22 C32 16, 38 14, 42 20 C46 18, 50 22, 48 28 C52 30, 54 36, 48 38 C54 42, 52 50, 44 54Z"
        fill="#A1887F"
        stroke="#8D6E63"
        strokeWidth="1.5"
      />
      {/* Eyes */}
      <circle cx="28" cy="40" r="2.5" fill="#5D4037" />
      <circle cx="40" cy="40" r="2.5" fill="#5D4037" />
      <circle cx="29" cy="39" r="0.8" fill="white" />
      <circle cx="41" cy="39" r="0.8" fill="white" />
      {/* Smile */}
      <path d="M30 46 Q34 50 38 46" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function BottleIcon({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
      {/* Nipple */}
      <path d="M28 8 C28 4, 36 4, 36 8 L36 14 L28 14Z" fill="#FFB8CC" />
      {/* Cap ring */}
      <rect x="26" y="14" width="12" height="4" rx="1" fill="#E8D5F5" />
      {/* Bottle body */}
      <path d="M24 18 L24 52 C24 56, 40 56, 40 52 L40 18Z" fill="white" stroke="#E8D5F5" strokeWidth="2" />
      {/* Milk level */}
      <path d="M26 30 L26 50 C26 54, 38 54, 38 50 L38 30Z" fill="#FFF3CC" opacity="0.7" />
      {/* Measurement lines */}
      <line x1="26" y1="34" x2="30" y2="34" stroke="#E8D5F5" strokeWidth="1" />
      <line x1="26" y1="40" x2="30" y2="40" stroke="#E8D5F5" strokeWidth="1" />
      <line x1="26" y1="46" x2="30" y2="46" stroke="#E8D5F5" strokeWidth="1" />
    </svg>
  );
}

export function BreastFeedIcon({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
      {/* Mother silhouette */}
      <circle cx="32" cy="20" r="10" fill="#FFE0CC" />
      {/* Body */}
      <path d="M22 28 C18 34, 16 42, 20 50 L44 50 C48 42, 46 34, 42 28Z" fill="#FFD6E0" />
      {/* Baby bundle */}
      <ellipse cx="34" cy="44" rx="10" ry="7" fill="#E8D5F5" />
      <circle cx="38" cy="42" r="4" fill="#FFE0CC" />
      {/* Heart */}
      <path d="M28 32 C26 28, 20 28, 20 33 C20 38, 28 42, 28 42 C28 42, 36 38, 36 33 C36 28, 30 28, 28 32Z" fill="#F48FB1" opacity="0.6" />
    </svg>
  );
}

export function DiaperIcon({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
      {/* Diaper shape */}
      <path
        d="M14 20 L14 36 C14 48, 50 48, 50 36 L50 20 C44 24, 36 26, 32 26 C28 26, 20 24, 14 20Z"
        fill="white"
        stroke="#B8DCF5"
        strokeWidth="2"
      />
      {/* Tabs */}
      <rect x="10" y="18" width="10" height="6" rx="2" fill="#B8DCF5" />
      <rect x="44" y="18" width="10" height="6" rx="2" fill="#B8DCF5" />
      {/* Cute pattern */}
      <circle cx="26" cy="34" r="2" fill="#FFD6E0" opacity="0.6" />
      <circle cx="32" cy="36" r="2" fill="#E8D5F5" opacity="0.6" />
      <circle cx="38" cy="34" r="2" fill="#D6ECFA" opacity="0.6" />
      {/* Star decorations */}
      <path d="M30 30 L31 28 L32 30 L34 30 L32.5 31.5 L33 34 L31 32.5 L29 34 L29.5 31.5 L28 30Z" fill="#FFE899" opacity="0.5" />
    </svg>
  );
}

export function MoonIcon({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
      {/* Moon */}
      <path
        d="M40 12 C28 16, 22 28, 26 42 C30 54, 44 58, 54 50 C42 54, 32 46, 30 34 C28 22, 34 14, 40 12Z"
        fill="#FFE899"
        stroke="#FFD54F"
        strokeWidth="1.5"
      />
      {/* Stars */}
      <circle cx="18" cy="18" r="2" fill="#FFE899" />
      <circle cx="14" cy="30" r="1.5" fill="#FFE899" opacity="0.7" />
      <circle cx="48" cy="22" r="1.5" fill="#FFE899" opacity="0.7" />
      {/* Zzz */}
      <text x="44" y="38" fontFamily="Nunito" fontSize="10" fontWeight="bold" fill="#D4B8EB" opacity="0.8">z</text>
      <text x="48" y="32" fontFamily="Nunito" fontSize="8" fontWeight="bold" fill="#D4B8EB" opacity="0.6">z</text>
      <text x="51" y="27" fontFamily="Nunito" fontSize="6" fontWeight="bold" fill="#D4B8EB" opacity="0.4">z</text>
    </svg>
  );
}

export function HeartIcon({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
      <path
        d="M32 52 C32 52, 8 36, 8 22 C8 14, 14 8, 22 8 C28 8, 32 14, 32 14 C32 14, 36 8, 42 8 C50 8, 56 14, 56 22 C56 36, 32 52, 32 52Z"
        fill="#F48FB1"
      />
      <path
        d="M22 16 C18 16, 14 20, 14 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function ChartIcon({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
      <rect x="8" y="40" width="10" height="16" rx="3" fill="#FFD6E0" />
      <rect x="22" y="28" width="10" height="28" rx="3" fill="#E8D5F5" />
      <rect x="36" y="20" width="10" height="36" rx="3" fill="#D6ECFA" />
      <rect x="50" y="32" width="10" height="24" rx="3" fill="#D4F0E7" />
      {/* Trend line */}
      <path d="M13 38 L27 26 L41 18 L55 30" stroke="#F48FB1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="13" cy="38" r="2.5" fill="#F48FB1" />
      <circle cx="27" cy="26" r="2.5" fill="#F48FB1" />
      <circle cx="41" cy="18" r="2.5" fill="#F48FB1" />
      <circle cx="55" cy="30" r="2.5" fill="#F48FB1" />
    </svg>
  );
}

export function StarIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 2 L14.5 9 L22 9 L16 13.5 L18 21 L12 17 L6 21 L8 13.5 L2 9 L9.5 9Z"
        fill="#FFE899"
        stroke="#FFD54F"
        strokeWidth="0.5"
      />
    </svg>
  );
}
