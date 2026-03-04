import React, { useState } from 'react';
import { Heart, Users, Briefcase, Gift, Calendar, Mail, Phone, MapPin } from 'lucide-react';

export const GetInvolved: React.FC = () => {
  const [activeTab, setActiveTab] = useState('donate');
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const donationOptions = [
    { amount: '5000', impact: 'Provides medication for 1 warrior for a month' },
    { amount: '15000', impact: 'Supports a support group meeting for 20 warriors' },
    { amount: '25000', impact: 'Funds awareness campaign in one community' },
    { amount: '50000', impact: 'Sponsors medical check-up for 10 warriors' },
    { amount: '100000', impact: 'Establishes a new support group in rural area' },
  ];

  const volunteerOpportunities = [
    {
      title: "Community Health Educator",
      description: "Help educate communities about SCD prevention and management.",
      commitment: "4-6 hours/week",
      location: "Various states",
      icon: Users
    },
    {
      title: "Medical Support Volunteer",
      description: "Assist with medical aid distribution and patient support.",
      commitment: "8-10 hours/week",
      location: "Lagos, Abuja, Kano",
      icon: Heart
    },
    {
      title: "Data Entry Specialist",
      description: "Help maintain our warrior database and program records.",
      commitment: "2-4 hours/week",
      location: "Remote",
      icon: Briefcase
    },
    {
      title: "Event Coordinator",
      description: "Organize awareness events and fundraising activities.",
      commitment: "6-8 hours/week",
      location: "Major cities",
      icon: Calendar
    }
  ];

  const partnershipTypes = [
    {
      title: "Healthcare Partnerships",
      description: "Collaborate with hospitals and clinics to improve SCD care.",
      benefits: ["Expanded patient reach", "Shared resources", "Joint research opportunities"],
      icon: Heart
    },
    {
      title: "Corporate Sponsorship",
      description: "Partner with businesses to fund programs and initiatives.",
      benefits: ["Brand visibility", "CSR impact", "Employee engagement"],
      icon: Briefcase
    },
    {
      title: "Educational Institutions",
      description: "Work with schools and universities on awareness programs.",
      benefits: ["Student engagement", "Research collaboration", "Community impact"],
      icon: Users
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-google-orange to-google-red py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Get Involved</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Join our mission to support SCD warriors across Nigeria. Every contribution,
            big or small, makes a meaningful difference in someone's life.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('donate')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'donate'
                  ? 'border-google-red text-google-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center space-x-2">
                <Gift className="h-4 w-4" />
                <span>Donate</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('volunteer')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'volunteer'
                  ? 'border-google-red text-google-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Volunteer</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('partner')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'partner'
                  ? 'border-google-red text-google-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4" />
                <span>Partner</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Donate Tab */}
      {activeTab === 'donate' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Make a Donation</h2>
              <p className="text-xl text-gray-600">
                Your donation directly supports SCD warriors with medical aid, education, and community programs.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Impact</h3>
                  <div className="space-y-4">
                    {donationOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => setDonationAmount(option.amount)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${donationAmount === option.amount
                            ? 'border-google-red bg-red-50'
                            : 'border-gray-200 hover:border-google-red'
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xl font-bold text-gray-900">₦{parseInt(option.amount).toLocaleString()}</div>
                            <div className="text-gray-600 text-sm mt-1">{option.impact}</div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${donationAmount === option.amount
                              ? 'border-google-red bg-google-red'
                              : 'border-gray-300'
                            }`}></div>
                        </div>
                      </div>
                    ))}

                    <div className="p-4 border-2 border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          id="custom"
                          name="amount"
                          checked={donationAmount === 'custom'}
                          onChange={() => setDonationAmount('custom')}
                          className="text-google-red"
                        />
                        <label htmlFor="custom" className="flex-1">
                          <div className="text-lg font-semibold text-gray-900">Custom Amount</div>
                          <input
                            type="number"
                            placeholder="Enter amount in Naira"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Donation Details</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="anonymous" className="text-google-red" />
                      <label htmlFor="anonymous" className="text-sm text-gray-600">
                        Make this donation anonymous
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="newsletter" className="text-google-red" />
                      <label htmlFor="newsletter" className="text-sm text-gray-600">
                        Subscribe to our newsletter for updates
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-google-red text-white py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
                    >
                      Donate Now
                    </button>
                  </form>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Secure Payment</h4>
                    <p className="text-sm text-gray-600">
                      Your donation is processed securely through our encrypted payment system.
                      You will receive a receipt via email for tax purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Volunteer Tab */}
      {activeTab === 'volunteer' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Volunteer Opportunities</h2>
              <p className="text-xl text-gray-600">
                Use your skills and passion to make a direct impact in the lives of SCD warriors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {volunteerOpportunities.map((opportunity, index) => {
                const IconComponent = opportunity.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                    <div className="bg-google-red p-3 rounded-full w-fit mb-6">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{opportunity.title}</h3>
                    <p className="text-gray-600 mb-4">{opportunity.description}</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Time Commitment: {opportunity.commitment}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Location: {opportunity.location}</span>
                      </div>
                    </div>
                    <button className="mt-6 w-full bg-google-orange text-white py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors">
                      Apply Now
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Volunteer Application</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Location *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                  >
                    <option value="">Select State</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Kano">Kano</option>
                    <option value="Rivers">Rivers</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Interest *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-google-red" />
                      <span>Community Education</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-google-red" />
                      <span>Medical Support</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-google-red" />
                      <span>Data Management</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-google-red" />
                      <span>Event Coordination</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to volunteer with SALFAR?
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                  ></textarea>
                </div>

                <div className="md:col-span-2 text-center">
                  <button
                    type="submit"
                    className="bg-google-red text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Partner Tab */}
      {activeTab === 'partner' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Partnership Opportunities</h2>
              <p className="text-xl text-gray-600">
                Join us as a strategic partner to amplify our impact and reach more SCD warriors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {partnershipTypes.map((partnership, index) => {
                const IconComponent = partnership.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                    <div className="bg-google-green p-3 rounded-full w-fit mb-6">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{partnership.title}</h3>
                    <p className="text-gray-600 mb-4">{partnership.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Benefits:</h4>
                      {partnership.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-google-green rounded-full"></div>
                          <span className="text-gray-600 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Partnership Inquiry</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partnership Type *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                  >
                    <option value="">Select Partnership Type</option>
                    <option value="healthcare">Healthcare Partnership</option>
                    <option value="corporate">Corporate Sponsorship</option>
                    <option value="educational">Educational Institution</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your organization and partnership goals
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                  ></textarea>
                </div>

                <div className="md:col-span-2 text-center">
                  <button
                    type="submit"
                    className="bg-google-green text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
                  >
                    Submit Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Need More Information?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our team is here to help you find the best way to get involved with SALFAR.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-google-red p-3 rounded-full mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">info@salfarsickleaid.org</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-google-orange p-3 rounded-full mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+2349061550304</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-google-green p-3 rounded-full mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">Room 215, Broadfield Hotel, Apo Bridge Abuja</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};