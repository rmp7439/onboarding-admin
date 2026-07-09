import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, FileBarChart } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/employees', label: 'Employees', icon: Users },
  { path: '/reports', label: 'Reports', icon: FileBarChart }
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col hidden md:flex shrink-0">
      <Link 
        to="/dashboard"
        className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0 cursor-pointer hover:bg-slate-50 transition-colors group block no-underline"
      >
        <h1 className="text-xl font-bold text-blue-600 tracking-wide group-hover:opacity-80 transition-opacity">
          OnboardApp
        </h1>
      </Link>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}