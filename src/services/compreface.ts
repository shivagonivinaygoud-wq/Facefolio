
export interface DetectedFace {
  age: {
    high: number;
    low: number;
  };
  gender: {
    value: string;
    probability: number;
  };
  embedding: number[];
  box: {
    probability: number;
    x_max: number;
    y_max: number;
    x_min: number;
    y_min: number;
  };
  landmarks: number[][];
  execution_time: {
    age: number;
    gender: number;
    detector: number;
    calculator: number;
  };
}

export interface CompreFaceDetectionResult {
  result: DetectedFace[];
  plugins_versions: {
    [key: string]: string;
  };
}

// CompreFace configuration - update these after setting up CompreFace
const COMPREFACE_CONFIG = {
  baseUrl: 'http://localhost:8000',
  apiKey: 'your-api-key-here', // Replace with actual API key from CompreFace dashboard
  detectionUrl: '/api/v1/detection/detect',
  recognitionUrl: '/api/v1/recognition/recognize',
};

export class CompreFaceService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = COMPREFACE_CONFIG.baseUrl;
    this.apiKey = COMPREFACE_CONFIG.apiKey;
  }

  async detectFaces(imageFile: File): Promise<DetectedFace[]> {
    // Use mock face detection for development (no Docker required)
    console.log('Using mock face detection for development');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return this.mockFaceDetection();
  }

  // Mock face detection for development when CompreFace is not running
  private mockFaceDetection(): DetectedFace[] {
    // Return mock data with random face detection
    const mockFaces = Math.floor(Math.random() * 3) + 1; // 1-3 faces
    
    return Array.from({ length: mockFaces }, (_, index) => ({
      age: {
        high: Math.floor(Math.random() * 20) + 30,
        low: Math.floor(Math.random() * 10) + 20,
      },
      gender: {
        value: Math.random() > 0.5 ? 'male' : 'female',
        probability: Math.random() * 0.3 + 0.7,
      },
      embedding: Array.from({ length: 512 }, () => Math.random()),
      box: {
        probability: Math.random() * 0.2 + 0.8,
        x_max: Math.floor(Math.random() * 100) + 150,
        y_max: Math.floor(Math.random() * 100) + 150,
        x_min: Math.floor(Math.random() * 50) + 50,
        y_min: Math.floor(Math.random() * 50) + 50,
      },
      landmarks: Array.from({ length: 68 }, () => [Math.random() * 200, Math.random() * 200]),
      execution_time: {
        age: Math.random() * 10,
        gender: Math.random() * 10,
        detector: Math.random() * 50,
        calculator: Math.random() * 20,
      },
    }));
  }

  // Future method for face recognition
  async recognizeFaces(imageFile: File): Promise<any> {
    // TODO: Implement face recognition
    console.log('Face recognition not implemented yet');
    return [];
  }

  // Update API key after CompreFace setup
  updateApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Update base URL if needed
  updateBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
}

export const compreFaceService = new CompreFaceService();
