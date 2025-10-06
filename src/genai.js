// This module is used by client-side Vue code. The official
// @google/generative-ai package is intended for server-side use and
// will often fail when bundled into a browser app (it depends on
// Node-only primitives). To avoid breaking the entire app at module
// load time, do not import the SDK at the top level.

// Client-side fallback: return a mocked response so the UI remains
// usable during development. In production you should call a server
// endpoint that uses the official SDK.

async function getResponse(contents) {
  // Running in a browser environment -> return a safe mocked response.
  // The official @google/generative-ai SDK depends on Node primitives and will
  // fail when bundled into a browser app, so short-circuit here when `window`
  // exists (client-side execution).
  if (typeof window !== 'undefined') {
    // If a Vite-provided API key is present, use it (INSECURE: key will be
    // exposed to the client and should only be used for experimentation).
    const clientKey = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_GENAI_API_KEY : undefined;
    const text = typeof contents === 'string' ? contents : JSON.stringify(contents);

    if (clientKey) {
      // Attempt a direct REST call to the Google Generative Language endpoint.
      // NOTE: Many production Google APIs require OAuth/service-account auth;
      // this approach works only if your key/account/project permits API-key access.
      try {
        const model = 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta2/models/${encodeURIComponent(model)}:generateText?key=${encodeURIComponent(clientKey)}`;
        const body = {
          prompt: { text },
          temperature: 0.2,
          maxOutputTokens: 512
        };
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!resp.ok) {
          const errText = await resp.text();
          console.warn('Generative API request failed:', resp.status, errText);
          // Fall back to a mocked response so the UI remains usable.
        } else {
          const j = await resp.json();
          // The REST response usually contains `candidates` with an `output` field.
          const out = j?.candidates?.[0]?.output || j?.candidates?.[0]?.content || j?.output || j?.text;
          if (typeof out === 'string') return out;
          if (Array.isArray(out) && out.length) return out.join('\n');
          if (j?.candidates && j.candidates.length && typeof j.candidates[0] === 'object') {
            // Attempt to extract text-like fields
            const cand = j.candidates[0];
            return cand.output || cand.content || JSON.stringify(cand);
          }
        }
      } catch (e) {
        console.warn('Direct client-side generative call failed, using fallback:', e?.message || e);
      }
    }

    // If no client key is present or the request failed, return a deterministic
    // mocked response so the UI remains usable during development.
    if (text.includes('Vehicle Information') || text.includes('Provide feedback on the following vehicle information')) {
      return `No feedback available at this time.`;
    }
    return `No feedback available at this time.`;
  }

  // If this module is used server-side (SSR or a node endpoint), dynamically
  // import the SDK and use it. We still avoid top-level imports so server
  // bundling is explicit.
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    // Guard access to `process` (it's not defined in browsers and will throw a
    // ReferenceError if accessed directly). Use typeof checks so this code can be
    // safely bundled for both server and build-time environments.
    const apiKey = (typeof process !== 'undefined' && (process.env?.VITE_GENAI_API_KEY || process.env?.GENAI_API_KEY)) ||
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GENAI_API_KEY);
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

export { getResponse };
