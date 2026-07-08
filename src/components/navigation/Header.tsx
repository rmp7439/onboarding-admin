export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h2 className="text-xl font-semibold text-gray-800">
        Employee Onboarding Admin
      </h2>
      <div className="flex items-center space-x-4">
        {/* Placeholder for future profile/logout controls */}
        <div className="h-9 w-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
          <span className="text-sm font-medium">AD</span>
        </div>
      </div>
    </header>
  );
}