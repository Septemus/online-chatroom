import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const rootReducer = combineReducers({ user: userReducer });
export const setUpStore = (preloadedState?: RootState) => {
	return configureStore({
		reducer: rootReducer,
		preloadedState,
	});
};
let store: AppStore;
try {
	store = setUpStore((window as any)?.__PRELOADED_STATE__);
	console.log("rehydrating store:", (window as any)?.__PRELOADED_STATE__);
} catch (err) {
	store = setUpStore();
}
export { store };
// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
export type AppStore = ReturnType<typeof setUpStore>;
