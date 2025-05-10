// const express = require("express");
// const { GoogleAuth } = require("google-auth-library");
// const { VertexAI } = require("@google-cloud/vertexai");
// require("dotenv").config();

// const router = express.Router();

// // // Use keyFilename to read credentials from the specified file
// // const auth = new GoogleAuth({
// //   keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Read directly from file
// //   scopes: ["https://www.googleapis.com/auth/cloud-platform"],
// // });

// // const vertexAI = new VertexAI({
// //   project: process.env.GOOGLE_PROJECT_ID, // Ensure this is defined in your .env
// //   location: "us-central1",
// //   googleAuthOptions: { auth },
// // });

// // const model = vertexAI.getGenerativeModel({ model: "gemini-pro" });

// const key = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// const auth = new GoogleAuth({
//   credentials: key,
//   scopes: ['https://www.googleapis.com/auth/cloud-platform'],
// });

// const vertexAI = new VertexAI({
//   project: key.project_id,
//   location: 'us-central1', // or another region supported
//   googleAuthOptions: { credentials: key },
// });

// const model = vertexAI.getGenerativeModel({
//   model: 'gemini-pro', // You can use 'chat-bison' for PaLM model
// });

// router.post("/", async (req, res) => {
//   const { prompt } = req.body;

//   if (!prompt || prompt.trim() === "") {
//     return res.status(400).json({ error: "Prompt is required" });
//   }

//   try {
//     const result = await model.generateContent({
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: `Generate 3 short, friendly marketing messages for this campaign goal:\n"${prompt}". Keep each under 200 characters.` }],
//         },
//       ],
//     });

//     const text = result.response.candidates[0].content.parts[0].text;
//     const messages = text.split(/\n\d+\.\s*/).filter(Boolean);

//     res.status(200).json({ suggestions: messages });
//   } catch (error) {
//     console.error("Vertex AI error:", error);
//     res.status(500).json({ error: "Failed to generate messages" });
//   }
// });

// module.exports = router;
const express = require("express");
const { GoogleAuth } = require("google-auth-library");
const { VertexAI } = require("@google-cloud/vertexai");
require("dotenv").config(); // Load environment variables

const router = express.Router();

// Ensure required environment variables exist
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS || !process.env.GOOGLE_PROJECT_ID) {
  throw new Error("Missing required environment variables. Check your .env file.");
}

// Initialize authentication using the JSON credentials file path
const auth = new GoogleAuth({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Pass the path directly
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_PROJECT_ID, // Ensure this is defined in your .env file
  location: "us-central1",
  googleAuthOptions: { auth },
});

const model = vertexAI.getGenerativeModel({ model: "gemini-pro" });

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `Generate 3 short, friendly marketing messages for this campaign goal:\n"${prompt}". Keep each under 200 characters.` }],
        },
      ],
    });

    const text = result.response.candidates[0].content.parts[0].text;
    const messages = text.split(/\n\d+\.\s*/).filter(Boolean);

    res.status(200).json({ suggestions: messages });
  } catch (error) {
    console.error("Vertex AI error:", error);
    res.status(500).json({ error: "Failed to generate messages" });
  }
});

module.exports = router;