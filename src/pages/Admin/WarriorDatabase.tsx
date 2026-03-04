import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Search,
    Filter,
    FileText,
    Table as TableIcon,
    ChevronLeft,
    ChevronRight,
    Users,
    MapPin,
    Activity,
    Eye,
    X,
    Phone,
    Mail
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const WarriorDatabase: React.FC = () => {
    const [warriors, setWarriors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWarrior, setSelectedWarrior] = useState<any | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Filter state
    const [filters, setFilters] = useState({
        genotype: '',
        state: '',
        gender: '',
        income: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchWarriors();
    }, []);

    const fetchWarriors = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('scd_register')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setWarriors(data);
        }
        setLoading(false);
    };

    // Filter logic
    const filteredWarriors = warriors.filter(w => {
        const matchesSearch =
            w.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.phone_primary?.includes(searchTerm) ||
            w.nin?.includes(searchTerm);

        const matchesGenotype = !filters.genotype || w.genotype === filters.genotype;
        const matchesState = !filters.state || w.state_residence === filters.state;
        const matchesGender = !filters.gender || w.gender === filters.gender;
        const matchesIncome = !filters.income || w.monthly_income === filters.income;

        return matchesSearch && matchesGenotype && matchesState && matchesGender && matchesIncome;
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredWarriors.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredWarriors.length / itemsPerPage);

    // Export Logic
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredWarriors);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Warriors");
        XLSX.writeFile(workbook, `SSAI_Warrior_Database_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("SSAI - Registered Warriors Database", 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

        const tableColumn = ["Name", "Gender", "Genotype", "State", "Phone", "Income"];
        const tableRows = filteredWarriors.map(w => [
            w.full_name,
            w.gender,
            w.genotype,
            w.state_residence,
            w.phone_primary,
            w.monthly_income
        ]);

        // Fix: Use the imported autoTable function directly
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            styles: { fontSize: 8 },
            headStyles: { fillColor: '#4f46e5' }
        });

        doc.save(`SSAI_Warrior_Database_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // Stats
    const totalCount = filteredWarriors.length;
    const genotypeStats = filteredWarriors.reduce((acc: any, w) => {
        acc[w.genotype] = (acc[w.genotype] || 0) + 1;
        return acc;
    }, {});

    return (
        <AdminLayout title="Warrior Database">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 flex items-center">
                        <Users className="mr-3 text-indigo-600 h-8 w-8" />
                        National Archive
                    </h2>
                    <p className="text-gray-500 font-medium">Comprehensive Registry of SCD Warriors.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                        onClick={exportToExcel}
                        className="flex-1 sm:flex-none justify-center bg-green-50 text-green-700 px-4 py-2.5 rounded-xl font-bold flex items-center hover:bg-green-100 transition-all border border-green-200 text-sm"
                    >
                        <TableIcon size={18} className="mr-2" /> Excel
                    </button>
                    <button
                        onClick={exportToPDF}
                        className="flex-1 sm:flex-none justify-center bg-red-50 text-red-700 px-4 py-2.5 rounded-xl font-bold flex items-center hover:bg-red-100 transition-all border border-red-200 text-sm"
                    >
                        <FileText size={18} className="mr-2" /> PDF
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-3 md:space-x-4">
                    <div className="bg-indigo-100 p-2.5 md:p-4 rounded-xl md:rounded-2xl text-indigo-600">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                        <h4 className="text-lg md:text-2xl font-black text-gray-900">{totalCount}</h4>
                    </div>
                </div>
                {Object.entries(genotypeStats).slice(0, 3).map(([key, val]: any) => (
                    <div key={key} className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-3 md:space-x-4">
                        <div className="bg-red-50 p-2.5 md:p-4 rounded-xl md:rounded-2xl text-red-600">
                            <Activity size={20} />
                        </div>
                        <div>
                            <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{key || 'Other'}</p>
                            <h4 className="text-lg md:text-2xl font-black text-gray-900">{val}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Find by name, phone, or NIN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-medium"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-6 py-3.5 rounded-2xl font-bold flex items-center transition-all ${showFilters ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        <Filter size={18} className="mr-2" /> Filters
                    </button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl animate-fade-in">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Genotype</label>
                            <select
                                value={filters.genotype}
                                onChange={(e) => setFilters({ ...filters, genotype: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm font-bold shadow-sm outline-none"
                            >
                                <option value="">All Types</option>
                                <option value="HbSS">HbSS</option>
                                <option value="HbSC">HbSC</option>
                                <option value="HbSβ Thalassemia">HbSβ-Thal</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Gender</label>
                            <select
                                value={filters.gender}
                                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm font-bold shadow-sm outline-none"
                            >
                                <option value="">All</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Monthly Income</label>
                            <select
                                value={filters.income}
                                onChange={(e) => setFilters({ ...filters, income: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm font-bold shadow-sm outline-none"
                            >
                                <option value="">Any Income</option>
                                <option value="Under ₦20,000">Under ₦20,000</option>
                                <option value="₦20,000 - ₦50,000">₦20,000 - ₦50,000</option>
                                <option value="₦50,000 - ₦100,000">₦50,000 - ₦100,000</option>
                                <option value="Above ₦100,000">Above ₦100,000</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({ genotype: '', state: '', gender: '', income: '' })}
                                className="w-full bg-white border border-gray-200 text-gray-500 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all"
                            >
                                Reset All
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Table/Card Section */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop view */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                                <th className="px-8 py-5">Full Name</th>
                                <th className="px-8 py-5">Medical Profile</th>
                                <th className="px-8 py-5 text-right">Preview</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={3} className="px-8 py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div><p className="text-gray-400 font-bold">Reading national register...</p></td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan={3} className="px-8 py-20 text-center text-gray-400 font-bold">No records found matching your query.</td></tr>
                            ) : currentItems.map((w) => (
                                <tr key={w.id} className="hover:bg-indigo-50/30 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-black">
                                                {w.full_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900 leading-none">{w.full_name}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">NIN: {w.nin || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-2">
                                            <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 text-[10px] font-black border border-red-200">
                                                {w.genotype}
                                            </span>
                                            <span className="text-xs text-gray-500 font-medium">{w.crisis_frequency} crises/yr</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => setSelectedWarrior(w)}
                                            className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400 font-bold">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            Loading...
                        </div>
                    ) : currentItems.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 font-bold">No records found.</div>
                    ) : currentItems.map((w) => (
                        <div key={w.id} className="p-6 space-y-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-black">
                                        {w.full_name?.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-black text-gray-900">{w.full_name}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">{w.genotype} • {w.state_residence}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedWarrior(w)}
                                    className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"
                                >
                                    <Eye size={20} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="bg-gray-50 p-2.5 rounded-xl">
                                    <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">Income</p>
                                    <p className="font-bold text-gray-700">{w.monthly_income}</p>
                                </div>
                                <div className="bg-gray-50 p-2.5 rounded-xl">
                                    <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">Phone</p>
                                    <p className="font-bold text-gray-700">{w.phone_primary}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Footer */}
            <div className="p-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/30">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredWarriors.length)} of {filteredWarriors.length} entries
                </p>
                <div className="flex items-center space-x-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`h-10 w-10 rounded-xl font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Profile Detail Drawer/Modal */}
            {selectedWarrior && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white z-10 sticky top-0">
                            <div className="flex items-center space-x-4">
                                <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-200">
                                    {selectedWarrior.full_name?.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xl md:text-2xl font-black text-gray-900 truncate">{selectedWarrior.full_name}</h2>
                                    <p className="text-gray-400 font-bold uppercase text-[8px] md:text-[10px] tracking-widest truncate">REF ID: {selectedWarrior.id?.split('-')[0]}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedWarrior(null)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 md:space-y-12 bg-gray-50/50">
                            {/* Grid of Sections */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                {/* Medical */}
                                <div className="space-y-4 md:space-y-6">
                                    <div className="flex items-center space-x-2 text-red-600 font-black text-xs uppercase tracking-widest border-l-4 border-red-600 pl-4 mb-2 md:mb-4">
                                        <Activity size={16} /> <span>Medical History</span>
                                    </div>
                                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                                        <div className="flex justify-between border-b border-gray-50 pb-3">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Genotype</span>
                                            <span className="font-black text-red-600">{selectedWarrior.genotype}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-3">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Crisis Freq.</span>
                                            <span className="font-black">{selectedWarrior.crisis_frequency} per year</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-3">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Hospital Adm.</span>
                                            <span className="font-black">{selectedWarrior.hospital_admissions} (Last 12m)</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-3">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Hydroxyurea</span>
                                            <span className={`font-black ${selectedWarrior.on_hydroxyurea ? 'text-green-600' : 'text-gray-400'}`}>
                                                {selectedWarrior.on_hydroxyurea ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="pt-2">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Complications</p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedWarrior.complications?.map((c: string) => (
                                                    <span key={c} className="px-3 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded-lg">{c}</span>
                                                )) || <span className="text-xs text-gray-400 italic">None reported</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Socio-Economic */}
                                <div className="space-y-4 md:space-y-6">
                                    <div className="flex items-center space-x-2 text-indigo-600 font-black text-xs uppercase tracking-widest border-l-4 border-indigo-600 pl-4 mb-2 md:mb-4">
                                        <Users size={16} /> <span>Socio-Economic</span>
                                    </div>
                                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                                        <div className="flex justify-between border-b border-gray-50 pb-3">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Income</span>
                                            <span className="font-black">{selectedWarrior.monthly_income}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-3">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Education</span>
                                            <span className="font-black truncate max-w-[150px] md:max-w-[200px]">{selectedWarrior.highest_education}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-3">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Insurance</span>
                                            <span className="font-black">{selectedWarrior.health_insurance || 'None'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-3">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Fin. Struggle</span>
                                            <span className="font-black text-orange-600">{selectedWarrior.struggle_afford_meds}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">HH Size</span>
                                            <span className="font-black">{selectedWarrior.household_size} Members</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Location & Contact */}
                                <div className="md:col-span-2 space-y-4 md:space-y-6">
                                    <div className="flex items-center space-x-2 text-green-600 font-black text-xs uppercase tracking-widest border-l-4 border-green-600 pl-4 mb-2 md:mb-4">
                                        <MapPin size={16} /> <span>Location & Contact</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">State & LGA</label>
                                            <p className="font-black text-gray-900">{selectedWarrior.state_residence} • {selectedWarrior.lga}</p>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Numbers</label>
                                            <p className="font-black text-gray-900">{selectedWarrior.phone_primary}</p>
                                            {selectedWarrior.phone_alternative && <p className="text-xs text-gray-500">{selectedWarrior.phone_alternative}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Residential Address</label>
                                            <p className="font-black text-gray-900 line-clamp-2">{selectedWarrior.residential_address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 border-t border-gray-100 bg-white flex justify-end">
                            <button
                                onClick={() => setSelectedWarrior(null)}
                                className="w-full md:w-auto bg-gray-900 text-white px-12 py-4 rounded-2xl font-black shadow-xl hover:bg-gray-800 transition-all transform hover:scale-105"
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};
