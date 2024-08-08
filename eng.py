import base64
import cv2
import numpy as np
from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import mediapipe as mp
import itertools

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize the mediapipe face detection class.
mp_face_detection = mp.solutions.face_detection

# Setup the face detection function.
face_detection = mp_face_detection.FaceDetection(model_selection=0, min_detection_confidence=0.5)

# Initialize the mediapipe drawing class.
mp_drawing = mp.solutions.drawing_utils

# Initialize the mediapipe face mesh class.
mp_face_mesh = mp.solutions.face_mesh

# Setup the face landmarks function for videos.
face_mesh_videos = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1,
                                         min_detection_confidence=0.5, min_tracking_confidence=0.5)


def base64_to_image(base64_string):
    base64_data = base64_string.split(",")[1]
    image_bytes = base64.b64decode(base64_data)
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    return image

def applyLipColor(image, landmarks, hex_color,face_landmarks):
    # Convert hex color to RGB
    r, g, b = int(hex_color[1:3], 16), int(hex_color[3:5], 16), int(hex_color[5:7], 16)
    
    # Retrieve the height and width of the image.
    image_height, image_width, _ = image.shape

    INDEXES = mp_face_mesh.FACEMESH_LIPS
    
    # Convert the indexes of the landmarks of the face part into a list.
    INDEXES_LIST = list(itertools.chain(*INDEXES))
    
    # Initialize a list to store the landmarks of the face part.
    landmarks = []
    
    # Iterate over the indexes of the landmarks of the face part. 
    for INDEX in INDEXES_LIST:
        
        # Append the landmark into the list.
        landmarks.append([int(face_landmarks.landmark[INDEX].x * image_width),
                          int(face_landmarks.landmark[INDEX].y * image_height)])
    
    # Convert the list of landmarks of the face part into a numpy array.
    landmarks = np.array(landmarks)
    
    # Define the lip landmarks (approximation)
    #lip_landmarks = landmarks[48:67]

    # Convert lip landmarks to integer data type
    lip_landmarks = landmarks.astype(int)

    # Create a mask for the lip region
    lip_mask = np.zeros_like(image)

    # Fill the lip region with the specified color
    cv2.fillPoly(lip_mask, [lip_landmarks], (b, g, r))

    # Blend the lip color with the original image
    alpha = 0.4  # You can adjust the alpha value for blending
    blended_image = cv2.addWeighted(image, 1 - alpha, lip_mask, alpha, 0)

    return blended_image

@socketio.on("connect")
def test_connect():
    emit("my response", {"data": "Connected"})

@socketio.on("image")
def receive_image(data):
    image = data['image']
    color = data.get('color', '#FF0000') 

    image = base64_to_image(image)

    # Flip the frame horizontally for natural (selfie-view) visualization.
    frame = cv2.flip(image, 1)

    # Convert the frame to RGB format (required by MediaPipe).
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Perform face detection to get facial landmarks.
    results = face_mesh_videos.process(frame_rgb)
    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            # Convert the landmarks to numpy array for easier manipulation
            landmarks = np.array([(lm.x * frame.shape[1], lm.y * frame.shape[0]) for lm in face_landmarks.landmark])
            # Apply lip color manipulation
            frame = applyLipColor(frame, landmarks, color,face_landmarks)  # red color #FF0000
    
    # Display the frame.
    processed_image = frame
    
    # Encode the processed image as a JPEG-encoded base64 string
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
    _, frame_encoded = cv2.imencode(".jpg", processed_image, encode_param)
    processed_img_data = base64.b64encode(frame_encoded).decode()
    
    # Prepend the base64-encoded string with the data URL prefix
    b64_src = "data:image/jpg;base64,"
    processed_img_data = b64_src + processed_img_data
    
    # Send the processed image back to the client
    emit("processed_image", processed_img_data)

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000, host='0.0.0.0')
