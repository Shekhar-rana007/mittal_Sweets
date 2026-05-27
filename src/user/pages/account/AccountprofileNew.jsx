import React, { useState, useEffect } from 'react';
import AccountSidebar from '../../components/AccountSidebar';
import { toast } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import axiosInstance, { weburl } from '../../../axiosInstance';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import getCookie from '../../../helper/getCookie';
import getDecryptData from '../../../helper/getDecryptData';
import LoadingScreen from '../../components/LoadingScreen';
import eraseCookie from '../../../helper/eraseCookie';

const AccountprofileNew = () => {

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
    profile: "",
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
          aadharno: existingUser.aadharno || "",
          DOB: existingUser.DOB || "",
          pHealthHistory: existingUser.pHealthHistory || "",
          cHealthStatus: existingUser.cHealthStatus || "",
          profile: existingUser.profile || "",
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

  const handleSubmit = async () => {
    const decryptdatajson = await getDecryptData();

    const id = decryptdatajson?._id;

    setSubmitLoading(false);
    console.log(inputs);
    const fields = [
      { name: "username", message: "Please enter Full Name" },
      { name: "aadharno", message: "Please enter aadhar number" },
      { name: "DOB", message: "Please Select DOB" },
      { name: "pHealthHistory", message: "Please enter past health history" },
      { name: "cHealthStatus", message: "Please enter current health status" },
      { name: "profile", message: "Please upload profile picture " },

      // { name: "Gender", message: "Please enter Gender" },
      // { name: "DOB", message: "Please enter DOB" },
      // { name: "state", message: "Please enter State" },
      // { name: "pincode", message: "Please enter pincode" },
      // { name: "address", message: "Please enter address" },
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

    // Aadhaar Number Validation (12-digit numeric)
    const aadharRegex = /^\d{12}$/;
    if (!aadharRegex.test(inputs.aadharno)) {
      toast.error("Please enter a valid Aadhaar number (12 digits)");
      setSubmitLoading(true);
      return;
    }

    // DOB Validation (age 18+)
    let dob = new Date(inputs.DOB);
    let today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    let m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      toast.error("You must be at least 18 years old");
      setSubmitLoading(true);
      return;
    }


    console.log("inputsinputs", inputs);
    try {
      const { data } = await axiosInstance.put(
        `/update-user-details-health/${id}`,
        inputs,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { success } = data;
      if (success) {
        // navigate("/");

        if (inputs.SetEmail === '') {
          toast.success("Profile Updated Successfully | Please login  ");
          navigate("/login");
          // localStorage.clear();
          eraseCookie('token')
        } else {
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


                <h4 className="mb-2">Personal Health Profile</h4>


                {loading ? <LoadingScreen /> :
                  <form className="m-b20 row">
                    <div className="card  border-0 bg-white p-4 mb-4">
                      <div className="row">

                        <div className='col-md-3 mb-4 col-4'>
                          <div className="openimage-container">
                            <label className="form-label text-dark" for="profileImage">Profile Image<span className="text-danger"> ( Required )</span></label>

                            {inputs.profile && typeof inputs.profile === "string" ? (
                              <img
                                src={inputs.profile !== "" ? weburl + inputs.profile.replace('public\\', '') : "/img/profile-default.png"}
                                id="ProfileImage"
                                alt="Profile Image"
                                style={{
                                  width: "100%",
                                  aspectRatio: "1/1",
                                  background: "#f8f9fa",
                                  display: "block",
                                  textAlign: "center",
                                  lineHeight: "40vh",
                                  borderRadius: "",
                                  objectFit: "cover",
                                  border: "1px solid grey",
                                }}
                              />
                            ) : (
                              <img
                                src={inputs.profile && typeof inputs.profile === "string" && inputs.profile !== "" ? weburl + inputs.profile.replace('public\\', '') : "/img/profile-default.png"}
                                id="ProfileImage"
                                alt="Profile Image"
                                style={{
                                  width: "100%",
                                  aspectRatio: "1/1",
                                  background: "#f8f9fa",
                                  display: "block",
                                  textAlign: "center",
                                  lineHeight: "40vh",
                                  borderRadius: "",
                                  objectFit: "cover",
                                  border: "1px solid grey",
                                }}
                              />
                            )}
                            <input
                              type="file"
                              id="profileImage"
                              className="form-control"
                              name="profileImage"
                              accept=".jpg, .jpeg, .png, .webp"
                              capture="camera"  // This will suggest using the camera on mobile devices
                              onChange={(event) => {
                                const file = event.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    const imgElement = document.getElementById("ProfileImage");
                                    if (imgElement) {
                                      imgElement.src = e.target.result; // Set the image URL directly on the img element
                                    }
                                  };
                                  reader.readAsDataURL(file); // Read the file as a data URL
                                  setInputs((prevData) => ({ ...prevData, profile: file })); // Update profile in state
                                }
                              }}
                            />
                          </div>
                        </div>


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


                        <div className="mb-4 col-md-6">
                          <label className="form-label text-dark" htmlFor="name">
                            Aadhar Number
                            <span className="text-danger"> ( Required )</span>
                          </label>
                          <div className="input-group   input-sm">
                            <input
                              type="number"
                              id="aadharno"
                              className="form-control"
                              name="aadharno"
                              value={inputs.aadharno}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="mb-4 col-6  ">
                          <label className="form-label text-dark" htmlFor="email">
                            DOB <span className="text-danger"> ( Required )</span>
                          </label>
                          <div className="input-group    input-sm">

                            <input
                              type="date"
                              id="DOB"
                              className="form-control custom-date"
                              name="DOB"
                              value={inputs.DOB ? inputs.DOB.split('T')[0] : ''} // Extract the date part (YYYY-MM-DD)
                              onChange={handleChange}
                            />
                          </div>
                        </div>


                        <div className="mb-4 col-12  ">
                          <label className="form-label text-dark" htmlFor="email">
                            Past health history
                            <span className="text-danger"> ( Required )</span>
                          </label>
                          <div className="input-group    input-sm">
                            <textarea
                              id="pHealthHistory"
                              className="form-control custom-date"
                              name="pHealthHistory"
                              value={inputs.pHealthHistory}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="mb-4 col-12  ">
                          <label className="form-label text-dark" htmlFor="email">
                            Current health status
                            <span className="text-danger"> ( Required )</span>
                          </label>
                          <div className="input-group    input-sm">
                            <textarea
                              id="cHealthStatus"
                              className="form-control custom-date"
                              name="cHealthStatus"
                              value={inputs.cHealthStatus}
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

export default AccountprofileNew