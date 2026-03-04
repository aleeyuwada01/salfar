import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Heart, TrendingUp, Image as ImageIcon, PieChart, ArrowRight, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ExpandableText } from '../components/ExpandableText';

export const Home: React.FC = () => {
  const [stats, setStats] = useState({
    totalWarriors: 0,
    warriorsInPoverty: 0,
    statesCovered: 0,
    programsActive: 9 // SSAI has 9 pillars
  });

  const [stateData, setStateData] = useState<any[]>([]);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  useEffect(() => {
    fetchRealStats();
  }, []);

  const fetchRealStats = async () => {
    try {

      // 1. Total Warriors
      const { count: totalCount } = await supabase
        .from('scd_register')
        .select('*', { count: 'exact', head: true });

      // 2. Warriors in Poverty (proxy: income < 20k)
      const { count: povertyCount } = await supabase
        .from('scd_register')
        .select('*', { count: 'exact', head: true })
        .eq('monthly_income', 'Under ₦20,000');

      // 3. States Covered
      const { data: statesData } = await supabase
        .from('scd_register')
        .select('state_residence');

      const uniqueStates = new Set(statesData?.map(s => s.state_residence).filter(Boolean));

      // 4. State distribution for chart
      const stateCounts: Record<string, number> = {};

      statesData?.forEach((row: any) => {
        const state = row.state_residence || 'Unknown';
        stateCounts[state] = (stateCounts[state] || 0) + 1;
      });

      // Prepare data for the chart (top 6 states)
      const colors = ['#EA4335', '#FB8C00', '#34A853', '#4285F4', '#FBBC04', '#9C27B0'];
      const formattedStateData = Object.entries(stateCounts)
        .map(([state, count], index) => ({
          state,
          warriors: count,
          underPoverty: 0, // Simplified for now
          percentage: 0,
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.warriors - a.warriors)
        .slice(0, 6);

      setStats({
        totalWarriors: totalCount || 0,
        warriorsInPoverty: povertyCount || 0,
        statesCovered: uniqueStates.size || 0,
        programsActive: 9
      });

      setStateData(formattedStateData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };


  const createPieSlice = (data: any[], index: number) => {
    const total = data.reduce((sum, item) => sum + item.warriors, 0);
    if (total === 0) return { pathData: '', percentage: 0 };
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
              to="/register"
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

      {/* Data Visualization Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <PieChart className="h-8 w-8 text-google-red" />
              <h2 className="text-4xl font-bold text-gray-900">National SCD Register</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time distribution of registered sickle cell warriors across Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Interactive Pie Chart */}
            <div className="flex justify-center">
              {stats.totalWarriors > 0 ? (
                <div className="relative">
                  <svg width="400" height="400" className="drop-shadow-lg">
                    <circle
                      cx="200"
                      cy="200"
                      r="120"
                      fill="#f9fafb"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />

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
                            filter: hoveredState === state.state ? 'brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none'
                          }}
                          onMouseEnter={() => setHoveredState(state.state)}
                          onMouseLeave={() => setHoveredState(null)}
                        />
                      );
                    })}
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center bg-white rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-lg border-2 border-gray-100">
                      <div className="text-2xl font-bold text-gray-900">{stats.totalWarriors.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Total Warriors</div>
                    </div>
                  </div>

                  {hoveredState && (
                    <div className="absolute top-4 left-4 bg-gray-900 text-white p-4 rounded-xl shadow-2xl z-10 min-w-48 animate-fade-in border border-white/10">
                      {(() => {
                        const state = stateData.find(s => s.state === hoveredState);
                        const sliceIdx = stateData.findIndex(s => s.state === hoveredState);
                        const pieSlice = createPieSlice(stateData, sliceIdx);
                        return state ? (
                          <div>
                            <h4 className="font-bold text-lg mb-2 text-google-yellow">{state.state} State</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Total Warriors:</span>
                                <span className="font-semibold">{state.warriors}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">% of Total:</span>
                                <span className="font-semibold">{pieSlice.percentage}%</span>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-3xl p-20 text-center border-2 border-dashed border-gray-200 w-full max-w-lg">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400">No Data Available</h3>
                  <p className="text-gray-400">Data will appear as more warriors register.</p>
                </div>
              )}
            </div>

            {/* Legend and Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Coverage Breakdown</h3>
                {stateData.length > 0 ? (
                  <div className="space-y-4">
                    {stateData.map((state, index) => {
                      const slice = createPieSlice(stateData, index);
                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent ${hoveredState === state.state ? 'border-indigo-100 bg-white shadow-md transform scale-[1.02]' : ''
                            }`}
                          onMouseEnter={() => setHoveredState(state.state)}
                          onMouseLeave={() => setHoveredState(null)}
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-4 h-4 rounded-full shadow-sm"
                              style={{ backgroundColor: state.color }}
                            ></div>
                            <span className="font-bold text-gray-900">{state.state}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{state.warriors}</div>
                            <div className="text-xs text-gray-500 font-bold">{slice.percentage}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Waiting for more registrations...</p>
                )}
              </div>

              <Link
                to="/data-center"
                className="block bg-gray-900 hover:bg-black rounded-2xl p-6 text-white transition-all group shadow-lg shadow-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold mb-1 text-lg">National Data Center</h4>
                    <p className="text-gray-400 text-sm">Explore our comprehensive research database</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl group-hover:bg-white/20 transition-colors">
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-google-red relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Join the Movement</h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Every warrior deserves support. Every voice matters. Every action counts.
            Join us in making a difference in the lives of SCD warriors across Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/get-involved"
              className="bg-white text-google-red px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
            >
              Become a Volunteer
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-google-red transition-all shadow-xl hover:scale-105"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};