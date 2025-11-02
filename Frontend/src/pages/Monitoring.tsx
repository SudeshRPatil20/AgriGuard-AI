import { Cloud, Thermometer, Droplets, Sprout, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  cropCondition: string;
  weatherStatus: string;
  lastUpdated: Date;
}

export default function Monitoring() {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 26.5,
    humidity: 62.3,
    soilMoisture: 48.7,
    cropCondition: 'Healthy',
    weatherStatus: 'Clear',
    lastUpdated: new Date(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prev) => ({
        ...prev,
        temperature: 20 + Math.random() * 15,
        humidity: 40 + Math.random() * 40,
        soilMoisture: 30 + Math.random() * 40,
        lastUpdated: new Date(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getConditionColor = (condition: string) => {
    if (condition === 'Healthy') return 'text-green-600 bg-green-50 border-green-200';
    if (condition === 'Warning') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const metrics = [
    {
      icon: Thermometer,
      label: 'Temperature',
      value: `${sensorData.temperature.toFixed(1)}°C`,
      status: sensorData.temperature > 30 ? 'High' : 'Normal',
      color: sensorData.temperature > 30 ? 'from-red-400 to-orange-500' : 'from-blue-400 to-cyan-500',
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${sensorData.humidity.toFixed(1)}%`,
      status: sensorData.humidity < 50 ? 'Low' : 'Normal',
      color: 'from-blue-400 to-indigo-500',
    },
    {
      icon: Cloud,
      label: 'Soil Moisture',
      value: `${sensorData.soilMoisture.toFixed(1)}%`,
      status: sensorData.soilMoisture < 40 ? 'Low' : 'Optimal',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: Sprout,
      label: 'Crop Condition',
      value: sensorData.cropCondition,
      status: 'Monitoring',
      color: 'from-green-500 to-lime-600',
    },
  ];

  const alerts = [
    {
      type: 'info',
      message: 'Weather forecast: Clear skies for the next 3 days',
      time: '2 hours ago',
    },
    {
      type: 'warning',
      message: 'Soil moisture approaching low threshold',
      time: '4 hours ago',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl mb-4">
            <Cloud className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Monitoring Cloud
          </h1>
          <p className="text-lg text-gray-600">
            Real-time monitoring of environmental conditions and crop health
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {sensorData.lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`h-1 bg-gradient-to-r ${metric.color}`}></div>
                <div className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">{metric.label}</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</p>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      metric.status === 'Low' || metric.status === 'High'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {metric.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Weather Forecast</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Today', 'Tomorrow', 'Day 3', 'Day 4'].map((day, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <p className="font-semibold text-gray-700 mb-2">{day}</p>
                  <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Cloud className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{(24 + index * 2)}°C</p>
                  <p className="text-xs text-gray-600 mt-1">Clear</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Environmental Trends</h3>
              <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Chart Placeholder</p>
                  <p className="text-sm text-gray-500">Temperature & Humidity trends over time</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Alerts & Notifications
              </h2>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${
                      alert.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        alert.type === 'warning' ? 'text-yellow-900' : 'text-blue-900'
                      }`}
                    >
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-all duration-200">
                  Activate Irrigation
                </button>
                <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-all duration-200">
                  Download Report
                </button>
                <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-all duration-200">
                  Set Alert Threshold
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <h3 className="font-semibold text-orange-900 mb-2">About Monitoring Cloud</h3>
          <p className="text-orange-800 text-sm">
            This dashboard displays real-time data from environmental sensors. Data is updated every 5 seconds for demonstration purposes. In production, this would be connected to actual IoT sensors and weather APIs for accurate, real-time agricultural monitoring.
          </p>
        </div>
      </div>
    </div>
  );
}
