import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Heart, MapPin, TrendingUp, Users, Shield, Calendar, PieChart, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  const [stats, setStats] = useState({
    totalWarriors: 2847,
    warriorsInPoverty: 1923,
    statesCovered: 28,
    programsActive: 12
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

  const featuredStories = [
    {
      title: "Supporting Warriors in Kano State",
      excerpt: "Our latest medical aid program reaches 150+ SCD warriors in rural communities.",
      date: "March 15, 2025",
      image: "https://images.pexels.com/photos/6129044/pexels-photo-6129044.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "New Partnership with Lagos University Teaching Hospital",
      excerpt: "Expanding access to specialized SCD care and research opportunities.",
      date: "March 10, 2025",
      image: "https://images.pexels.com/photos/8442093/pexels-photo-8442093.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Awareness Campaign Reaches 10,000 Students",
      excerpt: "Educational programs in schools help prevent discrimination and promote understanding.",
      date: "March 5, 2025",
      image: "https://images.pexels.com/photos/8363028/pexels-photo-8363028.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-google-red via-google-orange to-google-yellow min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            For the Warriors
            <br />
            <span className="text-google-yellow">Still Fighting</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto animate-slide-up">
            Supporting individuals affected by Sickle Cell Disease across Nigeria with 
            medical aid, awareness programs, and unwavering advocacy.
          </p>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
            <Link
              to="/data-center"
              className="bg-white text-google-red px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <UserPlus className="h-5 w-5" />
              <span>Register New Warrior</span>
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

      {/* Data Visualization Section */}
      <section className="py-20 bg-white">
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
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">States Breakdown</h3>
                <div className="space-y-3">
                  {stateData.map((state, index) => {
                    const slice = createPieSlice(stateData, index);
                    return (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-all cursor-pointer ${
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

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-google-red to-red-600 rounded-xl p-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="h-5 w-5" />
                    <h4 className="font-bold">In Poverty</h4>
                  </div>
                  <div className="text-2xl font-bold">
                    {stateData.reduce((sum, state) => sum + state.underPoverty, 0).toLocaleString()}
                  </div>
                  <p className="text-red-100 text-sm">Under $1/day</p>
                </div>

                <div className="bg-gradient-to-br from-google-green to-green-600 rounded-xl p-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <h4 className="font-bold">Avg. Poverty</h4>
                  </div>
                  <div className="text-2xl font-bold">
                    {Math.round(stateData.reduce((sum, state) => sum + state.percentage, 0) / stateData.length)}%
                  </div>
                  <p className="text-green-100 text-sm">Across states</p>
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

      {/* Mission Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are dedicated to improving the lives of individuals affected by Sickle Cell Disease 
              through comprehensive support, advocacy, and community building across Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-google-red p-3 rounded-full w-fit mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Medical Support</h3>
              <p className="text-gray-600">
                Providing access to essential medical care, medications, and specialized treatment 
                for SCD warriors across Nigeria.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-google-orange p-3 rounded-full w-fit mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Building</h3>
              <p className="text-gray-600">
                Creating strong support networks and communities where SCD warriors can connect, 
                share experiences, and find strength together.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-google-green p-3 rounded-full w-fit mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Advocacy & Awareness</h3>
              <p className="text-gray-600">
                Raising awareness about SCD, fighting discrimination, and advocating for policy 
                changes that benefit the SCD community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Updates</h2>
            <p className="text-xl text-gray-600">
              Stay informed about our ongoing programs and impact in communities across Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredStories.map((story, index) => (
              <article key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {story.date}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{story.title}</h3>
                  <p className="text-gray-600 mb-4">{story.excerpt}</p>
                  <Link 
                    to="/programs" 
                    className="text-google-red font-semibold hover:text-google-orange transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-google-red">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join the Fight</h2>
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