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
import { useBlogContext } from '../../../fetchdata/BlogContext';

const AccountAllEnquire = () => {
  const { Headers, isHeader } = useBlogContext();

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setlimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    const decryptdatajson = await getDecryptData();
    const userId = decryptdatajson?._id;
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/apply-enquire-status?page=${currentPage}&limit=${limit}&search=${searchTerm}&userId=${userId}`);
      setData(response.data.Enquire || []);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, limit]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };




  const inputRef = React.createRef();

  const handleSearchInputChange = (e) => {
    setCurrentPage(1);
    setTotalPages(1)
    setSearchTerm(e.target.value);


  };

  const handleSearch = () => {
    fetchData(currentPage);

  };


  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      month: 'long', // Use 'long' to display the full month name
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
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



                {loading ? <LoadingScreen />
                  :
                  <div className="card bg-transparent border-0 mb-4">


                    <div className="row">


                      <div className="datatable-top d-flex align-items-center justify-content-between w-100 border-bottom pb-3">
                        <h4 className="text-uppercase h5 ">Claim Enquiries</h4>

                        <div className="datatable-dropdown">
                          <label className='d-flex align-items-center gap-2'>
                            <select className="form-control w-auto" value={limit} onChange={(e) => {
                              setlimit(parseInt(e.target.value, 10));
                              setCurrentPage(1); // Reset current page to 1 when the limit changes
                            }} >
                              <option value={5}>5</option>
                              <option value={10} >
                                10
                              </option>
                              <option value={15}>15</option>
                              <option value={20}>20</option>
                              <option value={25}>25</option>
                            </select>{" "}

                            entries per page
                          </label>
                        </div>

                      </div>



                      <table className="table table-flush">
                        <thead>
                          <tr>
                            <th>S no.</th>
                            <th>Vendor Name</th>
                            <th>Vendor No.</th>
                            <th>requirement</th>
                            <th>Date / Time </th>
                            <th>Customer Care</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((row, index) => (
                            <tr key={row._id}>
                              <td>{index + 1}</td> {/* This will display the count starting from 1 */}
                              <td>{row.userId?.username}</td>
                              <td>{row.userId?.phone}</td>
                              <td>{row.requirement}</td>

                              <td>
                                {formatTimestamp(row.createdAt)}
                              </td>
                              <td>
                                {Headers.phone}
                              </td>
                              <td>
                                <div class="dropdown">
                                  <button class="btn btn-primary px-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="ri-more-2-fill"></i>
                                  </button>
                                  <ul class="dropdown-menu p-2 whitespace-nowrap">
                                    <li className='text-nowrap'> My Name : {row.senderId?.username} </li>
                                    <li className='text-nowrap'>  My phone:  {row.senderId?.phone}  </li>
                                    <li className='text-nowrap'>  My Email:  {row.senderId?.email}  </li>

                                  </ul>
                                </div>   </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>


                      <div className='container mt-4'>
                        <div className='d-flex bg-light border  align-center p-2 mx-auto overflow-hidden justify-content-between' style={{ maxWidth: '500px', borderRadius: '40px' }}>
                          <button href="/hospital/67973150a76a66c3198c5060" onClick={handlePreviousPage} disabled={loading || currentPage === 1} className="btn btn-white btn-shadow d-block border " style={{ borderRadius: '40px' }} >Previous</button>
                          <div className='col align-items-center d-flex justify-content-center'>
                            <span>   Showing  {currentPage} of {totalPages} </span>
                          </div>
                          <button className="btn btn-white btn-shadow d-block border" style={{ borderRadius: '40px' }} onClick={handleNextPage} disabled={loading || currentPage === totalPages} >Next</button>

                        </div>
                      </div>


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

export default AccountAllEnquire