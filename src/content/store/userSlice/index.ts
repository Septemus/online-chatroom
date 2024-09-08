import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "@/common/apollo/client";
import { VERIFY } from "@/common/apollo/verify";
// Define a type for the slice state
export interface userState {
	id: string;
	status: "loading" | "loaded";
}

// Define the initial state using that type
const initialState: userState = {
	id: "",
	status: "loading",
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
	extraReducers(builder) {
		builder
			.addCase(verifyToken.pending, (state, action) => {
				state.status = "loading";
			})
			.addCase(verifyToken.fulfilled, (state, action) => {
				state.status = "loaded";
				state.id = action.payload as string;
			})
			.addCase(verifyToken.rejected, (state, action) => {
				state.status = "loaded";
				console.log(action.payload);
			});
	},
});

export const verifyToken = createAsyncThunk(
	"user/verifyToken",
	async (token: string) => {
		const res = await client.query({
			query: VERIFY,
			variables: {
				token,
			},
		});
		if (res.data.verify.success) {
			return res.data.verify.id;
		} else {
			throw res.data.verify.msg;
		}
	},
);

export const { setId } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectId = (state: RootState) => state.user.id;
export const selectStatus = (state: RootState) => state.user.status;

export default userSlice.reducer;
