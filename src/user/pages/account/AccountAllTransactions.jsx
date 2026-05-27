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

 
import { Helmet } from 'react-helmet';
import getCookie from '../../../helper/getCookie';
import LoadingScreen from '../../components/LoadingScreen';
import getDecryptData from '../../../helper/getDecryptData';

const AccountAllTransactions = () => {
 
  const [Loading, setLoading] = useState(true);
  const [SubmitLoading, setSubmitLoading] = useState(true); // Add loading state
  const [Transaction, setTransaction] = useState([]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const fetchpaymentsById = async () => {
    const decryptdatajson = await getDecryptData();

    const id = decryptdatajson._id;

    try {
      setLoading(true);

      const { data } = await axiosInstance.get(`/all-payment/${id}`);
      const { success } = data;

      if (success) {
        setTransaction(data.transactions.reverse());
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Handle network errors, API issues, etc.
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchpaymentsById();
  }, []);

  const downloadInvoice = async (id) => {
    try {
      const response = await toast.promise(
        axiosInstance.post(
          `/download-invoice`,

          { invoiceId: id },
          {
            responseType: "blob", // Important for handling binary data
          }
        ),
        {
          loading: "Invoice Downloading...", // Loading message
          success: "Invoice Downloaded!", // Success message
          error: "Failed to Invoice Download.", // Error message
        }
      );

      // Create a link element and simulate a click to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "invoice.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the invoice:", error);
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

 
                {!Loading ? (
          <>
            <div className="container">
              <div className="title-bar">
                <h5 className="title">Payment History </h5>

                {/* <select
                  className="form-select"
                  name="filter"
                  onChange={handleFilterChange}
                  value={filterRange}
                >
                  <option value="all">All</option>
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="1month">Last 1 Month</option>
                </select>
                <select
                  className="form-select"
                  name="sort"
                  onChange={handleSortChange}
                  value={sortOrder}
                >
                  <option value={1}>Newest</option>
                  <option value={2}>Oldest</option>
                </select> */}
              </div>

              <div class="row mt-4 pt-2">
                {Transaction.map((transaction) => (
                  
                  <div key={transaction._id} class="p-2 col-md-6">
          <div className='card p-4'>
           <div className="d-flex">
                      <div className="col">
                        <h5 class="timeline-tilte">
                          {transaction.payment === 0 && (
                            <span class="badge bg-warning me-2">
                              Pending
                            </span>
                          )}
                          {transaction.payment === 1 && (
                            <span class="badge bg-success me-2">
                              Success
                            </span>
                          )}
                          {transaction.payment === 2 && (
                            <span class="badge bg-danger me-2">failed</span>
                          )}
                          ₹{transaction.totalAmount}
                        </h5>
                        <p class="timeline-date fw-bold">
                          {formatDate(transaction?.createdAt)} ||{" "}
                          {formatTime(transaction?.createdAt)}
                        </p>
                      </div>

                      <div className="d-block">
                        <button
                          className="btn btn-primary btn-sm text-white"
                          onClick={() => downloadInvoice(transaction._id)}
                        >
                          <i className="ri-file-download-fill me-2 fw-light"></i>
                          Invoice
                        </button>
                      </div>
                    </div>
                    <hr className="my-2" />
                    <p className="m-0">
                      <span className="fw-bold"> Payment Id : </span>
                      #{transaction.paymentId}{" "}
                    </p>
  </div>
                    
                  </div> 
                ))}
              </div>
              {Transaction.length === 0 &&  (
                    <p>No Transaction Found</p>
                  )}
            </div>
         
            <br /> 
           
          </>
        ) : (
          <LoadingScreen/>
        )}


                </div>
              </div>
            </div>
          </div>

        </div>
    
 

      <Footer />


    </>
  )
}

export default AccountAllTransactions