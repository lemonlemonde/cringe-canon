import json
from openai import OpenAI

from dotenv import load_dotenv

import os
import base64

def send_image(file_path, user_input):
    
    # get local .env vars
    load_dotenv()
    
    # Encode the image to base64
    with open(file_path, 'rb') as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    client = OpenAI(
        base_url="https://api.studio.nebius.com/v1/",
        api_key=os.environ.get("NEBIUS_API_KEY")
    )
    
    user_input = str(user_input)

    response = client.chat.completions.create(
        model="llava-hf/llava-1.5-7b-hf",
        max_tokens=512,
        temperature=0.6,
        top_p=0.9,
        extra_body={
            "top_k": 50
        },
        messages=[
            {
                "role": "system",
                "content": "You are given a drawing of an Original character (OC) with a brief explanation. Use the traits that you identify in the drawing to make a character profile (name, pronouns, occupation, education, personality, hobbies, likes, dislikes, current concerns, quote) in bulletpoints. And a paragraph backstory. Format it with '## PROFILE' and '## BACKGROUND'."
            },
            {
                "role": "user",
                "content": [
                    { "type": "text", "text": user_input },
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