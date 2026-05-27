import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import toast from "react-hot-toast";
import { authActions } from "../../redux/store";


const AccountSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //logout
  const handleLogout = () => {
    try {
      dispatch(authActions.logout());
      toast.success("Logout Successfully");
      navigate("/login");
      // localStorage.clear();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');


    } catch (error) {
      console.log(error);
    }
  };

  const isActive = (path) => {
    return window.location.pathname === path ? 'active' : '';
  };

  return (
    <>


      <div className="col-lg-3 my-lg-0 my-md-1">
        <div id="sidebar" className="bg-purple">
          <div className="h4 text-white">Account</div>
          <ul>
            <li className={isActive('/account')} >
              <Link
                to="/account"
                className="text-decoration-none d-flex align-items-start"
              >
                <div className="fas fa-box pt-2 me-3" />
                <div className="d-flex flex-column">
                  <div className="link">My Account</div>
                  <div className="link-desc">
                    View &amp; Manage orders and returns
                  </div>
                </div>
              </Link>
            </li>
            <li className={isActive('/account/orders')} >
              <Link
                to="/account/orders"

                className="text-decoration-none d-flex align-items-start"
              >
                <div className="fas fa-box-open pt-2 me-3" />
                <div className="d-flex flex-column">
                  <div className="link">My Orders</div>
                  <div className="link-desc">
                    View &amp; Manage orders and returns
                  </div>
                </div>
              </Link>
            </li>

            <li className={isActive('/account/profile')} >
              <Link
                to="/account/profile"
                className="text-decoration-none d-flex align-items-start"
              >
                <div className="far fa-address-book pt-2 me-3" />
                <div className="d-flex flex-column">
                  <div className="link">My Profile</div>
                  <div className="link-desc">  Change your profile details</div>
                </div>
              </Link>
            </li>

            <li className={isActive('/wishList')} >
              <Link
                to="/wishList"
                className="text-decoration-none d-flex align-items-start"
              >
                <div className="far fa-address-book pt-2 me-3" />
                <div className="d-flex flex-column">
                  <div className="link">My wishlist</div>
                  <div className="link-desc">  Choose your wishList</div>
                </div>
              </Link>
            </li>


            <li className={isActive('/comparsion')} >
              <Link
                to="/comparsion"
                className="text-decoration-none d-flex align-items-start"
              >
                <div className="far fa-address-book pt-2 me-3" />
                <div className="d-flex flex-column">
                  <div className="link">My comparsion</div>
                  <div className="link-desc">  Compare your products details</div>
                </div>
              </Link>
            </li>


            <li className={isActive('/account/password')} >
              <Link
                to="/account/password"
                className="text-decoration-none d-flex align-items-start"
              >
                <div className="far fa-user pt-2 me-3" />
                <div className="d-flex flex-column">
                  <div className="link">Change Password</div>
                  <div className="link-desc">
                    Change your profile password
                  </div>
                </div>
              </Link>
            </li>
            <li className={isActive('/account/support')} >
              <Link
                to="/account/support"
                className="text-decoration-none d-flex align-items-start"
              >
                <div className="fas fa-headset pt-2 me-3" />
                <div className="d-flex flex-column">
                  <div className="link">Help &amp; Support</div>
                  <div className="link-desc">
                    Contact Us for help and support
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>


      <div className="overlay col-md-3 mt-1 d-none" id="left">

        <Link to="/account/" class="mb-3">
          <button className="btn2 mt-2 form-control" fdprocessedid="b0h82a">
            <span>Dashboard</span>
          </button>
        </Link>


        <Link to="/account/orders" class="mb-3">
          <button className="btn2 mt-2 form-control" fdprocessedid="b0h82a">
            <span>My orders</span>
          </button>
        </Link>

        <Link to="/account/profile" class="mb-3">
          <button className="btn2 mt-2 form-control" fdprocessedid="b0h82a">
            <span>My profile</span>
          </button>
        </Link>

        <Link to="/account/password" class="mb-3">
          <button className="btn2 mt-2 form-control" fdprocessedid="b0h82a">
            <span> Password</span>
          </button>
        </Link>

        <Link onClick={handleLogout} class="mb-3">
          <button className="btn2 mt-2 form-control" fdprocessedid="b0h82a">
            <span> Logout</span>
          </button>
        </Link>

      </div>

    </>
  )
}

export default AccountSidebar