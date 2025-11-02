/**
 * 🌿 Global Type Definitions for AgriGuard AI
 * -------------------------------------------------
 * This file defines all shared interfaces and types 
 * used across the app for strong typing and clarity.
 */

// 🌱 Navigation
export interface NavigationItem {
  /** Display name of the navigation link */
  name: string;
  /** Route path (e.g., '/detect', '/chat') */
  path: string;
  /** Icon name or identifier (Lucide or custom) */
  icon: string;
}

// 🌾 Disease Detection
export interface DiseaseDetectionResult {
  /** Predicted disease name */
  disease: string;
  /** Confidence score (0–1) */
  confidence: number;
  /** Recommended treatment or prevention steps */
  treatment: string;
}

// 🧪 Fertilizer Prediction
export interface FertilizerPrediction {
  /** Recommended fertilizer name */
  fertilizer: string;
  /** Instructions or usage guide */
  usage_guide: string;
}

// 💬 Chatbot
export interface ChatMessage {
  /** Unique message ID */
  id: string;
  /** Message text content */
  text: string;
  /** Message sender ('user' | 'bot') */
  sender: 'user' | 'bot';
  /** Timestamp of the message */
  timestamp: Date;
}

// 🌦️ Live Monitoring
export interface MonitoringData {
  /** Current temperature in °C */
  temperature: number;
  /** Current humidity percentage */
  humidity: number;
  /** Detected or predicted crop condition */
  cropCondition: string;
  /** Weather forecast text */
  weatherPrediction: string;
}
