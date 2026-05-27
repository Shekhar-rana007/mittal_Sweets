import React, { useState, useEffect, useContext, Component } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/store';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../axiosInstance';

import Header from '../components/Header';
import Footer from '../components/Footer';


const CreateBlogs = () => {



    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        const checkUserToken = async () => {
            const usertoken = localStorage.getItem('token');
            if (!usertoken) {
                navigate('/login');
                toast.error('Login First');
            }
        };
        checkUserToken();
    }, [navigate]);

    const [inputs, setInputs] = useState({
        title: '',
        description: '',
        image: '',
    });

    const usertoken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    let credentials = {}; // Initialize an empty object
    if (usertoken) {
        credentials = {
            title: inputs.title,
            description: inputs.description,
            image: inputs.image,
            user: userId
        };
    }

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
            const { data } = await axiosInstance.post('http://localhost:8000/create-blog', credentials);
            const { success, token, user, message } = data;

            if (success) {

                toast.success("blog add sucesssfully");

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

            <div className='container mt-5 mb-5'>

                <div className='row'>
                    <div class="col-md-6 m-auto">

                        <form onSubmit={handleSubmit}>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="form1Example1">
                                    Add Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    id="title"
                                    value={inputs.title}
                                    onChange={handleChange}
                                    required=""

                                />

                            </div>

                            {/* Email input */}
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="form1Example1">
                                    Add Description
                                </label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    id="description"
                                    onChange={handleChange}
                                    required=""
                                    value={inputs.description} // Set the value of the textarea using the `value` attribute
                                ></textarea>


                            </div>
                            {/* Password input */}
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="form1Example2">
                                    Add Image
                                </label>
                                <input
                                    type="text"

                                    className="form-control"
                                    id="image"
                                    name="image" onChange={handleChange}
                                    required=""
                                    value={inputs.image}

                                />

                            </div>
                            {/* 2 column grid layout for inline styling */}

                            {/* Submit button */}
                            <button type="submit" className="btn btn-primary btn-block">
                                Add Blog
                            </button>



                        </form>


                    </div>
                </div>

            </div>


            <Footer />


        </>

    )
}

export default CreateBlogs