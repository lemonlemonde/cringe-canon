

// get file that was POSTed to /api/uploadsnapshot
// from page.js
export async function POST(request) {
    console.log("YOURE N THE UPLOAD SNAPSHOT TERRITORY")
    const body = await request.json();
    const { img, chat, profile } = body;

    if (!img || !chat || !profile) {
        return Response.json({ message: "No snapshot or chat or profile received" }, { status: 400 });
    }

    console.log("Sucessfully received img, chat, profile. Sending to Flask...")

    // remove the 'data:image/png;base64,'
    const img_base64 = img.replace("data:image/png;base64,", '');

    // Send to Flask backend
    const res = await fetch("http://localhost:8000/uploadChat", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',  // Ensure Content-Type is set correctly
        },
        body: JSON.stringify(
            {
                img: img_base64,
                chat: chat,
                profile: profile
            }
        )
    });

    const flaskResponse = await res.json();

    return Response.json({
        message: "File uploaded and forwarded to Flask!",
        flaskResponse,
    });
}
