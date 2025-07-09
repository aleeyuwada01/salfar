import React from 'react';
import { Heart, Users, BookOpen, Shield, Stethoscope, GraduationCap, Megaphone, HandHeart, Database, Award, Target, Zap } from 'lucide-react';

export const Programs: React.FC = () => {
  const programs = [
    {
      title: "SCD National Register Project",
      description: "Creating a comprehensive national database of SCD warriors to better understand the scope and needs of the community across Nigeria.",
      icon: Database,
      color: "bg-google-red",
      features: [
        "National warrior registration system",
        "Comprehensive health data collection",
        "Geographic mapping of SCD prevalence",
        "Research and policy development support"
      ],
      image: "https://images.pexels.com/photos/6129044/pexels-photo-6129044.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Scholar Warrior Program",
      description: "Educational support and scholarship opportunities for SCD warriors to pursue their academic dreams despite health challenges.",
      icon: GraduationCap,
      color: "bg-google-orange",
      features: [
        "Educational scholarships",
        "Academic mentorship",
        "School fee assistance",
        "Educational materials support"
      ],
      image: "https://images.pexels.com/photos/5427674/pexels-photo-5427674.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "SkillUp Warriors Initiative",
      description: "Skills acquisition and vocational training programs designed to empower SCD warriors with marketable skills for economic independence.",
      icon: Award,
      color: "bg-google-green",
      features: [
        "Vocational training programs",
        "Digital skills development",
        "Entrepreneurship support",
        "Job placement assistance"
      ],
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "SafeNet Support Program",
      description: "Comprehensive social safety net providing emergency assistance, healthcare support, and ongoing care for SCD warriors in crisis.",
      icon: Shield,
      color: "bg-google-blue",
      features: [
        "Emergency medical funding",
        "Crisis intervention support",
        "Healthcare access facilitation",
        "Family support services"
      ],
      image: "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Love Strong Campaign",
      description: "Promoting inclusive relationships and fighting stigma around SCD in dating, marriage, and family planning decisions.",
      icon: Heart,
      color: "bg-pink-500",
      features: [
        "Relationship education programs",
        "Genotype-compatible counseling",
        "Anti-stigma advocacy",
        "Family planning support"
      ],
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "She Strong Warriors Program",
      description: "Gender-specific support addressing the unique challenges faced by women and girls living with SCD, including menstrual health and empowerment.",
      icon: Users,
      color: "bg-purple-500",
      features: [
        "Menstrual hygiene support",
        "Women's health education",
        "Gender empowerment workshops",
        "Female warrior mentorship"
      ],
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Lead Warriors Academy",
      description: "Leadership development and capacity building program to empower SCD warriors to become advocates and leaders in their communities.",
      icon: Target,
      color: "bg-indigo-500",
      features: [
        "Leadership training",
        "Advocacy skills development",
        "Community organizing",
        "Public speaking training"
      ],
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Warrior Blood Shield Project",
      description: "Specialized program focusing on blood-related health needs, including blood donation drives and transfusion support for SCD warriors.",
      icon: Zap,
      color: "bg-red-600",
      features: [
        "Blood donation campaigns",
        "Transfusion support services",
        "Blood bank partnerships",
        "Emergency blood access"
      ],
      image: "https://images.pexels.com/photos/6129020/pexels-photo-6129020.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  const impactStats = [
    { number: "2,847", label: "Warriors Supported", icon: Heart },
    { number: "28", label: "States Reached", icon: Shield },
    { number: "156", label: "Support Groups", icon: Users },
    { number: "8", label: "Active Programs", icon: BookOpen }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-google-blue to-google-green py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Our Programs</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Comprehensive initiatives designed to support, educate, and empower 
            SCD warriors across Nigeria through targeted interventions.
          </p>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-gray-100 p-4 rounded-full w-fit mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-google-red" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Key Programs</h2>
            <p className="text-xl text-gray-600">
              Targeted initiatives addressing the diverse needs of our SCD warrior community.
            </p>
          </div>

          <div className="space-y-16">
            {programs.map((program, index) => {
              const IconComponent = program.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
                    <img 
                      src={program.image} 
                      alt={program.title}
                      className="rounded-lg shadow-lg w-full h-80 object-cover"
                    />
                  </div>
                  
                  <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
                    <div className={`${program.color} p-3 rounded-full w-fit mb-6`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{program.title}</h3>
                    <p className="text-gray-600 text-lg mb-6">{program.description}</p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                      {program.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-google-red rounded-full"></div>
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">
              Real impact stories from our SCD warrior community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="mb-6">
                <img 
                  src="https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Success story"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The Scholar Warrior Program helped me complete my university education. 
                Now I'm a teacher inspiring other young warriors to pursue their dreams."
              </p>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">Amina K.</p>
                <p className="text-gray-600">Lagos State</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="mb-6">
                <img 
                  src="https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Success story"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Through the SkillUp Warriors Initiative, I learned digital marketing. 
                I now run my own online business and support my family."
              </p>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">Ibrahim M.</p>
                <p className="text-gray-600">Kano State</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="mb-6">
                <img 
                  src="https://images.pexels.com/photos/5327590/pexels-photo-5327590.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Success story"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The SafeNet Support Program saved my life during a crisis. 
                The emergency medical funding helped me get the treatment I needed."
              </p>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">Grace O.</p>
                <p className="text-gray-600">Rivers State</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-google-red">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Our Programs</h2>
          <p className="text-xl text-white mb-8">
            Whether you're a warrior seeking support or someone who wants to make a difference, 
            there's a place for you in our programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-google-red px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors">
              Apply for Support
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-google-red transition-colors">
              Become a Volunteer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};