from flask import Flask, request, jsonify
import os
from nebius_api import send_image

app = Flask(__name__)

# Ensure the upload folder exists
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# this is the route that frontend will upload to!!
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    elif 'description' not in request.form:
        return jsonify({'error': 'No description part'}), 400

    file = request.files['file']
    description = request.form['description']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    elif description == '':
        return jsonify({'error': 'No description given'}), 400

    # Save the file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    # nebius api
    response = send_image(file_path, str(description))

    # return so we know it's all good
    return jsonify({
        'message': 'Received API response successfully',
        'filename': file.filename,
        'saved_path': file_path,
        'description': description,
        'response': response,
    }), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
