import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FileText,
    Image as ImageIcon,
    Activity,
    ChevronLeft,
    Menu,
    LogOut,
    Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarItem {
    name: string;
    path: string;
    icon: React.ElementType;
}

interface AdminSidebarProps {
    onMobileClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onMobileClose }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const { signOut } = useAuth();

    const menuItems: SidebarItem[] = [
        { name: 'Dashboard', path: '/academy/admin', icon: LayoutDashboard },
        { name: 'Warrior Archive', path: '/admin/warriors', icon: Users },
        { name: 'Enroll Warrior', path: '/admin/scd-register', icon: Activity },
        { name: 'Academy Review', path: '/academy/admin', icon: FileText },
        { name: 'Content Manager', path: '/admin/content', icon: FileText },
        { name: 'Media Gallery', path: '/admin/gallery', icon: ImageIcon },
    ];

    return (
        <aside
            className={`bg-indigo-950 text-white h-screen transition-all duration-300 flex flex-col sticky top-0 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-indigo-900/50 h-20">
                {!isCollapsed && (
                    <div className="flex items-center space-x-2 animate-fade-in">
                        <div className="w-8 h-8 bg-google-red rounded-lg flex items-center justify-center font-bold text-white shadow-lg">S</div>
                        <span className="font-bold text-lg tracking-tight">SALFAR Admin</span>
                    </div>
                )}
                {isCollapsed && (
                    <div className="w-8 h-8 bg-google-red rounded-lg flex items-center justify-center font-bold text-white shadow-lg mx-auto">S</div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-indigo-900 rounded-lg transition-colors ml-auto shadow-sm border border-indigo-900"
                >
                    {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => onMobileClose?.()}
                            className={`flex items-center p-3 rounded-xl transition-all group ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                : 'text-indigo-300 hover:bg-indigo-900/50 hover:text-white'
                                }`}
                        >
                            <item.icon className={`transition-transform group-hover:scale-110 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} size={22} />
                            {!isCollapsed && <span className="font-medium animate-fade-in">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-indigo-900/50 space-y-2">
                <button className="flex items-center w-full p-3 text-indigo-300 hover:bg-indigo-900/50 hover:text-white rounded-xl transition-all group">
                    <Settings className={`group-hover:rotate-45 transition-transform ${isCollapsed ? 'mx-auto' : 'mr-3'}`} size={22} />
                    {!isCollapsed && <span className="font-medium animate-fade-in">Settings</span>}
                </button>
                <button
                    onClick={() => signOut()}
                    className="flex items-center w-full p-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all group"
                >
                    <LogOut className={`group-hover:-translate-x-1 transition-transform ${isCollapsed ? 'mx-auto' : 'mr-3'}`} size={22} />
                    {!isCollapsed && <span className="font-medium animate-fade-in">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
};
