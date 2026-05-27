// TokenValidator.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../redux/store';
import toast from 'react-hot-toast';
import axiosInstance from '../axiosInstance';
import getCookie from '../user/components/extra/getCookie';
import eraseCookie from '../user/components/extra/eraseCookie';

const TokenValidator = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // useEffect(() => {
    //     const validateToken = async () => {
    //        // const usertoken = localStorage.getItem('token');
    //         const usertoken = getCookie('token'); // Retrieve token from cookie
            
    //         if (usertoken) {
    //             try {
    //                 const response = await axiosInstance.get(`/validatetoken/${usertoken}`);

    //                 if (response.data.success) {
    //                     // Token is valid, dispatch the login action and navigate to the home page
    //                     dispatch(authActions.login());
    //                     // toast.success("Token found");
    //                 } else {
    //                     // Token is invalid, clear local storage token
    //                     eraseCookie('token');
    //                     eraseCookie('userId');
    //                     eraseCookie('user');
    //                     // localStorage.removeItem('token');
    //                     // localStorage.removeItem('userId');
    //                     toast.error("Token expired or invalid");
    //                 }
    //             } catch (error) {
    //                 // Handle error, for example, show an error message
    //                 console.error('Error validating token:', error);
    //                 // Optionally, clear local storage token in case of an error
    //                 eraseCookie('token');
    //                 eraseCookie('userId');
    //                 eraseCookie('user');
    //                 toast.error("Error validating token");
    //             }
    //         }
    //     };

    //     validateToken();
    // }, [dispatch]);

    return null; // This component doesn't render anything visible
};

export default TokenValidator;






