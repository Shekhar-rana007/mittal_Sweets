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

// import shoppingImage from '../../assets_user/img/shopping-cart.png';
// import orderImage from '../../assets_user/img/order-image.png';
// import heartImage from '../../assets_user/img/love-image.png'

import { useBlogContext } from '../../../fetchdata/BlogContext';
import { Helmet } from 'react-helmet';
import getCookie from '../../../helper/getCookie';
import getDecryptData from '../../../helper/getDecryptData';
const Account = () => {
 
  const [user, setUser] = useState(true); // State to manage which form to display


  useEffect(() => {

  const decryptdatajson = getDecryptData();
  setUser(decryptdatajson);
}, []);


  return (
    <>

      <Header />

      <Helmet>
        <title> Account | {window.location.hostname}</title>

      </Helmet>
 
        <div className="user-dasboard whitesmoke" >

          <div className="container pt-4">
            <div className="row pb-4">

              <AccountSidebar />

              <div className="col-lg-9 my-lg-0 my-1">
                <div id="main-content" className="bg-white border">
                  <div className="d-flex flex-column">
                    <div className="h5">Hello {user.username ? user.username : 'User' }

                    </div>
                    {/* <div>Logged in as: someone@gmail.com</div> */}
                  </div>

                  <div className="row">
                    <div className="col-md-3">

                    </div>


                  </div>


                  <div className="d-flex my-4 flex-wrap">
                      <Link className="box me-4 my-1 bg-light-border" to="/account/orders"  >
                        <i className="bi bi-box-seam-fill h2 text-primary"/>

                        <div className="d-flex align-items-center mt-2">
                          <div className="tag">My Order</div>
                         </div>
                      </Link>
                      <Link className="box me-4 my-1 bg-light-border" to="/wishList">
                  <i className="bi bi-box2-heart-fill h2 text-primary"/>
                         <div className="d-flex align-items-center mt-2" >
                          <div className="tag">My Wishlist</div>
                         </div>
                      </Link>
                      <Link className="box me-4 my-1 bg-light-border" to="/account/profile">
                    <i className="bi bi-person-square h2 text-primary"/>

                        <div className="d-flex align-items-center mt-2">
                          <div className="tag">Edit Profile</div>
                         </div>
                      </Link>
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

export default Account