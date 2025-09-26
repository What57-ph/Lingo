import { configureStore } from "@reduxjs/toolkit";
import testListSlice from "../slice/testListSlice";
import attemptSlice from "../slice/attempts"
import authReducer from '../slice/authentication';

export const store = configureStore({
    reducer: {
        tests: testListSlice,
        attempts: attemptSlice,
        authentication: authReducer
    },
});
