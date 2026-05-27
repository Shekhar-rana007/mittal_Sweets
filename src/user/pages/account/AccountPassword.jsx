import React, { useState, useEffect } from 'react';
import AccountSidebar from '../../components/AccountSidebar';
import { toast } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import axiosInstance from '../../../axiosInstance';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
 import getDecryptData from '../../../helper/getDecryptData';



const AccountPassword = () => {

  const [loading, setLoading] = useState(true); // Add loading state
  const [SubmitLoading, setSubmitLoading] = useState(true); // Add loading state

  const [formData, setFormData] = useState({
    password: '',
    password2: '',
  });

  


  const submitData = async () => {
    const decryptdatajson = await getDecryptData();
    const id = decryptdatajson?._id;

    if (formData.password === formData.password2) {
      setSubmitLoading(false);

      try {
        if (id) {
          await axiosInstance.put(`/update-profile/${id}`, formData);
          toast.success('password Updated!');
        }
      } catch (error) {
        console.error('Error On Profile:', error);
        console.log(formData);
        toast.error(error.response.data.message);
      } finally {
        setSubmitLoading(true);
      }
    }
    else {
      toast.error("Password not Match");

    }

  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: type === 'checkbox' ? checked : value }));
  };


  return (
    <>
      <Header />

      <Helmet>
        <title> Account Password | {window.location.hostname}</title>
      </Helmet>

      <div className="user-dasboard whitesmoke" >

        <div className="container pt-4">
          <div className="row pb-4">

            <AccountSidebar />

            <div className="col-lg-9 my-lg-0 my-1">
              <div id="main-content" className="bg-white border">


                <h4 className="mb-2">
                  Change Password</h4>


                <div className="card-body">
                  <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                      <h6 className="mb-2 text-primary">Password Details</h6>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        {" "}
                        <label className="mb-2 mt-2 d-block" htmlFor="password">Password </label>{" "}
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          name="password"
                          placeholder="Enter Password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        {" "}
                        <label className="mb-2 mt-2 d-block" htmlFor="eMail">Re Password</label>{" "}
                        <input
                          type="password"
                          className="form-control"
                          id="password2"
                          name="password2"
                          placeholder="Enter Password"
                          value={formData.password2}
                          onChange={handleChange}
                        />
                      </div>
                    </div>


                  </div>

                  <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-5">
                      <div className="text-right">
                        {" "}
                        <Link
                          to="/account"
                          id="submit"
                          name="submit"
                          className="btn btn-secondary"
                        >
                          Cancel
                        </Link>{" "}

                        {SubmitLoading ? (
                          <button
                            type="button"
                            id="submit"
                            name="submit"
                            className="btn btn-primary ms-2"
                            onClick={submitData} >
                            Update
                          </button>

                        ) : (

                          <button class="btn btn-primary ms-2" type="button" disabled>
                            <span class="ms-1">Loading...</span>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          </button>

                        )}

                      </div>
                    </div>
                  </div>
                </div>



              </div>
            </div>
          </div>
        </div>

      </div>


      <Footer />
    </>
  )
}

export default AccountPassword