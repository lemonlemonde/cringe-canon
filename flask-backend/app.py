from flask import Flask, request, jsonify
import os
from nerbius_api import send_image

app = Flask(__name__)

# Ensure the upload folder exists
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# this is the route that frontend will upload to!!
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    # nebius api
    # TODO: get user input from frontend too
    user_input = "This is Phi, she has 9 mechanical tails, and is an algorithmic-witch."
    response = send_image(file_path, user_input)

    # return so we know it's all good
    return jsonify({
        'message': 'Received API response successfully',
        'filename': file.filename,
        'path': file_path,
        'response': response,
    }), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
