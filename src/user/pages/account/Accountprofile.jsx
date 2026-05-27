import React, { useState, useEffect } from 'react';
import AccountSidebar from '../../components/AccountSidebar';
import { toast } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import axiosInstance from '../../../axiosInstance';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import getCookie from '../../../helper/getCookie';
import getDecryptData from '../../../helper/getDecryptData';
import LoadingScreen from '../../components/LoadingScreen';
import eraseCookie from '../../../helper/eraseCookie';
const Accountprofile = () => {
  

  const navigate = useNavigate();
  const [filteredCities, setFilteredCities] = useState([]);

  const [loading, setLoading] = useState(true); // Add loading state

  const [SubmitLoading, setSubmitLoading] = useState(true); // Add loading state
  const [data, setData] = useState([]);
  const [dataNew, setDataNew] = useState([]);

  const [inputs, setInputs] = useState({
    type: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
    pincode: "",
    Gender: "1",
    DOB: "",
    address: "",
    state: "",
    statename: "",
    city: "",
  });

  // //handle input change
  // const handleChange = (e) => {
  //     const { name, value, type, checked, files } = e.target;
  //     setInputs((prevData) => ({
  //         ...prevData,
  //         [name]:
  //             type === "checkbox" ? checked : type === "file" ? files[0] : value,
  //     }));
  // };

  const capitalizeEachWord = (str) => {
    if (!str) return str;
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const CreateSlug = (str) => {
    var slug = str;

    // Convert to lowercase
    slug = slug.toLowerCase();

    // Replace spaces with hyphens
    slug = slug.replace(/\s+/g, "-");

    // Remove special characters (only allow alphanumeric, hyphens, and underscores)
    slug = slug.replace(/[^a-z0-9\-]/g, "");

    return slug;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    let newValue;

    // Handle multi-checkbox logic
    if (type === "checkbox") {
      if (name === "OfferEquipment") {
        // If 'specialization' is being updated, add/remove values from the array
        newValue = checked
          ? [...(inputs.OfferEquipment || []), value] // Add value if checked
          : (inputs.OfferEquipment || []).filter((item) => item !== value); // Remove value if unchecked
      } else if (name === "NatureOfBusiness") {
        // If 'specialization' is being updated, add/remove values from the array
        newValue = checked
          ? [...(inputs.NatureOfBusiness || []), value] // Add value if checked
          : (inputs.NatureOfBusiness || []).filter((item) => item !== value); // Remove value if unchecked
      } else {
        newValue = checked;
        console.log(type, name, newValue);
      }
    } else if (type === "file") {
      // Handle file input
      newValue = files[0];
    } else {
      // Handle normal text inputs
      newValue = value;
    }

    // Capitalize text for the 'username' field
    if (name === "state") {
      const selectedState = data.find((state) => state._id === newValue);
      if (selectedState) {
        setFilteredCities(selectedState.cities);
        setInputs((prevData) => ({
          ...prevData,
          statename: selectedState.name,
          city: "",
        }));
      }
      console.log("selectedState", selectedState, newValue, data);
    }

    // Capitalize the text for 'username' field
    if (name === "username") {
      newValue = capitalizeEachWord(newValue);
      // Update the state with the new value
      setInputs((prevData) => ({
        ...prevData,
        profile_url: CreateSlug(newValue),
      }));
    }

    // Capitalize the text for 'username' field
    if (name === "profile_url") {
      newValue = CreateSlug(newValue);
    }

    // Update the state with the new value
    setInputs((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleDescriptionChange = (value) => {
    // Update the state with the new value
    setInputs((prevData) => ({
      ...prevData,
      about: value,
    }));
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //form handle
  const fetchUserById = async () => {
    const decryptdatajson = await getDecryptData();
    const id = decryptdatajson?._id;

    const credentials = {
      id: id,
    };

    try {
      const { data } = await axiosInstance.post("/auth-user", credentials);
      const { success, token, existingUser, message } = data;

      if (success) {
        setInputs((prevData) => ({
          ...prevData,
          username: existingUser.username || "",
          phone: existingUser.phone || "",
          email: existingUser.email || "",
          address: existingUser.address || "",
          pincode: existingUser.pincode || "",
          state: existingUser.state || "",
          statename: existingUser.statename || "",
          country: existingUser.country || "",
          city: existingUser.city || "",
          about: existingUser.about || "",
          SetEmail: existingUser.email || "",
        }));
      }

      console.log("success", existingUser);
    } catch (error) {
      console.error("Error during login:", error);
      // Handle network errors, API issues, etc.
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchUserById();
  }, []);

  useEffect(() => {
    const selectedState = data.find((state) => state._id === inputs.state);
    setFilteredCities(selectedState?.cities || []);
  }, [data, inputs.state]);

  const handleSubmit = async () => {
    const decryptdatajson = await getDecryptData();

    const id = decryptdatajson?._id;

    setSubmitLoading(false);
    console.log(inputs);
    const fields = [
      { name: "username", message: "Please enter Full Name" },
      { name: "phone", message: "Please enter phone number" },
      { name: "email", message: "Please enter email" },
      // { name: "Gender", message: "Please enter Gender" },
      // { name: "DOB", message: "Please enter DOB" },
      { name: "state", message: "Please enter State" },
      { name: "city", message: "Please enter City" },
      { name: "pincode", message: "Please enter pincode" },
      { name: "address", message: "Please enter address" },
      // { name: "profile", message: "Please choose profile photo" },
      // {
      //   name: "AadhaarFront",
      //   message: "Please choose Aadhaar Front photo ",
      // },
      // {
      //   name: "AadhaarBack",
      //   message: "Please choose Aadhaar Back photo ",
      // },
    ];

    for (const field of fields) {
      if (!inputs[field.name]) {
        toast.error(field.message);
        setSubmitLoading(true);
        return;
      }
    }

    const profileData = {
      username: inputs.username,
      phone: inputs.phone,
      email: inputs.email,
      state: inputs.state,
      statename: inputs.statename,
      city: inputs.city,
      pincode: inputs.pincode,
      address: inputs.address,
    };

    console.log("inputsinputs", profileData);
    try {
      const { data } = await axiosInstance.put(
        `/update-profile/${id}`,
        profileData
        // {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // }
      );
      const { success } = data;
      if (success) {
        // navigate("/");

        if(inputs.SetEmail === ''){
          toast.success("Profile Updated Successfully | Please login  ");
          navigate("/login");
          // localStorage.clear();
          eraseCookie('token')
        }else{
          toast.success("Profile Updated Successfully");
        }
       
      }
    } catch (error) {
      console.error("Error On Signup:", error);
      toast.error(error.response.data.message);
    } finally {
      setSubmitLoading(true);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    console.log("response.data start");

    try {
      const response = await axiosInstance.get("/get-all-zones");
      console.log("response.data.Zones,", response.data.Zones);
      setData(response.data.Zones);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

    
  return (
    <>
      <Header />

      <Helmet>
        <title> Account Profile | {window.location.hostname}</title>
      </Helmet>

      <div className="user-dasboard whitesmoke" >

        <div className="container pt-4">
          <div className="row pb-4">

            <AccountSidebar />

            <div className="col-lg-9 my-lg-0 my-1">
              <div id="main-content" className="bg-white border">


                <h4 className="mb-2">My Profile</h4>

 
{loading ? <LoadingScreen /> : 
    <form className="m-b20 row">
                  <div className="card  border-0 bg-white p-4 mb-4">
                    <div className="row">
                     
                      <div className="mb-4">
                        <label className="form-label text-dark" htmlFor="name">
                          Full Name{" "}
                          <span className="text-danger"> ( Required )</span>
                        </label>
                        <div className="input-group   input-sm">
                          <input
                            type="text"
                            id="username"
                            className="form-control"
                            name="username"
                            value={inputs.username}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="mb-4 col-6">
                        <label className="form-label text-dark" htmlFor="email">
                          Email{" "}
                          <span className="text-danger"> ( Required )</span>
                        </label>
                        <div className="input-group   input-sm">
                          <input
                          readOnly={inputs.SetEmail !== ''}
                          type="email"
                            id="email"
                            className="form-control"
                            name="email"
                            value={inputs.email}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="mb-4 col-6">
                        <label className="form-label text-dark" htmlFor="phone">
                          Phone{" "}
                          <span className="text-danger"> ( Required )</span>
                        </label>
                        <div className="input-group   input-sm">
                          <input
                            readOnly
                            type="email"
                            id="phone"
                            className="form-control"
                            name="phone"
                            value={inputs.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="mb-4 col-6 ">
                        <label
                          className="form-label text-dark"
                          htmlFor="Gender"
                        >
                          Gender{" "}
                          <span className="text-danger"> ( Required )</span>
                        </label>
                        <div className="input-group    input-sm">
                          <select
                            className="form-control"
                            value={inputs.Gender}
                            name="Gender"
                            onChange={handleChange}
                          >
                            <option selected disabled>
                              {" "}
                              Select Gender
                            </option>
                            <option value="1">Male</option>
                            <option value="2">Female</option>
                            <option value="0">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4 col-6 ">
                        <label className="form-label text-dark" htmlFor="email">
                          State{" "}
                          <span className="text-danger"> ( Required )</span>
                        </label>
                        <div className="input-group    input-sm">
                          <select
                            className="form-control"
                            id="state"
                            name="state"
                            value={inputs.state}
                            onChange={handleChange}
                          >
                            <option selected disabled>
                              {" "}
                              {loading ? "Loading..." : "Select State"}
                            </option>
                            {data.map((item) => (
                              <option key={item._id} value={item._id}>
                                {item.name}
                              </option>
                            ))}{" "}
                            ;
                          </select>
                        </div>
                      </div>

                      <div className="mb-4 col-6 ">
                        <label className="form-label text-dark" htmlFor="city">
                          City{" "}
                          <span className="text-danger"> ( Required )</span>
                        </label>
                        <div className="input-group    input-sm">
                          <select
                            className="form-control"
                            id="city"
                            name="city"
                            value={inputs.city}
                            onChange={handleChange}
                          >
                            <option selected value={""} disabled>
                              {" "}
                              {!inputs.city ? "Select City" : inputs.city}
                            </option>
                            {filteredCities.map((city, index) => (
                              <option key={index} value={city}>
                                {city}
                              </option>
                            ))}{" "}
                            ;
                          </select>
                        </div>
                      </div>

                      <div className="mb-4 col-6  ">
                        <label className="form-label text-dark" htmlFor="email">
                          Pincode
                          <span className="text-danger"> ( Required )</span>
                        </label>
                        <div className="input-group    input-sm">
                          <input
                            type="number"
                            
                            id="pincode"
                            className="form-control custom-date"
                            name="pincode"
                            value={inputs.pincode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="mb-4 col-md-6 d-none">
                        <label
                          className="form-label text-dark"
                          htmlFor="password"
                        >
                          New Password{" "}
                        </label>
                        <div className="input-group   input-sm">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="form-control dz-password"
                            name="password"
                            value={inputs.password}
                            onChange={handleChange} // Add onChange handler to manage input changes
                            // onKeyPress={(e) => {
                            //   if (e.key === 'Enter' && inputs.phone.length === 10) {
                            //     submitLoginPass();
                            //   }
                            // }}
                          />
                          <span className="input-group-text text-primary p-1">
                            {/* Toggle password visibility button */}
                            <i
                              className={
                                showPassword
                                  ? "ri-eye-off-fill cursor"
                                  : "ri-eye-fill cursor"
                              }
                              onClick={togglePasswordVisibility}
                            />
                          </span>
                        </div>
                      </div>
                      <div className="mb-4 col-md-6  d-none">
                        <label
                          className="form-label text-dark"
                          htmlFor="password"
                        >
                          New Confirm Password{" "}
                        </label>
                        <div className="input-group   input-sm">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="form-control dz-password"
                            name="confirm_password"
                            value={inputs.confirm_password}
                            onChange={handleChange} // Add onChange handler to manage input changes
                            // onKeyPress={(e) => {
                            //   if (e.key === 'Enter' && inputs.phone.length === 10) {
                            //     submitLoginPass();
                            //   }
                            // }}
                          />
                          <span className="input-group-text text-primary p-1">
                            {/* Toggle password visibility button */}
                            <i
                              className={
                                showPassword
                                  ? "ri-eye-off-fill cursor"
                                  : "ri-eye-fill cursor"
                              }
                              onClick={togglePasswordVisibility}
                            />
                          </span>
                        </div>
                      </div>

                      <div className="mb-4 col-12  ">
                        <label className="form-label text-dark" htmlFor="email">
                          Address
                          <span className="text-danger"> ( Required )</span>
                        </label>
                        <div className="input-group    input-sm">
                          <textarea
                            id="pincode"
                            className="form-control custom-date"
                            name="address"
                            value={inputs.address}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                

                      
                    </div>
                  </div>

                  <div className="col-md-12 text-end">
                    {SubmitLoading ? (
                      <button
                      className="btn btn-primary ms-2"   
                                           type="button"
                        onClick={handleSubmit}
                      >
                        Update Profile
                      </button>
                    ) : (
                      <button
                        disabled
                        className="btn btn-primary ms-2"   
                        type="button"
                      >
                        <span className="ms-1">Loading...</span>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </button>
                    )}
                  </div>
                </form>
 }



              </div>
            </div>
          </div>
        </div>

      </div >



      <Footer />
    </>
  )
}

export default Accountprofile
