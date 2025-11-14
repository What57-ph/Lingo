import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { submitWriting } from "../config/api-ATI";

const initialState = {
  result: null,
  loading: false,
  error: null
};

export const createSubmit = createAsyncThunk(
  "writing/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await submitWriting(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || "Lỗi không xác định");
    }
  }
);

const writingSlice = createSlice({
  name: "writing",
  initialState,
  reducers: {
    resetWritingResult: (state) => {
      state.result = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubmit.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubmit.fulfilled, (state, action) => {
        state.result = action.payload;
        state.loading = false;
      })
      .addCase(createSubmit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
})

export const { resetWritingResult } = writingSlice.actions;
export default writingSlice.reducer;