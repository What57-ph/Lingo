import instance from "../config/AxiosConfig";

export const getAllComments = async () => {
    const URL = `/api/v1/comment/`;
    const response = await instance.get(URL);
    return response;
}

export const getReplyOfComment = async (id) => {
    const URL = `/api/v1/comment/replies/${id}`;
    const response = await instance.get(URL);
    return response;
}

export const createComment = async (commentRequest) => {
    const URL = `/api/v1/comment`;
    const response = await instance.post(URL, commentRequest);
    return response;
}

export const inactiveComment = async (id) => {
    const URL = `/api/v1/comment/${id}`;
    const response = await instance.delete(URL);
    return response;
}

export const getCommentsOfTest = async (testId) => {
    const URL = `/api/v1/comment/commentOfTest/${testId}`;
    const response = await instance.get(URL);
    return response;
}