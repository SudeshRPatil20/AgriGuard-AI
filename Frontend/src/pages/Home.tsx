import { Sprout, Droplets, Bot, Cloud } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const features = [
    {
      icon: Sprout,
      title: 'Disease Detection',
      description:
        'Upload plant images to detect diseases using AI-powered CNN models and get instant treatment recommendations.',
      path: 'disease',
      gradient: 'from-green-400 to-emerald-500',
    },
    {
      icon: Droplets,
      title: 'Fertilizer Prediction',
      description:
        'Get optimal fertilizer recommendations based on soil conditions, crop type, and environmental factors.',
      path: 'fertilizer',
      gradient: 'from-blue-400 to-cyan-500',
    },
    {
      icon: Bot,
      title: 'AgriBot Q&A',
      description:
        'Chat with our AI-powered agricultural assistant for instant answers to your farming questions.',
      path: 'agribot',
      gradient: 'from-purple-400 to-pink-500',
    },
    {
      icon: Cloud,
      title: 'Monitoring Cloud',
      description:
        'Real-time monitoring of temperature, humidity, crop conditions, and weather predictions.',
      path: 'monitoring',
      gradient: 'from-orange-400 to-red-500',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🎬 Background Video with perfect darkness */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-[35%]" // ✨ 35% brightness = clean & clear
      >
        <source src="/videos/farm-background.mp4" type="video/mp4" />
      </video>

      {/* 🖤 Subtle dark overlay for clarity */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* ✅ Light misty gradient for aesthetic balance */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-green-50/10 to-blue-50/10 backdrop-blur-[1px]"></div>

      {/* ✅ Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              AgriGuard AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Empowering Farmers with AI — Detect, Predict, and Grow Smarter.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('disease')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </button>
            <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden group"
                onClick={() => onNavigate(feature.path)}
              >
                <div className={`h-2 bg-gradient-to-r ${feature.gradient}`}></div>
                <div className="p-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                  <button className="mt-6 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition-all duration-200">
                    Explore →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already using AgriGuard AI to
            increase yields and reduce crop losses.
          </p>
          <button
            onClick={() => onNavigate('trial')}
            className="px-8 py-4 bg-white text-green-600 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
}
