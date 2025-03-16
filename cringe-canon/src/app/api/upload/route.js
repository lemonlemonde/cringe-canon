import { writeFile } from "fs/promises";
import path from "path";

// get file that was POSTed to /api/upload
  // from page.js
export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const description = formData.get("description")

  if (!file || !description) {
    return Response.json({ message: "No file or description received" }, { status: 400 });
  }

  // Send to Flask backend
  const res = await fetch("http://localhost:8000/upload", {
    method: "POST",
    body: formData,
  });

  const flaskResponse = await res.json();

  return Response.json({
    message: "File uploaded and forwarded to Flask!",
    flaskResponse,
  });
}
