import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings2, Globe, Camera, RefreshCw } from "lucide-react";
import { processImage } from "../services/api";

export default function Scanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const savedSettings = JSON.parse(localStorage.getItem("smartscan_settings") || "{}");

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(savedSettings.mode || "notes");
  const [ocrLang, setOcrLang] = useState(savedSettings.language || "en");
  const [targetLang, setTargetLang] = useState(savedSettings.targetLang || "ta");

  const navigate = useNavigate();

  // 🎥 Start camera
  useEffect(() => {
  let isMounted = true;

  if (isMounted) {
    startCamera();
  }

  return () => {
    isMounted = false;
    stopCamera();
  };
}, []);

 const startCamera = async () => {
  try {
    // ✅ Check browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported in this browser ❌");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment" // 📱 mobile back camera
      }
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

  } catch (err) {
    console.error("🎥 Camera Error:", err);

    // 🔥 Detailed error handling
    if (err.name === "NotAllowedError") {
      alert("Camera permission denied ❌\n\n👉 Allow camera in browser settings");
    } else if (err.name === "NotFoundError") {
      alert("No camera found on this device ❌");
    } else if (err.name === "NotReadableError") {
      alert("Camera is already in use by another app ❌");
    } else {
      alert("Camera error: " + err.message);
    }
  }
};
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  // 📸 Capture
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl);
    stopCamera();
  };

  // 🔄 Retake
  const retake = () => {
    setImage(null);
    startCamera();
  };

  // 🚀 Process
  const handleScan = async () => {
  try {
    // ✅ Check image first
    if (!image) {
      alert("Please capture image first ❗");
      return;
    }

    setLoading(true);

    // ✅ Convert base64 → blob safely
    const res = await fetch(image);
    if (!res.ok) throw new Error("Failed to convert image");

    const blob = await res.blob();

    const formData = new FormData();
    formData.append("file", blob, "scan.png");
    formData.append("mode", mode);
    formData.append("ocrLang", ocrLang);
    formData.append("targetLang", targetLang);

    console.log("📤 Sending request...");

    const response = await processImage(formData);

    console.log("✅ Response:", response.data);

    // 💾 Save history safely
    try {
      const historyItem = {
        id: Date.now(),
        title: "Scanned Document",
        date: new Date().toLocaleString(),
        mode,
        result: response.data,
      };

      const existingHistory = JSON.parse(localStorage.getItem("smartscan_history") || "[]");

      localStorage.setItem(
        "smartscan_history",
        JSON.stringify([historyItem, ...existingHistory].slice(0, 30))
      );
    } catch (e) {
      console.warn("History save failed", e);
    }

    navigate("/result", {
      state: { result: response.data, fileUrl: image },
    });

  } catch (error) {
    console.error("🔥 FULL ERROR:", error);

    // ✅ Better error messages
    if (error.response) {
      alert("Backend Error: " + JSON.stringify(error.response.data));
    } else if (error.request) {
      alert("Cannot connect to backend ❌");
    } else {
      alert(error.message || "Unexpected error ❌");
    }

  } finally {
    setLoading(false);
  }
};
  if (loading) {
    return <div className="text-center mt-20 text-lg font-semibold">Processing... ⏳</div>;
  }

  return (
    <div className="max-w-5xl mx-auto w-full p-4 animate-in slide-in-from-bottom-4">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border">

        <h2 className="text-3xl font-bold mb-6">📸 Scan Document</h2>

        <div className="grid md:grid-cols-5 gap-8">

          {/* 📷 Camera */}
          <div className="md:col-span-3">
            {!image ? (
              <video ref={videoRef} autoPlay className="rounded-xl shadow" />
            ) : (
              <img src={image} alt="preview" className="rounded-xl shadow" />
            )}

            <canvas ref={canvasRef} className="hidden" />

            <div className="mt-4 flex gap-3">
              {!image ? (
                <button
                  onClick={captureImage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <Camera size={18} /> Capture
                </button>
              ) : (
                <>
                  <button
                    onClick={retake}
                    className="bg-gray-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                  >
                    <RefreshCw size={18} /> Retake
                  </button>

                  <button
                    onClick={handleScan}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl"
                  >
                    🚀 Scan & Extract
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ⚙️ Options Panel */}
          <div className="md:col-span-2 space-y-6">

            <div className="flex items-center gap-2">
              <Settings2 className="text-indigo-600" />
              <h3 className="font-semibold text-lg">Options</h3>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl space-y-4">

              {/* OCR Language */}
              <div>
                <label className="text-sm font-medium flex gap-2 items-center">
                  <Globe size={16} /> OCR Language
                </label>
                <select
                  value={ocrLang}
                  onChange={(e) => setOcrLang(e.target.value)}
                  className="w-full mt-2 p-3 rounded-xl border"
                >
                  <option value="en">English</option>
                  <option value="ta">Tamil</option>
                </select>
              </div>

              {/* Mode */}
              <div>
                <label className="text-sm font-medium">Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full mt-2 p-3 rounded-xl border"
                >
                  <option value="notes">Notes</option>
                  <option value="ticket">Ticket</option>
                  <option value="translate">Translate</option>
                  <option value="medical">Medical</option>
                </select>
              </div>

              {/* 🌐 Translate Options */}
              {mode === "translate" && (
                <div>
                  <label className="text-sm font-medium flex gap-2 items-center text-indigo-700">
                    <Globe size={16} /> Translate to
                  </label>

                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full mt-2 p-3 rounded-xl border bg-indigo-50"
                  >
                    <option value="en">English</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="te">Telugu (తెలుగు)</option>
                    <option value="ml">Malayalam (മലയാളം)</option>
                    <option value="kn">Kannada (ಕನ್ನಡ)</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                    <option value="zh-cn">Chinese</option>
                  </select>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}