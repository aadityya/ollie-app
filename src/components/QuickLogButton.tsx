import type { ReactNode } from 'react';

interface QuickLogButtonProps {
  icon: ReactNode;
  label: string;
  count: number;
  bgColor: string;
  borderColor: string;
  onClick: () => void;
}

export function QuickLogButton({ icon, label, count, bgColor, borderColor, onClick }: QuickLogButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} border ${borderColor} rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-sm hover:shadow-md`}
    >
      <div className="relative">
        {icon}
        {count > 0 && (
          <span className="absolute -top-1 -right-2 bg-rose text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
            {count}
          </span>
        )}
      </div>
      <span className="text-xs font-semibold text-warm-brown">{label}</span>
    </button>
  );
}
