import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

const CameraCapture = () => {
  const [socket, setSocket] = useState(null);
  const [localMediaStream, setLocalMediaStream] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [processedImage, setProcessedImage] = useState(null); 

  const location = useLocation();
  const state = location.state || {};
  const selectedColor = state.color || '#FF0000'; 

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
        socket.emit('image', { image: dataURL, color: selectedColor });
      };

      const intervalId = setInterval(sendSnapshot, 100);

      return () => {
        clearInterval(intervalId);
        video.pause();
        video.srcObject = null;
      };
    }
  }, [localMediaStream, canvas, socket]);


  useEffect(() => {
    if (socket) {
      socket.on('processed_image', (data) => {
        setProcessedImage(data); 
      });
    }

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
        {processedImage && <img src={processedImage} alt="Processed Image" />} 
        <button onClick={() => window.history.back()} className="absolute top-4 left-4 text-white">
          <FontAwesomeIcon icon={faArrowCircleLeft} size="2x" />
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;