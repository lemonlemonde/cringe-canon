import React, { useRef, useState, useEffect } from 'react';

const CameraStream = () => {
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
                    chat: chat
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
        <div className="flex flex-col w-full">
            <canvas ref={canvasRef} className="hidden" />
            <div className='flex'>
                <button onClick={toggleCamera}>
                    {isCamOn ? 'Stop Camera' : 'Start Camera'}
                </button>
                <button onClick={captureFrame}>
                    Snapshot
                </button>
            </div>
            <div className='flex'>
                <video ref={videoRef} autoPlay className="w-1/2"/>
                <img src={snapshot} className="w-1/2"/>
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
            <button onClick={sendFrame}>
                Send snapshot + chat
            </button>
            {/* actual results */}
            {chatResponse && (
            <div className="w-full border p-4 rounded max-w-none px-5">
                {chatResponse}
            </div>
            )}
        </div>
    )
}
export default CameraStream;
