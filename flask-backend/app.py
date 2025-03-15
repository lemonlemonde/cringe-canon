from flask import Flask, request, jsonify
import os

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

    # You can process the file here (e.g., image recognition, etc.)
    # For now, we just return the filename
    return jsonify({
        'message': 'File received successfully',
        'filename': file.filename,
        'path': file_path
    }), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
