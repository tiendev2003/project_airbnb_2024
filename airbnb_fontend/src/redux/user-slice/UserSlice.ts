import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IProfile } from "../../constant/constant";
import { axiosInterceptorWithCybertoken } from "../../services/services";
interface IState {
  profileData: IProfile;
}

const initialState: IState = {
  profileData: {
    id: 0,
    name: "",
    phone: "",
    birthday: "",
    avatar: "",
    gender: true,
    role: "",
    email: "",
    password: "",
  },
};

export const getProfileData = createAsyncThunk(
  "userSlice/getProfileData",
  async (id: number) => {
    try {
      const resp = await axiosInterceptorWithCybertoken.get(`/api/users/${id}`);
      return resp;
    } catch (error) {
      console.log(error);
    }
  },
);

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setDefaultProfile: (state) => {
      state.profileData = {
        id: 0,
        name: "None",
        phone: "",
        birthday: "",
        avatar: "",
        gender: true,
        role: "USER",
        email: "",
        password: "",
      };
    },
  },
  extraReducers: (build) => {
    build.addCase(getProfileData.fulfilled, (state, action) => {
      state.profileData = action.payload?.data;
    });
  },
});

export default userSlice.reducer;

export const { setDefaultProfile } = userSlice.actions;
