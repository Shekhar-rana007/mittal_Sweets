import React, { useState, useEffect, useContext, Component, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/store';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axiosInstance, { keyLogin } from '../../axiosInstance';
import setCookie from '../../helper/setCookie';
import getCookie from '../../helper/getCookie';
import { encrypt } from '../../helper/encryption';
import LoginComponents from '../components/LoginComponents';
import PropTypes from 'prop-types';

function UserLogin({ updateAuthStatus }) {
  return (
    <>
      <Header />

      <Helmet>
        <title>User Login | {window.location.hostname}</title>
      </Helmet>

      <div className="whitesmoke">
        <div className="container py-10">
          <div
            className="col-12 col-lg-6 m-auto rounded-3 shadow p-5 bg-white"
            style={{ maxWidth: 450, minHeight: 400 }}
          >
            {/* Passing the function to LoginComponents correctly */}
            <LoginComponents updateAuth={updateAuthStatus} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// ✅ FIXED: updateAuthStatus is a function, not a boolean
UserLogin.propTypes = {
  updateAuthStatus: PropTypes.func.isRequired,
};

// ✅ Optional: improve performance with memo
export default React.memo(UserLogin);
