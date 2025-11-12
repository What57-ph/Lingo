import instance from "../config/AxiosConfig";
// {userId, message}
export const chatWithAI = async (chatRequest) => {
    const URL = `/api/v1/chatbot/askAI`;
    const response = await instance.post(URL, chatRequest);
    return response;
}
export const chatWithAIAndMediaFile = async (file, userId, message) => {
    const URL = `/api/v1/chatbot/askAI`;
    const form = new FormData();
    form.append("userId", userId);
    form.append("message", message);
    form.append("file", file)

    const response = await instance.post(URL, form, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response;
}



