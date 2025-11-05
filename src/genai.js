import { authState, getToken } from './auth.js';
import axios from 'axios'

async function getResponse(contents) {
  const token = await getToken();
  const response = axios.get('http://localhost:3000/api/generate', {
    headers: { 'Authorization': `Bearer ${token}` },
    params: { contents },
  });
  return (await response).data;
}

export { getResponse };