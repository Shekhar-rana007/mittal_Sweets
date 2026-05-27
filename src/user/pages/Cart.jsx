import React, { useState, useEffect, useContext, Component } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/store';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuantitySelector from '../components/extra/QuantitySelector';
import { useBlogContext } from '../../fetchdata/BlogContext';
import CreateSlug from '../components/extra/CreateSlug';

const CartPage = () => {

  const { cartItems, removeItemFromCart, updateItemQuantity, getTotalAmount, removePromoCode, getTotalItems, applyPromoCode, promoCodeInfo, mypromoCode, totalAmount } = useBlogContext();

  // console.log('cartItems', cartItems); // Log cartItems to console for debugging


  const [promoCode, setPromoCode] = useState(''); // State to hold the entered promo code

  const handleRemovePromoCode = () => {
    toast.success('Promo code removed')
    removePromoCode();
    // console.log(promoCodeInfo)
  };

  // Function to handle applying promo code
  const handleApplyPromoCode = () => {
    applyPromoCode(promoCode); // Call the applyPromoCode function with the entered promo code
    // console.log('promoCodeInfo', promoCode)
  };

  const handleDecreaseQuantity = (itemId) => {
    updateItemQuantity(itemId, cartItems.find(item => item.id === itemId).quantity - 1);
  };

  const handleIncreaseQuantity = (itemId) => {
    updateItemQuantity(itemId, cartItems.find(item => item.id === itemId).quantity + 1);
  };

  return (
    <>
      <Header />

      <Helmet>
        <title> My Cart | {window.location.hostname}</title>

      </Helmet>


      <div className="whitesmoke">
        <div className="py-4">
          <div className="container d-lg-flex justify-content-between align-items-center py-2 py-lg-4 pb-0">
            <div className="pe-lg-4 text-center text-lg-start">
              <h1 className="h3 mb-0">Shopping cart</h1>
            </div>
            <div className="pt-2 pt-lg-0">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb flex-lg-nowrap justify-content-center justify-content-lg-start">
                  <li className="breadcrumb-item">
                    <Link className="text-nowrap" to="/" previewlistener="true">
                      <i className="ri-store-2-line" /> Home{" "}
                    </Link>
                  </li>

                  <li className="breadcrumb-item text-nowrap active" aria-current="page">
                    Shopping cart
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        <div className="container pb-4 pb-lg-10">
          <div className="row g-4 g-lg-10">
            <div className="col-lg-8">
              {cartItems && cartItems.length > 0 ? (
                <div className="border rounded-3 p-4 bg-white">
                  <h5 className="modal-title">Your Cart ({cartItems.length}) Total Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})</h5>
                  <table className="table table-hover carttable">
                    <thead>
                      <tr>
                        <th>Product Image</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => { 
                        
                               const myslug = CreateSlug(item.title);
                        return (
                        <tr key={item.id}>
                          <td> 
                            <Link to={`/product/${myslug}/${item.pid}`} className='cursor'> <img src={item.image}   style={{
    width: 100,
    aspectRatio: "1 / 1",
    objectFit: "contain",
    background: "white"
  }} 
 /> </Link>

<p className='text-center mt-4 d-lg-none mb-0'>

<Link className="btn btn-secondary p-2 mb-2 w-100" to={`/product/${item.pid}`}> 
View </Link>


<button className="btn btn-danger p-2  w-100" onClick={() => removeItemFromCart(item.id)}> 
Remove </button>





</p>


                           </td>
                           <td>
<p style={{
    maxWidth: 200,
    textOverflow: "ellipsis",
    overflow: "hidden",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    display: "-webkit-box",
    whiteSpace: "normal",margin:"0px",
  }} >{item.title} 
</p>
                      
                           </td>
                          <td className='d-two cart' >

                            <div className="d-flex flex-row flex-md-row flex-column gap-2 align-items-center">
                              <button className="btn btn-primary btn-sm p-2" disabled={promoCodeInfo && promoCodeInfo.type && promoCodeInfo.discount > 0} onClick={() => handleDecreaseQuantity(item.id)}>−</button>
                              <span>{item.quantity}</span>
                              <button className="btn btn-primary btn-sm p-2" disabled={promoCodeInfo && promoCodeInfo.type && promoCodeInfo.discount > 0} onClick={() => handleIncreaseQuantity(item.id)}>+</button>
                            </div>

                          </td>
                          <td  className='d-two' >
                          <span className='d-md-none'> Price</span>

<p  >₹{item.regularPrice}
   </p></td>
                          <td className='d-two' >
                          <span className='d-md-none'> Discount</span>

<p> ₹{ item.regularPrice - item.price } </p></td>
                          <td className='d-two'>
                            
                          <span className='d-md-none'> Total</span>
                          
                          <p> ₹{item.quantity * item.price} </p></td>
                          <td><button className="btn btn-danger p-2 d-none d-lg-block" onClick={() => removeItemFromCart(item.id)}> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> </button></td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center mt-5 mb-4"> <p className="h3" style={{ fontWeight: 300 }} > No items in the cart </p> </div>
              )}
            </div>
            <div className="col-lg-4">
              <div className="card border">
                <div className="card-body">
                  {cartItems && cartItems.length > 0 ? (
                    <>

                      {promoCodeInfo && promoCodeInfo.type && promoCodeInfo.discount > 0 ? (<>
                        <div className="d-flex align-items-center justify-content-between">
                          <p>Sub Total </p>
                          <p>₹{cartItems.reduce((total, item) => total + item.quantity * item.price, 0)}</p>
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                          <p >Discount </p>
                          <p>{totalAmount - (cartItems.reduce((total, item) => total + item.quantity * item.price, 0))}</p>

                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                          <h5> Total </h5>
                          <h5>₹{totalAmount}</h5>
                        </div>

                        <div className="d-flex align-items-center justify-content-between mypromobox mb-2">
                          <div className="d-flex align-items-center justify-content-between gap-2" >
                            <i class="ri-checkbox-circle-line text-success h4"></i>

                            <p className='m-0'> <b> {mypromoCode} </b>  applied <br />
                              {promoCodeInfo.type === "percentage" ? (<>
                                {promoCodeInfo.discount * 100}% OFF
                              </>) : (<>
                                ₹{promoCodeInfo.discount} OFF
                              </>)}  </p>

                          </div>

                          <button type="button" className="btn btn-danger p-2" onClick={handleRemovePromoCode}>
                            {" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={16}
                              height={16}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1={10} y1={11} x2={10} y2={17} />
                              <line x1={14} y1={11} x2={14} y2={17} />
                            </svg>{" "}
                          </button>


                        </div>

                      </>) : (<>
                        <div className="d-flex align-items-center justify-content-between">
                          <h5> Total </h5>
                          <h5>  {cartItems.length > 0 && (
                            <>  ₹ {cartItems.reduce((total, item) => total + item.quantity * item.price, 0)}
                            </>
                          )} </h5>

                        </div>

                        <hr className="mb-4" />
                        <div className="col-auto mb-3">
                          <div className="input-group">
                            <input id="promoCode1" type="text" className="form-control" onChange={(e) => setPromoCode(e.target.value)} placeholder="Promo code" value={promoCode} />
                            <button className="btn btn-primary" onClick={handleApplyPromoCode} type="button" id="button-promo">Apply</button>
                          </div>
                        </div>

                      </>
                      )}





                      <Link className="btn btn-accent btn-shadow d-block w-100" to="/checkout">Checkout</Link>
                    </>
                  ) : (<>
                    <Link className="btn btn-primary btn-shadow d-block w-100" to="/">Shop Now</Link>
                  </>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
      <Footer />
    </>
  );
};


export default CartPage
