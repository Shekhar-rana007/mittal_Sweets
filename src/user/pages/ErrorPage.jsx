import React, { useState, useEffect, useContext, Component } from 'react';
import { useNavigate,Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/store';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Error from '../assets_user/img/error.jpg'

const ErrorPage = () => {

    return (
        <>
            <Header />

   
            <div className="d-flex align-items-center justify-content-center vh-100">
  <div className="text-center row">
    <div className=" col-md-6">
      <img
        src={Error}
        className="img-fluid"
      />
    </div>
    <div className=" col-md-6 mt-5">
      <p className="fs-3">
        {" "}
        <span className="text-danger">Opps!</span> Page not found.
      </p>
      <p className="lead">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  </div>
</div>


           
            <Footer />
        </>

    );
};

export default ErrorPage