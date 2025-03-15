"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Header from "./components/header";

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

    // give it to the nextjs backend!
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Response:", data);

      // TODO: do something with the data!
        // hopefully the model returned two sections:
          // "PROFILE:" and "BACKGROUND:"

    } catch (e) {
      console.error("Uploading error:", e)
    }
  };

  return (

    <div className="grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex-col justify-items-center">
        <i>Welcome to</i>
        <Header />
      </div>

      <main className="flex flex-col gap-8 row-start-2 md:items-start max-w-screen-lg w-full space-y-5">
        <div className="flex md:flex-row flex-col w-full md:space-x-5 space-y-5">
          {/* image */}
          <div className="flex flex-col">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {/* button triggers input above */}
            <button
              onClick={handleChooseFile}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Choose Image
            </button>

            {preview && (
              <img src={preview} alt="Preview" className="w-xl h-auto rounded-lg" />
            )}
          </div>
          
          {/* description input box */}
          <div className="flex flex-col w-full">
            <label htmlFor="textInput" className="mb-2 text-lg text-gray-400">
              Description:
            </label>
            <textarea
              type="text"
              id="textInput"
              rows="12"
              placeholder="e.g., Jackie is a mechanic specializing in fixing ghost-bikes..."
              className="p-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        
        {/* upload button */}
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>

      </main>
    </div>
  );
}




// export default function ImageUploader() {
  
// }
