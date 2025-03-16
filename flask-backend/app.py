import os
import base64

from flask import Flask, request, jsonify
from nebius_api import send_image, send_prompt, get_img

app = Flask(__name__)

# Ensure the folders exist
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
GENERATED_FOLDER = 'generated'
os.makedirs(GENERATED_FOLDER, exist_ok=True)

gen_img_num = len(os.listdir(GENERATED_FOLDER))

print(f"gen_img_num: {gen_img_num}")

# this is the route that frontend will upload to!!
@app.route('/upload', methods=['POST'])
def upload_file():
    # check file and description
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    elif 'description' not in request.form:
        return jsonify({'error': 'No description part'}), 400

    file = request.files['file']
    description = request.form['description']

    # check empties
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    elif description == '':
        return jsonify({'error': 'No description given'}), 400

    # Save the file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    try:
        # nebius api
        # send to vlm to get list of features
        img_description = send_image(file_path, description)
        # send features and user description to llm to get profile
        profile = send_prompt(description, img_description)

        # return so we know it's all good
        return jsonify({
            'message': 'Received API response successfully',
            'filename': file.filename,
            'saved_path': file_path,
            'description': description,
            'profile': profile,
        }), 200
    except Exception as e:
        return jsonify({
            'message': 'Something went wrong in the API call',
            'error': e,
        }), 500
        
    
@app.route('/gen-img', methods=['POST'])
def gen_image():
    global gen_img_num
    
    if 'profile' not in request.form:
        return jsonify({'error': 'No profile part'}), 400
    elif 'description' not in request.form:
        return jsonify({'error': 'No description part'}), 400

    profile = request.form['profile']
    description = request.form['description']
    if (profile == ''):
        return jsonify({'error': 'Empty profile'}), 400
    elif (description == ''):
        return jsonify({'error': 'Empty description'}), 400
        
    
    try:
        new_img = get_img(description, profile)
        
        # if it has the prefix "data:image/webp;base64," remove it
        if ',' in new_img:
            new_img = new_img.split(',')[1]
            
        # decode base64 to bytes and save
        new_img_bytes = base64.b64decode(new_img)
        with open(os.path.join(GENERATED_FOLDER, str(gen_img_num) + ".webp"), 'wb') as f:
            f.write(new_img_bytes)
            gen_img_num += 1
            
        # return the raw base64
        return jsonify({
            'message': 'Received API response successfully',
            'new_img': new_img,
        }), 200
    except Exception as e:
        return jsonify({
            'message': 'Something went wrong in the API call',
            'error': e,
        }), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
