import React, { useState, useEffect, useContext, Component } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/store';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axiosInstance from '../../axiosInstance';
import getCookie from '../components/extra/getCookie';
import getDecryptData from '../../helper/getDecryptData';

const CompleteOrder = () => {
  const [Order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoginFromLocalStorage = localStorage.getItem('token') ? true : false;
  const [isLogin, setIsLogin] = useState(isLoginFromLocalStorage);

  const [isLoginForm, setIsLoginForm] = useState(true); // State to manage which form to display

  const toggleForm = () => {
    setIsLoginForm(prevState => !prevState); // Toggle between login and signup forms
  };


  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const getUserOrders = async () => {
    try {
    //  const id = localStorage.getItem('userId');
       const decryptdatajson = await getDecryptData();
    const id = decryptdatajson?._id;

      const { data } = await axiosInstance.get(`/user-orders/${id}`);
      console.log(data);
      if (data?.success) {
        setOrder(data?.userOrder.orders ?? []);
      }
      setIsLoading(false); // Set loading state to false after fetching data
    } catch (error) {
      console.log(error);

    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);



  return (
    <>
      <Header />

      <div className="py-4" style={{ backgroundColor: "var(--bs-secondary-bg)" }}>
        <div className="container d-lg-flex justify-content-between align-items-center py-2 py-lg-4">
          <div className="pe-lg-4 text-center text-lg-start">
            <h1 className="h3 mb-0">Checkout complete</h1>
          </div>
          <div className="pt-2 pt-lg-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb flex-lg-nowrap justify-content-center justify-content-lg-start">
                <li className="breadcrumb-item">
                  <Link className="text-nowrap" to="/" previewlistener="true">
                    <i className="ri-store-2-line" /> Home{" "}
                  </Link>
                </li>

                <li
                  className="breadcrumb-item text-nowrap active"
                  aria-current="page"
                >
                  Checkout complete
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="container my-4 my-lg-10 py-0 py-sm-4 py-lg-10">
        <div className="card py-4">
          <div className="card-body text-center">


            {Order && Order.length > 0 ? (
              <div>      {/* Render information about the first order */}



                <h4 className="pb-4">Thank you for your order!</h4>
                <p className="fs-sm">
                  Your order <span className="fw-medium">Order ID: {Order[0].orderId} .</span> has been
                  placed and will be processed as soon as possible.
                </p>
                <p className="fs-sm">
                  Our manager can contact you by email or phone to confirm the order.
                </p>
                <p className="fs-sm">
                  Now you can continue shopping or track your order.
                </p>
                <b> Order Amount : ₹{Order[0]?.totalAmount}</b> <br />
                <Link className="btn btn-secondary mt-2 me-4" to="/">
                  Continue shopping
                </Link>
                <Link
                  className="btn btn-primary d-inline-flex align-items-center mt-2"
                  to="/account"
                >
                  <i className="ri-map-pin-line me-2" /> Track order{" "}
                </Link>

                {/* Add more details as needed */}
              </div>
            ) : (
              <>
                <div
                  className="orderpanel"
                  style={{
                    width: "100%",
                    borderRadius: 5,
                    margin: 0,
                    height: "100%",
                    position: "fixed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    background: "#ffffffa1",
                    left: 0,
                    top: 0,
                    color: "white",

                  }}
                >
                  <div className="page">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <div className="loader-outer">
                          <div className="loader" />
                        </div>
                        <h2>Fetching YOUR ORDER</h2>
                      </div>
                      <div className="panel-body">
                        <p>
                          Hold tight, your order is being processed, please do not navigate away
                          from the current window or refresh the page.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}



          </div>
        </div>
      </div>


      <Footer />
    </>
  )
}

export default CompleteOrder
