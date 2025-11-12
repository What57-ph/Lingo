import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { chatWithAI, chatWithAIAndMediaFile } from "../service/chatbotService";

const initialState = {
    conversation: null,
    messageResponse: null,
    loading: false,
    error: null
}
export const askAI = createAsyncThunk("chats/chatAI", async (chatRequest) => await chatWithAI(chatRequest))
export const askAIWithFile = createAsyncThunk("chats/chatAIWithFile", async (file, userId, message) => await chatWithAIAndMediaFile(file, userId, message));

const chatSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(askAI.fulfilled, (state, action) => {
                state.loading = false;
                state.messageResponse = action.payload;
            })
            .addCase(askAI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(askAI.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(askAIWithFile.fulfilled, (state, action) => {
                state.loading = false;
                state.messageResponse = action.payload;
            })
            .addCase(askAIWithFile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(askAIWithFile.pending, (state, action) => {
                state.loading = true;
            })

    }
})

export default chatSlice.reducer;