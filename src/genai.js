import { J } from 'mermaid/dist/chunks/mermaid.esm.min/chunk-KXVH62NG.mjs';
import { authState, getToken } from './auth.js';
import axios from 'axios'

export async function getResponse(contents) {
  const token = await getToken();
  const response = await axios.post(
    'http://localhost:3000/api/generate',
    { contents },
    { headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getQuestions(vehicle, issues) {
  const token = await getToken();
  const response = await axios.post(
    'http://localhost:3000/api/gen-questions',
    { vehicle, issues }, // body
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function getFlowchart(vehicle, issues, responses) {
  const token = await getToken();
  const response = await axios.post(
    'http://localhost:3000/api/gen-flowchart',
    { vehicle, issues, responses }, // body
    { headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
