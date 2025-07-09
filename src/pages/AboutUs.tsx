import React, { useState } from 'react';
import { Users, Target, Eye, Heart, Award, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableTextProps {
  children: React.ReactNode;
  title: string;
}

const ExpandableSection: React.FC<ExpandableTextProps> = ({ children, title }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        {isExpanded ? <ChevronUp className="h-5 w-5 text-google-red" /> : <ChevronDown className="h-5 w-5 text-google-red" />}
      </button>
      {isExpanded && (
        <div className="mt-4 text-gray-700 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

export const AboutUs: React.FC = () => {
  const goals = [
    {
      title: "Enhance Access to Healthcare and Support Services",
      content: "Improve access to quality healthcare services, medications, and specialized treatment for SCD warriors across Nigeria through partnerships with healthcare providers and direct support programs."
    },
    {
      title: "Empower SCD Warriors Through Education and Skills",
      content: "Provide educational opportunities and skills development programs to help SCD warriors build sustainable careers and achieve economic independence despite health challenges."
    },
    {
      title: "Create Sustainable Livelihood Opportunities",
      content: "Develop and implement programs that create long-term economic opportunities for SCD warriors, including entrepreneurship support and job placement assistance."
    },
    {
      title: "Build a Robust Social Safety Net",
      content: "Establish comprehensive support systems that provide emergency assistance, ongoing care, and community support for SCD warriors and their families."
    },
    {
      title: "Promote Inclusive and Informed Relationships",
      content: "Advocate for understanding and acceptance in relationships and marriages, providing education and counseling to reduce stigma and promote inclusive love choices."
    },
    {
      title: "Strengthen Advocacy and Awareness Campaigns",
      content: "Increase public awareness about SCD, advocate for policy changes, and work to eliminate discrimination against people living with the condition."
    },
    {
      title: "Drive Gender Inclusion and Empowerment",
      content: "Address the unique challenges faced by women and girls living with SCD, including menstrual health support and gender-specific empowerment programs."
    },
    {
      title: "Foster Leadership and Capacity Building",
      content: "Develop leadership skills among SCD warriors and build organizational capacity to ensure sustainable impact and community-led solutions."
    },
    {
      title: "Expand Access to Social Amenities and Community Support",
      content: "Work to improve access to basic social services and community resources that are essential for the wellbeing of SCD warriors and their families."
    },
    {
      title: "Strengthen Institutional Capacity and Partnerships",
      content: "Build strong partnerships with local and international organizations while strengthening our own institutional capacity to deliver effective programs."
    }
  ];

  const objectives = [
    "To provide financial assistance and support to sickle cell warriors",
    "To create a national registry and database of sickle cell warriors in Nigeria",
    "To raise awareness about sickle cell disease",
    "To advocate for improved healthcare policies for sickle cell warriors",
    "To provide psychosocial support to sickle cell warriors",
    "To empower sickle cell warriors economically and socially",
    "To promote research on sickle cell disease",
    "To build partnerships and collaborations with local and international organizations",
    "To ensure financial sustainability for the NGO",
    "To ensure transparency and accountability in all activities",
    "To Promote Access to Basic Education for Sickle Cell Warriors and Children of Warriors in Need",
    "To Provide Skills Acquisition Training for Teenagers Living with Sickle Cell Disease",
    "To support the emotional well-being of persons living with Sickle Cell Disease by facilitating relationship education, genotype-compatible counseling, and advocacy for inclusive, stigma-free love and marriage choices."
  ];

  const programs = [
    "SCD National Register Project",
    "Scholar Warrior Program",
    "SkillUp Warriors Initiative",
    "SafeNet Support Program",
    "Love Strong Campaign",
    "She Strong Warriors Program",
    "Lead Warriors Academy",
    "Warrior Blood Shield Project"
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-google-red to-google-orange py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">About SALFAR</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Dedicated to supporting SCD warriors across Nigeria through comprehensive care, 
            advocacy, and community building initiatives.
          </p>
        </div>
      </section>

      {/* Mission, Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="bg-google-red p-4 rounded-full w-fit mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg">
                To support and empower Sickle Cell warriors, especially the underserved, through access to healthcare, education, skill acquisition, psychosocial support, and inclusive advocacy—creating sustainable solutions for their wellbeing and independence.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-google-orange p-4 rounded-full w-fit mx-auto mb-6">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 text-lg">
                A Nigeria where every person living with Sickle Cell Disease lives a healthy, empowered, and dignified life—free from discrimination, poverty, and isolation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Full Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">About Us</h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed bg-white rounded-lg p-8 shadow-lg">
            <p className="mb-6">
              Sickle Cell Disease (SCD) remains one of the most prevalent and neglected genetic disorders in Nigeria, with an estimated 150,000 children born annually with the condition. Despite the public health crisis it represents, most interventions focus solely on genotype awareness and advocacy against incompatible marriages. Little attention is paid to those already living with the condition SCD warriors who face immense challenges such as poverty, limited access to healthcare, social stigma, educational barriers, and economic exclusion.
            </p>
            
            <p className="mb-6">
              Salfar Sickle Aid Initiative was born out of the passion to change this narrative established in memory of Salma, a dear friend of the founder who passed away from complications of SCD in 2017. The NGO is committed to supporting sickle cell warriors through healthcare access, education, skills development, economic empowerment, and psychosocial support.
            </p>
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Goals</h2>
          </div>

          <div className="space-y-4">
            {goals.map((goal, index) => (
              <ExpandableSection key={index} title={goal.title}>
                <p>{goal.content}</p>
              </ExpandableSection>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Objectives of Salfar Sickle Aid Initiative</h2>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-4">
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-google-red w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{objective}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Programs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <div key={index} className="bg-gradient-to-br from-google-red to-google-orange rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-white bg-opacity-20 p-3 rounded-full w-fit mb-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{program}</h3>
                <p className="text-sm opacity-90">Click to learn more about this program</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Address and Contact */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Address */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="bg-google-red p-3 rounded-full w-fit mb-6">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Address</h3>
              <p className="text-gray-700 text-lg">
                E18 NPA Quarters, IBB way, Maitama Abuja
              </p>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
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
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-red"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-google-red text-white py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h3>
            <div className="flex justify-center space-x-6">
              <a href="#" className="bg-google-blue text-white p-3 rounded-full hover:bg-blue-600 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="bg-google-blue text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="bg-google-red text-white p-3 rounded-full hover:bg-red-600 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
              <a href="#" className="bg-google-blue text-white p-3 rounded-full hover:bg-blue-800 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};