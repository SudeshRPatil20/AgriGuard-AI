import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, Droplets, Sparkles } from 'lucide-react';

export default function FertilizerPrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    moisture: '',
    crop_type: '',
    soil_type: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
  });

  // ✅ API base URL (auto switches for local & deployed)
  const API_BASE =
    import.meta.env.MODE === "development"
      ? "http://127.0.0.1:8000"
      : "https://agriguard-ai-1.onrender.com";

  const cropTypes = [
    'Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane',
    'Potato', 'Tomato', 'Onion', 'Soybean', 'Groundnut'
  ];

  const soilTypes = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // ✅ Create FormData to match FastAPI's Form(...) parameters
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // ✅ Step 1: Predict fertilizer
      const predictionResponse = await fetch(`${API_BASE}/prediction`, {
        method: 'POST',
        body: formDataToSend, // no headers needed for FormData
      });

      if (!predictionResponse.ok) throw new Error('Failed to get prediction');
      const predictionData = await predictionResponse.json();

      // ✅ Step 2: (Optional) Extract rag_steps nicely
      const ragSteps = predictionData.rag_steps;
      const formattedSteps = Array.isArray(ragSteps)
        ? ragSteps.join('\n')
        : typeof ragSteps === 'string'
        ? ragSteps
        : 'No RAG insights available.';

      // ✅ Set results
      setResult({
        fertilizer: predictionData.prediction || "No prediction returned",
        usage_guide: formattedSteps,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl mb-4">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fertilizer Prediction
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get smart fertilizer recommendations powered by AI and expert agricultural knowledge.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Temperature (°C)', name: 'temperature', placeholder: 'e.g., 25.5' },
                { label: 'Humidity (%)', name: 'humidity', placeholder: 'e.g., 65.0' },
                { label: 'Moisture (%)', name: 'moisture', placeholder: 'e.g., 45.0' },
              ].map((item) => (
                <div key={item.name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{item.label}</label>
                  <input
                    type="number"
                    name={item.name}
                    value={(formData as any)[item.name]}
                    onChange={handleChange}
                    required
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={item.placeholder}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Type</label>
                <select
                  name="crop_type"
                  value={formData.crop_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select crop</option>
                  {cropTypes.map((crop) => (
                    <option key={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Soil Type</label>
                <select
                  name="soil_type"
                  value={formData.soil_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select soil</option>
                  {soilTypes.map((soil) => (
                    <option key={soil}>{soil}</option>
                  ))}
                </select>
              </div>

              {['nitrogen', 'phosphorus', 'potassium'].map((nutrient) => (
                <div key={nutrient}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                    {nutrient} ({nutrient[0].toUpperCase()})
                  </label>
                  <input
                    type="number"
                    name={nutrient}
                    value={(formData as any)[nutrient]}
                    onChange={handleChange}
                    required
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., 40.0"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Getting Smart Recommendation...
                </>
              ) : (
                'Get Fertilizer Recommendation'
              )}
            </button>
          </form>

          {/* Error Alert */}
          {error && (
            <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-3xl shadow-lg p-8">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Recommended Fertilizer: <span className="text-blue-600">{result.fertilizer}</span>
                  </h3>
                  <p className="text-gray-700 text-sm italic">
                    Tailored recommendation based on your soil and crop data.
                  </p>
                </div>
              </div>

              <div className="border-t border-blue-200 pt-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-cyan-500" />
                  <h4 className="text-lg font-semibold text-gray-800">AI Insights</h4>
                </div>
                <div className="bg-white/70 rounded-2xl p-4 text-gray-800 shadow-inner leading-relaxed whitespace-pre-line">
                  {result.usage_guide}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6">
          <h3 className="font-semibold text-green-900 mb-2">Important Notes</h3>
          <ul className="space-y-2 text-green-800 text-sm">
            <li>• Ensure all measurements are accurate for best recommendations.</li>
            <li>• Follow the usage guide carefully to avoid over-fertilization.</li>
            <li>• Consider seasonal variations in your application.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
