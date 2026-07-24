import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileBarChart, UserCog, Building2, ShieldAlert } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/employees", label: "Employees", icon: Users },
  { path: "/reports", label: "Reports", icon: FileBarChart },
  { path: "/users", label: "Users", icon: UserCog },
  { path: "/units", label: "Units", icon: Building2 },
  { path: "/admins", label: "Admins", icon: ShieldAlert, role: "PERME" }, // DEV-only tab
];

export default function Sidebar() {
  const { user } = useAuth(); // Destructure user to check role

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col hidden md:flex shrink-0">
      {/* ... logo code ... */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          // Hide items that require a specific role if the user doesn't have it
          if (item.role && user?.role !== item.role) return null;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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