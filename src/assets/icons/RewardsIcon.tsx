export const RewardsIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rewardGold" x1="0" x2="1">
        <stop offset="0%" stopColor="#f6d36a" />
        <stop offset="40%" stopColor="#d79d2d" />
        <stop offset="100%" stopColor="#8c5a14" />
      </linearGradient>
      <linearGradient id="rewardGreen" x1="0" x2="1">
        <stop offset="0%" stopColor="#57f4bd" />
        <stop offset="100%" stopColor="#0ca66a" />
      </linearGradient>
    </defs>

    <rect x="13" y="12" width="74" height="74" rx="18" fill="#040a09" stroke="url(#rewardGold)" strokeWidth="6"/>
    <path d="M22 38 L78 38 L74 74 Q74 79 69 79 L31 79 Q26 79 26 74 Z" fill="url(#rewardGreen)" stroke="url(#rewardGold)" strokeWidth="5" strokeLinejoin="round"/>
    <path d="M22 38 H78" stroke="url(#rewardGold)" strokeWidth="8" strokeLinecap="round"/>
    <path d="M50 24 C46 24 42 28 42 32 C42 36 46 39 50 39 C54 39 58 36 58 32 C58 28 54 24 50 24 Z" fill="none" stroke="url(#rewardGold)" strokeWidth="5"/>
    <path d="M50 24 V80" stroke="url(#rewardGold)" strokeWidth="7" strokeLinecap="round"/>
    <path d="M32 38 C32 26 38 22 50 22 C62 22 68 26 68 38" fill="none" stroke="url(#rewardGold)" strokeWidth="7" strokeLinecap="round"/>
    <path d="M35 50 C42 44 46 42 50 42 C54 42 58 44 65 50" fill="none" stroke="url(#rewardGold)" strokeWidth="5" strokeLinecap="round"/>
    <path d="M22 40 L78 40" stroke="#f6d36a" strokeWidth="3" opacity="0.7"/>
  </svg>
);
