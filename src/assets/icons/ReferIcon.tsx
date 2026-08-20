export const ReferIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="referGold" x1="0" x2="1">
        <stop offset="0%" stopColor="#f4cf67" />
        <stop offset="32%" stopColor="#d9992e" />
        <stop offset="65%" stopColor="#e5bc4c" />
        <stop offset="100%" stopColor="#8a5a17" />
      </linearGradient>
      <linearGradient id="referGreen" x1="0" x2="1">
        <stop offset="0%" stopColor="#56f0b0" />
        <stop offset="100%" stopColor="#0e9a6d" />
      </linearGradient>
    </defs>

    <rect x="10" y="10" width="80" height="80" rx="18" fill="#04090A" stroke="url(#referGold)" strokeWidth="6"/>
    <path d="M22 38 C22 25 31 18 40 18 C49 18 58 25 58 38" fill="none" stroke="url(#referGreen)" strokeWidth="8" strokeLinecap="round"/>
    <path d="M58 38 C58 25 67 18 76 18 C85 18 94 25 94 38" fill="none" stroke="url(#referGreen)" strokeWidth="8" strokeLinecap="round" transform="matrix(-1 0 0 1 100 0)"/>
    <circle cx="50" cy="38" r="12" fill="url(#referGold)"/>
    <circle cx="50" cy="38" r="6" fill="#0d1110"/>
    <circle cx="25" cy="62" r="9" fill="url(#referGold)"/>
    <circle cx="75" cy="62" r="9" fill="url(#referGold)"/>
    <circle cx="25" cy="62" r="4" fill="#0d1110"/>
    <circle cx="75" cy="62" r="4" fill="#0d1110"/>
    <path d="M38 56 C42 51 48 49 50 49 C52 49 58 51 62 56" fill="none" stroke="url(#referGreen)" strokeWidth="7" strokeLinecap="round"/>
    <path d="M50 49 V78" stroke="url(#referGreen)" strokeWidth="7" strokeLinecap="round"/>
    <path d="M32 60 C38 69 43 74 50 74 C57 74 62 69 68 60" fill="none" stroke="url(#referGreen)" strokeWidth="7" strokeLinecap="round"/>
  </svg>
);
