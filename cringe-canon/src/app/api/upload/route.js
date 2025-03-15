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

  // const bytes = await file.arrayBuffer();
  // const buffer = Buffer.from(bytes);

  // Save to /public/uploads directory 
  // const filename = file.name;
  // const filePath = path.join(process.cwd(), "public", "uploads", filename);
  // console.log("YOYOYOYO")
  // return Response.json({ message: "File uploaded!", filename });

  // await writeFile(filePath, buffer);

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
