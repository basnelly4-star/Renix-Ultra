export const SupportIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="supportGold" x1="0" x2="1">
        <stop offset="0%" stopColor="#f4cf67" />
        <stop offset="32%" stopColor="#d9992e" />
        <stop offset="65%" stopColor="#e5bc4c" />
        <stop offset="100%" stopColor="#8a5a17" />
      </linearGradient>
      <linearGradient id="supportGreen" x1="0" x2="1">
        <stop offset="0%" stopColor="#56f0b0" />
        <stop offset="100%" stopColor="#0e9a6d" />
      </linearGradient>
    </defs>

    <rect x="10" y="10" width="80" height="80" rx="18" fill="#04090A" stroke="url(#supportGold)" strokeWidth="6"/>
    <path d="M29 42 C29 27 39 18 52 18 C65 18 75 27 75 42" fill="none" stroke="url(#supportGreen)" strokeWidth="8" strokeLinecap="round"/>
    <path d="M31 42 V58 C31 68 39 76 49 76 H51 C61 76 69 68 69 58 V42" fill="none" stroke="url(#supportGreen)" strokeWidth="8" strokeLinecap="round"/>
    <circle cx="50" cy="42" r="14" fill="url(#supportGold)"/>
    <circle cx="50" cy="42" r="7" fill="#0d1110"/>
    <path d="M18 58 C18 48 24 40 34 40" fill="none" stroke="url(#supportGold)" strokeWidth="6" strokeLinecap="round"/>
    <path d="M82 58 C82 48 76 40 66 40" fill="none" stroke="url(#supportGold)" strokeWidth="6" strokeLinecap="round"/>
    <circle cx="18" cy="58" r="5" fill="url(#supportGold)"/>
    <circle cx="82" cy="58" r="5" fill="url(#supportGold)"/>
  </svg>
);
