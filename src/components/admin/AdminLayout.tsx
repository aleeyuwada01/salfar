import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Bell, Search, User, Menu } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 overflow-hidden relative">
            {/* Sidebar Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Desktop (Sticky) / Mobile (Fixed Drawer) */}
            <div className={`
                fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <AdminSidebar onMobileClose={() => setIsMobileMenuOpen(false)} />
            </div>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 min-h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 lg:hidden text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate max-w-[150px] md:max-w-none">{title}</h1>
                    </div>

                    <div className="flex items-center space-x-3 md:space-x-6">
                        {/* Search Bar - Desktop Only */}
                        <div className="hidden md:flex relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Global search..."
                                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm w-48 lg:w-64 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                            />
                        </div>

                        <div className="flex items-center space-x-2 md:space-x-4">
                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative">
                                <Bell size={20} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-google-red rounded-full border-2 border-white"></span>
                            </button>

                            <div className="h-8 w-px bg-gray-200 mx-1 md:mx-2"></div>

                            <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer group">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs md:text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Admin</p>
                                    <p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 tracking-wider">Super Admin</p>
                                </div>
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 rounded-lg md:rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-all overflow-hidden text-sm md:text-base">
                                    <User size={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto animate-fade-in pb-12">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
