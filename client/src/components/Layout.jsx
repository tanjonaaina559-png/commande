import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  PieChart,
  PlusCircle,
  History,
} from 'lucide-react';

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
        isActive
          ? 'bg-green-700 text-white shadow-md'
          : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const Sidebar = () => (
  <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col p-4 fixed top-0 left-0 z-20 shadow-sm">
    <div className="flex items-center space-x-3 px-4 mb-8 mt-2">
      <div className="bg-green-700 p-2 rounded-xl">
        <ShoppingCart className="text-white w-5 h-5" />
      </div>
      <div>
        <h1 className="text-lg font-extrabold text-gray-900 leading-none">T-Shirt Biz</h1>
        <p className="text-xs text-gray-400">Gestion des commandes</p>
      </div>
    </div>

    <nav className="flex-1 space-y-1">
      <SidebarLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
      <SidebarLink to="/orders" icon={<ShoppingCart size={18} />} label="Commandes" />
      <SidebarLink to="/orders/new" icon={<PlusCircle size={18} />} label="Nouvelle Commande" />
      <SidebarLink to="/clients" icon={<Users size={18} />} label="Clients" />
      <SidebarLink to="/history" icon={<History size={18} />} label="Historique" />
      <SidebarLink to="/stats" icon={<PieChart size={18} />} label="Statistiques" />
    </nav>

    <div className="border-t border-gray-100 pt-4 px-2">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">A</div>
        <div>
          <p className="text-sm font-bold text-gray-800">Administrateur</p>
          <p className="text-xs text-gray-400">T-Shirt Biz</p>
        </div>
      </div>
    </div>
  </aside>
);

const Layout = () => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 ml-64 p-8 min-h-screen">
      <Outlet />
    </main>
  </div>
);

export default Layout;
