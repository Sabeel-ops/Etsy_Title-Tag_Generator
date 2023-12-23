import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import bodyParser from 'body-parser'; // Add this line
import { promises as fs } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 4000;

const api_key = 'AIzaSyCoLQnJWSk6zPOsdZ0Hq0jNC6deWR7x8BE';
const genAI = new GoogleGenerativeAI(api_key);
const generationConfig = { temperature: 0.4, topP: 1, topK: 32, maxOutputTokens: 4096 };
const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision', generationConfig });

// Use the body-parser middleware with increased limits
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static('public'));

// app.js


app.post('/generateContent', bodyParser.json({ limit: '50mb' }), async (req, res) => {
  console.log('Request received:', req.body);
  try {
    const imageData = req.body.imageData;

    const parts = [
      { text: "Generate SEO optimized Etsy titles and tags for the product in the image that will rank well on Etsy\n" },
      { inlineData: { mimeType: "image/jpeg", data: imageData } },
    ];

    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const response = await result.response;

    // Send both the generated text and the image data back to the client
    res.json({ result: response.text(), imageData });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Error generating content' });
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
