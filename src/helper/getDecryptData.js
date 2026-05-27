import React from "react";
import getCookie from "./getCookie";
import { decrypt } from "./encryption";
import eraseCookie from "./eraseCookie";
import toast from "react-hot-toast";
 import { keyLogin } from "../axiosInstance";
const getDecryptData = () => {
  const KEY = keyLogin;

  const token = getCookie("token");
  // if(token){
  //     const decryptdata = decrypt(token,KEY);

  //     const decryptdatajson = JSON.parse(decryptdata);
  //     return decryptdatajson;

  // }else{
  //     return null;

  // }

  if (token) {
    try {
      const decryptdata = decrypt(token, KEY);
      const decryptdatajson = JSON.parse(decryptdata);
      return decryptdatajson;
    } catch (error) {
      console.error("Error parsing decrypted data:", error);
      eraseCookie("token");
      toast.error("User Not Authenticated");
      return null;
    }
  } else {
    return null;
  }
};

export default getDecryptData;
