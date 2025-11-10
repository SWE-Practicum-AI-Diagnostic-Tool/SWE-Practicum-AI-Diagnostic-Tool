import { authState, getToken } from './auth.js';
import axios from 'axios'

export async function getResponse(contents) {
  const token = await getToken();
  const response = axios.get('http://localhost:3000/api/generate', {
    headers: { Authorization: `Bearer ${token}` },
    params: { contents },
  });
  return (await response).data;
}

export async function getQuestions(vehicle, issues) {
  const token = await getToken();
  const response = axios.get('http://localhost:3000/api/gen-questions', {
    headers: { Authorization: `Bearer ${token}` },
    params: { vehicle, issues },
  });
  return (await response).data;
}

export async function getFlowchart(vehicle, issues, responses) {
  const token = await getToken();
  const response = axios.get('http://localhost:3000/api/gen-flowchart', {
    headers: { Authorization: `Bearer ${token}` },
    params: { vehicle, issues, responses },
  });
  return (await response).data;
}
