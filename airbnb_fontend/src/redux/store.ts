import { configureStore } from "@reduxjs/toolkit";
import sliceBookingAdmin from "./Admin-slice/AdminBookingSlice";
import sliceLocationAdmin from "./Admin-slice/AdminLocationSlice";
import sliceRoomAdmin from "./Admin-slice/AdminRoomSlice";
import sliceUserAdmin from "./Admin-slice/AdminUserSlice";
import sliceComment from "./Comment-slice/CommentSlice";
import sliceCurrent from "./Current-detail/currentDetailManage";
import sliceRoomDetail from "./Detail-slice/DetailSlice";
import sliceLocation from "./Location-slice/LocationSlice";
import sliceUser from "./user-slice/UserSlice";
export const store = configureStore({
  reducer: {
    sliceLocation,
    sliceUser,
    sliceRoomDetail,
    sliceComment,
    sliceCurrent,
    sliceUserAdmin,
    sliceRoomAdmin,
    sliceLocationAdmin,
    sliceBookingAdmin,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
