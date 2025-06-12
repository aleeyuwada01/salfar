import React, { useState } from 'react';
import { Upload, Users, MapPin, TrendingUp, Database, Search, Filter, Download } from 'lucide-react';

export const DataCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');

  // Mock data for demonstration
  const stateData = [
    { state: 'Lagos', warriors: 487, underPoverty: 312, percentage: 64 },
    { state: 'Kano', warriors: 356, underPoverty: 289, percentage: 81 },
    { state: 'Rivers', warriors: 298, underPoverty: 187, percentage: 63 },
    { state: 'Oyo', warriors: 245, underPoverty: 156, percentage: 64 },
    { state: 'Kaduna', warriors: 234, underPoverty: 198, percentage: 85 },
    { state: 'Abuja', warriors: 189, underPoverty: 98, percentage: 52 },
  ];

  const warriorsList = [
    { id: 'W001', name: 'Amina Kano', state: 'Lagos', lga: 'Ikeja', district: 'GRA', age: 24, underPoverty: true },
    { id: 'W002', name: 'Ibrahim Musa', state: 'Kano', lga: 'Fagge', district: 'Sabon Gari', age: 19, underPoverty: true },
    { id: 'W003', name: 'Grace Okafor', state: 'Rivers', lga: 'Port Harcourt', district: 'Mile 1', age: 31, underPoverty: false },
    { id: 'W004', name: 'Ahmed Bello', state: 'Kaduna', lga: 'Chikun', district: 'Gonin Gora', age: 27, underPoverty: true },
    { id: 'W005', name: 'Fatima Abdullahi', state: 'Abuja', lga: 'Gwagwalada', district: 'Phase 2', age: 22, underPoverty: false },
  ];

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    state: '',
    lga: '',
    district: '',
    contact: '',
    livingCondition: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Warrior registration submitted successfully!');
    setFormData({
      fullName: '',
      dateOfBirth: '',
      state: '',
      lga: '',
      district: '',
      contact: '',
      livingCondition: ''
    });
  };

  const filteredWarriors = warriorsList.filter(warrior => 
    warrior.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedState === 'all' || warrior.state === selectedState)
  );

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-google-blue to-google-green py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Data Center</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Comprehensive data management and analytics platform for tracking and supporting 
            SCD warriors across Nigeria.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-google-red text-google-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'register'
                  ? 'border-google-red text-google-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Register Warrior</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('warriors')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'warriors'
                  ? 'border-google-red text-google-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Warriors Database</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="bg-google-red p-3 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">2,847</p>
                    <p className="text-gray-600">Total Warriors</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="bg-google-orange p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">1,923</p>
                    <p className="text-gray-600">Under $1/Day</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="bg-google-green p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">28</p>
                    <p className="text-gray-600">States Covered</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="bg-google-blue p-3 rounded-full">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">67.5%</p>
                    <p className="text-gray-600">Poverty Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* State-wise Data */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">State-wise Statistics</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        State
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Warriors
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Under Poverty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Poverty Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stateData.map((state, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {state.state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {state.warriors}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {state.underPoverty}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-google-red h-2 rounded-full" 
                                style={{ width: `${state.percentage}%` }}
                              ></div>
                            </div>
                            <span>{state.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Register Warrior Tab */}
      {activeTab === 'register' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Register New Warrior</h2>
                <p className="text-gray-600">
                  Help us expand our support network by registering SCD warriors in your community.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                    />
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                    >
                      <option value="">Select State</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Kano">Kano</option>
                      <option value="Rivers">Rivers</option>
                      <option value="Oyo">Oyo</option>
                      <option value="Kaduna">Kaduna</option>
                      <option value="Abuja">Abuja</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="lga" className="block text-sm font-medium text-gray-700 mb-2">
                      Local Government Area *
                    </label>
                    <input
                      type="text"
                      id="lga"
                      name="lga"
                      value={formData.lga}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                    />
                  </div>

                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                      District/Ward *
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Information *
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="Phone number or email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="livingCondition" className="block text-sm font-medium text-gray-700 mb-2">
                    Living Condition *
                  </label>
                  <select
                    id="livingCondition"
                    name="livingCondition"
                    value={formData.livingCondition}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                  >
                    <option value="">Select Living Condition</option>
                    <option value="under_1_dollar">Living under $1/day</option>
                    <option value="above_1_dollar">Living above $1/day</option>
                  </select>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-google-red text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
                  >
                    Register Warrior
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Warriors Database Tab */}
      {activeTab === 'warriors' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 md:mb-0">Warriors Database</h3>
                  
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search warriors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                      />
                    </div>
                    
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                    >
                      <option value="all">All States</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Kano">Kano</option>
                      <option value="Rivers">Rivers</option>
                      <option value="Kaduna">Kaduna</option>
                      <option value="Abuja">Abuja</option>
                    </select>

                    <button className="flex items-center space-x-2 px-4 py-2 bg-google-green text-white rounded-md hover:bg-green-600 transition-colors">
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredWarriors.map((warrior) => (
                      <tr key={warrior.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {warrior.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {warrior.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {warrior.district}, {warrior.lga}, {warrior.state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {warrior.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            warrior.underPoverty 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {warrior.underPoverty ? 'Under $1/day' : 'Above $1/day'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};