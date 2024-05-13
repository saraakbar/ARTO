import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

const CameraCapture = () => {
  const [socket, setSocket] = useState(null);
  const [localMediaStream, setLocalMediaStream] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [processedImage, setProcessedImage] = useState(null); // State to store processed image data

  useEffect(() => {
    const newSocket = io.connect(`http://localhost:5000`);
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const constraints = {
      video: {
        width: 1280,
        height: 720
      }
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        setLocalMediaStream(stream);
      })
      .catch(error => {
        console.error("Error accessing camera:", error);
      });

    // Cleanup function to stop the media stream when the component unmounts
    return () => {
      if (localMediaStream) {
        localMediaStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

  useEffect(() => {
    if (localMediaStream && canvas && socket) {
      const ctx = canvas.getContext('2d');
      const video = document.createElement('video');
      video.srcObject = localMediaStream;
      video.play().catch((error) => console.error('Error playing video:', error))

      const sendSnapshot = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        let dataURL = canvas.toDataURL('image/jpeg');
        socket.emit('image', dataURL);
      };

      // Start capturing frames (adjust interval as needed)
      const intervalId = setInterval(sendSnapshot, 100);

      // Cleanup function to clear the interval when the component unmounts
      return () => {
        clearInterval(intervalId);
        video.pause();
        video.srcObject = null;
      };
    }
  }, [localMediaStream, canvas, socket]);


  useEffect(() => {
    // Socket event listener for receiving processed image from the server
    if (socket) {
      socket.on('processed_image', (data) => {
        setProcessedImage(data); // Update state with processed image data
      });
    }

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.off('processed_image');
      }
    };
  }, [socket]);

  const handleCanvasRef = canvasRef => {
    setCanvas(canvasRef);
  };

  return (
    <div className='w-screen h-screen bg-black flex justify-center items-center'>
      <div style={{ position: 'relative' }}>
        <canvas width="800" height="450" ref={handleCanvasRef} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'none' }} />
        {processedImage && <img src={processedImage} alt="Processed Image" />} {/* Display processed image if available */}
        <button onClick={() => window.history.back()} className="absolute top-4 left-4 text-white">
          <FontAwesomeIcon icon={faArrowCircleLeft} size="2x" />
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;