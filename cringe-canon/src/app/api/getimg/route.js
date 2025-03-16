

// get file that was POSTed to /api/getimg
  // from page.js
export async function POST(request) {
  const formData = await request.formData();
  const profile = formData.get("profile")

  console.log("HIHIHIHI YOURE GETTING IMMAGEs")

  if (!profile) {
    return Response.json({ message: "No profile received" }, { status: 400 });
  }

  // Send to Flask backend
  const res = await fetch("http://localhost:8000/gen-img", {
    method: "POST",
    body: formData,
  });

  const flaskResponse = await res.json();

  return Response.json({
    message: "Profile uploaded and forwarded to Flask!",
    flaskResponse,
  });
}

