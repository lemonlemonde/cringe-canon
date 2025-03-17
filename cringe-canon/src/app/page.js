"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import Header from "./components/header";
import CameraStream from "./components/camera";

export default function Home() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState(null);
  const [preview, setPreview] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [genImg, setGenImg] = useState(null);

  const videoRef = useRef (null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isCamOn, setIsCamOn] = useState(false);

    const [chat, setChat] = useState(null);
    const [chatResponse, setChatResponse] = useState(null);

    const [snapshot, setSnapshot] = useState(null);

    const captureFrame = () => {
        console.log("Capturing snapshot")
        const video = videoRef.current;
        const canvas = canvasRef.current;
    
        if (!video || !canvas) {
            console.log("No video or canvas to capture frame snapshot!!")
        }
    
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        // Draw the current frame from the video to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
        // Get image as a data URL (base64)
        const dataUrl = canvas.toDataURL('image/png');
        setSnapshot(dataUrl);
    
        console.log('Captured image base64:', dataUrl);
    };

    const startCam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            setStream(stream);
            setIsCamOn(true);
        } catch (e) {
            console.error("Error: Can't start webcam - ", e);
        }
    }

    const stopCam = () => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
                setIsCamOn(false);
            }
        } catch (e) {
            console.error("Error: Can't stop webcam - ", e)
        }
    }

    const toggleCamera = () => {
        if (isCamOn) {
            stopCam();
        } else {
            startCam();
        }
    }

    const handleChatResponse = async (data) => {
        if (!data.flaskResponse.chat_response) {
            console.error("Couldn't find chat response!")
            return
        }
        // handle the API response
        console.log("Chat response:", data.flaskResponse.chat_response)
    
        setChatResponse(data.flaskResponse.chat_response)
    }

    const sendFrame = async () => {
        if (snapshot) {
            // send straight base64 snapshot
            console.log("Sending frame to NextJS backend...")
            console.log("chat:", chat)

            const body_json = JSON.stringify(
                {
                    img: snapshot,
                    chat: chat,
                    profile: profile
                }
            )

            // send to nextjs backend
            try {
                const res = await fetch("/api/uploadsnapshot", {
                  method: "POST",
                  body: body_json,
                });
          
                var data = await res.json();
                console.log("Response:", data);
          
                handleChatResponse(data);
          
            } catch (e) {
                console.error("Snapshot uploading error:", e)
                return
            }
        }
    }

  const handleResponse = (data) => {
    setLoading(false)
    if (!data.flaskResponse.profile) {
        console.error("Couldn't find API profile")
        return
    }
    // handle the API response
    console.log("ACTUAL PROFILE:", data.flaskResponse.profile)

    setProfile(data.flaskResponse.profile)
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
      return
    }

    const imgFormData = new FormData();
    imgFormData.append("profile", profile);
    imgFormData.append("description", description)

    // request img now
    try {
      const res = await fetch("/api/getimg", {
        method: "POST",
        body: imgFormData,
      });

      const data = await res.json();
      console.log("Response:", data);

      if (data.flaskResponse.new_img) {
        // should be base64, no need to decode
        console.log("GOT IMG")
        setGenImg(`data:image/webp;base64,${data.flaskResponse.new_img}`);
      }
    } catch (e) {
      console.error("Uploading error:", e)
      setLoading(false)
    }

  };

  useEffect(() => {
      const enableCameraStream = async () => {
          
      };

      enableCameraStream();

      return () => {
          // Stop the webcam when component unmounts
          stopCam();
      };

  }, []);

  return (

    <div className="grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex-col justify-items-center">
        <i>Welcome to</i>
        <Header />
      </div>

      <main className="flex flex-col gap-8 row-start-2 md:items-start max-w-screen-lg w-full space-y-5">
        <div className="flex md:flex-row flex-col w-full max-w-screen md:space-x-5 space-y-5">
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

        {/* generated img */}
        <div className="flex flex-col w-full">
            {genImg && (
              <img src={genImg} alt="generated image" className="w-xl h-auto rounded-lg" />
            )}
        </div>

        <div className="flex flex-col w-full space-y-5">
            <canvas ref={canvasRef} className="hidden" />
            <div className='flex space-x-5'>
                <button onClick={toggleCamera} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    {isCamOn ? 'Stop Camera' : 'Start Camera'}
                </button>
                <button onClick={captureFrame} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Snapshot
                </button>
            </div>
            <div className='flex'>
                <video ref={videoRef} autoPlay className="border p-4 rounded w-1/2"/>
                <img src={snapshot} className="w-1/2 border p-4 rounded"/>
            </div>
            {/* description input box */}
            <div className="flex flex-col w-full md:pt-3">
                <label htmlFor="textInput" className="mb-2 text-lg text-gray-400">
                Chat with your character based on the camera snapshot!
                </label>
                <textarea
                type="text"
                id="textInput"
                rows="12"
                onChange={(e) => setChat(e.target.value)}
                placeholder="e.g., What do you think of my drawing of you?"
                className="p-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <button onClick={sendFrame} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Send snapshot + chat
            </button>
            {/* actual results */}
            {chatResponse && (
            <div className="w-full border p-4 rounded max-w-none px-5">
                {chatResponse}
            </div>
            )}
        </div>

      </main>
    </div>
  );
}
