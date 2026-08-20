import React, { useCallback, useState } from "react";

/**
 * RENIX ULTRA — Vector Icon Set
 * Each icon is a self-contained SVG component (100x100 viewBox).
 * Colors are taken directly from pixel-sampling the source screenshots.
 * These are vector RECREATIONS (clean glyph + gradients), not pixel traces
 * of the original painted raster art — built for exact color match and
 * infinite scalability instead.
 *
 * All icons share <IconBadge> for the dark rounded-square + gold border frame.
 */

interface IconBadgeProps {
  children: React.ReactNode;
  gradientId: string;
}

export const IconBadge: React.FC<IconBadgeProps & React.SVGProps<SVGSVGElement>> = ({
  children,
  gradientId,
  ...rest
}) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <defs>
      <linearGradient id={`${gradientId}-border`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0d25a" />
        <stop offset="45%" stopColor="#aa6400" />
        <stop offset="100%" stopColor="#502800" />
      </linearGradient>
      <radialGradient id={`${gradientId}-bg`} cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#141414" />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>
    </defs>
    <rect
      x="3"
      y="3"
      width="94"
      height="94"
      rx="22"
      fill={`url(#${gradientId}-bg)`}
      stroke={`url(#${gradientId}-border)`}
      strokeWidth="4"
    />
    {children}
  </svg>
);

// ---------- 1. Home ----------

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBadge gradientId="home" {...props}>
    <defs>
      <linearGradient id="home-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0b432" />
        <stop offset="100%" stopColor="#8c5000" />
      </linearGradient>
      <linearGradient id="home-roof" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#1fa864" />
        <stop offset="55%" stopColor="#2ee6a0" />
        <stop offset="100%" stopColor="#0a5c3c" />
      </linearGradient>
    </defs>
    <path
      d="M22 46 L50 22 L78 46 L70 52 L50 35 L30 52 Z"
      fill="url(#home-roof)"
    />
    <rect x="34" y="46" width="32" height="28" fill="url(#home-gold)" rx="2" />
    <rect x="42" y="54" width="16" height="14" fill="#1a1a1a" rx="1" />
    <line x1="50" y1="54" x2="50" y2="68" stroke="#8c5000" strokeWidth="1.5" />
    <line x1="42" y1="61" x2="58" y2="61" stroke="#8c5000" strokeWidth="1.5" />
  </IconBadge>
);

// ---------- 2. Daily Tasks ----------

export const DailyTasksIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBadge gradientId="tasks" {...props}>
    <defs>
      <linearGradient id="tasks-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0be28" />
        <stop offset="100%" stopColor="#824600" />
      </linearGradient>
    </defs>
    <rect x="26" y="24" width="40" height="52" rx="4" fill="none" stroke="url(#tasks-gold)" strokeWidth="3" />
    <rect x="38" y="20" width="16" height="8" rx="2" fill="url(#tasks-gold)" />
    <circle cx="46" cy="24" r="2" fill="#1a1a1a" />
    {[36, 48, 60].map((y) => (
      <g key={y}>
        <path
          d={`M31 ${y} l3 3 l6 -6`}
          fill="none"
          stroke="#1fa84a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="44" y1={y} x2="60" y2={y} stroke="url(#tasks-gold)" strokeWidth="2" strokeLinecap="round" />
      </g>
    ))}
    <path d="M62 68 L76 54 L80 58 L66 72 Z" fill="url(#tasks-gold)" />
    <path d="M76 54 L80 58 L83 51 L79 47 Z" fill="#f0be28" />
  </IconBadge>
);

// ---------- 3. Rewards ----------

export const RewardsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBadge gradientId="rewards" {...props}>
    <defs>
      <linearGradient id="rewards-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#dc9614" />
        <stop offset="100%" stopColor="#643200" />
      </linearGradient>
      <linearGradient id="rewards-green" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00a03c" />
        <stop offset="100%" stopColor="#00461e" />
      </linearGradient>
    </defs>
    <rect x="26" y="46" width="48" height="30" fill="#141414" stroke="url(#rewards-green)" strokeWidth="2" />
    <rect x="26" y="46" width="24" height="30" fill="url(#rewards-green)" opacity="0.35" />
    <rect x="45" y="46" width="10" height="30" fill="url(#rewards-gold)" />
    <rect x="26" y="58" width="48" height="8" fill="url(#rewards-gold)" />
    <path
      d="M50 46 C42 38, 30 38, 34 30 C38 24, 46 30, 50 40 C54 30, 62 24, 66 30 C70 38, 58 38, 50 46 Z"
      fill="url(#rewards-gold)"
    />
    <circle cx="50" cy="44" r="3" fill="#f0d25a" />
  </IconBadge>
);

// ---------- 4. Refer & Earn ----------

export const ReferEarnIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBadge gradientId="refer" {...props}>
    <defs>
      <linearGradient id="refer-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0b432" />
        <stop offset="100%" stopColor="#824600" />
      </linearGradient>
      <linearGradient id="refer-green" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2ee67a" />
        <stop offset="100%" stopColor="#00461e" />
      </linearGradient>
      <marker id="refer-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L6,3 z" fill="#2ee67a" />
      </marker>
    </defs>
    <circle cx="50" cy="34" r="8" fill="url(#refer-gold)" />
    <path d="M38 54 a12 12 0 0 1 24 0 z" fill="url(#refer-gold)" />
    <circle cx="28" cy="58" r="5" fill="url(#refer-gold)" />
    <path d="M20 72 a8 8 0 0 1 16 0 z" fill="url(#refer-gold)" />
    <circle cx="72" cy="58" r="5" fill="url(#refer-green)" />
    <path d="M64 72 a8 8 0 0 1 16 0 z" fill="url(#refer-green)" />
    <path d="M40 42 A22 22 0 0 1 60 42" fill="none" stroke="url(#refer-green)" strokeWidth="2.5" markerEnd="url(#refer-arrow)" />
    <path d="M64 60 A22 22 0 0 1 50 74" fill="none" stroke="url(#refer-green)" strokeWidth="2.5" />
    <path d="M36 60 A22 22 0 0 0 50 74" fill="none" stroke="url(#refer-green)" strokeWidth="2.5" />
  </IconBadge>
);

// ---------- 5. Withdraw ----------

export const WithdrawIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBadge gradientId="withdraw" {...props}>
    <defs>
      <linearGradient id="withdraw-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#dc9614" />
        <stop offset="100%" stopColor="#5a2800" />
      </linearGradient>
      <linearGradient id="withdraw-green" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#00a03c" />
        <stop offset="100%" stopColor="#005000" />
      </linearGradient>
    </defs>
    {[68, 60, 52].map((y) => (
      <ellipse key={y} cx="34" cy={y} rx="12" ry="5" fill="url(#withdraw-gold)" stroke="#3c1e00" strokeWidth="1" />
    ))}
    <rect x="48" y="54" width="30" height="20" rx="2" fill="url(#withdraw-green)" />
    <rect x="60" y="54" width="6" height="20" fill="#e8f5e8" opacity="0.85" />
    <path d="M62 50 L62 30 M62 30 L54 40 M62 30 L70 40" fill="none" stroke="url(#withdraw-green)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </IconBadge>
);

// ---------- 6. Support ----------

export const SupportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBadge gradientId="support" {...props}>
    <defs>
      <linearGradient id="support-green" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1fd67a" />
        <stop offset="100%" stopColor="#003c1e" />
      </linearGradient>
      <linearGradient id="support-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0b432" />
        <stop offset="100%" stopColor="#783c00" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="42" r="12" fill="none" stroke="url(#support-green)" strokeWidth="2.5" />
    <path d="M30 78 a20 20 0 0 1 40 0 z" fill="none" stroke="url(#support-green)" strokeWidth="2.5" />
    <path d="M32 44 a18 18 0 0 1 36 0" fill="none" stroke="url(#support-gold)" strokeWidth="3.5" strokeLinecap="round" />
    <rect x="28" y="42" width="6" height="12" rx="3" fill="url(#support-gold)" />
    <rect x="66" y="42" width="6" height="12" rx="3" fill="url(#support-gold)" />
    <path d="M69 54 q0 10 -10 10" fill="none" stroke="url(#support-gold)" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="59" cy="64" r="2.5" fill="url(#support-gold)" />
  </IconBadge>
);

// ---------- 7. Settings ----------

export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  const teeth = 8;
  const cx = 50,
    cy = 50,
    rOuter = 22,
    rInner = 16,
    toothLen = 6;
  const points: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const angle = (Math.PI / teeth) * i;
    const r = i % 2 === 0 ? rOuter + toothLen : rOuter;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }

  return (
    <IconBadge gradientId="settings" {...props}>
      <defs>
        <linearGradient id="settings-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2ee67a" />
          <stop offset="100%" stopColor="#005a1e" />
        </linearGradient>
      </defs>
      <polygon points={points.join(" ")} fill="url(#settings-green)" />
      <circle cx={cx} cy={cy} r={rInner - 4} fill="#0a0a0a" stroke="url(#settings-green)" strokeWidth="2" />
    </IconBadge>
  );
};

// ---------- 8. Ultra Elite ----------

export const UltraEliteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBadge gradientId="elite" {...props}>
    <defs>
      <linearGradient id="elite-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0d25a" />
        <stop offset="100%" stopColor="#6e3c00" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="26" fill="none" stroke="url(#elite-gold)" strokeWidth="2.5" strokeDasharray="140 20" />
    <circle cx="50" cy="50" r="21" fill="none" stroke="url(#elite-gold)" strokeWidth="2" />
    <path
      d="M36 56 L38 42 L46 50 L50 38 L54 50 L62 42 L64 56 Z"
      fill="url(#elite-gold)"
      strokeLinejoin="round"
    />
    <rect x="36" y="56" width="28" height="4" fill="url(#elite-gold)" />
    <path d="M50 30 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 z" fill="#fff6c8" />
  </IconBadge>
);

// ---------- 9. Logout ----------

export const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBadge gradientId="logout" {...props}>
    <defs>
      <linearGradient id="logout-green" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1fd67a" />
        <stop offset="100%" stopColor="#00461e" />
      </linearGradient>
      <linearGradient id="logout-gold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f0b432" />
        <stop offset="100%" stopColor="#8c5000" />
      </linearGradient>
    </defs>
    <rect x="28" y="26" width="26" height="48" fill="none" stroke="url(#logout-green)" strokeWidth="3" />
    <circle cx="48" cy="50" r="1.8" fill="url(#logout-green)" />
    <line x1="46" y1="50" x2="72" y2="50" stroke="url(#logout-gold)" strokeWidth="4" strokeLinecap="round" />
    <path d="M62 40 L74 50 L62 60" fill="none" stroke="url(#logout-gold)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </IconBadge>
);

// ---------- 10. KYC Verification ----------

export const KycVerificationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBadge gradientId="kyc" {...props}>
    <defs>
      <linearGradient id="kyc-card" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1a5c4c" />
        <stop offset="100%" stopColor="#0a2018" />
      </linearGradient>
      <linearGradient id="kyc-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0b432" />
        <stop offset="100%" stopColor="#824600" />
      </linearGradient>
      <linearGradient id="kyc-shield" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2ee67a" />
        <stop offset="100%" stopColor="#00641e" />
      </linearGradient>
    </defs>
    <rect x="22" y="34" width="46" height="32" rx="3" fill="url(#kyc-card)" stroke="#1fa864" strokeWidth="1.5" />
    <circle cx="33" cy="46" r="5" fill="url(#kyc-gold)" />
    <path d="M26 60 a7 7 0 0 1 14 0 z" fill="url(#kyc-gold)" />
    <line x1="44" y1="42" x2="62" y2="42" stroke="url(#kyc-gold)" strokeWidth="2" strokeLinecap="round" />
    <line x1="44" y1="49" x2="62" y2="49" stroke="url(#kyc-gold)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M62 54 L76 50 L76 64 C76 72 69 76 62 78 C55 76 48 72 48 64 L48 50 Z" fill="url(#kyc-shield)" transform="translate(0,-4) scale(0.62) translate(30,20)" />
    <path d="M63 56 L75 52 L75 64 C75 71 69 75 63 77 C57 75 51 71 51 64 L51 52 Z" fill="url(#kyc-shield)" />
    <path d="M58 63 l4 4 l8 -9" fill="none" stroke="#eafff0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </IconBadge>
);

// ---------- 11. Security ----------

export const SecurityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBadge gradientId="security" {...props}>
    <defs>
      <linearGradient id="security-shield" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2ee67a" />
        <stop offset="100%" stopColor="#003c0a" />
      </linearGradient>
      <linearGradient id="security-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0b432" />
        <stop offset="100%" stopColor="#783c00" />
      </linearGradient>
    </defs>
    <path
      d="M50 22 L74 30 V52 C74 66 63 75 50 80 C37 75 26 66 26 52 V30 Z"
      fill="none"
      stroke="url(#security-shield)"
      strokeWidth="3.5"
    />
    <rect x="41" y="48" width="18" height="14" rx="2" fill="url(#security-gold)" />
    <path d="M44 48 v-6 a6 6 0 0 1 12 0 v6" fill="none" stroke="url(#security-gold)" strokeWidth="3" />
    <circle cx="50" cy="54" r="2.2" fill="#3c1e00" />
  </IconBadge>
);

// ---------- 12. Live Chat ----------

export const LiveChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBadge gradientId="chat" {...props}>
    <defs>
      <linearGradient id="chat-green" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2ee67a" />
        <stop offset="100%" stopColor="#005014" />
      </linearGradient>
      <linearGradient id="chat-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0b432" />
        <stop offset="100%" stopColor="#8c5000" />
      </linearGradient>
    </defs>
    <path d="M46 26 h26 a5 5 0 0 1 5 5 v14 a5 5 0 0 1 -5 5 h-6 l-4 6 v-6 h-16 a5 5 0 0 1 -5 -5 v-14 a5 5 0 0 1 5 -5 Z" fill="url(#chat-green)" opacity="0.85" />
    <circle cx="54" cy="38" r="1.5" fill="#08210f" />
    <circle cx="60" cy="38" r="1.5" fill="#08210f" />
    <circle cx="66" cy="38" r="1.5" fill="#08210f" />
    <path d="M24 42 h26 a5 5 0 0 1 5 5 v14 a5 5 0 0 1 -5 5 h-16 l-4 6 v-6 h-6 a5 5 0 0 1 -5 -5 v-14 a5 5 0 0 1 5 -5 Z" fill="url(#chat-green)" />
    <circle cx="32" cy="54" r="1.5" fill="#08210f" />
    <circle cx="38" cy="54" r="1.5" fill="#08210f" />
    <circle cx="44" cy="54" r="1.5" fill="#08210f" />
    <path d="M56 60 a12 12 0 0 1 24 0" fill="none" stroke="url(#chat-gold)" strokeWidth="3" strokeLinecap="round" />
    <rect x="54" y="59" width="5" height="9" rx="2.5" fill="url(#chat-gold)" />
    <rect x="78" y="59" width="5" height="9" rx="2.5" fill="url(#chat-gold)" />
  </IconBadge>
);

/**
 * RENIX ULTRA — Icon Metadata
 * Pairs each icon id with its label + palette. The actual vector art
 * lives in RenixIcons.tsx as React components (HomeIcon, SettingsIcon, etc).
 */

export interface IconColors {
  [key: string]: string;
}

export interface AppIconMeta {
  id: string;
  label: string;
  description: string;
  colors: IconColors;
}

export const RENIX_SHARED_TOKENS = {
  badgeBackground: "#000000",
  badgeBorderGradient:
    "linear-gradient(180deg, #f0d25a 0%, #aa6400 50%, #502800 100%)",
  cornerRadius: "22%",
  glowGreen: "#00e676",
  glowGold: "#ffd54a",
} as const;

export const RENIX_PRESS_INTERACTION = {
  pressScale: 0.92,
  pressDurationMs: 100,
  releaseDurationMs: 150,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const RENIX_ICON_META: AppIconMeta[] = [
  {
    id: "home",
    label: "Home",
    description: "House with glowing green chevron roof and gold body",
    colors: { primary: "#be7800", secondary: "#aa6400", shadow: "#502800", glowAccent: "#2ee6a0" },
  },
  {
    id: "daily_tasks",
    label: "Daily Tasks",
    description: "Gold clipboard with green checkmarks and a pen",
    colors: { primary: "#f0be28", secondary: "#f0aa14", shadow: "#3c1e00", checkGreen: "#1fa84a" },
  },
  {
    id: "rewards",
    label: "Rewards",
    description: "Black/green gift box with gold ribbon and bow",
    colors: { primary: "#824600", secondary: "#8c5000", boxGreen: "#00781e", shadow: "#3c1e00" },
  },
  {
    id: "refer_earn",
    label: "Refer & Earn",
    description: "Three people in a referral loop connected by green arrows",
    colors: { primary: "#e6a01e", secondary: "#dc9614", personGreen: "#00641e", arrowGreen: "#00640a" },
  },
  {
    id: "withdraw",
    label: "Withdraw",
    description: "Gold coin stack, green cash bundle, green up arrow",
    colors: { coinGold: "#824600", coinShadow: "#5a2800", cashGreen: "#006400", arrowGreen: "#0a6e0a" },
  },
  {
    id: "support",
    label: "Support",
    description: "Green glowing person silhouette wearing a gold headset",
    colors: { figureGreen: "#004628", figureGreenLight: "#005028", headsetGold: "#824600" },
  },
  {
    id: "settings",
    label: "Settings",
    description: "Glowing green gear/cog",
    colors: { gearGreen: "#007828", gearGreenDark: "#005a1e", gearHighlight: "#006e28" },
  },
  {
    id: "ultra_elite",
    label: "Ultra Elite",
    description: "Gold crown inside a double concentric ring badge",
    colors: { crownGold: "#824600", crownLight: "#f0d25a", ringGold: "#783c00", shadow: "#502800" },
  },
  {
    id: "logout",
    label: "Logout",
    description: "Green door outline with gold exit arrow",
    colors: { doorGreen: "#00643c", doorGreenLight: "#006e46", doorGreenDark: "#00461e", arrowGold: "#8c5000" },
  },
  {
    id: "kyc_verification",
    label: "KYC Verification",
    description: "Green ID card with gold avatar/lines and a verified shield badge",
    colors: { cardGreen: "#14463c", cardGreenDark: "#143c32", shieldGreen: "#00a03c", shieldGreenDark: "#005a14" },
  },
  {
    id: "security",
    label: "Security",
    description: "Green shield outline with a gold padlock",
    colors: { shieldGreen: "#0a3c32", shieldGreenDark: "#003c0a", lockGold: "#c88200", lockGoldLight: "#c87800" },
  },
  {
    id: "live_chat",
    label: "Live Chat",
    description: "Two green speech bubbles with a gold headset accent",
    colors: { bubbleGreen: "#00641e", bubbleGreenLight: "#00503c", bubbleGreenDark: "#005a14", headsetGold: "#8c5000" },
  },
];

export function getIconMeta(id: string): AppIconMeta | undefined {
  return RENIX_ICON_META.find((icon) => icon.id === id);
}

const ICON_COMPONENTS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  home: HomeIcon,
  daily_tasks: DailyTasksIcon,
  rewards: RewardsIcon,
  refer_earn: ReferEarnIcon,
  withdraw: WithdrawIcon,
  support: SupportIcon,
  settings: SettingsIcon,
  ultra_elite: UltraEliteIcon,
  logout: LogoutIcon,
  kyc_verification: KycVerificationIcon,
  security: SecurityIcon,
  live_chat: LiveChatIcon,
};

interface AppIconProps {
  id: string;
  onPress?: (id: string) => void;
  size?: number;
  showLabel?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({
  id,
  onPress,
  size = 72,
  showLabel = true,
}) => {
  const [pressed, setPressed] = useState(false);
  const meta = getIconMeta(id);
  const Glyph = ICON_COMPONENTS[id];

  const handlePressStart = useCallback(() => setPressed(true), []);
  const handlePressEnd = useCallback(() => setPressed(false), []);

  if (!Glyph || !meta) return null;

  return (
    <button
      type="button"
      aria-label={meta.label}
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerLeave={handlePressEnd}
      onPointerCancel={handlePressEnd}
      onClick={() => onPress?.(id)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: size,
          height: size,
          transform: pressed ? `scale(${RENIX_PRESS_INTERACTION.pressScale})` : "scale(1)",
          transition: `transform ${pressed ? RENIX_PRESS_INTERACTION.pressDurationMs : RENIX_PRESS_INTERACTION.releaseDurationMs}ms ${RENIX_PRESS_INTERACTION.easing}`,
          filter: pressed ? "brightness(0.85)" : "brightness(1)",
        }}
      >
        <Glyph width={size} height={size} />
      </span>

      {showLabel && (
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#f5f5f0",
            letterSpacing: "0.01em",
          }}
        >
          {meta.label}
        </span>
      )}
    </button>
  );
};

interface AppIconGridProps {
  ids?: string[];
  onPress?: (id: string) => void;
  columns?: number;
  size?: number;
}

export const AppIconGrid: React.FC<AppIconGridProps> = ({
  ids = RENIX_ICON_META.map((i) => i.id),
  onPress,
  columns = 4,
  size = 72,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 20,
      background: "#000000",
      padding: 24,
    }}
  >
    {ids.map((id) => (
      <AppIcon key={id} id={id} onPress={onPress} size={size} />
    ))}
  </div>
);

export default AppIcon;
