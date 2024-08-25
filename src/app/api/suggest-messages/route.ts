import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, StreamingTextResponse } from "ai";

// Initialize Google Generative AI with API key
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Define the maximum duration for the operation
export const maxDuration = 30;

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse the JSON body of the request
    const { prompt: userPrompt } = await request.json();

    // Construct the prompt to send to the AI model
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be based on the input that the user provides: ${userPrompt}.`;

    // Send the prompt to the AI model and stream the response
    const resultStream = await streamText({
      model: google("models/gemini-pro"),
      prompt,
    });

    // Return the streaming response to the client
    return new StreamingTextResponse(resultStream.toAIStream());
  } catch (error) {
    // Log the error and return a proper HTTP error response
    console.error("An unexpected error occurred:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500 }
    );
  }
}
