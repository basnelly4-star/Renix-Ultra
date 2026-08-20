export const WithdrawIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="withdrawGold" x1="0" x2="1">
        <stop offset="0%" stopColor="#f4cf67" />
        <stop offset="32%" stopColor="#d9992e" />
        <stop offset="65%" stopColor="#e5bc4c" />
        <stop offset="100%" stopColor="#8a5a17" />
      </linearGradient>
      <linearGradient id="withdrawGreen" x1="0" x2="1">
        <stop offset="0%" stopColor="#56f0b0" />
        <stop offset="100%" stopColor="#0e9a6d" />
      </linearGradient>
    </defs>

    <rect x="9" y="12" width="82" height="78" rx="18" fill="#050a09" stroke="url(#withdrawGold)" strokeWidth="6"/>

    <g transform="translate(26 29)">
      <ellipse cx="18" cy="18" rx="18" ry="8" fill="url(#withdrawGold)"/>
      <ellipse cx="18" cy="18" rx="11" ry="5" fill="#f7d97d" opacity="0.9"/>
    </g>
    <g transform="translate(38 18)">
      <ellipse cx="18" cy="18" rx="18" ry="8" fill="url(#withdrawGold)"/>
      <ellipse cx="18" cy="18" rx="11" ry="5" fill="#f7d97d" opacity="0.9"/>
    </g>
    <g transform="translate(50 29)">
      <ellipse cx="18" cy="18" rx="18" ry="8" fill="url(#withdrawGold)"/>
      <ellipse cx="18" cy="18" rx="11" ry="5" fill="#f7d97d" opacity="0.9"/>
    </g>

    <g transform="translate(28 46)">
      <path d="M7 0 L54 0 L66 18 L66 28 L7 28 Z" fill="#f0ca59" stroke="url(#withdrawGold)" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M10 10 L61 10" stroke="#d79d2d" strokeWidth="2.5"/>
    </g>

    <path d="M58 26 L78 26 L92 40" fill="none" stroke="url(#withdrawGold)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M60 66 L82 42" fill="none" stroke="url(#withdrawGold)" strokeWidth="6" strokeLinecap="round"/>
    <path d="M82 42 L66 42" fill="none" stroke="url(#withdrawGold)" strokeWidth="6" strokeLinecap="round"/>
    <path d="M22 25 L48 25 L58 16 L58 30 L22 30 Z" fill="url(#withdrawGreen)" stroke="url(#withdrawGold)" strokeWidth="3" strokeLinejoin="round"/>
  </svg>
);
