import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Scanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("general");
  const [ocrLang, setOcrLang] = useState("en");

  const navigate = useNavigate();

  // 🎥 Start Camera
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied ❌");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  // 📸 Capture Image
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

  // 🚀 Send to Backend
  const handleScan = async () => {
    try {
      setLoading(true);

      const blob = await fetch(image).then((res) => res.blob());

      const formData = new FormData();
      formData.append("file", blob, "scan.png");
      formData.append("mode", mode);
      formData.append("ocrLang", ocrLang);

      const response = await axios.post(
        "http://localhost:8000/process", // 🔥 change to Render URL later
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/result", { state: response.data });
    } catch (error) {
      console.error(error);
      alert("Scan failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Scanner</h1>

      {/* 🎥 Camera or Preview */}
      {!image ? (
        <video
          ref={videoRef}
          autoPlay
          className="w-full max-w-md rounded-lg shadow-lg"
        />
      ) : (
        <img
          src={image}
          alt="preview"
          className="w-full max-w-md rounded-lg shadow-lg"
        />
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* 🎛 Controls */}
      <div className="mt-4 flex flex-col gap-3 w-full max-w-md">
        {!image ? (
          <button
            onClick={captureImage}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            📸 Capture
          </button>
        ) : (
          <>
            <button
              onClick={retake}
              className="bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              🔄 Retake
            </button>

            <button
              onClick={handleScan}
              className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              🚀 Scan & Extract
            </button>
          </>
        )}

        {/* ⚙️ Options */}
        <div className="bg-white p-3 rounded-lg shadow">
          <label className="block mb-2 font-semibold">Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="general">General OCR</option>
            <option value="translate">Translate</option>
            <option value="ticket">Ticket</option>
            <option value="medical">Medical</option>
          </select>

          <label className="block mt-3 mb-2 font-semibold">
            OCR Language
          </label>
          <select
            value={ocrLang}
            onChange={(e) => setOcrLang(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="en">English</option>
            <option value="ta">Tamil</option>
          </select>
        </div>
      </div>

      {/* ⏳ Loading */}
      {loading && (
        <div className="mt-4 text-blue-600 font-semibold">
          Processing... ⏳
        </div>
      )}
    </div>
  );
};

export default Scanner;