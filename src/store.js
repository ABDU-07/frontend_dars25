import { configureStore } from "@reduxjs/toolkit";
import articlesSlice from "./slices/articlesSlice";
import authSlice from "./slices/authSlice";

export default configureStore({
  reducer: { articles: articlesSlice, auth: authSlice },
});
