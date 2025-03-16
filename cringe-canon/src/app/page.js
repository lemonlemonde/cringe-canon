"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

import Header from "./components/header";

export default function Home() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState(null);
  const [preview, setPreview] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResponse = (data) => {
    setLoading(false)
    if (!data.flaskResponse.response) {
        console.error("Couldn't find API response")
    }
    // handle the API response
    console.log("ACTUAL PROFILE:", data.flaskResponse.response)


    setProfile(data.flaskResponse.response)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFile(file);
        setPreview(URL.createObjectURL(file));
    }
  };

  const handleChooseFile = () => {
    // This uses the actual hidden input when 'Choose Image' button clicked
    inputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) return alert("No file selected!");
    if (!description) return alert("No description given!")

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);

    setLoading(true)

    // give it to the nextjs backend!
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Response:", data);

      handleResponse(data);

    } catch (e) {
      console.error("Uploading error:", e)
      setLoading(false)
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
          <div className="flex flex-col w-full md:w-xl space-y-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
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
          <div className="flex flex-col w-full md:pt-3">
            <label htmlFor="textInput" className="mb-2 text-lg text-gray-400">
              Description and world-building:
            </label>
            <textarea
              type="text"
              id="textInput"
              rows="12"
              onChange={(e) => setDescription(e.target.value)}
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

        {/* profile */}
        <div className="flex flex-col w-full">
        
          {/* default placeholder */}
          {!loading && !profile && (
            <div className="w-full border p-4 rounded">
              {/* Example content */}
              <h2 className="text-lg font-bold">Profile?</h2>
              <p className="text-gray-400">Upload your drawing and write a description to get your very own, totally canon, character profile!</p>
            </div>
          )}

          {/* Loading thing */}
          {loading && (
            <div className="w-full border p-4 rounded">
              {/* Example content */}
              <h2 className="text-lg font-bold animate-pulse">✨ Generating profile... ✨</h2>
            </div>
          )}

          {/* actual results */}
          {!loading && profile && (
            <div className="w-full border p-4 rounded prose prose-invert max-w-none px-5">
              <ReactMarkdown>
                {profile}
              </ReactMarkdown>
            </div>
          )}
            
        </div>

      </main>
    </div>
  );
}




// export default function ImageUploader() {
  
// }
