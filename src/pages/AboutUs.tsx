import React from 'react';
import { Users, Target, Eye, Heart, Award, MapPin } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const boardMembers = [
    {
      name: "Dr. Amina Kano",
      role: "Chairman, Board of Trustees",
      bio: "A renowned hematologist with over 20 years of experience in SCD research and treatment. Dr. Kano has dedicated her career to improving healthcare outcomes for SCD patients across West Africa.",
      image: "https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Prof. Ibrahim Musa",
      role: "Vice Chairman",
      bio: "Professor of Public Health at University of Lagos, specializing in community health interventions and health policy development.",
      image: "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Mrs. Fatima Abdullahi",
      role: "Secretary",
      bio: "Legal practitioner and human rights advocate with extensive experience in healthcare law and patient rights.",
      image: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Okafor",
      role: "Executive Director",
      bio: "Leading our mission with passion and expertise in healthcare management and SCD advocacy.",
      image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Ahmed Bello",
      role: "Program Manager",
      bio: "Coordinating our nationwide programs and ensuring effective implementation of our initiatives.",
      image: "https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Dr. Grace Adebayo",
      role: "Medical Director",
      bio: "Overseeing medical programs and ensuring quality healthcare delivery to our warriors.",
      image: "https://images.pexels.com/photos/5327590/pexels-photo-5327590.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
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

      {/* Mission, Vision, Goals */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-google-red p-4 rounded-full w-fit mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg">
                To provide comprehensive support, medical aid, and advocacy for individuals 
                affected by Sickle Cell Disease across Nigeria, ensuring no warrior fights alone.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-google-orange p-4 rounded-full w-fit mx-auto mb-6">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 text-lg">
                A Nigeria where every person affected by Sickle Cell Disease has access to 
                quality healthcare, support, and opportunities to live fulfilling lives.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-google-green p-4 rounded-full w-fit mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Values</h2>
              <p className="text-gray-600 text-lg">
                Compassion, integrity, excellence, and unwavering commitment to the 
                dignity and rights of every SCD warrior in our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Director's Welcome */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Executive Director"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome Message</h2>
              <p className="text-gray-600 text-lg mb-6">
                "As someone who has witnessed firsthand the challenges faced by individuals 
                with Sickle Cell Disease, I am deeply committed to our mission at SALFAR. 
                Every day, we work tirelessly to ensure that no warrior faces their battle alone."
              </p>
              <p className="text-gray-600 text-lg mb-6">
                "Our comprehensive approach combines medical support, community building, 
                and advocacy to create lasting change. Together, we are building a future 
                where every SCD warrior can thrive."
              </p>
              <div className="border-l-4 border-google-red pl-6">
                <p className="text-gray-800 font-semibold">Dr. Sarah Okafor</p>
                <p className="text-gray-600">Executive Director, SALFAR</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Board of Trustees */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Board of Trustees</h2>
            <p className="text-xl text-gray-600">
              Distinguished leaders guiding our mission and ensuring organizational excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {boardMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-google-red font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600">
              Dedicated professionals working every day to support our SCD warriors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-google-orange font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Goals & Objectives */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Goals & Objectives</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <Award className="h-6 w-6 text-google-red mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Healthcare Access</h3>
              </div>
              <p className="text-gray-600">
                Improve access to quality healthcare services and specialized SCD treatment 
                across all 36 states of Nigeria.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-google-orange mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Community Support</h3>
              </div>
              <p className="text-gray-600">
                Build strong support networks and communities where SCD warriors can 
                connect and support each other.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-google-green mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Advocacy & Policy</h3>
              </div>
              <p className="text-gray-600">
                Advocate for policy changes and increased government support for 
                SCD research and treatment programs.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-google-red mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Awareness & Education</h3>
              </div>
              <p className="text-gray-600">
                Increase public awareness about SCD, reduce stigma, and promote 
                understanding in communities nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};