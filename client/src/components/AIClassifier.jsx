import { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';

const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/RlA-_1OLL/';

export default function AIClassifier() {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      const modelURL = MODEL_URL + 'model.json';
      const metadataURL = MODEL_URL + 'metadata.json';
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !model) return;

    setLoading(true);
    setPrediction(null);

    const url = URL.createObjectURL(file);
    setPreview(url);

    setTimeout(async () => {
      const img = imageRef.current;
      const predictions = await model.predict(img);
      const top = predictions.reduce((a, b) =>
        a.probability > b.probability ? a : b
      );
      setPrediction({
        label: top.className,
        confidence: Math.round(top.probability * 100),
        all: predictions
      });
      setLoading(false);
    }, 500);
  };

  const getIcon = (label) => {
    if (label === 'Code') return '💻';
    if (label === 'Design') return '🎨';
    if (label === 'Document') return '📄';
    return '🔍';
  };

  const getColor = (label) => {
    if (label === 'Code') return 'text-green-400 bg-green-400/10';
    if (label === 'Design') return 'text-purple-400 bg-purple-400/10';
    if (label === 'Document') return 'text-blue-400 bg-blue-400/10';
    return 'text-gray-400';
  };

  return (
    <div className="bg-[#1a1a2e] border border-indigo-500/20 
      rounded-2xl p-6">
      <h3 className="text-white font-bold text-lg mb-1">
        🤖 AI File Classifier
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Upload a screenshot and AI will detect if it's 
        Code, Design, or Document
      </p>

      <label className="block w-full border-2 border-dashed 
        border-indigo-500/30 rounded-xl p-6 text-center 
        cursor-pointer hover:border-indigo-500/60 transition-all">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <p className="text-gray-400 text-sm">
          📁 Click to upload image
        </p>
      </label>

      {preview && (
        <div className="mt-4">
          <img
            ref={imageRef}
            src={preview}
            alt="preview"
            className="w-full max-h-48 object-contain rounded-xl"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center">
          <p className="text-indigo-400 animate-pulse">
            🔍 Analyzing image...
          </p>
        </div>
      )}

      {prediction && (
        <div className="mt-4">
          <div className={`flex items-center gap-3 p-4 
            rounded-xl ${getColor(prediction.label)}`}>
            <span className="text-3xl">
              {getIcon(prediction.label)}
            </span>
            <div>
              <p className="font-bold text-lg">
                {prediction.label}
              </p>
              <p className="text-sm opacity-80">
                {prediction.confidence}% confidence
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {prediction.all.map(p => (
              <div key={p.className}>
                <div className="flex justify-between 
                  text-xs text-gray-400 mb-1">
                  <span>{getIcon(p.className)} {p.className}</span>
                  <span>{Math.round(p.probability * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 
                  rounded-full h-1.5">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full 
                      transition-all duration-500"
                    style={{ 
                      width: `${Math.round(p.probability * 100)}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
