# cringe-canon
takes your cringe, makes it canon

(Created for [Visionary Hack](https://www.sprint.dev/hackathons/visionaryhack), sponsored by Nebius AI Studio, hosted by Sprint.dev)
March 14, 2025 12:00 PDT - March 16, 2025 20:00 PDT

## Quick start (frontend)
```bash
cd cringe-canon
npm install
npm run dev
```


## Quick start (backend)
```bash
cd flask-backend
conda create -n cringe-canon python=3.10.15
conda activate cringe-canon
pip install flask openai
# flask = 3.1.0
# openai = 1.66.3

python app.py
```

Make sure you also have a `.env` file in `/flask-backend` like so:

```.env
NEBIUS_API_KEY=YOUR_KEY_HERE
```


### Techstack
- Next.js
- Tailwind css
- Flask
- Nebius AI Studio 