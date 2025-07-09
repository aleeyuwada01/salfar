import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Heart, MapPin, TrendingUp, Users, Shield, Calendar, PieChart, ArrowRight, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableTextProps {
  children: React.ReactNode;
  previewLines?: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ children, previewLines = 3 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div>
      <div className={`${!isExpanded ? `line-clamp-${previewLines}` : ''}`}>
        {children}
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-google-red hover:text-google-orange font-medium flex items-center space-x-1 transition-colors"
      >
        <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
    </div>
  );
};

export const Home: React.FC = () => {
  const [stats, setStats] = useState({
    totalWarriors: 2847,
    warriorsInPoverty: 1923,
    statesCovered: 28,
    programsActive: 8
  });

  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // State-wise data for visualization
  const stateData = [
    { state: 'Lagos', warriors: 487, underPoverty: 312, percentage: 64, color: '#EA4335' },
    { state: 'Kano', warriors: 356, underPoverty: 289, percentage: 81, color: '#FB8C00' },
    { state: 'Rivers', warriors: 298, underPoverty: 187, percentage: 63, color: '#34A853' },
    { state: 'Oyo', warriors: 245, underPoverty: 156, percentage: 64, color: '#4285F4' },
    { state: 'Kaduna', warriors: 234, underPoverty: 198, percentage: 85, color: '#FBBC04' },
    { state: 'Abuja', warriors: 189, underPoverty: 98, percentage: 52, color: '#9C27B0' },
  ];

  // Calculate pie chart data
  const totalWarriors = stateData.reduce((sum, state) => sum + state.warriors, 0);
  
  const createPieSlice = (data: any[], index: number) => {
    const total = data.reduce((sum, item) => sum + item.warriors, 0);
    const percentage = (data[index].warriors / total) * 100;
    
    // Calculate cumulative percentage up to this slice
    const cumulativePercentage = data.slice(0, index).reduce((sum, item) => sum + (item.warriors / total) * 100, 0);
    
    const startAngle = (cumulativePercentage / 100) * 2 * Math.PI - Math.PI / 2; // Start from top
    const endAngle = ((cumulativePercentage + percentage) / 100) * 2 * Math.PI - Math.PI / 2;
    
    const centerX = 200;
    const centerY = 200;
    const radius = 120;
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    return {
      pathData,
      percentage: Math.round(percentage * 10) / 10
    };
  };

  // Simulate live updating statistics
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalWarriors: prev.totalWarriors + Math.floor(Math.random() * 3),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-google-red via-google-orange to-google-yellow min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            Welcome to
            <br />
            <span className="text-google-yellow">Salfar Sickle Aid Initiative</span>
          </h1>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
            <Link
              to="/data-center"
              className="bg-white text-google-red px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <UserPlus className="h-5 w-5" />
              <span>Register as a Warrior</span>
            </Link>
            <Link
              to="/dp-creator"
              className="bg-google-blue text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-600 transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <ImageIcon className="h-5 w-5" />
              <span>Create Support DP</span>
            </Link>
            <Link
              to="/get-involved"
              className="bg-google-green text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-600 transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <Heart className="h-5 w-5" />
              <span>Donate Now</span>
            </Link>
          </div>

          {/* Live Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-slide-up">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.totalWarriors.toLocaleString()}
              </div>
              <div className="text-white text-sm md:text-base">SCD Warriors Registered</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.warriorsInPoverty.toLocaleString()}
              </div>
              <div className="text-white text-sm md:text-base">Living Under $1/Day</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.statesCovered}
              </div>
              <div className="text-white text-sm md:text-base">States Covered</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.programsActive}
              </div>
              <div className="text-white text-sm md:text-base">Active Programs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Welcome Message</h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <ExpandableText>
              <p className="mb-6">
                At Salfar Sickle Aid Initiative (SSAI), we believe that every individual living with Sickle Cell Disease (SCD) deserves not just survival but the right to thrive with dignity, opportunity, and inclusion.
              </p>
              
              <p className="mb-6">
                We are more than a nonprofit. We are a movement born from lived experience a vision led by warriors, for warriors. Our mission is to challenge the status quo that too often neglects the voices and needs of people living with SCD. While advocacy on prevention is critical, we recognize the urgent need to support those already living the journey many of whom face daily crises, social exclusion, and financial hardship with very little institutional support.
              </p>
              
              <p className="mb-6 font-semibold text-google-red">
                Salfar exists to change that narrative.
              </p>
              
              <p className="mb-6">
                Rooted in empathy and driven by data, our programs are built around nine strategic pillars from health and social support to education, gender inclusion, and economic empowerment. Every initiative we roll out from national data collection to menstrual hygiene webinars and our warrior-centered social protection programs is carefully designed to be practical, inclusive, and impactful.
              </p>
              
              <p className="mb-6">
                Our vision aligns with the Sustainable Development Goals (SDGs), especially goals on health (SDG 3), gender equality (SDG 5), reduced inequalities (SDG 10), and decent work and economic growth (SDG 8). But beyond global goals, our heartbeat is simple: no warrior should be left behind.
              </p>
              
              <p className="mb-6">
                We are a team of Sickle Cell Warriors, caregivers, professionals, and volunteers united by a common passion to build systems that work for the most vulnerable. We are not working for sympathy; we are working for structural change, for equity, and for hope.
              </p>
              
              <p className="mb-6">
                Whether you are a warrior, a caregiver, a donor, a policymaker, or a supporter, welcome.
                We invite you to walk this journey with us.
              </p>
              
              <p className="mb-6 font-semibold">
                Because at Salfar, we are not just raising awareness.
                We are raising champions.
              </p>
              
              <p className="text-google-red font-semibold italic">
                For the Warriors Still Fighting,
              </p>
            </ExpandableText>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="bg-google-red p-4 rounded-full w-fit mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                To support and empower Sickle Cell warriors, especially the underserved, through access to healthcare, education, skill acquisition, psychosocial support, and inclusive advocacy—creating sustainable solutions for their wellbeing and independence.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="bg-google-orange p-4 rounded-full w-fit mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Vision</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                A Nigeria where every person living with Sickle Cell Disease lives a healthy, empowered, and dignified life—free from discrimination, poverty, and isolation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">About Us</h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <ExpandableText>
              <p className="mb-6">
                Sickle Cell Disease (SCD) remains one of the most prevalent and neglected genetic disorders in Nigeria, with an estimated 150,000 children born annually with the condition. Despite the public health crisis it represents, most interventions focus solely on genotype awareness and advocacy against incompatible marriages. Little attention is paid to those already living with the condition SCD warriors who face immense challenges such as poverty, limited access to healthcare, social stigma, educational barriers, and economic exclusion.
              </p>
              
              <p className="mb-6">
                Salfar Sickle Aid Initiative was born out of the passion to change this narrative established in memory of Salma, a dear friend of the founder who passed away from complications of SCD in 2017. The NGO is committed to supporting sickle cell warriors through healthcare access, education, skills development, economic empowerment, and psychosocial support.
              </p>
            </ExpandableText>
          </div>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <PieChart className="h-8 w-8 text-google-red" />
              <h2 className="text-4xl font-bold text-gray-900">SCD Warriors Distribution</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time data showing the distribution of registered SCD warriors across Nigeria's top states
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Interactive Pie Chart */}
            <div className="flex justify-center">
              <div className="relative">
                <svg width="400" height="400" className="drop-shadow-lg">
                  {/* Background circle */}
                  <circle
                    cx="200"
                    cy="200"
                    r="120"
                    fill="#f9fafb"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  
                  {/* Pie slices */}
                  {stateData.map((state, index) => {
                    const slice = createPieSlice(stateData, index);
                    return (
                      <path
                        key={index}
                        d={slice.pathData}
                        fill={state.color}
                        stroke="white"
                        strokeWidth="2"
                        className="transition-all duration-300 cursor-pointer hover:brightness-110 hover:scale-105"
                        style={{
                          transformOrigin: '200px 200px',
                          filter: hoveredState === state.state ? 'brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none'
                        }}
                        onMouseEnter={() => setHoveredState(state.state)}
                        onMouseLeave={() => setHoveredState(null)}
                      />
                    );
                  })}
                </svg>
                
                {/* Center Info */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center bg-white rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-lg border-2 border-gray-100">
                    <div className="text-2xl font-bold text-gray-900">{totalWarriors.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Total Warriors</div>
                  </div>
                </div>

                {/* Hover Tooltip */}
                {hoveredState && (
                  <div className="absolute top-4 left-4 bg-gray-900 text-white p-4 rounded-lg shadow-xl z-10 min-w-48 animate-fade-in">
                    {(() => {
                      const state = stateData.find(s => s.state === hoveredState);
                      const slice = stateData.findIndex(s => s.state === hoveredState);
                      const pieSlice = createPieSlice(stateData, slice);
                      return state ? (
                        <div>
                          <h4 className="font-bold text-lg mb-2 text-yellow-300">{state.state} State</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Total Warriors:</span>
                              <span className="font-semibold text-blue-300">{state.warriors}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Under Poverty:</span>
                              <span className="font-semibold text-red-300">{state.underPoverty}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Poverty Rate:</span>
                              <span className="font-semibold text-orange-300">{state.percentage}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>% of Total:</span>
                              <span className="font-semibold text-green-300">{pieSlice.percentage}%</span>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Legend and Summary */}
            <div className="space-y-6">
              {/* State Legend */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">States Breakdown</h3>
                <div className="space-y-3">
                  {stateData.map((state, index) => {
                    const slice = createPieSlice(stateData, index);
                    return (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:shadow-md transition-all cursor-pointer ${
                          hoveredState === state.state ? 'ring-2 ring-gray-300 shadow-md transform scale-105' : ''
                        }`}
                        onMouseEnter={() => setHoveredState(state.state)}
                        onMouseLeave={() => setHoveredState(null)}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ backgroundColor: state.color }}
                          ></div>
                          <span className="font-semibold text-gray-900">{state.state}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{state.warriors}</div>
                          <div className="text-sm text-gray-600">{slice.percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link 
                to="/data-center"
                className="block bg-gray-900 hover:bg-gray-800 rounded-xl p-4 text-white transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold mb-1">View Full Data</h4>
                    <p className="text-gray-300 text-sm">Explore detailed analytics</p>
                  </div>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-google-red">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Us</h2>
          <p className="text-xl text-white mb-8">
            Every warrior deserves support. Every voice matters. Every action counts.
            Join us in making a difference in the lives of SCD warriors across Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/get-involved"
              className="bg-white text-google-red px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Become a Volunteer
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-google-red transition-colors"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};