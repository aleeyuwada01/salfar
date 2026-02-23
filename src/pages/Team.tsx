import React from 'react';
import { Users, Award, Target, Heart } from 'lucide-react';
import { ExpandableText } from '../components/ExpandableText';
import salehImage from '../assets/team/WhatsApp Image 2025-07-08 at 10.00.33_a6dd1dea.jpg';
import happinessImage from '../assets/team/WhatsApp Image 2025-07-08 at 10.04.27_13bf693a.jpg';
import ruqaiyaImage from '../assets/team/Ruqaiya.png';
import musaImage from '../assets/team/Musa.jpg';
import yusraImage from '../assets/team/yusra_kure.jpeg';
import makieImage from '../assets/team/makie.jpeg';
import bashirImage from '../assets/team/Bashir_Kola_Turawa.jpeg';

export const Team: React.FC = () => {
  const teamMembers = [
    {
      name: "Saleh Farouq Gagarawa",
      title: "Executive Director (Policy)",
      description: "Saleh Farouq Gagarawa provides strategic and policy leadership for the Salfar Sickle Aid Initiative (SSAI), guiding the organization's vision, mission, and long-term direction. He leads high-level advocacy, institutional positioning, and national representation, ensuring that SSAI's work is driven by strong policy frameworks and aligned with its core pillars. Through his leadership, SSAI continues to strengthen its impact, partnerships, and sustainability in advancing support for sickle cell warriors.",
      image: salehImage,
      icon: Target
    },
    {
      name: "Happiness Barnabas",
      title: "Deputy Executive Director (Partnership & Human Resources)",
      description: "Happiness Barnabas serves as the Deputy Executive Director (Partnership & Human Resources) at the Salfar Sickle Aid Initiative (SSAI), where she provides second-level executive support and leads the organization's partnership and human resource functions. She drives donor engagement, strategic collaborations, and team development, ensuring SSAI builds strong alliances while nurturing a motivated and high-performing workforce to advance its mission.",
      image: happinessImage,
      icon: Award
    },
    {
      name: "Bashir Kola Turawa",
      title: "Director of Operations & Administration",
      description: "Bashir Kola Turawa oversees the internal operations and administrative systems of the Salfar Sickle Aid Initiative (SSAI). He ensures efficient day-to-day functioning, strengthens organizational processes, and promotes operational excellence across all units. Through his role, he supports the institutional growth of SSAI by building structured, accountable, and responsive systems that enable effective program delivery.",
      image: bashirImage,
      icon: Target
    },
    {
      name: "Makie",
      title: "Programs Lead",
      description: "Makie leads the design, coordination, and implementation of SSAI's program activities. She works closely with teams and partners to ensure that interventions are impactful, community-responsive, and aligned with the organization's strategic priorities. Her role is central to translating SSAI's mission into meaningful outcomes for sickle cell warriors and their families.",
      image: makieImage,
      icon: Award
    },
    {
      name: "Yusra Kure",
      title: "Media & Engagement Lead",
      description: "Yusra Kure leads SSAI's media, communications, and public engagement efforts. She drives the organization's storytelling, digital presence, and stakeholder outreach to amplify awareness around sickle cell issues. Through strategic communication and audience engagement, she helps position SSAI's voice and expand its visibility and influence.",
      image: yusraImage,
      icon: Users
    },
    {
      name: "Musa Elachi",
      title: "Data, Monitoring & Registry Officer",
      description: "Musa Elachi manages SSAI's data systems, monitoring processes, and sickle cell registry development. He ensures accurate data collection, analysis, and reporting to support evidence-based programming and decision-making. His work strengthens SSAI's ability to track impact, generate insights, and build credible data-driven interventions within the sickle cell space.",
      image: musaImage,
      icon: Target
    },
    {
      name: "Ruqaiya Aliyu",
      title: "Volunteer Coordination & Community Engagement Officer",
      description: "Ruqaiya Aliyu coordinates SSAI's volunteer network and community engagement activities. She mobilizes and supports volunteers while strengthening grassroots connections with sickle cell warriors and affected communities. Her role ensures that SSAI's interventions remain community-driven, inclusive, and responsive to real needs on the ground.",
      image: ruqaiyaImage,
      icon: Users
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-google-blue to-google-green py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Our Team</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Meet the dedicated individuals leading SALFAR's mission to support and empower 
            SCD warriors across Nigeria.
          </p>
        </div>
      </section>

      {/* Team Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-google-red p-4 rounded-full w-fit mx-auto mb-8">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Leadership Team</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our leadership team combines lived experience, professional expertise, and unwavering 
            commitment to creating meaningful change in the lives of SCD warriors. Together, we 
            bring strategic vision, operational excellence, and deep community understanding to 
            every aspect of our work.
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => {
              const IconComponent = member.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-w-16 aspect-h-12">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-80 object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-google-red p-3 rounded-full mr-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
                        <p className="text-google-red font-semibold">{member.title}</p>
                      </div>
                    </div>
                    
                    <div className="text-gray-700 leading-relaxed">
                      <ExpandableText previewLines={4}>
                        <p>{member.description}</p>
                      </ExpandableText>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide our team and drive our mission forward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-google-red p-4 rounded-full w-fit mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Empathy</h3>
              <p className="text-gray-600">
                We lead with understanding and compassion, recognizing the lived experiences of every warrior.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-google-orange p-4 rounded-full w-fit mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Inclusion</h3>
              <p className="text-gray-600">
                We ensure every voice is heard and every warrior has access to our programs and support.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-google-green p-4 rounded-full w-fit mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Impact</h3>
              <p className="text-gray-600">
                We focus on creating measurable, sustainable change that transforms lives and communities.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-google-blue p-4 rounded-full w-fit mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for the highest standards in everything we do, from program delivery to partnerships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-20 bg-google-red">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Our Mission</h2>
          <p className="text-xl text-white mb-8">
            We're always looking for passionate individuals who share our commitment to supporting 
            SCD warriors. Whether as staff, volunteers, or partners, there's a place for you in our movement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-google-red px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors">
              View Open Positions
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-google-red transition-colors">
              Volunteer With Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};