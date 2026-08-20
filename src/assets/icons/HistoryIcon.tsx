export const HistoryIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="historyGold" x1="0" x2="1">
        <stop offset="0%" stopColor="#f4cf67" />
        <stop offset="32%" stopColor="#d9992e" />
        <stop offset="65%" stopColor="#e5bc4c" />
        <stop offset="100%" stopColor="#8a5a17" />
      </linearGradient>
      <linearGradient id="historyGreen" x1="0" x2="1">
        <stop offset="0%" stopColor="#56f0b0" />
        <stop offset="100%" stopColor="#0e9a6d" />
      </linearGradient>
    </defs>

    <rect x="12" y="12" width="76" height="76" rx="18" fill="#04090A" stroke="url(#historyGold)" strokeWidth="6" />
    <path d="M30 28 H68 V74 H30 Z" fill="#0d1111" stroke="url(#historyGold)" strokeWidth="4" strokeLinejoin="round" />
    <path d="M36 44 H62" stroke="url(#historyGreen)" strokeWidth="6" strokeLinecap="round" />
    <path d="M36 54 H62" stroke="url(#historyGreen)" strokeWidth="6" strokeLinecap="round" />
    <path d="M36 64 H58" stroke="url(#historyGreen)" strokeWidth="6" strokeLinecap="round" />
    <path d="M51 22 L68 22 L68 38" fill="none" stroke="url(#historyGold)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M46 22 L50 26 L58 18" fill="none" stroke="url(#historyGreen)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
