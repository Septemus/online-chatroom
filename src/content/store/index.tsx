import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const rootReducer = combineReducers({ user: userReducer });
export const setUpStore = (preloadedState?: any) => {
	return configureStore({
		reducer: rootReducer,
		preloadedState,
	});
};
export const store = setUpStore();
// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
export type AppStore = ReturnType<typeof setUpStore>;
