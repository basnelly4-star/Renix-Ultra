export const SecurityIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGold" x1="0" x2="1">
        <stop offset="0%" stopColor="#f4cf67" />
        <stop offset="32%" stopColor="#d9992e" />
        <stop offset="65%" stopColor="#e5bc4c" />
        <stop offset="100%" stopColor="#8a5a17" />
      </linearGradient>
      <linearGradient id="shieldGreen" x1="0" x2="1">
        <stop offset="0%" stopColor="#56f0b0" />
        <stop offset="100%" stopColor="#0e9a6d" />
      </linearGradient>
    </defs>

    <rect x="10" y="10" width="80" height="80" rx="18" fill="#04090A" stroke="url(#shieldGold)" strokeWidth="6"/>
    <path d="M50 18 L74 28 V48 C74 62 63 75 50 82 C37 75 26 62 26 48 V28 L50 18 Z" fill="url(#shieldGreen)" stroke="url(#shieldGold)" strokeWidth="5" strokeLinejoin="round"/>
    <path d="M38 50 L46 58 L62 42" fill="none" stroke="#f7f7f7" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="50" cy="49" r="7" fill="url(#shieldGold)"/>
  </svg>
);
