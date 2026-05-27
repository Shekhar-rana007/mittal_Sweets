import React, { useState, useEffect, useContext, Component, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/store';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axiosInstance, { keyLogin } from '../../axiosInstance';
import setCookie from '../../helper/setCookie';
import getCookie from '../../helper/getCookie';
import { encrypt } from '../../helper/encryption';

const LoginComponents = ({ updateAuth }) => {
 
  // Assuming countdown state is managed using useState hook
  const [countdown, setCountdown] = useState(0);



  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const isLoginFromLocalStorage = localStorage.getItem('token') ? true : false;
  const isLoginFromLocalStorage = getCookie('token') ? true : false;

  const [isLogin, setIsLogin] = useState(isLoginFromLocalStorage);

  const [SubmitLoading, setSubmitLoading] = useState(true); // Add loading state
  const [GetOtpRes, setOtpRes] = useState([]); // Add loading state
  const [GetOtpTyp, setOtpTyp] = useState([]); // Add loading state
  const [hasPassword, setPassword] = useState(false); // Add loading state
  const [NewUser, setNewUser] = useState(false); // Add loading state


  const [formData, setFormData] = useState({
    phone: '',
    Gtoken: 'sddwdwdwdd',
    password: '',
  });


  const [inputs, setInputs] = useState({
    phone: '',
    Gtoken: 'sddwdwdwdd',
    password: '',
  });

  const credentials = {
    email: inputs.email,
    password: inputs.password
  };
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const checkUserToken = async () => {
      console.log('Effect is running');
      // Check if this is printed multiple times

      // const usertoken = localStorage.getItem('token');
      const usertoken = getCookie('token');

      if (usertoken) {
        console.log('Token found in local storage'); // Check if this is printed multiple times

        // navigate('/account');

        toast.success("Welcome back");
      }
    }
    checkUserToken();
  }, [dispatch, navigate]);




  //handle input change
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  };


  const [combinedOTP, setcombinedOTP] = useState(""); // Add loading state


  // otp start

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


  const verifyOTPFinal = async () => {
    setSubmitLoading(false); // Set loading to false after request completion

    const MYOTPinputs = { OTP: combinedOTP, HASHOTP: GetOtpRes.otp }

    try {
      const response = await axiosInstance.post(`/login-verify-otp`, MYOTPinputs); // Await the axios post request
      console.log('responseresponse', response)
      const { success } = response.data
      if (success) {

        // if (String(GetOtpRes.otp) === String(combinedOTP)) { }

        if (GetOtpRes.password === false) {

          toast.success('Otp Verfied successfully!');
          // Save token and user ID to localStorage

          //   localStorage.setItem('token', GetOtpRes.token);
          // setCookie('token', GetOtpRes.token, 7); // Expires in 7 days

          // localStorage.setItem('userId', GetOtpRes.existingUser._id);


          if (GetOtpRes) {
            const { _id, username, email, type, phone } = GetOtpRes.existingUser;
            const userToStore = { _id, username, email, type, phone };
            // localStorage.setItem('user', JSON.stringify(userToStore));
            const encrptdata = encrypt(JSON.stringify(userToStore), keyLogin);

            setCookie('token', encrptdata, 7); // Expires in 7 days
          }

          updateAuth(true);
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
              // setCookie('token', response.data.token, 7); // Expires in 7 days

              // localStorage.setItem('userId', response.data.existingUser._id);
              // setCookie('userId', response.data.existingUser._id, 7); // Expires in 7 days


              if (GetOtpRes) {
                const { _id, username, email, type, phone } = response.data.existingUser;
                const userToStore = { _id, username, email, type, phone };

                //  localStorage.setItem('user', JSON.stringify(userToStore));
                const encrptdata = encrypt(JSON.stringify(userToStore), keyLogin);

                setCookie('token', encrptdata, 7); // Expires in 7 days

              }

              updateAuth(true);
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
          // setCookie('token', GetOtpRes.token, 7); // Expires in 7 days

          //   localStorage.setItem('userId', GetOtpRes.existingUser._id);
          // setCookie('userId', GetOtpRes.existingUser._id, 7); // Expires in 7 days

          if (GetOtpRes) {
            const { _id, username, email, type, phone } = GetOtpRes.existingUser;
            const userToStore = { _id, username, email, type, phone };
            // localStorage.setItem('user', JSON.stringify(userToStore));
            const encrptdata = encrypt(JSON.stringify(userToStore), keyLogin);

            setCookie('token', encrptdata, 7); // Expires in 7 days

          }

          updateAuth(true);
          // Dispatch login action if you're using Redux
          dispatch(authActions.login());
          setIsLogin(true); // Set isLogin to true when token is found
          // navigate('/');
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
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    setIsChecked(false);
  }, [currentStep]);


  const submitOTP = async () => {
    setSubmitLoading(false); // Set loading to true before making the request

    try {
      const response = await axiosInstance.post(`/signup-login-otp/`, inputs); // Await the axios post request
      console.log('responseresponse', response);
      if (response.data.password === true) {
        setPassword(true)
      } else {
        handleNext();
        setOtpRes(response.data); // Set the response data to state
        // toast.success('Otp Send successfully!');
        setTimeout(function () { toast.success(`Your OTP  is ${response.data.newotp}`); }, 1000);
      }
      // console.log('dataotp', response.data.password);

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
      const response = await axiosInstance.post(`/login-with-otp/`, inputs);
      setOtpRes(response.data);
      toast.success('Otp Sent successfully!');
         setTimeout(function () { toast.success(`Your OTP  is ${response.data.newotp}`); }, 1000);

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
      const response = await axiosInstance.post(`/login-with-otp/`, inputs); // Await the axios post request
      setOtpRes(response.data); // Set the response data to state

      toast.success('Otp Send successfully!');
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
      const response = await axiosInstance.post(`/login-with-pass/`, inputs); // Await the axios post request
      setOtpRes(response.data); // Set the response data to state
      console.log('dataotp', response.data);
      if (response.data.checkpass === true) {

        toast.success('Login successfully!');
        // Save token and user ID to localStorage

        // localStorage.setItem('token', response.data.token);
        // setCookie('token', response.data.token, 7); // Expires in 7 days


        // localStorage.setItem('userId', response.data.existingUser._id);
        // setCookie('userId', response.data.existingUser._id, 7); // Expires in 7 days

        if (GetOtpRes) {
          const { _id, username, email, type, phone } = response.data.existingUser;
          const userToStore = { _id, username, email, type, phone };
          // localStorage.setItem('user', JSON.stringify(userToStore));
          const encrptdata = encrypt(JSON.stringify(userToStore), keyLogin);

          setCookie('token', encrptdata, 7); // Expires in 7 days

        }

        updateAuth(true);
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

  useEffect(() => {
    console.log('GetOtpResGetOtpRes', GetOtpRes);
    console.log("countdown", countdown)
  }, [GetOtpRes, countdown]);



  return (

        <>



     {currentStep === 1 && (
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
                              value={inputs.phone}
                              maxlength={10}
                              onChange={(e) => {
                                if (e.target.value.length <= 10) { // Check input length before updating
                                  handleChange(e); // Call handleChange if length is within limit
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
                          </label> <span> to the <Link to="#" > Terms of Use</Link> &amp;<Link to="#" > Privacy Policy  </Link> </span>
                        </div>



                        {SubmitLoading ? (

                          <button disabled={!isChecked || inputs.phone.length !== 10}

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

                  <div className="col-12 m-auto mt-10">
                    <button className="btn btn-accent btn-shadow d-block w-100 mt-10" type="button" onClick={() => {
                      handleNext()
                      handleRequestAgainClick();
                      // submitLoginOTP();
                    }}
                    >Login With OTP</button>
                    <hr class="or" />
                    <button className="btn btn-accent btn-shadow d-block w-100" type="button" onClick={() => setCurrentStep(3)} >Login With Password</button>

                  </div>
                </>)}


              </>)}

            {currentStep === 2 && (
              <>

                <div className="card-body p-0 pt-5 text-center">
                  {!hasPassword ? (<>
                    <h4>Verify with OTP</h4>
                    <p>Send to    <a onClick={handlePrevious} previewlistener="true" href="#" className='bg-primary text-white p-1 px-2 rounded-pill small me-2'  >Edit  </a>   {inputs.phone}</p>

                    <div className="d-flex gap-3 col-md-7 col-9 m-auto mb-4">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="col">
                          <input
                            type="tel"
                            name="otp"
                            className="form-control text-center"
                            placeholder=""
                            maxLength={1} // Set the maximum length to 1 character
                            // onInput={(event) => handleInputChange(index, event)} // Handle input change
                            onInput={(event) => {
                              const value = event.target.value;
                              if (value.length > 1) {

                              } else {
                                handleInputChange(index, event)
                              }

                            }} // Handle input change
                            ref={(input) => otpInputs.push(input)} // Add a reference to the input field
                          />
                        </div>
                      ))}
                    </div>
                    {countdown > 0 && (
                      <p>Resend OTP in <span className='text-success'>00.{countdown} </span></p>)}

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


                    <p className="resend text-muted mb-0 mt-2">
                      Didn't receive code?{" "}
                      <a href="#" onClick={handleRequestAgainClick} >
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
                    <p>Send to    <a onClick={handlePrevious} previewlistener="true" href="#" className='bg-primary text-white p-1 px-2 rounded-pill small me-2' >Edit  </a>   {inputs.phone}</p>

                    <div className="d-flex gap-3 col-md-7 col-9 m-auto mb-4">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="col">
                          <input
                            type="tel"
                            name="otp"
                            className="form-control text-center"
                            placeholder=""
                            maxLength={1} // Set the maximum length to 1 character
                            onInput={(event) => {
                              const value = event.target.value;
                              if (value.length > 1) {

                              } else {
                                handleInputChange(index, event)
                              }

                            }} // Handle input change

                            ref={(input) => otpInputs.push(input)} // Add a reference to the input field
                          />
                        </div>
                      ))}
                    </div>

                    {countdown > 0 && (
                      <p>Resend OTP in <span className='text-success'>00.{countdown} </span></p>)}

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
            {currentStep === 3 && (
              <>

                <h4 className="border-bottom pb-4 mb-4 text-center">Login With Password</h4>
                <p className="mb-2"> Please enter password that is linked to <br /> <b> {inputs.phone}  </b>  <a previewlistener="true" href="#" onClick={() => { setPassword(false); setCurrentStep(1) }} >Edit  </a> </p>


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
                            value={inputs.password}
                            onChange={handleChange} // Add onChange handler to manage input changes
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && inputs.phone.length === 10) {
                                submitLoginPass();
                              }
                            }}
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {SubmitLoading ? (

                  <button disabled={inputs.phone.length !== 10}
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



        </>

    )
}

export default LoginComponents