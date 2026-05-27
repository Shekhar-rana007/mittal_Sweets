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

const Cancel = () => {

    return (
        <>
            <Header />

   
            <div className="d-flex align-items-center justify-content-center vh-100">
  <div className="text-center row">

    <div className=" col-md-12 mt-0">
      <p className="fs-3">
        {" "}
        <span className="text-danger">Opps!</span> Payment Cancelled
      </p>
      <p className="lead"> You can cancel transactions that appear on your list of pending orders from your merchant backend </p>
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

export default Cancel