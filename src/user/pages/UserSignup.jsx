import React, { useState, useEffect, useContext, Component } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/store';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import axiosInstance from '../../axiosInstance';

const UserSignup = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const checkUserToken = async () => {
            console.log('Effect is running');
            const usertoken = localStorage.getItem('token');
            if (usertoken) {
                console.log('Token found in local storage');
                navigate('/');
                toast.success('Welcome back');
            }
        };
        checkUserToken();
    }, [navigate]);


    const [inputs, setInputs] = useState({
        username: '',
        email: '',
        password: '',
    });


    const credentials = {
        username: inputs.username,
        email: inputs.email,
        password: inputs.password
    };
    const [loginError, setLoginError] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Add loading state


    //handle input change
    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));

    };

    //form handle
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axiosInstance.post('http://localhost:8000/login', credentials);
            const { success, token, user, message } = data;

            if (success) {
                // Save token and user ID to localStorage
                localStorage.setItem('token', user.token);
                localStorage.setItem('userId', user._id);

                toast.success("login sucesssfully");

                // Dispatch login action if you're using Redux
                dispatch(authActions.login());

                // Redirect user or perform other actions upon successful login
                navigate('/'); // Redirect to dashboard or any other desired route
            }
            console.log("Message from backend:", message);

        } catch (error) {
            console.error('Error during login:', error);
            // Handle network errors, API issues, etc.
            toast.error(error.response.data.message);

        }
    };

    return (
        <>

            <Header />

            <div className='container mt-5'>

                <div className='row'>
                    <div class="col-md-6 m-auto">

                        <form onSubmit={handleSubmit}>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="form1Example1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    id="username"
                                    value={inputs.email}
                                    onChange={handleChange}
                                    required=""

                                />

                            </div>

                            {/* Email input */}
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="form1Example1">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    id="email"
                                    value={inputs.email}
                                    onChange={handleChange}

                                    required=""
                                    fdprocessedid="gxml2x"
                                />

                            </div>
                            {/* Password input */}
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="form1Example2">
                                    Password
                                </label>
                                <input
                                    type="password"

                                    className="form-control"
                                    id="password"
                                    name="password" onChange={handleChange}
                                    required=""
                                    value={inputs.password}

                                />

                            </div>
                            {/* 2 column grid layout for inline styling */}
                            <div className="row mb-4">
                                <div className="col text-start">



                                    <label className="form-check-label" htmlFor="form1Example3">
                                        Already have a account
                                    </label>

                                </div>
                                <div className="col text-end">
                                    {/* Simple link */}
                                    <Link to="/login"> Login Here</Link>
                                </div>
                            </div>
                            {/* Submit button */}
                            <button type="submit" className="btn btn-primary btn-block">
                                Sign Up
                            </button>



                        </form>


                    </div>
                </div>

            </div>
        </>
    )
}

export default UserSignup;

