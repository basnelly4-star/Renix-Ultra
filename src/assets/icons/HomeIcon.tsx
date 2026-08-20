export const HomeIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="homeGold" x1="0" x2="1">
        <stop offset="0%" stopColor="#f4cf67" />
        <stop offset="32%" stopColor="#d9992e" />
        <stop offset="65%" stopColor="#e5bc4c" />
        <stop offset="100%" stopColor="#8a5a17" />
      </linearGradient>
      <linearGradient id="homeGreen" x1="0" x2="1">
        <stop offset="0%" stopColor="#56f0b0" />
        <stop offset="100%" stopColor="#0e9a6d" />
      </linearGradient>
    </defs>

    <rect x="10" y="10" width="80" height="80" rx="18" fill="#04090A" stroke="url(#homeGold)" strokeWidth="6" />
    <path
      d="M18 44 L50 18 L82 44 L82 76 Q82 79 79 79 L21 79 Q18 79 18 76 Z"
      fill="url(#homeGreen)"
      stroke="url(#homeGold)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    <path
      d="M36 79 V57 H64 V79"
      fill="url(#homeGold)"
      stroke="#f7dd8a"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <rect x="42" y="46" width="16" height="16" rx="2" fill="#0d1110" stroke="url(#homeGold)" strokeWidth="4" />
    <rect x="45" y="49" width="10" height="10" fill="url(#homeGold)" opacity="0.95" />
  </svg>
);
