import React, { useState, useEffect, useContext, Component } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import AccountSidebar from '../../components/AccountSidebar';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { authActions } from '../../../redux/store';
import axios from 'axios';
import axiosInstance from '../../../axiosInstance';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import getDecryptData from '../../../helper/getDecryptData';
 
import { Helmet } from 'react-helmet';
import getCookie from '../../../helper/getCookie';


const Account = () => {



  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const isLoginFromLocalStorage = localStorage.getItem('token') ? true : false;
  const isLoginFromLocalStorage =  getCookie('token') ? true : false;

  const [isLogin, setIsLogin] = useState(isLoginFromLocalStorage);

  const [isLoginForm, setIsLoginForm] = useState(true); // State to manage which form to display

  const [IfLogin, setIfLogin] = useState(true); // State to manage which form to display



  const toggleForm = () => {
    setIsLoginForm(prevState => !prevState); // Toggle between login and signup forms
  };


  useEffect(() => {
    // console.log(isLoginFromLocalStorage, 'isLoginFromLocalStorage')

    const checkUserToken = async () => {
      console.log('Effect is running');
      // Check if this is printed multiple times
     
      // const usertoken = localStorage.getItem('token');

      const usertoken =  getCookie('token');
      
      if (!usertoken) {
        toast.error("Please Login First");
        navigate('/');

      }

    }
    checkUserToken();
  }, [dispatch, navigate]);




  const [Order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [OrderPlace, setOrderPlace] = useState('');
  const [MYuser, setMYuser] = useState('');

  // const userId = localStorage.getItem('userId');
     const decryptdatajson = getDecryptData();
     const userId = decryptdatajson?._id;

  
  const getUserOrders = async () => {
    try {
    //  const id = localStorage.getItem('userId');
   

      const { data } = await axiosInstance.get(`/user-orders/${userId}`);
      // console.log(id);
      if (data?.success) {
        setOrder(data?.userOrder.orders);
        setOrderPlace(data?.userOrder.orders.length)
      }
      setIsLoading(false); // Set loading state to false after fetching data
      setIfLogin(false)
    } catch (error) {
      console.log(error);
      setIsLoading(false); // Set loading state to false in case of an error

    }
  };

  useEffect(() => {
    // This useEffect runs whenever the 'blog' state variable changes
    // console.log(Order); // Log the updated 'blog' state
  }, [Order]); // Dependency array with 'blog' ensures the effect runs when 'blog' state changes


  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);


  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }


  useEffect(() => {

    if (!IfLogin) {
      const getUsernameAndEmailFromLocalStorage = () => {
       // const userString = localStorage.getItem('user');
        const userString =  getCookie('user');

        if (userString) {
          const { username, email } = JSON.parse(userString);
          return { username, email };
        }
        return null;
      };

      // Retrieve username and email from local storage user data
      const { username, email } = getUsernameAndEmailFromLocalStorage();
      setMYuser(username);

    }
    getUserOrders();
  }, []); // Empty dependency array ensures that the effect runs once after the initial render


  return (
    <>

      <Header />

      <Helmet>
        <title> Account Order | {window.location.hostname}</title>

      </Helmet>

      {isLogin && <>
        <div className="user-dasboard whitesmoke" >

          <div className="container pt-4">
            <div className="row pb-4">

              <AccountSidebar />

              <div className="col-lg-9 my-lg-0 my-1">
                <div id="main-content" className="bg-white border">

                  <h4 className="text-uppercase">My orders</h4>



                  {isLoading ? (
                    // Display loading skeletons while data is being fetched
                    Array.from({ length: 2 }).map((_, index) => (
                      <div className="col-md-12" key={index}>

                        <div className="skeleton mb-3" style={{ height: 154, borderRadius: 2 }} />

                      </div>
                    ))
                  ) :
                    (Order.map(Order => (
                      <>


                        <div className="order my-3 bg-light-border">
                          <div className="row">
                            <div className="col-lg-4">
                              <div className="d-flex flex-column justify-content-between order-summary">
                                <div className="d-flex align-items-center">
                                  <div className="text-uppercase">Order #{Order.orderId}</div>
                                  <div className="blue-label ms-auto text-uppercase">
                                    {Order.mode}
                                  </div>
                                </div>

                                <div className="fs-8"> {formatDate(Order.createdAt)}</div>

                              </div>
                            </div>
                            <div className="col-lg-8">
                              <div className="d-sm-flex align-items-sm-start justify-content-sm-between">
                                <div className="status">Status: {
                                  Order.status === '0' ? (<> Cancel </>) :
                                    Order.status === '1' ? 'Placed' :
                                      Order.status === '2' ? 'Accepted' :
                                        Order.status === '3' ? 'Packed' :
                                          Order.status === '4' ? 'Shipped' :
                                            Order.status === '5' ? 'Delivered' :
                                              'Unknown'
                                }</div>
                                <Link className="btn btn-primary text-uppercase" to={`/account/order/${userId}/${Order._id}`}>
                                  order info
                                </Link>
                              </div>

                              <div className="progressbar-track">
                                <ul className="progressbar">
                                  <li id="step-1" className={`text-muted ${Order.status === '1' && 'green'}`}>
                                    <span class="ri-gift-line" />
                                  </li>
                                  <li id="step-2" className={`text-muted ${Order.status === '2' && 'green'}`}>
                                    <span className="ri-check-line" />
                                  </li>
                                  <li id="step-3" className={`text-muted ${Order.status === '3' && 'green'}`}>
                                    <span className="ri-instance-line" />
                                  </li>
                                  <li id="step-4" className={`text-muted ${Order.status === '4' && 'green'}`}>
                                    <span className="ri-truck-line" />
                                  </li>
                                  <li id="step-5" className={`text-muted ${Order.status === '5' && 'green'}`}>
                                    <span className="ri-box-1-line" />
                                  </li>
                                </ul>
                                <div id="tracker" />
                              </div>

                            </div>
                          </div>
                        </div>


                      </>
                    ))
                    )}


                </div>
              </div>
            </div>
          </div>

        </div>
      </>}




      <Footer />


    </>
  )
}

export default Account