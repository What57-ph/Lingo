import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addTest, deleteTest, getAllTests, getOneTest, updateTest } from "../service/TestService";

const initialState = {
    test: null,
    other: [],
    tests: null,
    loading: false,
};

export const createTest = createAsyncThunk("tests/create", async (test) => await addTest(test));
export const retrieveAllTests = createAsyncThunk("tests/retrieveAll", async (params) => await getAllTests(params));
export const retrieveSingleTest = createAsyncThunk("tests/retrieveOne", async (id) => await getOneTest(id));
export const modifyTest = createAsyncThunk("tests/update", async ({ id, test }) => await updateTest(id, test));
export const removeTest = createAsyncThunk("tests/delete", async (id) => await deleteTest(id));

const testSlice = createSlice({
    name: "test",
    initialState,
    reducers: {
        submitUserAnswer: (state, action) => {
            console.log("User Answers Submitted:", action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTest.fulfilled, (state, action) => {
                state.other.push(action.payload);
            })
            .addCase(retrieveAllTests.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(retrieveAllTests.fulfilled, (state, action) => {
                state.tests = action.payload;
                // console.log("debug all tests", state.tests)
                state.loading = false;
            })
            .addCase(retrieveSingleTest.fulfilled, (state, action) => {

                state.test = action.payload;
                // console.log("Fetched test:", state.test);
            })
            .addCase(retrieveSingleTest.rejected, (state, action) => {
                console.error("Failed to fetch test:", action.error);
            })
            .addCase(modifyTest.fulfilled, (state, action) => {
                const index = state.other.findIndex(test => test.id === action.payload.id);
                if (index !== -1) {
                    state.other[index] = { ...state.other[index], ...action.payload };
                }
            })
            .addCase(removeTest.fulfilled, (state, action) => {
                state.other = state.other.filter((test) => test.id !== action.payload.id);
            });
    }
});

export const { submitUserAnswer } = testSlice.actions;
export default testSlice.reducer;
