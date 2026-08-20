export const ProfileIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="profileGold" x1="0" x2="1">
        <stop offset="0%" stopColor="#f6d36a" />
        <stop offset="40%" stopColor="#d79d2d" />
        <stop offset="100%" stopColor="#8c5a14" />
      </linearGradient>
      <linearGradient id="profileGreen" x1="0" x2="1">
        <stop offset="0%" stopColor="#57f4bd" />
        <stop offset="100%" stopColor="#0ca66a" />
      </linearGradient>
    </defs>

    <rect x="10" y="10" width="80" height="80" rx="18" fill="#050a09" stroke="url(#profileGold)" strokeWidth="6"/>
    <circle cx="50" cy="38" r="14" fill="url(#profileGold)"/>
    <circle cx="50" cy="38" r="8" fill="#0d1111"/>
    <path d="M30 70 C33 58 41 52 50 52 C59 52 67 58 70 70" fill="url(#profileGreen)" stroke="url(#profileGold)" strokeWidth="5" strokeLinecap="round"/>
  </svg>
);
