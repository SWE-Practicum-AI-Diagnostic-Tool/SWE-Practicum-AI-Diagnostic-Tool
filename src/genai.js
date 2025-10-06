// This module is used by client-side Vue code. The official
// @google/generative-ai package is intended for server-side use and
// will often fail when bundled into a browser app (it depends on
// Node-only primitives). To avoid breaking the entire app at module
// load time, do not import the SDK at the top level.

// Client-side fallback: return a mocked response so the UI remains
// usable during development. In production you should call a server
// endpoint that uses the official SDK.

async function getReponse(contents) {
  // Running in a browser environment -> return a safe mocked response.
  if (typeof window !== 'undefined') {
    // Keep responses short and deterministic for the UI.
    const text = typeof contents === 'string' ? contents : JSON.stringify(contents);
    return `Mocked response (client): received ${text.slice(0, 200)}`;
  }

  // If this module is used server-side (SSR or a node endpoint), dynamically
  // import the SDK and use it. We still avoid top-level imports so server
  // bundling is explicit.
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const apiKey = process?.env?.VITE_GENAI_API_KEY || process?.env?.GENAI_API_KEY || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GENAI_API_KEY);
    const ai = new GoogleGenerativeAI(apiKey);
    const preferredModel = 'gemini-2.5-flash';

    const extractText = async (result) => {
      if (!result) return null;
      if (result.response && typeof result.response.text === 'function') return await result.response.text();
      if (typeof result === 'string') return result;
      if (result.response && typeof result.response === 'string') return result.response;
      if (result.output && typeof result.output === 'string') return result.output;
      return JSON.stringify(result);
    };

    try {
      const model = ai.getGenerativeModel({ model: preferredModel });
      const result = await model.generateContent(contents);
      return await extractText(result);
    } catch (err) {
      console.warn('Primary model failed, attempting to list available models:', err?.message || err);
      try {
        if (typeof ai.listModels === 'function') {
          const listResponse = await ai.listModels();
          const models = Array.isArray(listResponse) ? listResponse : listResponse?.models || [];
          const candidate = models.find((m) => {
            const supported = m?.supportedMethods || m?.capabilities || m?.methods;
            return Array.isArray(supported) && supported.includes('generateContent');
          }) || models[0];
          if (candidate) {
            const candidateId = candidate.name || candidate.model || candidate.id || candidate.modelId;
            console.info('Falling back to model:', candidateId);
            const fallbackModel = ai.getGenerativeModel({ model: candidateId });
            const fallbackResult = await fallbackModel.generateContent(contents);
            return await extractText(fallbackResult);
          }
        }
      } catch (listErr) {
        console.error('Failed to list or fallback to another model:', listErr);
      }
      throw err;
    }
  } catch (err) {
    // If dynamic import or usage fails on server, rethrow to let the
    // caller handle it.
    throw err;
  }
}

export default getReponse;
