import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'
 

import AccountSidebar from '../../components/AccountSidebar';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { authActions } from '../../../redux/store';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

 
import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';
import { Helmet } from 'react-helmet';
import { useBlogContext } from '../../../fetchdata/BlogContext';
import getCookie from '../../../helper/getCookie';
import getDecryptData   from '../../../helper/getDecryptData';

import axiosInstance, { weburl } from '../../../axiosInstance';
const CryptoJS = window.CryptoJS;


const AccountOrderView = () => {
 
  const { orderId ,userId} = useParams();

// map logic start 
  const { AllLocationReq,Headers , isHeader } = useBlogContext();

  const [currentMapLocation, setCurrentMapLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false); // Track whether the map is loaded
  const [selectedMarker, setSelectedMarker] = useState(null); // State to track selected marker

    useEffect(() => {

  // Check if AllLocationReq is defined and is an array
  if (!AllLocationReq  ) {
    return;  // Exit early if AllLocationReq is undefined or empty
  }

    const AllLocation = AllLocationReq[AllLocationReq.length - 1];
    // console.log('loactionfound', AllLocationReq, AllLocation.userId, decryptdatajson._id)

    if (AllLocation && AllLocation.userId === decryptdatajson._id && AllLocation.orderId === orderId) {
      console.log('loactionfound', AllLocation)
      setCurrentMapLocation(AllLocation.currentLocation);
    }


  }, [AllLocationReq]);


 

 
  const [reason, setReason] = useState('');

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  function decrypt(encryptedText, key) {
    const keyHex = CryptoJS.enc.Hex.parse(md5(key));
    const initVector = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
    const encryptedHex = CryptoJS.enc.Hex.parse(encryptedText);
    const decryptedText = CryptoJS.AES.decrypt(
        { ciphertext: encryptedHex },
        keyHex,
        { iv: initVector, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding }
    );
    return decryptedText.toString(CryptoJS.enc.Utf8);
}

function md5(input) {
    return CryptoJS.MD5(input).toString(CryptoJS.enc.Hex);
}


  async function makeRequest() {
console.log('stats')
    try {
      const response = await axiosInstance.get(`/update-stuck-order/${Order.orderId}`);
      console.log(response.data)


    } catch (error) {
      console.error('Error:', error);
    }
  }



  const [formData, setFormData] = useState({
    reason: "",
    comment: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: type === 'checkbox' ? checked : value }));
  };



 // const userId = localStorage.getItem('userId');
      const decryptdatajson =  getDecryptData();

  // const userId = decryptdatajson._id;


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


  // useEffect(() => {
  //   console.log(isLoginFromLocalStorage, 'isLoginFromLocalStorage')

  //   const checkUserToken = async () => {
  //     console.log('Effect is running');
  //     // Check if this is printed multiple times
  //    // const usertoken = localStorage.getItem('token');
  //     const usertoken =  getCookie('token');
  //     if (!usertoken) {
  //       toast.error("Please Login First");
  //       navigate('/');

  //     }

  //   }
  //   checkUserToken();
  // }, [dispatch, navigate]);




  const [Order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [OrderPlace, setOrderPlace] = useState('');
  const [MYuser, setMYuser] = useState(false);



  const saveAsPDF = async () => {
    const printContent = document.getElementById('print');

    // Set the scale factor for better quality
    const scale = 5;

    // Set the quality of the JPEG image
    const imageQuality = 1; // 1 is maximum quality

    // Convert print content to image with higher scale
    html2canvas(printContent, {
      scale: scale,
      useCORS: true, // Enable CORS to support loading images from different origins
      logging: true // Enable logging for debugging
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', imageQuality); // Use JPEG format with specified quality

      // Calculate dimensions of PDF page
      const pdfWidth = 297; // A4 width in mm
      const pdfHeight = 210; // A4 height in mm
      const ratio = canvas.width / canvas.height;

      let pdfHeightAdjusted = pdfHeight;
      let pdfWidthAdjusted = pdfWidth;

      if (ratio < pdfWidth / pdfHeight) {
        pdfWidthAdjusted = pdfHeight * ratio;
      } else {
        pdfHeightAdjusted = pdfWidth / ratio;
      }

      // Calculate center position for the image
      const xPos = (pdfWidth - pdfWidthAdjusted) / 2;
      const yPos = (pdfHeight - pdfHeightAdjusted) / 2;

      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: 'landscape', // Set the orientation of the PDF to landscape
        unit: 'mm', // Use millimeters as the unit for measurements
        format: [pdfWidth, pdfHeight] // Set the format of the PDF (A4 size)
      });

      // Add image to PDF document at the calculated center position
      pdf.addImage(imgData, 'JPEG', xPos, yPos, pdfWidthAdjusted, pdfHeightAdjusted);

      // Save the PDF
      pdf.save("invoice.pdf");
    });
  }

  const getUserOrders = async () => {

    try {
      // const id = localStorage.getItem('userId');
      const { data } = await axiosInstance.get(`/user-orders-view/${userId}/${orderId}`);

      if (data?.success) {
        console.log('order', data)
        setOrder(data?.userOrder);

      }

      console.log(data)
      
      if(data.userOrder.mode === "CCAvenue" && data.userOrder.payment === 2 ){
        setTimeout(function() {  
             window.location.reload();
         }, 1000);

        try {
          const response = await axiosInstance.get(`/update-stuck-order/${data.userOrder.orderId}`);
          console.log(response.data)
    
    
        } catch (error) {
          console.error('Error:', error);
        }
        
      }
      if( data.userOrder.mode === "CCAvenue" && data.userOrder.payment === 0 && data.userOrder.status === "1"){

        setTimeout(function() {  
          window.location.reload();
      }, 1000);

                try {
                  const response = await axiosInstance.get(`/update-stuck-order/${data.userOrder.orderId}`);
                  console.log(response.data)
            
            
                } catch (error) {
                  console.error('Error:', error);
                }
                
              }

      setIsLoading(false); // Set loading state to false after fetching data
      setIfLogin(false)
    } catch (error) {
      console.log(error);
      setIsLoading(false); // Set loading state to false in case of an error
      toast.error("order Not found");
      navigate('/account');
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);


  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }


  useEffect(() => {

    // if (!IfLogin) {
    //   const getUsernameAndEmailFromLocalStorage = () => {
    //     // const userString = localStorage.getItem('user');
    //     const userString = getCookie('user');

    //     if (userString) {
    //       const { username, email } = JSON.parse(userString);
    //       return { username, email };
    //     }
    //     return null;
    //   };

    //   // Retrieve username and email from local storage user data
    //   const { username, email } = getUsernameAndEmailFromLocalStorage();
    //   setMYuser(username);
    // }

    getUserOrders();
  }, []); // Empty dependency array ensures that the effect runs once after the initial render

  const [loading, setLoading] = useState(true);


  const CancelStatusChange = async (event) => {
    const newStatus = event.target.value;
    setLoading(true);

    try {
      await axiosInstance.put(`/cancel-order/${orderId}`, formData);
      setLoading(false);
      getUserOrders();
      toast.success("Order Cancel success!");
      window.location.reload();

    } catch (error) {
      console.error('Error Order Cancel:', error);
      setLoading(false);
    }

  };





  return (
    <>

     
     
        <div className="user-dasboard bg-light" >

          <div className="container pt-4">
            <div className="row pb-4">

 

              <div className="col-lg-12 my-lg-0 my-1">
                <div id="main-content" className="bg-white border p-3 rounded">
                  <div className="d-flex justify-content-between align-items-center py-3">
                    

                    <div className=" mb-2">


                      <Link to="/account/orders" className="btn btn-dark me-2 mt-2 py-1">
                        <i className="bi bi-arrow-left me-2" /> 
                        <span className="text">Go Home</span>
                      </Link>
                      <button onClick={saveAsPDF} className="btn btn-primary me-2 mt-2  py-1">
                        <i className="bi bi-download" />{" "}
                        <span className="text">Invoice</span>
                      </button>

                   
                    </div>
                  </div>

 
 

                  {isLoading ? (
                    // Display loading skeletons while data is being fetched
                    Array.from({ length: 2 }).map((_, index) => (
                      <div className="col-md-12" key={index}>

                        <div className="skeleton mb-3" style={{ height: 154, borderRadius: 2 }} />

                      </div>
                    ))
                  ) :
                    (<>


<div   className=" border bg-white rounded mx-auto mt-3"

              >
                <div className="card-body p-2">
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <div
                        className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3 shadow-sm"
                        style={{ width: 45, height: 45 }}
                      >
                        <strong>{Order.details[0]?.username?.replace(/^(\w)\w*\s(\w)\w*/, '$1$2').toUpperCase()}</strong>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-semibold"> {Order.details[0].username} </h6>
                        <small className="text-muted"> {Order.details[0].email} </small>
                      </div>
                    </div>
                    {/* <a href="#" className="text-decoration-none text-primary small fw-medium">
                      Change
                    </a> */}
                  </div>
                  <hr className="my-3" />
                  {/* Invoice Dates */}
                  <div className="d-flex text-center mb-3">
                    <div className="col-6 bg-light rounded-3 py-2 me-1 border">
                      <small className="text-muted d-block">Invoice Date</small>
                      <span className="fw-semibold">  {formatDate(Order.createdAt)}  </span>
                    </div>
                    <div className="col bg-light rounded-3 py-2 ms-1 border">
                      <small className="text-muted d-block">Payment Status</small>
                      <span className={`text-white px-2 rounded ${Order.payment === 0 ? 'bg-danger' : Order.payment === 1 ? 'bg-success' : 'bg-warning'}`}>
                        {
                          Order.payment === 0 ? 'unpaid' :
                            Order.payment === 1 ? 'Full Paid' :
                              Order.payment === 3 ? 'Half Paid' :

                                'failed'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="text-primary fw-semibold mb-0">Item Details</h6>
                    <span className="badge bg-primary-subtle text-primary">
                      {Order.items.length} {Order.items.length > 1 ? 'items' : 'item'}
                    </span>
                  </div>

                  {/* Item List */}
                  <div className="list-group rounded-4 mb-3">
                    {Order.items.map((Pro) => (
                      <div
                        key={Pro.id}
                        className="list-group-item border-0 rounded-0 border-bottom d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={Pro.id === '1' ? weburl + Pro.image : Pro.image}
                            alt={Pro.title}
                            width={40}
                            className="rounded me-3"
                            style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                            data-bs-toggle="modal" data-bs-target="#exampleModal"
                          />
                          <div>
                            <strong>{Pro.title}</strong>
                            <div>
                              <small className="text-muted">
                                {Pro.quantity} × ₹{Math.round(Pro.price).toFixed(0)}
                              </small>
                            </div>
                          </div>
                        </div>
                        <span className="fw-semibold">
                          ₹{Math.round(Pro.price * Pro.quantity).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="p-3 bg-light rounded-3 border">
                    <h6 className="text-primary fw-semibold mb-3">Total Summary</h6>

                    {/* Subtotal */}
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Subtotal</span>
                      <span className="fw-semibold">
                        ₹{Math.round(
                          Order.items.reduce(
                            (total, item) => total + item.quantity * (item.price ?? 0),
                            0
                          )
                        )}
                      </span>
                    </div>

                    {/* Shipping */}
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Shipping</span>
                      <span className="fw-semibold">₹{Order.shipping}</span>
                    </div>



                    {/* Coupon Discount */}
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Coupon Discount</span>
                      <span className="fw-semibold text-danger">
                    {Order.discount && Math.abs(Order.discount) > 0
  ? `- ₹${Math.abs(Order.discount).toFixed(2)}`
  : '₹0'}

                      </span>
                    </div>

                    <hr className="my-2" />

                    {/* Grand Total */}
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="fw-bold mb-0">Total</h6>
                      <h5 className="fw-bold text-primary mb-0">₹{Order.totalAmount}</h5>
                    </div>
                  </div>


                </div>
               </div>

                      <div className="w-100 d-none" id="print">
                        <br />
                        <div class="p-5" style={{
                          backgroundColor: "#fff8ee",
                          border: "5px solid #00406e",
                          marginBottom: 10
                        }} >

                          <div className="d-block d-lg-flex justify-content-between align-items-center py-3">

                         

{Headers.meta_logo && Headers.meta_logo !== undefined && (
                    <img
                      src={Headers.meta_logo}
                      width="300" 
                      alt="logo"
                     
                    />
)}

                            <h1 class="text-end"> INVOICE</h1>



                          </div>


                          <div className="d-block d-lg-flex justify-content-between align-items-center py-3">

                            <div class=" text-center">
                              <b> INVOICE DATE </b>
                              <p> {formatDate(Order.createdAt)} </p>
                            </div>

                            <div class="text-center">
                              <b> Order No. </b>
                              <p> #{Order.orderId} </p>
                            </div>

                            <div class="text-center">
                              <b> Place Of Supply </b>
                              <p> {Order.details[0].state} </p>
                            </div>

                          </div>


                          {/* Title */}
                          <div className="d-block d-lg-flex justify-content-between align-items-center py-3">




                          </div>
                          {/* Main content */}
                          <div className="row" >

                            <div className='col-lg-6'>

                              {/* Shipping information */}
                              <div className="card-body">
                                <h3 className="h6"><b> BILL TO</b></h3>

                                <address>
                                  <p className="m-0">{Order.details[0].username}</p>
                                 
                                  <b title="Phone" className="mb-2" >Address:</b>  {Order.details[0].address}
                                  <br />
                                  <b title="Phone" className="mb-2" >State:</b>  {Order.details[0].state}
                                  <br />
                                  <b title="Phone" className="mb-2" >Pincode:</b>  {Order.details[0].pincode}
                                  <br />
                                  <b title="Phone" className="mb-2" >Phone:</b>  {Order.details[0].phone}
                                  <br />
                                  <b title="Phone" className="mb-2" >Email:</b>  {Order.details[0].email}  <br />


                                </address>
                              </div>

                            </div>

                            <div className="col-lg-6">

                              <div className="card-body text-end">

                                <h3 className="h6"> <b> BILL FROM </b></h3>

                                <address>
                                  <p className="mb-0" > The Helply </p>

                                  {/* <b title="Phone" className="mb-2">GST:</b>  06AAPFC7640H1Z9 */}
                                  <br />
                                  <b title="Phone" className="mb-2">Address:</b>  New Delhi 110045
                                  <br />

                                  <b title="Phone" className="mb-2">Email:</b> {!isHeader && (Headers.email)} <br />
                                  <b title="Phone" className="mb-2">Web:</b>www.{window.location.hostname} <br />
                            { (!isHeader && Headers.gst && Headers.gst.length !== 0 ) &&  <>  <b title="Phone" className="mb-2">GST:</b> {Headers.gst} <br /> </>  }  
                              

                                </address>
                              </div>


                            </div>




<div className='overflow-auto'>
 

 <table style={{ borderCollapse: "collapse", width: "100%" }}>
                               <tbody>
                                 <tr style={{ background: '#00406e', color: "white" }} >
                                   <td style={{ padding: 10, fontWeight: "bold" }}>Items</td>
                                   <td style={{ padding: 10, fontWeight: "bold" }}>QTY</td>
  
                                   <td style={{ padding: 10, fontWeight: "bold" }}> Price </td>
    
                                   <td style={{ padding: 10, fontWeight: "bold" }}>Total </td>
 
                                   
                                 </tr>
 
 
                                 {Order.items.map((Pro) => (
                                   <tr >
                                     <td style={{ padding: 10, maxWidth: '200px', borderWidth: '1px', borderColor: '#a2a2a2' }}>
                                       <div className="d-flex mb-2">
                                         <div className="flex-shrink-0">
                                           <img
                                             src={Pro.image}
                                             alt=""
                                             width={35}
                                             className="img-fluid"
                                           />
                                         </div>
                                         <div className="flex-lg-grow-1 ms-3">
                                           <h6 className="small mb-0">
                                             <Link href={`/product/${Pro.id}`} className="text-reset">
                                               {Pro.title}
                                             </Link>
                                           </h6>
 
                                         </div>
                                       </div>
                                     </td>
                                  
                                     <td style={{ padding: 10, borderWidth: '1px', borderColor: '#a2a2a2' }} > {Pro.quantity} </td>
 
  
                                     <td style={{ padding: 10, borderWidth: '1px', borderColor: '#a2a2a2' }}  >₹{Pro.price}</td>
  
                                    
                                   
                                     <td style={{ padding: 10, borderWidth: '1px', borderColor: '#a2a2a2' }} > ₹{Pro.quantity * Pro.price} </td>
 
  </tr>
                                 ))}
 
 
                               </tbody>
                               <tfoot>
                               
                                 <tr>
                                 <td colSpan={Order.primary === 'true' ? 3 : 2}></td>
                                   <td colSpan={1} style={{
                                     padding: ".75rem",
                                     verticalAlign: "top",
                                     borderWidth: '1px', borderColor: '#a2a2a2'
                                   }} > Subtotal </td>
                                   <td className="text-end" style={{
                                     padding: ".75rem",
                                     verticalAlign: "top",
                                     borderWidth: '1px', borderColor: '#a2a2a2'
                                   }} >₹{Order.items.reduce((total, item) => total + item.quantity * item.price, 0)}</td>
                                 </tr>
 
 
 
 
                                 <tr>
                                 <td colSpan={Order.primary === 'true' ? 3 : 2}></td>
 
 
                                   <td colSpan={1} style={{
                                     padding: ".75rem",
                                     verticalAlign: "top",
                                     borderWidth: '1px', borderColor: '#a2a2a2'
                                   }}  >  Shipping</td>
                                   <td className="text-end" style={{
                                     padding: ".75rem",
                                     verticalAlign: "top",
                                     borderWidth: '1px', borderColor: '#a2a2a2'
                                   }}  >₹{Order.shipping}</td>
                                 </tr>
                                 <tr>
                                 <td colSpan={Order.primary === 'true' ? 3 : 2}></td>
 
                                   <td colSpan={1} style={{
                                     padding: ".75rem",
                                     verticalAlign: "top",
                                     borderWidth: '1px', borderColor: '#a2a2a2'
                                   }}  > Coupon Discount </td>
 
                                   <td className="text-danger text-end" style={{
                                     padding: ".75rem",
                                     verticalAlign: "top",
                                     borderWidth: '1px', borderColor: '#a2a2a2'
                                   }} > {Order.items.reduce((total, item) => total + item.quantity * item.price, 0) - Math.abs(Order.discount) === 0 ? '₹0' : (
                                     <>- ₹{Math.abs(Order.discount)}
                                     </>
                                   )}  </td>
                                 </tr>
                                 <tr className="fw-bold">
                                 <td colSpan={Order.primary === 'true' ? 3 : 2}></td>
 
                                   <td colSpan={1} style={{
                                     padding: ".75rem",
                                     verticalAlign: "top",
                                     borderWidth: '1px', borderColor: '#a2a2a2'
                                   }}  > TOTAL</td>
                                   <td className="text-end" style={{
                                     padding: ".75rem",
                                     verticalAlign: "top",
                                     borderWidth: '1px', borderColor: '#a2a2a2'
                                   }}>₹{Order.totalAmount}</td>
                                 </tr>
                               </tfoot>
 
 
                             </table>
 

                            <table style={{ borderCollapse: "collapse", width: "100%" }} className='d-none'>
                              <tbody>
                                <tr style={{ background: '#00406e', color: "white" }} >
                                  <td style={{ padding: 10, fontWeight: "bold" }}>Items</td>
                                  <td style={{ padding: 10, fontWeight: "bold" }}>QTY</td>
                                  <td style={{ padding: 10, fontWeight: "bold" }}>Sale Price </td>

                                  <td style={{ padding: 10, fontWeight: "bold" }}>Gross Amount </td>
                                  <td style={{ padding: 10, fontWeight: "bold" }}>Discount </td>

                                  {Order.primary === 'true' ? (<>
                                    <td style={{ padding: 10, fontWeight: "bold" }}>CGST</td>
                                  <td style={{ padding: 10, fontWeight: "bold" }}>SGST</td>
                                  </>):(<>
                                    <td style={{ padding: 10, fontWeight: "bold" }}>IGST	</td>
                                    </>) }
                                  

                                  <td style={{ padding: 10, fontWeight: "bold" }}>Total </td>

                                  
                                </tr>


                                {Order.items.map((Pro) => (
                                  <tr >
                                    <td style={{ padding: 10, maxWidth: '200px', borderWidth: '1px', borderColor: '#a2a2a2' }}>
                                      <div className="d-flex mb-2">
                                        <div className="flex-shrink-0">
                                          <img
                                            src={Pro.image}
                                            alt=""
                                            width={35}
                                            className="img-fluid"
                                          />
                                        </div>
                                        <div className="flex-lg-grow-1 ms-3">
                                          <h6 className="small mb-0">
                                            <Link href={`/product/${Pro.id}`} className="text-reset">
                                              {Pro.title}
                                            </Link>
                                          </h6>

                                        </div>
                                      </div>
                                    </td>
                                 
                                    <td style={{ padding: 10, borderWidth: '1px', borderColor: '#a2a2a2' }} > {Pro.quantity} </td>

                                    <td style={{ padding: 10, borderWidth: '1px', borderColor: '#a2a2a2' }}  >₹{Math.round(Pro.price - (((Pro.price * Pro.gst) / 100))).toFixed(0)} </td>

                                    <td style={{ padding: 10, borderWidth: '1px', borderColor: '#a2a2a2' }}  >₹{Pro.price}</td>
                                    <td style={{ padding: 10, borderWidth: '1px', borderColor: '#a2a2a2' }}  > ₹{ Pro.regularPrice - Pro.price } </td>

                                    {Order.primary === 'true' ? (<>
                                      <td style={{ padding: 10, borderWidth: '1px', borderColor: '#a2a2a2' }} > ₹{((Pro.price * Pro.gst) / 100)/2}	 </td>
                                      <td style={{ padding: 10, borderWidth: '1px', borderColor: '#a2a2a2' }} > ₹{((Pro.price * Pro.gst) / 100)/2} </td>
                                 
                                  </>):(<>
                                    <td style={{ padding: 10, borderWidth: '1px', borderColor: '#a2a2a2' }}>₹{(Pro.price * Pro.gst) / 100}	</td>
                                    </>) }

                                  
                                    <td style={{ padding: 10, borderWidth: '1px', borderColor: '#a2a2a2' }} > ₹{Pro.quantity * Pro.price} </td>

 </tr>
                                ))}


                              </tbody>
                              <tfoot>
                                <tr>
                                  <td  style={{
                                    padding: ".75rem",
                                    verticalAlign: "top",
                                    borderWidth: '1px', borderColor: '#a2a2a2'
                                  }} >
Total
                                  </td>
                                  <td  style={{
                                    padding: ".75rem",
                                    verticalAlign: "top",
                                    borderWidth: '1px', borderColor: '#a2a2a2'
                                  }} >
                                  {Order.items.reduce((total, item) => total + item.quantity , 0)} 
                                  </td>

                          

                                  <td  style={{
                                    padding: ".75rem",
                                    verticalAlign: "top",
                                    borderWidth: '1px', borderColor: '#a2a2a2'
                                  }} >
₹{Math.round(Order.items.reduce((total, item) => total + item.price - (((item.price * item.gst) / 100)), 0)).toFixed(0)}
                                  </td>
        

                                  <td  style={{
                                    padding: ".75rem",
                                    verticalAlign: "top",
                                    borderWidth: '1px', borderColor: '#a2a2a2'
                                  }} >
                                  ₹{Order.items.reduce((total, item) => total + item.price  , 0)}
                                  </td>
        
                                  <td  style={{
                                    padding: ".75rem",
                                    verticalAlign: "top",
                                    borderWidth: '1px', borderColor: '#a2a2a2'
                                  }} >
                                  ₹{Order.items.reduce((total, item) => total + item.regularPrice - item.price , 0)}
                                  </td>

                                  
                                  {Order.primary === 'true' ? (<>
                                      <td style={{ padding: 10, borderWidth: '1px', borderColor: '#a2a2a2' }} >  ₹{Math.round(Order.items.reduce((total, item) => total + (((item.price * item.gst) / 100)/2), 0)).toFixed(0)}  </td>
                                      <td style={{ padding: 10, borderWidth: '1px', borderColor: '#a2a2a2' }} >  
                                      ₹{Math.round(Order.items.reduce((total, item) => total + (((item.price * item.gst) / 100)/2), 0)).toFixed(0)}
                                       </td>

                                  </>):(<>
                                    <td style={{ padding: 10, borderWidth: '1px', borderColor: '#a2a2a2' }} >  ₹{Math.round(Order.items.reduce((total, item) => total + (((item.price * item.gst) / 100)), 0)).toFixed(0)}  </td>
                                    </>) }

                                  
                                  <td  style={{
                                    padding: ".75rem",
                                    verticalAlign: "top",
                                    borderWidth: '1px', borderColor: '#a2a2a2'
                                  }} >
                                  ₹{Order.items.reduce((total, item) => total + item.quantity * item.price , 0)}
                                  </td>


                                </tr>
                                <tr>
                                  <td colSpan={10} >
<br/>
                                  </td>
                                </tr>
                                <tr>
                                <td colSpan={Order.primary === 'true' ? 6 : 5}></td>
                                  <td colSpan={1} style={{
                                    padding: ".75rem",
                                    verticalAlign: "top",
                                    borderWidth: '1px', borderColor: '#a2a2a2'
                                  }} > Subtotal </td>
                                  <td className="text-end" style={{
                                    padding: ".75rem",
                                    verticalAlign: "top",
                                    borderWidth: '1px', borderColor: '#a2a2a2'
                                  }} >₹{Order.items.reduce((total, item) => total + item.quantity * item.price, 0)}</td>
                                </tr>




                                <tr>
                                <td colSpan={Order.primary === 'true' ? 6 : 5}></td>


                                  <td colSpan={1} style={{
                                    padding: ".75rem",
                                    verticalAlign: "top",
                                    borderWidth: '1px', borderColor: '#a2a2a2'
                                  }}  >  Shipping</td>
                                  <td className="text-end" style={{
                                    padding: ".75rem",
                                    verticalAlign: "top",
                                    borderWidth: '1px', borderColor: '#a2a2a2'
                                  }}  >₹{Order.shipping}</td>
                                </tr>
                                <tr>
                                <td colSpan={Order.primary === 'true' ? 6 : 5}></td>

                                  <td colSpan={1} style={{
                                    padding: ".75rem",
                                    verticalAlign: "top",
                                    borderWidth: '1px', borderColor: '#a2a2a2'
                                  }}  > Coupon Discount </td>

                                  <td className="text-danger text-end" style={{
                                    padding: ".75rem",
                                    verticalAlign: "top",
                                    borderWidth: '1px', borderColor: '#a2a2a2'
                                  }} > {Order.items.reduce((total, item) => total + item.quantity * item.price, 0) - Math.abs(Order.discount) === 0 ? '₹0' : (
                                    <>- ₹{Math.abs(Order.discount)}
                                    </>
                                  )}  </td>
                                </tr>
                                <tr className="fw-bold">
                                <td colSpan={Order.primary === 'true' ? 6 : 5}></td>

                                  <td colSpan={1} style={{
                                    padding: ".75rem",
                                    verticalAlign: "top",
                                    borderWidth: '1px', borderColor: '#a2a2a2'
                                  }}  > TOTAL</td>
                                  <td className="text-end" style={{
                                    padding: ".75rem",
                                    verticalAlign: "top",
                                    borderWidth: '1px', borderColor: '#a2a2a2'
                                  }}>₹{Order.totalAmount}</td>
                                </tr>
                              </tfoot>


                            </table>

</div>
                     


                            <div className="text-end my-5">
                              <h3 className="h6">  SIGNATURE </h3>
                            </div>

                            <div className='col-lg-12 mt-5'>


                              <div className="card-body">
                                <div className="row">
                                  <div className="col-lg-6 ">
                                    <h3 className="h6">Payment Method</h3>
                                    <p>
                                      Method : {Order.mode}  {'  '}    <span className={`badge ${Order.payment === 1 ? 'bg-success' : 'bg-warning'} rounded-pill`}>{Order.payment === 1 ? 'PAID' : Order.payment === 0 ? 'UNPAID' : 'AWAITED'}</span>
                                    </p>
                                  </div>

                                  <div className="col-md-6 text-end d-none">
                                    <h3 className="h6">Order Status</h3>


                                    {
                                      Order.status === '0' ? (<> <span className="badge rounded-pill bg-danger">Cancel</span> </>) :
                                        Order.status === '1' ? (<> <span className="badge rounded-pill bg-warning">Placed</span> </>) :
                                          Order.status === '2' ? (<><span className="badge rounded-pill bg-info">Accepted</span> </>) :
                                            Order.status === '3' ? (<><span className="badge rounded-pill bg-info">Packed</span> </>) :
                                              Order.status === '4' ? (<> <span className="badge rounded-pill bg-info">Shipped</span> </>) :
                                                Order.status === '5' ? (<> <span className="badge rounded-pill bg-success">Delivered</span> </>) :
                                                  (<> <span className="badge rounded-pill bg-danger">Unknown</span> </>)
                                    }

                                  </div>
                                </div>
                              </div>
                            </div>



                          </div>


                        </div>
                        <br />

                      </div>


                      {['1', '2', '3'].includes(Order.status) && (
                        <>

                          <div className="d-flex mt-4">
                            <button data-bs-toggle="modal" data-bs-target="#cancel" className="btn btn-danger py-1">
                              <i className="bi bi-exclamation-circle me-2"></i>
                              <span className="text">Cancel</span>
                            </button>
                          </div>


                          <div
                            className="modal fade"
                            id="cancel"
                            tabIndex={-1}
                            aria-labelledby="exampleModalLabel"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title" id="exampleModalLabel">
                                    Cancellation Reason
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  />
                                </div>
                                <div className="modal-body">

                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      id="outOfStock"
                                      name="reason"
                                      value="Item out of stock"
                                      checked={formData.reason === 'Item out of stock'}
                                      onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="outOfStock">
                                      Item out of stock
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      id="changedMind"
                                      name="reason"
                                      value="Changed my mind"
                                      checked={formData.reason === 'Changed my mind'}
                                      onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="changedMind">
                                      Changed my mind
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      id="betterDealElsewhere"
                                      name="reason"
                                      value="Found a better deal elsewhere"
                                      checked={formData.reason === 'Found a better deal elsewhere'}
                                      onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="betterDealElsewhere">
                                      Found a better deal elsewhere
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      id="deliveryDelay"
                                      name="reason"
                                      value="Delivery delay"
                                      checked={formData.reason === 'Delivery delay'}
                                      onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="deliveryDelay">
                                      Delivery delay
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      id="productIssue"
                                      name="reason"
                                      value="Product issue"
                                      checked={formData.reason === 'Product issue'}
                                      onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="productIssue">
                                      Product issue
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      id="incorrectItem"
                                      name="reason"
                                      value="Received incorrect item"
                                      checked={formData.reason === 'Received incorrect item'}
                                      onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="incorrectItem">
                                      Received incorrect item
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      id="other1"
                                      name="reason"
                                      value="Other"
                                      checked={formData.reason === 'Other'}
                                      onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="other1">
                                      Other
                                    </label>
                                  </div>

                                  <div className="mb-3 mt-3">
                                    <label htmlFor="exampleFormControlTextarea1" className="form-label">
                                      Comment <span className='text-danger'> * </span>
                                    </label>
                                    <textarea
                                      className="form-control"
                                      id="comment"
                                      name="comment"
                                      rows={3}
                                      value={formData.comment}
                                      onChange={handleChange}
                                    />
                                  </div>




                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                  >
                                    Close
                                  </button>

                                  <button onClick={CancelStatusChange} type="button" className="btn btn-danger" disabled={formData.comment === '' && formData.reason === ''}>
                                    Cancel Order
                                  </button>

                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}






                    </>)}





                </div>
              </div>
            </div>
          </div>

        </div>
  

    </>
  )
}

export default AccountOrderView