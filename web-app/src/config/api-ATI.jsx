import publicInstance from "./AxiosPublicReq";

const url = "https://ielts-scoring-production.up.railway.app/api/v1";

export const submitSpeaking = (formData) => {
  return publicInstance.post(`${url}/submit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export const getResult = (id) => {
  return publicInstance.get(`${url}/result/${id}`);
}