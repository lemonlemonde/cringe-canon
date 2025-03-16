import json
from openai import OpenAI

from dotenv import load_dotenv

import os
import base64

def send_image(file_path):
    
    
    # Encode the image to base64
    with open(file_path, 'rb') as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    # get local .env vars
    load_dotenv()
    client = OpenAI(
        base_url="https://api.studio.nebius.com/v1/",
        api_key=os.environ.get("NEBIUS_API_KEY")
    )
    
    response = client.chat.completions.create(
        model="Qwen/Qwen2-VL-72B-Instruct",
        temperature=0.6,
        max_tokens=1024,
        top_p=0.9,
        extra_body={
            "top_k": 50
        },
        messages=[
            {
                "role": "system",
                "content": "You are given a drawing of an Original character (OC). Bulletpoint identify things you see in the drawing that are relevant to making a character profile."
            },
            {
                "role": "user",
                "content": [
                    { "type": "text", "text": "img" },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                        },
                    },
                ],
            }
        ],
    )
    
    print(response.to_json())
    response_json = json.loads(response.to_json())

    # return actual output
    return response_json["choices"][0]["message"]["content"]

def send_prompt(user_description, vlm_description):
    # concat
    content = str(user_description) + "\n" + str(vlm_description)
    
    # get local .env vars
    load_dotenv()
    client = OpenAI(
        base_url="https://api.studio.nebius.com/v1/",
        api_key=os.environ.get("NEBIUS_API_KEY")
    )
    
    response = client.chat.completions.create(
        model="mistralai/Mixtral-8x22B-Instruct-v0.1",
        max_tokens=1024,
        temperature=0.5,
        top_p=0.9,
        extra_body={
            "top_k": 50
        },
        messages=[
            {
                "role": "system",
                "content": """Given a description and a list of features about an original character (OC) based on a drawing, produce a character profile (name, pronouns, occupation, education, personality, style, MBTI, hobbies, likes, dislikes, current concerns, quote) in bulletpoints. Keep it short. Separately, give a paragraph backstory with worldbuilding based on the features. Format it with '## PROFILE' and '## BACKGROUND'. Be confident."""
            },
            {
                "role": "user",
                "content": [
                    { "type": "text", "text": content },
                ],
            }
        ]
    )
    
    print(response.to_json())
    response_json = json.loads(response.to_json())

    # return actual output
    return response_json["choices"][0]["message"]["content"]