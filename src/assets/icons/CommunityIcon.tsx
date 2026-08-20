export const CommunityIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="communityGold" x1="0" x2="1">
        <stop offset="0%" stopColor="#f4cf67" />
        <stop offset="32%" stopColor="#d9992e" />
        <stop offset="65%" stopColor="#e5bc4c" />
        <stop offset="100%" stopColor="#8a5a17" />
      </linearGradient>
      <linearGradient id="communityGreen" x1="0" x2="1">
        <stop offset="0%" stopColor="#56f0b0" />
        <stop offset="100%" stopColor="#0e9a6d" />
      </linearGradient>
    </defs>

    <rect x="10" y="10" width="80" height="80" rx="18" fill="#04090A" stroke="url(#communityGold)" strokeWidth="6" />
    <circle cx="52" cy="36" r="10" fill="url(#communityGold)" />
    <circle cx="26" cy="62" r="8" fill="url(#communityGold)" />
    <circle cx="74" cy="62" r="8" fill="url(#communityGold)" />
    <path d="M35 58 C40 51 46 48 52 48 C58 48 64 51 69 58" fill="none" stroke="url(#communityGreen)" strokeWidth="7" strokeLinecap="round" />
    <path d="M20 66 C28 56 35 50 52 50 C69 50 76 56 84 66" fill="none" stroke="url(#communityGreen)" strokeWidth="7" strokeLinecap="round" />
  </svg>
);
