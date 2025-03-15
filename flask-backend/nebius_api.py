import json
from openai import OpenAI

from dotenv import load_dotenv

import os
import base64

def send_image(file_path, description):
    
    # get local .env vars
    load_dotenv()
    
    # Encode the image to base64
    with open(file_path, 'rb') as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    client = OpenAI(
        base_url="https://api.studio.nebius.com/v1/",
        api_key=os.environ.get("NEBIUS_API_KEY")
    )
    
    description = str(description)

    response = client.chat.completions.create(
        model="Qwen/Qwen2-VL-72B-Instruct",
        max_tokens=512,
        temperature=0.6,
        top_p=0.9,
        extra_body={
            "top_k": 50
        },
        messages=[
            {
                "role": "system",
                "content": "You are given a drawing of an Original character (OC) with a brief explanation. Use the traits that you identify in the drawing to make a character profile (name, pronouns, occupation, education, personality, style, MBTI, hobbies, likes, dislikes, current concerns, quote) in bulletpoints. And a paragraph backstory with worldbuilding and with traits you see in the drawing. Format it with '## PROFILE' and '## BACKGROUND'."
            },
            {
                "role": "user",
                "content": [
                    { "type": "text", "text": description },
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