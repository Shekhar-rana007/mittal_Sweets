import React, { useState, useEffect, useContext, Component,useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/store';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useBlogContext } from '../../fetchdata/BlogContext';
import axiosInstance from '../../axiosInstance';
import getCookie from '../components/extra/getCookie';
import setCookie from '../components/extra/setCookie';


const CryptoJS = window.CryptoJS;


const Checkout = ({ updateAuthStatus }) => {

  const sanitizeInput = (input) => {
    // Implement your sanitization logic here
    return input.replace(/[^\w\s]/gi, '');
  };

    // Assuming countdown state is managed using useState hook
    const [countdown, setCountdown] = useState(0);
  


  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  // Function to pad the plaintext
  function pkcs5_pad(text, blocksize) {
    var padding = blocksize - (text.length % blocksize);
    for (var i = 0; i < padding; i++) {
      text += String.fromCharCode(padding);
    }
    return text;
  }

  // Function to encrypt plaintext
  function encrypt(plainText, key) {
    // Convert key to MD5 and then to binary
    var secretKey = CryptoJS.enc.Hex.parse(CryptoJS.MD5(key).toString(CryptoJS.enc.Hex));
    // Initialize the initialization vector
    var initVector = CryptoJS.enc.Utf8.parse(Array(16).fill(0).map((_, i) => String.fromCharCode(i)).join(''));
    // Pad the plaintext
    var plainPad = pkcs5_pad(plainText, 16);
    // Encrypt using AES-128 in CBC mode
    var encryptedText = CryptoJS.AES.encrypt(plainPad, secretKey, { iv: initVector, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding });
    // Convert the ciphertext to hexadecimal
    return encryptedText.ciphertext.toString(CryptoJS.enc.Hex);
  }

  // Function to decrypt ciphertext
  function decrypt(encryptedText, key) {
    // Convert key to MD5 and then to binary
    var secretKey = CryptoJS.enc.Hex.parse(CryptoJS.MD5(key).toString(CryptoJS.enc.Hex));
    // Initialize the initialization vector
    var initVector = CryptoJS.enc.Utf8.parse(Array(16).fill(0).map((_, i) => String.fromCharCode(i)).join(''));
    // Convert the encryptedText from hexadecimal to binary
    var encryptedData = CryptoJS.enc.Hex.parse(encryptedText);
    // Decrypt using AES-128 in CBC mode
    var decryptedText = CryptoJS.AES.decrypt({ ciphertext: encryptedData }, secretKey, { iv: initVector, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding });
    // Remove PKCS#5 padding
    return decryptedText.toString(CryptoJS.enc.Utf8).replace(/[\x00-\x1F\x80-\xFF]+$/g, '');
  }





  const [loading, setLoading] = useState(false); // Add loading state
  const [data, setData] = useState([]);
  const [FinalAmount, setFinalAmount] = useState(0); // Add loading state
  const [getTax, setTax] = useState([]);
  const [getStateName, setStateName] = useState('');
  const [getPrimaryName, setPrimaryName] = useState(false);
  const [orderProcess, setOrderProcess] = useState(false);

  const [getStateId, setStateId] = useState(false);


  const [mode, setMode] = useState('');


  
  const [GetEmailOTP, setEmailOTP] = useState(null); // Add loading state
  const [EmailVerify, setEmailVerify] = useState(false); // Add loading state



  const [getUserData, setUserData] = useState({
    username: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
  });


  const [SubmitLoading, setSubmitLoading] = useState(true); // Add loading state
  const [GetOtpRes, setOtpRes] = useState([]); // Add loading state
  const [GetOtpTyp, setOtpTyp] = useState([]); // Add loading state
  const [hasPassword, setPassword] = useState(false); // Add loading state

  const [GetcartItems, setcartItems] = useState([]); // Add loading state

  const [LoginOTPinputs, SetLoginOTPinputs] = useState({
    phone: '',
    Gtoken: 'sddwdwdwdd',
    password: '',
  });


  //handle input change
// handle input change
const handleLoginFormChange = (e) => {
  const sanitizedValue = sanitizeInput(e.target.value);
  SetLoginOTPinputs((prevState) => ({
    ...prevState,
    [e.target.name]: sanitizedValue,
  }));
};


  const handleModeChange = (e) => {
    setMode(e.target.value);
  };



  const { cartItems, Headers, isHeader, removeItemFromCart, totalAmount, clearAllItemsInCart, updateItemQuantity, getTotalAmount, removePromoCode, getTotalItems, applyPromoCode, promoCodeInfo, mypromoCode } = useBlogContext();

 // console.log('cartItems', cartItems); // Log cartItems to console for debugging
  const mycartItems = cartItems;


  const [promoCode, setPromoCode] = useState(''); // State to hold the entered promo code

  const handleRemovePromoCode = () => {
    toast.success('Promo code removed')
    removePromoCode();
  };

  // Function to handle applying promo code
  const handleApplyPromoCode = () => {
    applyPromoCode(promoCode); // Call the applyPromoCode function with the entered promo code
  };


  
  const verifyOTPFinal = async () =>{
    setSubmitLoading(false); // Set loading to false after request completion
    
const MYOTPinputs = {OTP:combinedOTP, HASHOTP:GetOtpRes.otp}
    
    try {
      const response = await axiosInstance.post(`/login-verify-otp`, MYOTPinputs); // Await the axios post request
      console.log('responseresponse', response)
       const {success} = response.data
if(success){

  // if (String(GetOtpRes.otp) === String(combinedOTP)) { }

    if (GetOtpRes.password === false) {

      toast.success('Otp Verfied successfully!');
      // Save token and user ID to localStorage
   
   //   localStorage.setItem('token', GetOtpRes.token);
      setCookie('token', GetOtpRes.token, 7); // Expires in 7 days

   //  localStorage.setItem('userId', GetOtpRes.existingUser._id);
      setCookie('userId', GetOtpRes.existingUser._id, 7); // Expires in 7 days


      if (GetOtpRes) {
        const { _id, username, email } = GetOtpRes.existingUser;
        const userToStore = { _id, username, email };
     //   localStorage.setItem('user', JSON.stringify(userToStore));
        setCookie('user',  JSON.stringify(userToStore), 7); // Expires in 7 days

      }

      updateAuthStatus(true);
      // Dispatch login action if you're using Redux
      dispatch(authActions.login());
      setIsLogin(true); // Set isLogin to true when token is found
      // navigate('/');

    }

    else if (GetOtpRes.newUser === true) {
      console.log('GetOtpResGetOtpRes', GetOtpRes)
      try {
        const response = await axiosInstance.post(`/signup-new-user/`, inputs); // Await the axios post request

        if (response) {

          toast.success('Otp Verfied New successfully!');
          // Save token and user ID to localStorage
         
         // localStorage.setItem('token', response.data.token);
          setCookie('token', response.data.token, 7); // Expires in 7 days

          // localStorage.setItem('userId', response.data.existingUser._id);
          setCookie('userId', response.data.existingUser._id, 7); // Expires in 7 days


          if (GetOtpRes) {
            const { _id, username, email } = response.data.existingUser;
            const userToStore = { _id, username, email };
           // localStorage.setItem('user', JSON.stringify(userToStore));
            setCookie('user', JSON.stringify(userToStore), 7); // Expires in 7 days

          }

          updateAuthStatus(true);
          // Dispatch login action if you're using Redux
          dispatch(authActions.login());
          setIsLogin(true); // Set isLogin to true when token is found
          // navigate('/');


        }


      } catch (error) {
        console.error('Error On Signup:', error);
        toast.error(error.response.data.message);
      } finally {
        setSubmitLoading(true); // Set loading to false after request completion
      }


    } else {
    
      toast.success('Otp Verfied successfully!');
      // Save token and user ID to localStorage
     
     // localStorage.setItem('token', GetOtpRes.token);
      setCookie('token', GetOtpRes.token, 7); // Expires in 7 days

    //  localStorage.setItem('userId', GetOtpRes.existingUser._id);
      setCookie('userId', GetOtpRes.existingUser._id, 7); // Expires in 7 days

      if (GetOtpRes) {
        const { _id, username, email } = GetOtpRes.existingUser;
        const userToStore = { _id, username, email };
      //  localStorage.setItem('user', JSON.stringify(userToStore));
        setCookie('user', JSON.stringify(userToStore), 7); // Expires in 7 days
      }

      updateAuthStatus(true);
      // Dispatch login action if you're using Redux
      dispatch(authActions.login());
      setIsLogin(true); // Set isLogin to true when token is found
    //  navigate('/');
    }
setSubmitLoading(true); // Set loading to true before making the request


}
    } catch (error) {
      console.error('Error On OTP Verify:', error);
      toast.error(error.response.data.message);
    } finally {
      setSubmitLoading(true); // Set loading to false after request completion
    }

       
      
  }



  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if(EmailVerify){
      setCurrentStep(currentStep + 1);
    }else{
      toast.error('Need to verify email first ')
    }
  
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };




  const [LogincurrentStep, setLoginCurrentStep] = useState(1);

  const handleLoginNext = () => {
    setLoginCurrentStep(LogincurrentStep + 1);
  };

  const handleLoginPrevious = () => {
    setLoginCurrentStep(LogincurrentStep - 1);
  };

  useEffect(() => {
    setIsChecked(false);
  }, [currentStep,LogincurrentStep]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

 // const isLoginFromLocalStorage = localStorage.getItem('token') ? true : false;
 const isLoginFromLocalStorage = getCookie('token') ? true : false;
 
  const [isLogin, setIsLogin] = useState(isLoginFromLocalStorage);

  const [isLoginForm, setIsLoginForm] = useState(true); // State to manage which form to display
  const [shippingCharge, setshippingCharge] = useState(''); // State to manage which form to display


  const toggleForm = () => {
    setIsLoginForm(prevState => !prevState); // Toggle between login and signup forms
  };


  const [showModal, setShowModal] = useState(false);

  const [PaymentMethod, setPaymentMethod] = useState('');

  const handlePaymentMethodChange = (event) => {
    const { id, checked } = event.target;
    setPaymentMethod(prevState => {
      if (checked) {
        // Add checkbox id to the state string
        return prevState + id + ',';
      } else {
        // Remove checkbox id from the state string
        return prevState.replace(id + ',', '');
      }
    });

  };

  // Function to check if a checkbox is checked
  const isCheckPaymentMethodChecked = (id) => {
    return PaymentMethod.includes(id);
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const getTotalFinalAmount = (weight, shippingRatesStr) => {
  //  console.log(shippingRatesStr)
    if (shippingRatesStr.length !== 0) {
      // Parse the shipping rates string into an array of rate objects
      const shippingRates = shippingRatesStr.split(',').map(rateStr => {
        const [rangeStr, chargeStr] = rateStr.split(':');
        const [minWeightStr, maxWeightStr] = rangeStr.split('-');
        return {
          minWeight: parseFloat(minWeightStr),
          maxWeight: parseFloat(maxWeightStr),
          charge: parseFloat(chargeStr)
        };
      });

      // Find the shipping rate that matches the weight range
      const rate = shippingRates.find(rate => weight >= rate.minWeight && weight <= rate.maxWeight);

      // If a matching rate is found, return the corresponding charge
      if (rate) {
        setshippingCharge(rate.charge);
      //  console.log('shippingRates', rate.charge)
      } else {
        setshippingCharge(0);
        return 0; // Return a default charge or handle the case as needed
      }

    } else {
      setshippingCharge(0);
      return 0; // Return a default charge or handle the case as needed

    }

    // setFinalAmount(discountedAmount);
  };



  // const calculateShippingCharge = (weight, shippingRates) => {
  //   // Find the shipping rate that matches the weight range
  //   const rate = shippingRates.find(rate => weight >= rate.minWeight && weight <= rate.maxWeight);

  //   // If a matching rate is found, return the corresponding charge
  //   if (rate) {
  //     return rate.charge;
  //   } else {
  //     // If no matching rate is found, return a default charge or handle the case as needed
  //     return 0; // Return 0 or handle the case as needed
  //   }
  // };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/get-all-zones");
    //  console.log(response.data.Zones);
      setData(response.data.Zones);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData()

  }, []);
  useEffect(() => {
    const checkUserToken = async () => {
      console.log('Effect is running');
      // Check if this is printed multiple times
    //  const usertoken = localStorage.getItem('token');
      const usertoken = getCookie('token');

      if (usertoken) {
        console.log('Token found in local storage'); // Check if this is printed multiple times

        // toast.success("Welcome back");
      }
    }
    checkUserToken();
  }, [dispatch, navigate]);


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
    console.log('e.target.name',e.target.name)
    let sanitizedValue = e.target.value;
    if(e.target.name !== 'email'){
     sanitizedValue = sanitizeInput(e.target.value);
  }

    setLoginInputs((prevState) => ({
      ...prevState,
      [e.target.name]: sanitizedValue,
    }));

  };



  const submitOTP = async () => {
    setSubmitLoading(false); // Set loading to true before making the request

    try {
      const response = await axiosInstance.post(`/signup-login-otp/`, LoginOTPinputs); // Await the axios post request
     // console.log('responseresponse', response)
      if (response.data.password === true) {
        setPassword(true)
      } else {
        handleLoginNext();
        setOtpRes(response.data); // Set the response data to state
        // toast.success('Otp Send successfully!');
        // setTimeout(function () { toast.success(`Your OTP  is ${response.data.otp}`); }, 1000);
      }

    } catch (error) {
      console.error('Error On taxes:', error);
      toast.error(error.response.data.message);
    } finally {
      setSubmitLoading(true); // Set loading to false after request completion
    }
  };

   const [isRequesting, setIsRequesting] = useState(false);
const lastRequestTimeRef = useRef(null);

  const submitResOTP = async () => {
    if (isRequesting) {
      return;
    }
  
    setSubmitLoading(false);
    setIsRequesting(true);
    lastRequestTimeRef.current = Date.now();
  
    try {
      const response = await axiosInstance.post('/login-with-otp/', inputs);
      setOtpRes(response.data);
      toast.success('Otp Sent successfully!');
    } catch (error) {
      console.error('Error On taxes:', error);
      toast.error(error.response.data.message);
    } finally {
      setSubmitLoading(true);
      setIsRequesting(false);
    }
  };
  

  const handleRequestAgainClick = () => {
    const currentTime = Date.now();
    if (!isRequesting && (!lastRequestTimeRef.current || currentTime - lastRequestTimeRef.current >= 30000)) {
      submitResOTP();
      setCountdown(30); // Set countdown to 30 seconds
      // Start countdown timer
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(interval);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    } else {
      const timeLeft = Math.ceil((lastRequestTimeRef.current + 30000 - currentTime) / 1000);
      // Show alert to wait for remaining time
      toast.error(`Please wait for ${timeLeft} seconds before requesting again.`);
    }
  };

 

  

  const submitLoginOTP = async () => {
    setSubmitLoading(false); // Set loading to true before making the request

    try {
      const response = await axiosInstance.post('/login-with-otp/', LoginOTPinputs); // Await the axios post request
      setOtpRes(response.data); // Set the response data to state
      // toast.success('Otp Send successfully!');
      // setTimeout(function () { toast.success(`Your OTP  is ${response.data.otp}`); }, 1000);
    } catch (error) {
      console.error('Error On taxes:', error);
      toast.error(error.response.data.message);
    } finally {
      setSubmitLoading(true); // Set loading to false after request completion


    }
  };


  const submitLoginPass = async () => {
    setSubmitLoading(false); // Set loading to true before making the request

    try {
      const response = await axiosInstance.post(`/login-with-pass/`, LoginOTPinputs); // Await the axios post request
      setOtpRes(response.data); // Set the response data to state
     // console.log('dataotp', response.data);
      if (response.data.checkpass === true) {

        toast.success('Login successfully!');
        // Save token and user ID to localStorage
       
       // localStorage.setItem('token', response.data.token);
       setCookie('token', response.data.token , 7); // Expires in 7 days

      //  localStorage.setItem('userId', response.data.existingUser._id);
        setCookie('userId', response.data.existingUser._id, 7); // Expires in 7 days


        if (GetOtpRes) {
          const { _id, username, email } = response.data.existingUser;
          const userToStore = { _id, username, email };
         // localStorage.setItem('user', JSON.stringify(userToStore));
          setCookie('user', JSON.stringify(userToStore), 7); // Expires in 7 days

        }

        updateAuthStatus(true);
        // Dispatch login action if you're using Redux
        dispatch(authActions.login());
        setIsLogin(true); // Set isLogin to true when token is found
        // navigate('/');

      }
    } catch (error) {
      console.error('Error On taxes:', error);
      toast.error(error.response.data.message);
    } finally {
      setSubmitLoading(true); // Set loading to false after request completion

    }
  };

  // form handle

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post('/login', Logincredentials);
      const { success, token, user, message } = data;

      if (success) {
        // Save token and user ID to localStorage
      //  localStorage.setItem('token', user.token);
        setCookie('token', user.token , 7); // Expires in 7 days

      //  localStorage.setItem('userId', user._id);
        setCookie('userId', user._id, 7); // Expires in 7 days


        toast.success("login sucesssfully");
      //  console.log('user', user)

        if (user) {
          const { _id, username, email } = user;
          const userToStore = { _id, username, email };
        //  localStorage.setItem('user', JSON.stringify(userToStore));
          setCookie('user',JSON.stringify(userToStore), 7); // Expires in 7 days

        }

        // Dispatch login action if you're using Redux
        dispatch(authActions.login());
        setIsLogin(true); // Set isLogin to true when token is found

        // Redirect user or perform other actions upon successful login
      }
   //   console.log("Message from backend:", message);

    } catch (error) {
      console.error('Error during login:', error);
      // Handle network errors, API issues, etc.
      toast.error(error.response.data.message);

    }
  };

  // const userString = localStorage.getItem('user');
  const userString = getCookie('user');
  

  let initialUserData = {
    username: '',
    phone: '',
    pincode: '',
    state: '',
    address: ''
  };

  if (userString) {
    const { username, phone, pincode, country, address } = JSON.parse(userString);
    // Use user information from localStorage as initial data
    initialUserData = { username, phone, pincode, country, address };
  }



  // Set initial state using retrieved user information
  const [Orderinputs, setOrderInputs] = useState(initialUserData);

  const [Ordercart, setOrderCart] = useState({});

  const Ordercredentials = {
    phone: Orderinputs.phone,
    pincode: Orderinputs.pincode,
    country: Orderinputs.country,
    address: Orderinputs.address,
    items: cartItems,
    status: '1',
    mode: '',
    details: {
      username: Orderinputs.username,
      phone: Orderinputs.phone,
      pincode: Orderinputs.pincode,
      state: getStateName,
      address: Orderinputs.address,
      email: Orderinputs.email,
    },
    discount: '',
    shipping: '',
    totalAmount: '',
    primary: getPrimaryName,
    payment: 0,
  };



  const fetchtaxData = async (id) => {
    setLoading(true); // Set loading to false when data is fetched
    console.log('fetchtaxData')
    try {
      const { data } = await axiosInstance.get(`/get-tax/${id}`);
      console.log('tax data', data.tax)
      setTax(data.tax);
      let weight = await mycartItems.reduce((total, item) => total + item.quantity * item.weight, 0);
      getTotalFinalAmount(weight, data.tax?.rate ?? []);

      // setStateName(data.tax?.name ?? '')
      console.log('weight', weight)
    }
    catch (error) {
      console.log(error);
      toast.error("Error fetching Shipping!");

    } finally {
      setLoading(false); // Set loading to false when data is fetched

    }
  };


  //handle input change
  const handleOrderChange = (e) => {
    
    console.log('e.target.name',e.target.name)
    let sanitizedValue = e.target.value;
    if(e.target.name !== 'email'){
     sanitizedValue = sanitizeInput(e.target.value);
  }


    setOrderInputs((prevState) => ({
      ...prevState,
      [e.target.name]:sanitizedValue,
    }));

  };

  const [paymentForm, setPaymentForm] = useState('');


  //form handle
  const handleOrderSubmit = async (e) => {

    if (!mode && mode !== '') {

      toast.error('Please Choose Payment Method');
 
    }
    else {

      if (!Orderinputs.username || !Orderinputs.phone || !Orderinputs.email || !Orderinputs.pincode || !Orderinputs.address) {
        if (!Orderinputs.state) {
          toast.error('Please Select State');
        } else {
          toast.error('Please Fill All Details');
        }
        handlePrevious();
        console.log(Orderinputs.pincode, Orderinputs.country, Orderinputs.address)
      }
      else {

        if (!mode) {
          toast.error('Please Choose Payment Mode');

        }
      //  const userId = localStorage.getItem('userId');
        const userId = getCookie('userId');

        e.preventDefault();


        const shipping = shippingCharge ? shippingCharge : 0;

        let Total;
        let discount;
        if (promoCodeInfo && promoCodeInfo.type && promoCodeInfo.discount > 0) {
          Total = totalAmount + shippingCharge;
          discount = totalAmount - cartItems.reduce((total, item) => total + item.quantity * item.price, 0)

        } else {
          Total = shippingCharge + cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
          discount = 0;
        }

        const updatedFormData = {
          ...Ordercredentials,
          phone: Orderinputs.phone,
          pincode: Orderinputs.pincode,
          address: Orderinputs.address,
          username: Orderinputs.username,
          email: Orderinputs.email,
          mode: mode,
          userId: userId,
          totalAmount: Total,
          discount: discount,
          shipping: shipping,
          primary: getPrimaryName,
          payment: 1,
          state: Orderinputs.state,
          verified:1,
        };

        
        console.log('updatedFormData', updatedFormData)



        try {

          setOrderProcess(true);

               
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Check if the email in formData is valid
      if (!emailRegex.test(Orderinputs.email)) {
        // Invalid email format
        // Handle this case accordingly, such as displaying an error message
        toast.error('Invalid email format');
        return; // Stop further execution
      }

          const response = await axiosInstance.post(`/create-order/${userId}`, updatedFormData);

          console.log('order.data', response.data);
          const { success, user, message, apiKey, Amount } = response.data;

          if (response && response.data && mode !== "COD") {
            removePromoCode();
            clearAllItemsInCart(); // Call the function to clear all items in the cart

      
            // Example usage
            var plainText = `tid=${response.data.tid}&merchant_id=${response.data.merchant_id}&order_id=${response.data.order_id}&amount=${Total}&currency=INR&redirect_url=${response.data.redirect_url}&cancel_url=${response.data.cancel_url}`;
            var key = response.data.WORKING_KEY;
            // Encrypt the plaintext
            var encryptedData = encrypt(plainText, key);
          

            // Create a form element
            const form = document.createElement('form');
            form.method = 'post';
            form.action = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encryptedData}&access_code=${response.data.accessCode}`;

            // Create hidden input fields and append them to the form
            const createAndAppendInput = (name, value) => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = name;
              input.value = value;
              form.appendChild(input);
            };

            createAndAppendInput('encRequest', encryptedData);
            // createAndAppendInput('access_code', 'DE826EF968F10B0DD1DCC540211008CB');

            // Append the form to the document body and submit it
            document.body.appendChild(form);
            form.submit();

          } else if (response.data.success === true && mode === "COD") {
            clearAllItemsInCart(); // Call the function to clear all items in the cart
            removePromoCode();
            navigate('/complete-order');

          }

        } catch (error) {
          console.error('Error during login:', error);
          // Handle network errors, API issues, etc.
          toast.error(error.response.data.message);

        } finally {
          setOrderProcess(false);
        }



      }

    }

  };




  const credentials = {
    username: inputs.username,
    email: inputs.email,
    password: inputs.password
  };
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state


  //handle input change
  const handleSignupChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  };

  //form handle
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post('/signup', credentials);
      const { success, token, user, message } = data;

      if (success) {
        // Save token and user ID to localStorage
      
      //  localStorage.setItem('token', user.token);
        setCookie('token', user.token , 7); // Expires in 7 days

      //  localStorage.setItem('userId', user._id);
        setCookie('userId', user._id , 7); // Expires in 7 days

        toast.success("login sucesssfully");

        // Dispatch login action if you're using Redux
        dispatch(authActions.login());
        setIsLogin(true); // Set isLogin to true when token is found

        // Redirect user or perform other actions upon successful login
      }
      console.log("Message from backend:", message);

    } catch (error) {
      console.error('Error during login:', error);
      // Handle network errors, API issues, etc.
      toast.error(error.response.data.message);

    }
  };

    //form handle
    const verifyemail = async () => {
      toast.success("OTP Send to your email address");
      try {
        const { data, success } = await axiosInstance.post('/email-verify', Orderinputs);
        if (data) {
          setEmailOTP(data.OTP);
        }
      } catch (error) {
        console.error('Error during verifyemail:', error);
        toast.error("Error while Sending OTP");
      }
    };


    const CheckEmail = async () => {
      if(GetEmailOTP === null){
        toast.error("OTP Not Verifed");
      }
      else if (Orderinputs.EmailOTP.toString() === GetEmailOTP.toString()  ) {

      toast.success("OTP Verifed");
      setEmailVerify(true);

    } else{
      toast.error("OTP Not Verifed");

    }

    }


  const [combinedOTP, setcombinedOTP] = useState(""); // Add loading state



  const otpInputs = [];

  // Function to handle input change
  // Function to handle input change
  const handleInputChange = async (index, event) => {
    const input = event.target;
    const maxLength = parseInt(input.getAttribute('maxlength'));
    const currentLength = input.value.length;

    // Move focus to the previous input field if backspace is pressed on an empty input
    if (event.nativeEvent.inputType === 'deleteContentBackward' && currentLength === 0 && index > 0) {
      otpInputs[index - 1].focus();
    }

    // Move focus to the next input field if the current input is filled
    else if (currentLength === maxLength && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }

    // Check if all OTP fields are filled and if the last input field is the one being typed
    const allFilled = otpInputs.every(input => input.value.trim() !== ''); // Check if all inputs have non-empty values
    if (allFilled && index === otpInputs.length - 1) { // Check if the last OTP field is filled
      const combinedValue = otpInputs.map(input => input.value.trim()).join(''); // Combine all values into a single string
      setcombinedOTP(combinedValue);


    }
  };



  useEffect(() => {
    setIsLogin(isLoginFromLocalStorage);
  }, [isLoginFromLocalStorage, dispatch]);


  useEffect(() => {


    if (isLogin === true) {



      //form handle
      const fetchUserById = async () => {

      //  const token = localStorage.getItem('token');
        const token = getCookie('token')  ;

      //  const id = localStorage.getItem('userId');
        const id = getCookie('userId') ;

        const credentials = {
          token: token,
          id: id,
        };

        try {
          const { data } = await axiosInstance.post('/auth-user', credentials);
          const { success, token, existingUser, message } = data;

          if (success) {



            setOrderInputs((prevData) => ({
              ...prevData,
              username: existingUser.username || '',
              phone: existingUser.phone || '',
              email: existingUser.email || '',
              address: existingUser.address || '',
              pincode: existingUser.pincode || '',
              state: existingUser.state || '',
              
            }));

            if(existingUser && existingUser.verified === 1){
              setEmailVerify(true)
            }
            setStateId(existingUser.state);
         //   console.log("Message from backend:", existingUser);
          }


        } catch (error) {
          console.error('Error during login:', error);
          // Handle network errors, API issues, etc.
          toast.error(error.response.data.message);

        }
      };
      fetchUserById();
    }

  }, [isLogin]);

  useEffect(() => {
    if (getStateId !== false) {
      fetchtaxData(getStateId);
      const status = data.find(data => data._id === getStateId)?.primary;
      const Sname = data.find(data => data._id === getStateId)?.name;

      if (status === 'true' || status === 'false') {
        setPrimaryName(status);
        setStateName(Sname);
      }

    }

  }, [getStateId]);




  return (


    <>
      <Header />

      <Helmet>
        <title> Checkout | {window.location.hostname}</title>
      </Helmet>



      <div className="whitesmoke">


        <div
          className="py-4"

        >
          <div className="container d-lg-flex justify-content-between align-items-center py-2 py-lg-4">
            <div className="pe-lg-4 text-center text-lg-start">
              <h1 className="h3 mb-0">Checkout billing</h1>
            </div>
            <div className="pt-2 pt-lg-0">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb flex-lg-nowrap justify-content-center justify-content-lg-start">
                  <li className="breadcrumb-item">
                    <a className="text-nowrap" href="index.html" previewlistener="true">
                      <i className="ri-store-2-line" /> Home{" "}
                    </a>
                  </li>
                  <li className="breadcrumb-item text-nowrap">
                    <a href="blog-list.html" previewlistener="true">
                      Shop
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item text-nowrap active "
                    aria-current="page"
                  >
                    Checkout billing
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>



        <div className="container pb-4 pb-lg-10 mt-3">
          <div className="row g-4 g-lg-10" style={{ position: "relative" }} >

            {loading === 0 && (
              <>
                <div
                  className=""
                  style={{
                    width: "100%",
                    borderRadius: 5,
                    margin: 0,
                    height: "100%",
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9,
                    background: 'white',
                    left: 0,
                    top: 0,
                    color: "white",
                    fontSize: "20em"
                  }}
                >
                  <div class="loading_icon"></div>
                </div>

              </>)}

            {orderProcess && (<>
              <div
                className="orderpanel"
                style={{
                  width: "100%",
                  borderRadius: 5,
                  margin: 0,
                  height: "100%",
                  position: "fixed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                  background: "#ffffffa1",
                  left: 0,
                  top: 0,
                  color: "white",

                }}
              >
                <div className="page">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <div className="loader-outer">
                        <div className="loader" />
                      </div>
                      <h2>PROCESSING YOUR ORDER</h2>
                    </div>
                    <div className="panel-body">
                      <p>
                        Hold tight, your order is being processed, please do not navigate away
                        from the current window or refresh the page.
                      </p>
                    </div>
                  </div>
                </div>
              </div>


            </>)}
            <div className="page">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <div className="loader-outer">
                    <div className="loader" />
                  </div>
                  <h2>PROCESSING YOUR ORDER</h2>
                </div>
                <div className="panel-body">
                  <p>
                    Hold tight, your order is being processed, please do not navigate away
                    from the current window or refresh the page.
                  </p>
                </div>
              </div>
            </div>


            <div className="col-lg-8">
              {/* Steps */}
              <div className="steps steps-dark border rounded-2 p-4 p-sm-5 mb-4 bg-white">
                {/* Step */}
                <a className="step-item active" href="#">
                  <div className="step-progress">
                    <div className="step-icon">
                      <i className="ri-shopping-cart-2-line" />
                    </div>
                  </div>
                  <div className="step-label"> Cart </div>
                </a>
                {/* Step */}
                {/* Step */}
                <a className="step-item active current" href="#">
                  <div className="step-progress">
                    <div className="step-icon">
                      <i className="ri-user-4-line" />
                    </div>
                  </div>
                  <div className="step-label"> Checkout </div>
                </a>
                {/* Step */}

                {/* Step */}
                {/* Step */}
                <a className="step-item" href="#">
                  <div className="step-progress">
                    <div className="step-icon">
                      <i className="ri-bank-card-line" />
                    </div>
                  </div>
                  <div className="step-label"> Payment </div>
                </a>
                {/* Step */}

              </div>

              {currentStep === 1 && (
                <>

                  {/* Steps */}
                  <div className="border rounded-3 p-4 bg-white">
                    {/* Alert */}
                    <div
                      className="alert alert-success alert-dismissible fade show d-none"
                      role="alert"
                    >


                      <a className="fw-medium" href="#" data-toggle="modal" data-target="#LoginModel" >
                        Login
                      </a>{" "}
                      or{" "}
                      <a className="fw-medium" href="#" data-toggle="modal" data-target="#RegisterModel" >
                        Register
                      </a>{" "}
                      for faster payment.{" "}
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                      />
                    </div>
                    {/* Alert */}



                    {!isLogin && (<>

                      {isLoginForm ? (
                        <>


                          <div className="col-12 col-lg-6 m-auto rounded-3 p-5 bg-white" style={{ maxWidth: 450, minHeight: 400 }}>

                            {LogincurrentStep === 1 && (
                              <>
                                {!hasPassword ? (<>
                                  <h4 className="border-bottom pb-4 mb-4 text-center">Login <span className=""> or</span> Signup</h4>
                                  <div className="needs-validation" noValidate="">
                                    <div className="row g-4">

                                      <div className="col-12">
                                        <div className="col-auto">

                                          <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                              <div className="input-group-text btn-accent" style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} >+91</div>
                                            </div>
                                            <input
                                              type="number"
                                              className="form-control"
                                              id="phone"
                                              name="phone"
                                              placeholder="Mobile Number*"
                                              value={LoginOTPinputs.phone}
                                              maxlength={10}
                                              onChange={(e) => {
                                               if (e.target.value.length <= 10) { // Check input length before updating
                                                handleLoginFormChange(e); // Call handleChange if length is within limit
                                               }
                                           }}
                                           onInput={(e) => {
                                               const inputValue = e.target.value;
                                               if (inputValue.length <= 10) {
                                                   setInputs({ ...inputs, phone: inputValue });
                                               }
                                           }}

                                            />
                                          </div>
                                        </div>

                                      </div>
                                      <div className="col-12 ">
                                      <div className="form-check mb-2">
  <input
    className="form-check-input"
    type="checkbox"
   value={isChecked}
          id="flexCheckDefault"
          onChange={handleCheckboxChange}
  />
  <label className="form-check-label" htmlFor="flexCheckDefault">
    I agree 
  </label> <span> to the <Link to="/page/65f84522dabc2fa9d8b6d96d" > Terms of Use</Link> &amp;<Link to="/page/663476f4313dc333e67eceed" > Privacy Policy  </Link> </span>
</div>

                                        {SubmitLoading ? (

                                          <button disabled={!isChecked ||  LoginOTPinputs.phone.length !== 10}
                                            className="btn btn-accent d-flex align-items-center justify-content-center w-100" onClick={() => {

                                              submitOTP();
                                            }}
                                            type="button">
                                            Continue
                                          </button>

                                        ) : (

                                          <button className="btn btn-accent d-flex align-items-center justify-content-center w-100" type="button" disabled>
                                            <span class="ms-1">Loading...</span>
                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                          </button>

                                        )}


                                      </div>
                                    </div>
                                  </div>
                                </>) : (<>
                                  <h4 className="border-bottom pb-4 mb-4 text-center">OTP <span className=""> or</span> Password</h4>

                                  <div className="col-8 m-auto mt-10">
                                    <button className="btn btn-accent btn-shadow d-block w-100 mt-10" type="button" onClick={() => {
                                      handleLoginNext()
                                      submitLoginOTP();
                                    }}
                                    >Login With OTP</button>
                                    <hr class="or" />
                                    <button className="btn btn-accent btn-shadow d-block w-100" type="button" onClick={() => setLoginCurrentStep(3)} >Login With Password</button>

                                  </div>
                                </>)}


                              </>)}

                            {LogincurrentStep === 2 && (
                              <>

                                <div className="card-body p-5 text-center">
                                  {!hasPassword ? (<>
                                    <h4>Verify with OTP</h4>
                                    <p>Send to  {LoginOTPinputs.phone}  <a onClick={handleLoginPrevious} previewlistener="true" href="#" >Edit  </a>   </p>

                                    <div className="d-flex gap-3 col-md-7 col-9 m-auto mb-4">
                                      {[...Array(4)].map((_, index) => (
                                        <div key={index} className="col">
                                          <input
                                            type="number"
                                            name="otp"
                                            className="form-control text-center"
                                            placeholder=""
                                            maxLength={1} // Set the maximum length to 1 character
                                          //  onInput={(event) => handleInputChange(index, event)} // Handle input change
                                          onInput={(event) => {
                                            const value = event.target.value;
                                            if (value.length > 1){
              
                                            }else{
                                              handleInputChange(index, event)
                                            }
                                        
                                          }} // Handle input change
                                            ref={(input) => otpInputs.push(input)} // Add a reference to the input field
                                          />
                                        </div>
                                      ))}
                                    </div>

                                    {countdown > 0 && ( 
<p>Resend OTP in <span className='text-success'>00.{countdown} </span></p> )}

                    {SubmitLoading ? (

<button  
  className="btn btn-accent d-flex align-items-center justify-content-center w-100" onClick={() => {

    verifyOTPFinal();
  }}
  type="button">
  Verify OTP
</button>

) : (

<button className="btn btn-accent d-flex align-items-center justify-content-center w-100" type="button" disabled>
  <span class="ms-1">Loading...</span>
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
</button>

)}

                                    <p className="resend text-muted mb-0">
                                      Didn't receive code?{" "}
                                      <a href="#" onClick={handleRequestAgainClick } >
                                        Request again
                                      </a>
                                    </p>
                                    {/* <hr></hr>
<p className="resend text-muted mb-0">
Login Using{" "}
<a href="" previewlistener="true">
Password
</a>
</p> */}
                                  </>
                                  ) : (<>

                                    <h4>Verify with OTP</h4>
                                    <p>Send to    <a onClick={handleLoginPrevious} previewlistener="true" href="#" >Edit  </a>   {inputs.phone}</p>

                                    <div className="d-flex gap-3 col-md-7 col-9 m-auto mb-4">
                                      {[...Array(4)].map((_, index) => (
                                        <div key={index} className="col">
                                          <input
                                            type="tel"
                                            name="tel"
                                            className="form-control text-center"
                                            placeholder=""
                                            maxLength={1} // Set the maximum length to 1 character
                                           // onInput={(event) => handleInputChange(index, event)} // Handle input change
                                           onInput={(event) => {
                                            const value = event.target.value;
                                            if (value.length > 1){
              
                                            }else{
                                              handleInputChange(index, event)
                                            }
                                        
                                          }} // Handle input change
                                            ref={(input) => otpInputs.push(input)} // Add a reference to the input field
                                          />
                                        </div>
                                      ))}
                                    </div>


                                    {countdown > 0 && ( 
<p>Resend OTP in <span className='text-success'>00.{countdown} </span></p> )}

                                    {SubmitLoading ? (

<button  
  className="btn btn-accent d-flex align-items-center justify-content-center w-100" onClick={() => {

    verifyOTPFinal();
  }}
  type="button">
  Verify OTP
</button>

) : (

<button className="btn btn-accent d-flex align-items-center justify-content-center w-100" type="button" disabled>
  <span class="ms-1">Loading...</span>
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
</button>

)}


                                    <p className="resend text-muted mb-0">
                                      Didn't receive code?{" "}
                                      <a href="#" onClick={handleRequestAgainClick} >
                                        Request again
                                      </a>
                                    </p>

                                  </>)}

                                </div>

                              </>
                            )}
                            {LogincurrentStep === 3 && (
                              <>

                                <h4 className="border-bottom pb-4 mb-4 text-center">Login With Password</h4>
                                <p className="mb-2"> Please enter password that is linked to <br /> <b> {LoginOTPinputs.phone}  </b>  <a previewlistener="true" href="#" onClick={() => { setPassword(false); setLoginCurrentStep(1) }} >Edit  </a> </p>


                                <div className="needs-validation" noValidate="">
                                  <div className="row g-4">

                                    <div className="col-12">
                                      <div className="col-auto">

                                        <div className="input-group mb-2">

                                          <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            placeholder="Enter Password*"
                                            value={LoginOTPinputs.password}
                                            onChange={handleLoginFormChange} // Add onChange handler to manage input changes

                                          />
                                        </div>
                                      </div>

                                    </div>
                                  </div>
                                </div>

                                {SubmitLoading ? (

                                  <button disabled={LoginOTPinputs.phone.length !== 10}
                                    className="btn btn-accent d-flex align-items-center justify-content-center w-100" onClick={() => {

                                      submitLoginPass();
                                    }}
                                    type="button">
                                    Continue
                                  </button>

                                ) : (

                                  <button className="btn btn-accent d-flex align-items-center justify-content-center w-100" type="button" disabled>
                                    <span class="ms-1">Loading...</span>
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                  </button>

                                )}

                              </>

                            )}

                          </div>





                          <input className="form-control d-none" name="email" type="email" id="email"
                            value={Logininputs.email}
                            onChange={handleLoginChange} />


                        </>
                      ) : (
                        <>
                          <h4 className=" py-2" > Signup  </h4>

                          <div className="row">
                            <div className="col-sm-6">
                              <div className="mb-4">
                                <label className="form-label" htmlFor="username">
                                  Full Name
                                </label>
                                <input className="form-control" name="username" id="username" type="text" value={inputs.username}
                                  onChange={handleSignupChange} />
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="mb-4">
                                <label className="form-label" htmlFor="email">
                                  Email ID
                                </label>
                                <input className="form-control" name="email" type="email" id="email" value={inputs.email}
                                  onChange={handleSignupChange} />
                              </div>
                            </div>

                            <div className="col-sm-12">
                              <div className="mb-4">
                                <label className="form-label" htmlFor="billing-ln">
                                  Password
                                </label>
                                <input className="form-control" type="password" name="password" value={inputs.password} onChange={handleSignupChange} />
                              </div>
                            </div>

                          </div>

                          <div className='text-center mb-4'>
                            <button className="btn btn-accent btn-shadow " type="button" onClick={handleSignupSubmit} >

                              Signup Account
                            </button>
                          </div>

                          <div className="row mb-4 px-3">
                            <div className="row col-md-6">
                              <label classNames="form-check-label" for="form1Example3">Already have a account</label></div>
                            <div className="col-md-6 justify-content-end d-flex gap-2">
                              <button type="button" onClick={toggleForm} className="btn btn-primary btn-sm">
                                Login
                              </button>
                              <Link to="/forgot" class="btn btn-danger btn-sm">forgot password ?</Link>

                            </div>

                          </div>


                        </>

                      )}


                    </>)}




                    {isLogin ? (<>

                      <h4 className='CapiTaliZed '>Welcome Back {Orderinputs?.username}</h4>

                      {Orderinputs.phone ? (
                        <>
                          <div className="row">


                            <div className="col-md-12">
                              <div className="mb-4">
                                <label className="form-label" htmlFor="username">
                                  Full Name
                                </label>
                                <input className="form-control" type="text" id="username"
                                  name="username"
                                  value={Orderinputs.username}
                                  onChange={handleOrderChange} />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="mb-4">
                                <label className="form-label" htmlFor="phone">
                                  Phone No.
                                </label>
                                <input className="form-control bg-light" type="number" id="phone" readOnly
                                  name="phone"
                                  value={Orderinputs.phone}
                                    />
                              </div>
                            </div>


                            <div className="col-md-6">
                              <div className="mb-4">
                                <label className="form-label" htmlFor="Email">
                                  Email 
                                </label>
                                <div className="input-group">

                                <input className="form-control" type="email" id="Email" name="email"
                                  value={Orderinputs.email}
                                  onChange={handleOrderChange} />
                                  {!EmailVerify && (   <button className="btn btn-danger" onClick={verifyemail} type="button"  >
                                    <svg
  xmlns="http://www.w3.org/2000/svg"
  width={20}
  height={20}
  viewBox="0 0 24 24"
  fill="none"
  stroke="#ffffff"
  strokeWidth="1.5"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <circle cx={12} cy={12} r={10} />
  <line x1={12} y1={8} x2={12} y2={12} />
  <line x1={12} y1={16} x2="12.01" y2={16} />
</svg>
{' '} Verify
</button> )}

                              </div>
                            
                              </div>
                {!EmailVerify  && GetEmailOTP && (
                  <>
                  <div className='bg-light p-2 mb-2 rounded'>
<label> OTP Send to your email address </label>

<div className="input-group my-3">
  <input
    type="number"
    className="form-control form-control-sm "
    placeholder="Enter OTP"
    name='EmailOTP'
    value={Orderinputs.EmailOTP}
    onChange={handleOrderChange}
    onKeyPress={(e) => { if (e.target.value.length === 4) e.preventDefault(); }}

  />
  <button
    className="btn btn-success btn-sm"
    type="button"
onClick={CheckEmail}
  >
    Submit
  </button>
</div>


</div>
                  </>
                )}              

                           

                            </div>


                            <div className="col-md-6">
                              <div className="mb-4">
                                <label className="form-label" htmlFor="pincode">
                                  Pincode
                                </label>
                                <input className="form-control" type="number" id="pincode" name="pincode"
                                  value={Orderinputs.pincode}
                                  onChange={handleOrderChange} />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="mb-4">
                                <label className="form-label" htmlFor="state">
                                  State
                              {/* {getStateName} */}
                                </label>
                                <select class="form-select" id="state" name="state" value={Orderinputs.state} onChange={(e) => { handleOrderChange(e); fetchtaxData(e.target.value); setStateName(e.target.options[e.target.selectedIndex].getAttribute('name')); setPrimaryName(e.target.options[e.target.selectedIndex].getAttribute('primary')) }}  >
                                  <option selected > {loading ? "Loading..." : "Select State"}</option>
                                  {data.map(item => (
                                    <option key={item.id} value={item._id} name={item.name} primary={item.primary} >{item.name}</option>
                                  ))};



                                </select>


                              </div>
                            </div>


                          </div>


                          <div className="col-12">
                            <label className="form-label" htmlFor="address">
                              Shipping Address
                            </label>
                            <textarea class="form-control" id="address" rows="3"
                              name="address"
                              value={Orderinputs.address}
                              onChange={handleOrderChange}
                            ></textarea>

                          </div>
                        </>
                      ) : (<>

                        <div id="wrapper">

                          <div class="profile-main-loader">
                            <div class="loader">
                              <svg class="circular-loader" viewBox="25 25 50 50" >
                                <circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#70c542" stroke-width="2" />
                              </svg>
                            </div>
                          </div>

                        </div>



                      </>)}


                    </>
                    ) : (<>

                      {/* 
                      <h6 className="pb-4 mb-4 border-bottom">Shipping address</h6>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="mb-4">
                            <label className="form-label" htmlFor="billing-fn">
                              First Name
                            </label>
                            <input className="form-control" type="text" id="billing-fn" />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="mb-4">
                            <label className="form-label" htmlFor="billing-ln">
                              Last Name
                            </label>
                            <input className="form-control" type="text" id="billing-ln" />
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label" htmlFor="billing-company">
                          Company Name
                        </label>
                        <input className="form-control" type="text" id="billing-company" />
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="mb-4">
                            <label className="form-label" htmlFor="billing-email">
                              Email
                            </label>
                            <input className="form-control" type="email" id="billing-email" />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="mb-4">
                            <label className="form-label" htmlFor="billing-phone">
                              Phone Number
                            </label>
                            <input className="form-control" type="text" id="billing-phone" />
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label" htmlFor="billing-country">
                          Country
                        </label>
                        <select className="form-select" id="billing-country">
                          <option value="">Choose country</option>
                          <option value="Australia">Australia</option>
                          <option value="Canada">Canada</option>
                          <option value="Finland">France</option>
                          <option value="Mexico">Mexico</option>
                          <option value="Switzerland">Switzerland</option>
                          <option value="United States">United States</option>
                        </select>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="mb-4">
                            <label className="form-label" htmlFor="billing-state">
                              State
                            </label>
                            <select className="form-select" id="billing-state">
                              <option value="">Choose state</option>
                              <option value="Australia">Australia</option>
                              <option value="Canada">Canada</option>
                              <option value="Finland">France</option>
                              <option value="Mexico">Mexico</option>
                              <option value="Switzerland">Switzerland</option>
                              <option value="United States">United States</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="mb-4">
                            <label className="form-label" htmlFor="billing-zip">
                              Zip / Postal Code
                            </label>
                            <input className="form-control" type="text" id="billing-zip" />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="form-label" htmlFor="billing-address-1">
                            Address 1
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="billing-address-1"
                          />
                        </div>
                        <div className="mb-8">
                          <label className="form-label" htmlFor="billing-address-2">
                            Address 2
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="billing-address-2"
                          />
                        </div>
                      </div>
                       */}


                    </>)}







                  </div>

                </>

              )}

              {currentStep === 2 && (


                !isHeader ? (<>

                  {Headers.cash === 'true' && (
                    <div className="accordion mb-4" id="payment-method">

                      <div className="accordion-item ">
                        <h3 className="accordion-header">

                          <div className="form-check accordion-button collapsed"

                          >

                            <input className="form-check-input fs-lg me-2 ms-0 align-right"
                              value="COD"
                              onChange={handleModeChange}
                              name="mode" type="radio" id="COD"
                              checked={mode === "COD"}
                            />
                            <label
                              className="form-check-label widget-filter-item-label w-100"
                              htmlFor="COD"
                            >
                              Cash On Delivery (COD)
                            </label>

                          </div>

                        </h3>


                      </div>
                    </div>
                  )}
                  {Headers.razorpay === 'true' && (

                    <div className="accordion mb-4" id="payment-method">

                      <div className="accordion-item ">
                        <h3 className="accordion-header">

                          <div className="form-check accordion-button collapsed"
                          >

                            <input className="form-check-input fs-lg me-2 ms-0 align-right"
                              value="CCAvenue"
                              onChange={handleModeChange}
                              name="mode" type="radio" id="CCAvenue"
                              checked={mode === "CCAvenue"}
                            />
                            <label
                              className="form-check-label widget-filter-item-label w-100"
                              htmlFor="CCAvenue"
                            >
                              CCAvenue
                            </label>

                          </div>

                        </h3>


                      </div>


                    </div>
                  )}


                </>) : (<> Payment Method Loading... </>)




              )}

              <div className=" d-flex align-items-center justify-content-between mt-8">




                {currentStep === 1 && (
                  <>


                    <button className="btn btn-primary" onClick={handleNext}  >
                      Proceed to Payment</button>
                  </>

                )}

                {currentStep === 2 && (
                  <>
                    <button className="btn btn-secondary" onClick={handlePrevious}>
                      Back
                    </button>

                    <button type="button" className="btn btn-primary" onClick={handleOrderSubmit}    >
                      Place Order
                    </button>


                  </>
                )}



              </div>
            </div>




            <div className="col-lg-4">
              <div
                className="card border"

              >
                <div className="card-body">
                  {/* Product */}


                  {cartItems.map((item) => (


                    <>
                      <div className="mb-4">
                        <div className="d-flex align-items-center pb-2 border-bottom">
                          <Link className="d-block flex-shrink-0" to={`/product/${item.id}`}>
                            <img src={item.image} width={60}
                              alt="Product" />
                          </Link>
                          <div className="ps-2">
                            <h6 className="fs-md mb-1">
                              <Link to={`/product/${item.id}`} className="link-hover-primary">
                                {item.title} - {item.color}
                              </Link>
                            </h6>
                            <div className="fs-sm">
                              <span className="text-accent me-2">₹{item.price}</span>
                              <span className="text-body-secondary">Quantity: </span>
                              <span className="text-body-secondary">{item.quantity}</span>
                            </div>

                            <div className="fs-sm">

                              <span className="text-body-secondary">Total Price: </span>
                              <span className="text-body-secondary">₹{item.quantity * item.price}</span>
                            </div>



                          </div>
                        </div>
                      </div>
                      {/* Product */}



                    </>
                  ))}



                  {cartItems && cartItems.length > 0 ? (
                    <>

                      {promoCodeInfo && promoCodeInfo.type && promoCodeInfo.discount > 0 ? (<>
                        <div className="d-flex align-items-center justify-content-between">
                          <p>Sub Total </p>
                          <p>₹{cartItems.reduce((total, item) => total + item.quantity * item.price, 0)}</p>
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                          <p >Discount </p>
                          <p>{totalAmount - cartItems.reduce((total, item) => total + item.quantity * item.price, 0) < 0
                            ? `- ₹${Math.abs(totalAmount - cartItems.reduce((total, item) => total + item.quantity * item.price, 0))}`
                            : `₹${totalAmount - cartItems.reduce((total, item) => total + item.quantity * item.price, 0)}`
                          }</p>

                        </div>


                        <div className="d-flex align-items-center justify-content-between">
                          <p >Shipping {cartItems.reduce((total, item) => total + item.quantity * item.weight, 0)}</p>
                          <p>+ ₹  {shippingCharge ? shippingCharge : 0}</p>

                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                          <h5> Total </h5>
                          <h5>₹ {totalAmount + shippingCharge}
                            {/* {String(FinalAmount) === '0' ? cartItems.reduce((total, item) => total + item.quantity * item.price, 0) - FinalAmount} */}
                          </h5>
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


                        {/* Subtotal */}
                        <ul className="list-unstyled fs-sm border-bottom pb-4 mb-4">
                          <li className="d-flex align-items-center justify-content-between mb-1">
                            <span className="me-2">Subtotal:</span>
                            <span className="text-end">₹{cartItems.reduce((total, item) => total + item.quantity * item.price, 0)}</span>
                          </li>

                          <li className="d-flex align-items-center justify-content-between">
                            <span className="me-2">Shipping:</span>
                            <span className="text-end"> + ₹ {shippingCharge ? shippingCharge : 0}</span>
                          </li>
                        </ul>

                        <div className="d-flex align-items-center justify-content-between">


                          <h5> Total </h5>
                          <h5>  {cartItems.length > 0 && (
                            <>  ₹{shippingCharge + cartItems.reduce((total, item) => total + item.quantity * item.price, 0)}
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







      <div className="container row mt-5 d-none">
        <div className="payment_details col-md-8">
          <h1>Payment Information</h1>

          <div className="details_card">


            {!isLogin && (<>

              {isLoginForm ? (
                <>
                  <h4 className="px-3 py-2" > Login  </h4>

                  <div className="name_address">
                    <div className="first_lastName">
                      <input type="email" placeholder="Email Id"
                        name="email"
                        value={Logininputs.email}
                        onChange={handleLoginChange}
                      />
                      <input type="password" placeholder="Password"
                        name="password"
                        value={Logininputs.password}
                        onChange={handleLoginChange} />
                    </div>

                  </div>

                  <div className="row mb-4 px-3">
                    <div className="row col-md-6">
                      <label classNames="form-check-label" for="form1Example3">Did'nt have a account</label></div>
                    <div className="col-md-6 justify-content-end d-flex gap-2">
                      <button type="button" onClick={toggleForm} className="btn btn-primary btn-sm">
                        Signup
                      </button>
                      <Link to="/forgot" class="btn btn-danger btn-sm">forgot password ?</Link>

                    </div>

                  </div>

                  <div className="proced_payment">
                    <button
                      type="submit"
                      className="btnsub  form-control  mt-3"
                      style={{ width: 200, marginTop: "30px !important", margin: 'auto' }}
                      onClick={'handleLoginSubmit'}
                    >
                      Login
                    </button>


                  </div>

                </>
              ) : (
                <>
                  <h4 className="px-3 py-2" > Signup  </h4>

                  <div className="name_address">
                    <div className="first_lastName">
                      <input type="text" placeholder="Full Name"
                        name="username"
                        value={inputs.username}
                        onChange={handleSignupChange} />

                      <input type="email" placeholder="Email Id"
                        name="email"
                        value={inputs.email}
                        onChange={handleSignupChange} />

                      <input type="password" placeholder="Password"
                        name="password"
                        value={inputs.password}
                        onChange={handleSignupChange}
                      />
                    </div>

                  </div>

                  <div className="row mb-4 px-3">
                    <div className="row col-md-6">
                      <label classNames="form-check-label" for="form1Example3">Already have a account</label></div>
                    <div className="col-md-6 justify-content-end d-flex gap-2">
                      <button type="button" onClick={toggleForm} className="btn btn-primary btn-sm">
                        Login
                      </button>
                      <Link to="/forgot" class="btn btn-danger btn-sm">forgot password ?</Link>

                    </div>

                  </div>

                  <div className="proced_payment">
                    <button
                      type="submit"
                      className="btnsub  form-control  mt-3"
                      onClick={handleSignupSubmit}
                      style={{ width: 200, marginTop: "30px !important", margin: 'auto' }}

                    >
                      Signup
                    </button>


                  </div>

                </>

              )}




              <br />
              <hr className="or" />
              <br />

              <div className="name_address">
                <div className="first_lastName">
                  <input type="text" placeholder="First Name" />
                  <input type="text" placeholder="Last Name" />
                </div>
                <div className="address">
                  <input
                    type="Number"
                    onkeyup="change()"
                    id="put"
                    placeholder="Phone No."
                  />
                  <input type="email" placeholder="Email Id" />
                  <input type="text" placeholder="Country" />
                </div>



              </div>

              <div className=" p-3">
                <h4>Shipping Address</h4>
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>

              </div>
            </>)}




            {isLogin && (<>
              <div className="name_address">

                <div className="address">
                  <input
                    type="Number"
                    id="put"
                    placeholder="Phone No."
                    name="phone"
                    value={Orderinputs.phone}
                    onChange={handleOrderChange}

                  />
                  <input type="number" placeholder="Pincode"
                    name="pincode"
                    value={Orderinputs.pincode}
                    onChange={handleOrderChange}
                  />

                  <input type="text" placeholder="Country"
                    name="country"
                    value={Orderinputs.country}
                    onChange={handleOrderChange}
                  />
                </div>

              </div>

              <div className=" p-3">
                <h4>Shipping Address</h4>
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"
                  name="address"
                  value={Orderinputs.address}
                  onChange={handleOrderChange}
                ></textarea>

              </div>

            </>
            )}


          </div>



        </div>
        <div className="order_summary col-md-4">
          <h1>Order Summary</h1>
          <div className="summary_card">

            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Your Cart ({cartItems.length}) Total Items ({cartItems.reduce((total, item) => total + item.quantity, 0)}) </h5>

              </div>
              <div className="modal-body">



                <div className="col-sm-12 col-md-12 col-md-offset-1">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th >Product</th>
                        <th>Quantity</th>
                        <th >Price</th>
                        <th >Total</th>
                        <th>Action </th>
                      </tr>
                    </thead>
                    <tbody>




                      {cartItems.map((item) => (
                        <tr key={item.id} >
                          <td className="col-sm-8 col-md-6" colspan="1">
                            <div className="media">
                              <div className='position-relative' style={{ width: 60, height: 80, overflow: 'hidden ' }}>
                                <iframe
                                  className="media-object"
                                  src={item.customise}
                                  style={{ width: 60, height: 80, overflow: 'hidden ' }}
                                />


                                <div className="position-absolute h-100 w-100" onClick={handleShow} role="button" style={{ top: 0, left: 0 }} />

                              </div>

                              <div className="media-body">

                                <h5 className="media-heading">
                                  {item.title} - {item.color} -
                                  <br />
                                  [ {
                                    Object.entries(item.SelectedSizes).map(([key, value]) => (
                                      <><span key={key}>{`${key}: ${value},`}</span>
                                      </>
                                    ))
                                  } ]
                                </h5>

                              </div>

                              {showModal && (
                                <div className="Custompopup">

                                  <div
                                    id="exampleModalLive"
                                    className="modal fade show"
                                    tabIndex={-1}
                                    role="dialog"
                                    aria-labelledby="exampleModalLiveLabel"
                                    style={{ display: "block", paddingRight: 17 }}>

                                    <div className="modal-dialog" role="document">
                                      <div className="modal-content">

                                        <div className="modal-body">
                                          <iframe
                                            className="media-object"
                                            src={item.customise}
                                            style={{ width: '100%', height: '400px', overflow: 'hidden ' }}
                                          />
                                        </div>
                                        <div className="modal-footer">
                                          <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={handleClose}
                                          >
                                            Close
                                          </button>

                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}



                            </div>
                          </td>

                          <td className="col-sm-1 col-md-1" style={{ textAlign: "center" }}>

                            <div className='d-flex gap-1 align-items-center'>
                              <button className="btn btn-primary btn-sm" onClick={() => updateItemQuantity(item.id, item.quantity - 1)} >
                                -
                              </button>
                              <span>
                                {item.quantity}
                              </span>
                              <button className="btn btn-primary btn-sm" onClick={() => updateItemQuantity(item.id, item.quantity + 1)} >
                                +
                              </button>
                            </div>

                            <hr />
                            <img src={item.overlayImage} width={'100px'} />


                          </td>
                          <td className="col-sm-1 col-md-1">
                            <strong>${item.price}</strong>
                          </td>
                          <td className="col-sm-1 col-md-1">
                            <strong>${item.quantity * item.price}</strong>
                          </td>
                          <td className="col-sm-1 col-md-1">
                            <button type="button" className="btn btn-danger" onClick={() => removeItemFromCart(item.id)} >
                              <svg
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
                              </svg>

                            </button>
                          </td>
                        </tr>
                      ))}


                      {cartItems && cartItems.length > 0 ? '' : (<tr>
                        <td> </td>
                        <td> </td>
                        <td> </td>

                        <td>
                          <h5>Total</h5>
                        </td>
                        <td className="text-right">
                          <h5>
                            <strong>${cartItems.reduce((total, item) => total + item.quantity * item.price, 0)}</strong>
                          </h5>
                        </td>
                      </tr>)}






                    </tbody>
                  </table>

                  <div class="text-center w-100">{cartItems && cartItems.length > 0 ? 'You cart Is empty' : ''}
                  </div>

                </div>

                <div className="proced_payment">
                  <button
                    type="submit"
                    className="btnsub  form-control  mt-3"
                    style={{ width: 200, marginTop: "30px !important", marginLeft: 'auto' }}
                    onClick={handleOrderSubmit}

                  >
                    Order Now
                  </button>

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

export default Checkout