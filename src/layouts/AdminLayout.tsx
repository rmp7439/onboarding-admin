import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';

export default function AdminLayout() {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        <Sidebar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}