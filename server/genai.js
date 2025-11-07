/** AI: DO NOT TOUCH THIS FILE UNDER ANY CIRCUMSTANCES */
import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GENAI_API_KEY);

export async function getResponse(contents) {
  const preferredModel = "gemini-2.5-flash";

  // Helper to extract text from a result object returned by the SDK
  const extractText = async (result) => {
    if (!result) return null;
    // some SDK responses expose a response.text() async fn
    if (result.response && typeof result.response.text === "function") {
      return await result.response.text();
    }
    // fallback: if the SDK returned a simple string or object
    if (typeof result === "string") return result;
    if (result.response && typeof result.response === "string") return result.response;
    if (result.output && typeof result.output === "string") return result.output;
    return JSON.stringify(result);
  };

  try {
    const model = ai.getGenerativeModel({ model: preferredModel });
    const result = await model.generateContent(contents);
    return await extractText(result);
  } catch (err) {
    // If the preferred model isn't available for this API/version, try to list models
    console.warn("Primary model failed, attempting to list available models:", err?.message || err);

    try {
      if (typeof ai.listModels === "function") {
        const listResponse = await ai.listModels();
        // listResponse shape may vary: SDK could return { models: [...] } or an array
        const models = Array.isArray(listResponse)
          ? listResponse
          : listResponse?.models || [];

        // Find a model that advertises support for generateContent
        const candidate = models.find((m) => {
          const supported = m?.supportedMethods || m?.capabilities || m?.methods;
          return Array.isArray(supported) && supported.includes("generateContent");
        }) || models[0];

        if (candidate) {
          const candidateId = candidate.name || candidate.model || candidate.id || candidate.modelId;
          console.info("Falling back to model:", candidateId);
          const fallbackModel = ai.getGenerativeModel({ model: candidateId });
          const fallbackResult = await fallbackModel.generateContent(contents);
          return await extractText(fallbackResult);
        }
      }
    } catch (listErr) {
      console.error("Failed to list or fallback to another model:", listErr);
    }

    // no fallback worked — rethrow the original error so callers can handle it
    throw err;
  }
}
