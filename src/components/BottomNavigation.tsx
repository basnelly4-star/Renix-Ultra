import { CreditCard, Gift, Home, PieChart, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/dashboard", Icon: Home },
  { label: "Loan", to: "/withdraw", Icon: CreditCard },
  { label: "Finance", to: "/history", Icon: PieChart },
  { label: "Reward", to: "/daily-rewards", Icon: Gift },
  { label: "Me", to: "/profile", Icon: User },
];

const BottomNavigation = () => {
  const location = useLocation();

  const hiddenPaths = ["/", "/auth", "/welcome"];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/95 px-2 py-2 shadow-[0_-16px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 rounded-3xl border border-white/5 bg-white/5 px-2 py-1 shadow-lg shadow-black/20">
        {navItems.map(({ label, to, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `inline-flex min-w-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-medium transition duration-200 ${
                isActive
                  ? "bg-white/10 text-[var(--gold-main)] shadow-[0_0_0_1px_rgba(234,179,8,0.15)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
