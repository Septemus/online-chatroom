import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

// Define a type for the slice state
export interface userState {
	id: string;
}

// Define the initial state using that type
const initialState: userState = {
	id: "",
};

export const userSlice = createSlice({
	name: "user",
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setId(state, action: PayloadAction<string>) {
			state.id = action.payload;
		},
	},
});

export const { setId } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectId = (state: RootState) => state.user.id;

export default userSlice.reducer;
