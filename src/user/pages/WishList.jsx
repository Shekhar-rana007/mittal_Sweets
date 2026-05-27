import React, { useState, useEffect, useContext, Component } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/store';
import { toast } from 'react-hot-toast';
import { useCart } from "react-use-cart";
import Header from '../components/Header';
import Footer from '../components/Footer';
import axiosInstance from '../../axiosInstance';
import getCookie from '../components/extra/getCookie';
import getDecryptData from '../../helper/getDecryptData';

const WishList = () => {



  const [isCat, setIsCat] = useState(true);

  const [ratings, setRatings] = useState([]);

  const [Wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const isLoginFromLocalStorage = localStorage.getItem('token') ? true : false;
  const isLoginFromLocalStorage = getCookie('token') ? true : false;

  const [isLogin, setIsLogin] = useState(isLoginFromLocalStorage);

  const [isLoginForm, setIsLoginForm] = useState(true); // State to manage which form to display

  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state




  const toggleForm = () => {
    setIsLoginForm(prevState => !prevState); // Toggle between login and signup forms
  };


  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const {
    isEmpty,
    totalUniqueItems,
    totalItems,
    items,
    cartTotal,
    updateItemQuantity,
    removeItem,
    emptyCart,
  } = useCart();

  const removeFromCart = (productId) => {
    removeItem(productId);
  };


  
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
  });


  const [Logininputs, setLoginInputs] = useState({
    email: '',
    password: '',
  });


  const Logincredentials = {
    email: Logininputs.email,
    password: Logininputs.password
  };


  //handle input change
  const handleLoginChange = (e) => {
    setLoginInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  };


  // const userString = localStorage.getItem('user');
  const userString =  getCookie('user');
  let initialUserData = {
    phone: '',
    pincode: '',
    country: '',
    address: ''
  };

  if (userString) {
    const { phone, pincode, country, address } = JSON.parse(userString);
    // Use user information from localStorage as initial data
    initialUserData = { phone, pincode, country, address };
  }



  // Set initial state using retrieved user information
  const [Orderinputs, setOrderInputs] = useState(initialUserData);

  const [Ordercart, setOrderCart] = useState({});

  const Ordercredentials = {
    phone: Orderinputs.phone,
    pincode: Orderinputs.pincode,
    country: Orderinputs.country,
    address: Orderinputs.address,
    items: Ordercart,
    status: '1',
    mode: 'cod',
    details: {
      phone: Orderinputs.phone,
      pincode: Orderinputs.pincode,
      country: Orderinputs.country,
      address: Orderinputs.address,
    },
    totalAmount: cartTotal,
  };




  const getRating = async () => {
    try {
      const { data } = await axiosInstance.get(`/all-rating`);
      setRatings(data.ratings);
      console.log('getRating', data)

    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };



  const getWishlist = async () => {
  //  const id = localStorage.getItem('userId');
   const decryptdatajson = await getDecryptData();
     const id = decryptdatajson?._id;

    try {
      const { data } = await axiosInstance.get(`/view-wishlist/${id}`);
      console.log("wishlist", data);
      setWishlist(data.wishlist);

      setIsCat(false)
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };


  const handleDelete = async (id) => {

    try {
      await axiosInstance.delete(`/delete-wishlist/${id}`);
      toast.success("Deleted wishlist Sucessfully");
      setIsCat(true);
      getWishlist();
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
    }
  };


  useEffect(() => {
    getRating();
    getWishlist();
    const userCart = localStorage.getItem('react-use-cart');

    if (userCart) {
      const { items } = JSON.parse(userCart);
      setOrderCart(items);
    }
  }, []); // Empty dependency array to run this effect only once when the component mounts


  const credentials = {
    username: inputs.username,
    email: inputs.email,
    password: inputs.password
  };



  useEffect(() => {
    setIsLogin(isLoginFromLocalStorage);
  }, [isLoginFromLocalStorage, dispatch]);



  return (
    <>
      <Header />

      <Helmet>
        <title> My Wishlist | {window.location.hostname}</title>
      </Helmet>

      <div
        className="py-4 mb-4 mb-lg-10"
        style={{ backgroundColor: "var(--bs-secondary-bg)" }}
      >
        <div className="container d-lg-flex justify-content-between align-items-center py-2 py-lg-4">
          <div className="pe-lg-4 text-center text-lg-start">
            <h1 className="h3 mb-0">Wishlist</h1>
          </div>
          <div className="pt-2 pt-lg-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb flex-lg-nowrap justify-content-center justify-content-lg-start">
                <li className="breadcrumb-item">
                  <Link className="text-nowrap" to="/" previewlistener="true">
                    <i className="ri-store-2-line" /> Home{" "}
                  </Link>
                </li>
              
             
              </ol>
            </nav>
          </div>
        </div>
      </div>


      <div className="container mb-4 mb-lg-10">
        <div className="card">
          <div className="card-body">
            {/* Title */}
            <h6 className="border-bottom pb-4 mb-4">Products added to wishlist</h6>
            {/* Title */}
            {/* Item */}


            <div class="row">

              {isCat
                ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="col-md-3 col-sm-6 mt-4"
                  >
                    <div
                      className="card-1 skeleton"
                      style={{ height: 430, borderRadius: 5 }}
                    ></div>
                  </div>
                ))
                : Wishlist.reverse().map((Pro) => {
                  let averageRating = undefined
                  if(Pro.productDetail !== undefined){
               
                  // Calculate average rating for the current product
                  const productRatings = ratings.filter(rating => rating.productId === Pro.productDetail._id);
                  const totalRatings = productRatings.length;
                  const totalRatingValue = productRatings.reduce((acc, curr) => acc + curr.rating, 0);
                   averageRating = totalRatings > 0 ? totalRatingValue / totalRatings : 0;
     
                }
                  return (
                    <>
                      {/* Product */}
                      <div className="col-sm-6 col-md-3 px-2 mb-4">
                        <div className="card card-product h-100">
                          {/* Badges */}

                          {/* Badges */}
                          {/* Buttons */}
                          <div className="product-buttons">
                            <button
                              className="btn-product btn-wishlist"
                              type="button"
                              data-bs-toggle="button"
                              title="Add to wishlist"
                            >
                              <i className="ri-heart-line" />
                            </button>
                            <a
                              className="btn-product btn-compare"
                              href="#"
                              title="Compare product"
                            >
                              <i className="ri-repeat-line" />
                            </a>
                          </div>
                          {/* Buttons */}
                          {/* Preview Image */}
                          <Link
                            to={`/product/${Pro.productDetail?._id}`}
                            className="card-img-top d-block overflow-hidden flex-shrink-0"
                          >
                            <img
                              className="img-fluid"
                              src={Pro.productDetail?.pImage}
                              alt="Product"
                            />
                          </Link>
                          {/* Preview Image */}
                          <div className="card-body d-flex flex-column align-items-start flex-grow-1 h-100 py-3">
                            {/* Product Category */}



                            {/* <a
                                    className="product-category d-block fs-sm pb-1"
                                    href="#"
                                  >
                                    Smartphones
                                  </a> */}

                            {/* Product Category */}
                            {/* Product Title */}
                            <h3 className="product-title flex-grow-1">
                              <Link to={`/product/${Pro.productDetail?._id}`}>
                                {" "}
                                {Pro.productDetail?.title}{" "}
                              </Link>
                            </h3>

                          
                           


                            {/* Star Rating */}
                            {/* Product Price */}
                            <div className="product-price">
                              <span className="text-danger fs-5">
                                ₹{Pro.productDetail?.salePrice}
                                <del className="text-body-secondary ms-1">
                                  <small>₹{Pro.productDetail?.regularPrice}</small>
                                </del>
                              </span>
                            </div>
                            {/* Product Price */}
                            {/* Product Meta */}


                            <div className="w-100 text-center mt-4">
                              <button type="button" onClick={() => handleDelete(Pro._id)} className="btn btn-danger btn-sm m-auto">
                                <svg
                                  className="me-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#ffffff"
                                  strokeWidth={2}
                                  strokeLinecap="square"
                                  strokeLinejoin="arcs"
                                  style={{ margin: 0 }}
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  <line x1={10} y1={11} x2={10} y2={17} />
                                  <line x1={14} y1={11} x2={14} y2={17} />
                                </svg>  Delete
                              </button>

                            </div>
                            {/* Product Meta */}
                          </div>
                          {/* Product Addon */}

                          {/* Product Addon */}
                        </div>
                      </div>
                      {/* Product */}
                    </>
                  );
                })}

            </div>



          </div>
        </div>
      </div>



      <Footer />
    </>
  )
}

export default WishList
