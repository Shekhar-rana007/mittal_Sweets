import React from "react";
import axiosInstance from "../axiosInstance";
import getDecryptData from "./getDecryptData";
import getCookie from "./getCookie";
import toast from "react-hot-toast";
import eraseCookie from "./eraseCookie";
const getUserData = async () => {
  const decryptdatajson = await getDecryptData();
  const id = decryptdatajson?._id;

  const credentials = {
    id: id,
  };
  const authuser = getCookie("token");
  if (!authuser) {
    return;
  }

  try {
    toast.success('successsuccesssuccess')
    const { data } = await axiosInstance.post("/auth-user", credentials);

    const { success, existingUser } = data;
    console.log("successsuccesssuccess", data);
    if (success) {
      return existingUser;
    } else if (data.success === false) {
      toast.error(data.message);
      eraseCookie("token");
    }
  } catch (error) {
    console.log(error);
  }
};

export default getUserData;
