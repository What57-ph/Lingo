import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createComment, getAllComments, getCommentsOfTest, getReplyOfComment, inactiveComment } from "../service/commentService";

const initialState = {
    comments: [],
    replyOfComment: {},
    loading: false,
    error: null,
    commentOfTest: []
};

export const retrieveAllComments = createAsyncThunk(
    "comments/getAll",
    async (id, { rejectWithValue }) => {
        try {
            return await getAllComments(id);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const retrieveRepliesOfComment = createAsyncThunk(
    "comments/getReplies",
    async (commentId, { rejectWithValue }) => {
        try {
            return await getReplyOfComment(commentId);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const retrieveCommentsOfTest = createAsyncThunk(
    "comments/getCommentsOfTest",
    async (testId, { rejectWithValue }) => {
        try {
            return await getCommentsOfTest(testId);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const removeComment = createAsyncThunk(
    "comments/delete",
    async (commentId, { rejectWithValue }) => {
        try {
            return await inactiveComment(commentId);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addComment = createAsyncThunk(
    "comments/create",
    async (commentRequest, { rejectWithValue }) => {
        try {
            return await createComment(commentRequest);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


const commentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(retrieveAllComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(retrieveAllComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload.result || [];
            })
            .addCase(retrieveAllComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(retrieveCommentsOfTest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(retrieveCommentsOfTest.fulfilled, (state, action) => {
                state.loading = false;
                state.commentOfTest = action.payload || [];
            })
            .addCase(retrieveCommentsOfTest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(retrieveRepliesOfComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(retrieveRepliesOfComment.fulfilled, (state, action) => {
                state.loading = false;
                const { id, replies } = action.payload;
                state.replyOfComment[id] = replies;
            })
            .addCase(retrieveRepliesOfComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.loading = false;
                state.comments.push(action.payload);
            })
            .addCase(addComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(removeComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeComment.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload.id || action.meta.arg;
                state.comments = state.comments.filter(c => c.id !== deletedId);
            })
            .addCase(removeComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default commentSlice.reducer;
