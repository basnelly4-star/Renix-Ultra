export const TasksIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="taskGold" x1="0" x2="1">
        <stop offset="0%" stopColor="#f6d36a" />
        <stop offset="40%" stopColor="#d79d2d" />
        <stop offset="100%" stopColor="#8c5a14" />
      </linearGradient>
      <linearGradient id="taskGreen" x1="0" x2="1">
        <stop offset="0%" stopColor="#53f4b4" />
        <stop offset="100%" stopColor="#0ca66a" />
      </linearGradient>
    </defs>

    <rect x="12" y="15" width="76" height="70" rx="12" fill="#0b0d0d" stroke="url(#taskGold)" strokeWidth="5"/>
    <path d="M35 28 L72 28" stroke="url(#taskGold)" strokeWidth="5" strokeLinecap="round"/>
    <path d="M35 40 L72 40" stroke="url(#taskGold)" strokeWidth="5" strokeLinecap="round"/>
    <path d="M35 52 L72 52" stroke="url(#taskGold)" strokeWidth="5" strokeLinecap="round"/>
    <path d="M35 64 L72 64" stroke="url(#taskGold)" strokeWidth="5" strokeLinecap="round"/>

    <circle cx="24" cy="28" r="7" fill="url(#taskGreen)"/>
    <path d="M20.5 27.8 L23 30.4 L28 24.8" fill="none" stroke="#f7f7f7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

    <circle cx="24" cy="40" r="7" fill="url(#taskGreen)"/>
    <path d="M20.5 39.8 L23 42.4 L28 36.8" fill="none" stroke="#f7f7f7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

    <circle cx="24" cy="52" r="7" fill="url(#taskGreen)"/>
    <path d="M20.5 51.8 L23 54.4 L28 48.8" fill="none" stroke="#f7f7f7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

    <g transform="translate(57 48) rotate(30)">
      <rect x="0" y="0" width="30" height="6" rx="3" fill="url(#taskGold)"/>
      <path d="M24 0 L34 10 L24 20 L34 30 L24 40" fill="none" stroke="url(#taskGold)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 0 L24 0 L34 10 L24 20 L14 20" fill="none" stroke="#f7d970" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);
