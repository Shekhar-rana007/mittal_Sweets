import React, { useState, useEffect, useContext, Component } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import AccountSidebar from '../../components/AccountSidebar';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { authActions } from '../../../redux/store';
import axios from 'axios';
import axiosInstance, { Homeurl } from '../../../axiosInstance';
import Header from '../../components/Header';
import Footer from '../../components/Footer';


import { Helmet } from 'react-helmet';
import getCookie from '../../../helper/getCookie';
import LoadingScreen from '../../components/LoadingScreen';
import getDecryptData from '../../../helper/getDecryptData';

const AccountPlan = () => {

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Buyloading, setBuyLoading] = useState(false);
  const [Buydata, setBuyData] = useState([]);
  const [Local, setLocal] = useState(0);


  // const isLoginFromLocalStorage = localStorage.getItem('token') ? true : false;
  const isLoginFromLocalStorage = getCookie('token') ? true : false;

  const [isLogin, setIsLogin] = useState(isLoginFromLocalStorage);


  const fetchData = async () => {
    const decryptdatajson = await getDecryptData();
    const id = decryptdatajson?._id;
    if (id) {

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/my-plan/${id}`);
        setData(response.data?.plan);
        setBuyData(response.data?.lastBuy);
        if (response.data?.state === false) {
          toast.error('Please update profile')
          navigate('/account/profile')
        }
        setLocal(response.data?.Local);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }

    }
    else {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/all-plan`);
        setData(response.data?.plan);
        setBuyData([]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const buyNow = async (planId, totalAmount) => {
    const decryptdatajson = await getDecryptData();
    const uid = decryptdatajson?._id;
    try {

      // Prepare the request data
      const mydata = {
        userId: uid,      // use the decrypted user ID
        planId: planId,   // pass the planId from function argument
        totalAmount: totalAmount, // pass the totalAmount from function argument
        razorpay_order_id: "", // Add razorpay details if available
        razorpay_payment_id: "", // Add razorpay details if available
        razorpay_signature: "", // Add razorpay details if available
        note: "", // Optional: Add any note if needed
        Local
      };

      setBuyLoading(true);

      const { data } = await toast.promise(
        axiosInstance.post(`/buy-plan`, mydata),
        {
          loading: "Buying plan", // Loading message
          success: "Plan buy sucesssfully!", // Success message
          error: "Failed to buy plan.", // Error message
        }
      );

      const { success, message } = data;

      if (success) {
        fetchData();
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setBuyLoading(false);
    }

  };


  return (
    <>

      <Header />

      <Helmet>
        <title> Account Order | {window.location.hostname}</title>

      </Helmet>

      <div className="user-dasboard whitesmoke" >

        <div className="container pt-4">
          <div className="row pb-4">

            <AccountSidebar />

            <div className="col-lg-9 my-lg-0 my-1">
              <div id="main-content" className="bg-white border">

                <h4 className="text-uppercase mb-4">My Plan</h4>



                {loading ? <LoadingScreen />
                  :
                  <div className="card bg-transparent border-0 mb-4 shadow-none">
                    {Buydata && Buydata.length !== 0 && Buydata.daysLeft &&
                      <div className="card  mb-4  p-3">
                        <div className="row">
                          <div className="col-md-6">
                            <h5>
                              {Buydata.planId?.name}
                              <span className={`badge badge-md ${Buydata.daysLeft !== 0 ? 'bg-success' : 'bg-danger'}  ms-1 text-white`}>
                                {Buydata.daysLeft !== 0 ? 'Active' : 'Unactive'}
                              </span>
                            </h5>
                          </div>
                          <div className="col-md-6 text-end">
                            <div className="rr">
                              {/* <Link to={`/card-view/${Buydata?._id}`}
                                className="btn btn-primary  ms-2"

                              >
                                View Health Card
                              </Link> */}

                              <button
                                className="btn btn-outline-primary  ms-2"
                                type="button"
                              >
                                {" "}
                                <i className="ri-time-line" /> {Buydata.daysLeft} days Left
                              </button>
                              <button
                                className="btn btn-outline-primary  ms-2"
                                type="button"
                              >
                                {" "}
                                ₹ {Buydata.totalAmount}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    }

                    <div className="row">

                      {data.map((row) => (

                        <div key={row._id} className="col-12 col-lg-6 col-xl-4">
                          <div className="card mb-4 mb-xl-0 bg-light">
                            <div className="card-header bg-white border-gray-100 py-5 px-4">
                              <div className="d-flex mb-3">
                                <span className="h5 mb-0">Rs</span>{" "}
                                <span
                                  className="price display-3 mb-0"
                                  data-annual={0}
                                  data-monthly={0}
                                >
                                  {row.price}
                                </span>{" "}
                                <span className="h6 fw-normal align-self-end">
                                  / {row.validity} days
                                </span>
                              </div>
                              <h4 className="mb-3 text-black">{row.name}</h4>
                              <p className="fw-normal mb-0">
                                <ul>
                                  {row.Category.length !== 0 && row.Category.map((row) => (
                                    <li>
                                    <i className="fa-regular fa-circle"/>  {row.name}
                                    </li>
                                  ))}
                                </ul>
                              </p>
                            </div>

                            <div className="card-footer border-gray-100 d-grid px-4 pb-4">
                              {" "}

                              {!Buyloading ? (
                                <Link
                                  className="btn btn-primary"
                                  to={`/checkout-plan/${row._id}`}
                                // onClick={()=>{
                                //   buyNow(row._id,row.price)
                                // }}
                                >
                                  Buy Plan
                                </Link>
                              ) : (
                                <button
                                  class="btn btn-primary btn-sm"
                                  type="button"
                                  disabled
                                >
                                  <span class="ms-1">Loading...</span>
                                  <span
                                    class="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                </button>
                              )}


                            </div>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                }

              </div>
            </div>
          </div>
        </div>

      </div>

      <Footer />


    </>
  )
}

export default AccountPlan