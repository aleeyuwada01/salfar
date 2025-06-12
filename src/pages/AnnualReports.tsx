import React from 'react';
import { Download, FileText, Calendar, TrendingUp, Users, Heart, Award } from 'lucide-react';

export const AnnualReports: React.FC = () => {
  const reports = [
    {
      year: 2024,
      title: "Annual Impact Report 2024",
      description: "Comprehensive overview of our programs, achievements, and financial performance throughout 2024.",
      highlights: [
        "2,847 SCD warriors supported",
        "28 states reached nationwide",
        "₦45.2M in medical aid distributed",
        "156 support groups established"
      ],
      fileSize: "2.4 MB",
      pages: 48,
      downloadUrl: "#"
    },
    {
      year: 2023,
      title: "Annual Impact Report 2023",
      description: "Detailed analysis of our growth, program expansion, and community impact in 2023.",
      highlights: [
        "2,156 SCD warriors registered",
        "24 states covered",
        "₦38.7M in medical support",
        "128 community programs"
      ],
      fileSize: "2.1 MB",
      pages: 44,
      downloadUrl: "#"
    },
    {
      year: 2022,
      title: "Annual Impact Report 2022",
      description: "Foundation year achievements and establishment of key programs across Nigeria.",
      highlights: [
        "1,789 warriors in our network",
        "18 states initially covered",
        "₦28.3M in aid distributed",
        "89 awareness campaigns"
      ],
      fileSize: "1.8 MB",
      pages: 36,
      downloadUrl: "#"
    }
  ];

  const impactMetrics = [
    {
      metric: "Total Warriors Supported",
      value: "6,792",
      growth: "+58%",
      icon: Users,
      color: "bg-google-red"
    },
    {
      metric: "Medical Aid Distributed",
      value: "₦112.2M",
      growth: "+67%",
      icon: Heart,
      color: "bg-google-orange"
    },
    {
      metric: "States Covered",
      value: "28",
      growth: "+56%",
      icon: TrendingUp,
      color: "bg-google-green"
    },
    {
      metric: "Programs Launched",
      value: "373",
      growth: "+75%",
      icon: Award,
      color: "bg-google-blue"
    }
  ];

  const financialHighlights = [
    { category: "Medical Aid", amount: "₦67.8M", percentage: 45 },
    { category: "Program Operations", amount: "₦37.2M", percentage: 25 },
    { category: "Awareness Campaigns", amount: "₦22.3M", percentage: 15 },
    { category: "Administrative Costs", amount: "₦14.9M", percentage: 10 },
    { category: "Research & Development", amount: "₦7.5M", percentage: 5 }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-google-blue to-google-green py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Annual Reports</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Transparent reporting on our impact, financial stewardship, and progress 
            toward supporting SCD warriors across Nigeria.
          </p>
        </div>
      </section>

      {/* Impact Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Cumulative Impact</h2>
            <p className="text-xl text-gray-600">
              Three years of dedicated service to the SCD warrior community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                  <div className={`${metric.color} p-4 rounded-full w-fit mx-auto mb-6`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
                  <div className="text-gray-600 mb-2">{metric.metric}</div>
                  <div className="text-green-600 font-semibold text-sm">{metric.growth} from 2022</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Annual Reports */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Download Reports</h2>
            <p className="text-xl text-gray-600">
              Access detailed annual reports showcasing our programs, impact, and financial transparency.
            </p>
          </div>

          <div className="space-y-8">
            {reports.map((report, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <div className="bg-google-red p-3 rounded-full mr-4">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{report.title}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{report.year}</span>
                            <span className="mx-2">•</span>
                            <span>{report.pages} pages</span>
                            <span className="mx-2">•</span>
                            <span>{report.fileSize}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-6">{report.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {report.highlights.map((highlight, highlightIndex) => (
                          <div key={highlightIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-google-red rounded-full"></div>
                            <span className="text-gray-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 lg:mt-0 lg:ml-8">
                      <button className="flex items-center space-x-2 bg-google-red text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors">
                        <Download className="h-5 w-5" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Transparency */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Financial Transparency</h2>
            <p className="text-xl text-gray-600">
              How we allocate resources to maximize impact for SCD warriors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">2024 Fund Allocation</h3>
              <div className="space-y-4">
                {financialHighlights.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">{item.category}</span>
                        <span className="text-gray-900 font-semibold">{item.amount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-google-red h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Total Funds Managed</h4>
                <p className="text-3xl font-bold text-google-red">₦149.7M</p>
                <p className="text-gray-600 text-sm mt-1">Fiscal Year 2024</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Financial Metrics</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Program Efficiency</span>
                  <span className="text-2xl font-bold text-green-600">90%</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Administrative Costs</span>
                  <span className="text-2xl font-bold text-google-red">10%</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Fundraising Efficiency</span>
                  <span className="text-2xl font-bold text-google-blue">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reserve Fund</span>
                  <span className="text-2xl font-bold text-google-orange">₦22.5M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-google-red">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Stay Informed</h2>
          <p className="text-xl text-white mb-8">
            Subscribe to receive our annual reports and quarterly updates directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-google-red px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};