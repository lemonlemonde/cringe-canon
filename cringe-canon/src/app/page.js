"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFile(file);
        setPreview(URL.createObjectURL(file));
    }
  };

  const handleChooseFile = () => {
    // This opens the hidden input when button is clicked
    inputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) return alert("No file selected!");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Response:", data);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* <input className="bg-blue-500 hover:bg-blue-600" type="file" accept="image/*" onChange={handleFileChange} /> */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Custom button to trigger file input */}
      <button
        onClick={handleChooseFile}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Choose Image
      </button>

      {preview && (
        <img src={preview} alt="Preview" className="w-64 h-auto rounded-lg" />
      )}
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload
      </button>
    </div>
  );
}




// export default function ImageUploader() {
  
// }
