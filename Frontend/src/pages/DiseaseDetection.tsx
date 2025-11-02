import { useState } from "react";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function DiseaseDetection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(
        "https://agriguard-ai-nckd.onrender.com/classify_image",
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Failed to get prediction");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
          🌿 Plant Disease Detection
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Upload a leaf image to detect plant diseases and get AI treatment
          suggestions.
        </p>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200"
            >
              <div className="flex flex-col items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 rounded-lg object-contain"
                  />
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG or JPEG (MAX. 10MB)
                    </p>
                  </>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>

            <button
              type="submit"
              disabled={!selectedFile || loading}
              className="mt-6 w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Detect Disease"
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-1" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-green-900 mb-2">
                    Disease Detected
                  </h2>
                  <p className="text-gray-800 text-lg mb-4">
                    <span className="font-semibold">Name:</span>{" "}
                    {result.disease || "Unknown"}
                  </p>

                  {result.solution && (
                    <>
                      <p className="font-semibold text-gray-700">Treatment:</p>
                      <ul className="list-disc list-inside text-gray-700 whitespace-pre-line">
                        {result.solution.split("\n").map((line: string, i: number) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {result.marked_image && (
                    <img
                      src={`https://agriguard-ai-nckd.onrender.com/${result.marked_image}`}
                      alt="Processed Leaf"
                      className="mt-4 rounded-lg border border-gray-200"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Tips for Best Results
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• Take clear, well-lit photos of affected plant parts.</li>
            <li>• Ensure the diseased area is clearly visible.</li>
            <li>• Avoid blurry or low-resolution images.</li>
            <li>• One plant per image works best.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
