import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileBarChart, UserCog, Building2, ShieldAlert, History, Landmark } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/employees", label: "Employees", icon: Users },
  { path: "/reports", label: "Reports", icon: FileBarChart },
  { path: "/users", label: "Users", icon: UserCog },
  { path: "/units", label: "Units", icon: Building2 },
  { path: "/banks", label: "Banks", icon: Landmark },
  { path: "/admins", label: "Admins", icon: ShieldAlert, role: "DEV" },
  { path: "/logs", label: "Activity Logs", icon: History }, 
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm flex flex-col hidden md:flex shrink-0 overflow-hidden transition-colors duration-200">
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isStealthDev = user?.username === "nikhil" && item.role === "DEV";
          if (item.role && user?.role !== item.role && !isStealthDev) return null;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400"
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100"
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" strokeWidth={2} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}