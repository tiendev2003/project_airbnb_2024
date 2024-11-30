import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ILocationItem } from "../../constant/constant";
import { axiosInterceptorWithCybertoken } from "../../services/services";
export interface ILocationState {
  inspectOfSearchPage: ILocationItem[];
  listRoomByIdLocation: [];
}

export const getInspectOfSearchPage = createAsyncThunk(
  "locationSlice/getInspectOfSearchPage",
  async () => {
    try {
      const resp = await axiosInterceptorWithCybertoken.get("/api/vi-tri/");
      console.log(resp);
      return resp.data; // Trả về chỉ dữ liệu (data) từ phản hồi
    } catch (error) {
      console.log(error);
      return []; // Trả về mảng trống nếu có lỗi
    }
  },
);

export const getListRoomByIdLocation = createAsyncThunk(
  "locationSlice/getListRoomByIdLocation",
  async (id: string | undefined) => {
    try {
      const resp = await axiosInterceptorWithCybertoken.get(
        `/api/phong-thue/lay-phong-theo-vi-tri?maViTri=${id}`,
      );
      return resp.data; // Trả về chỉ dữ liệu (data) từ phản hồi
    } catch (error) {
      console.log(error);
      return []; // Trả về mảng trống nếu có lỗi
    }
  },
);

const initialState: ILocationState = {
  inspectOfSearchPage: [],
  listRoomByIdLocation: [],
};

export const locationSlice = createSlice({
  name: "locationSlice",
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build.addCase(getInspectOfSearchPage.fulfilled, (state, action) => {
      state.inspectOfSearchPage = action.payload; // Chỉ lưu dữ liệu trả về
    });
    build.addCase(getListRoomByIdLocation.fulfilled, (state, action) => {
      state.listRoomByIdLocation = action.payload; // Chỉ lưu dữ liệu trả về
    });
  },
});

export default locationSlice.reducer;
