import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../axiosInstance';

import { useBlogContext } from '../../fetchdata/BlogContext';

const Contact = () => {


  const { Headers, isHeader, cartItems, AllProducts, AllCategoriess } = useBlogContext();


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axiosInstance.post('/contact-enquire', formData);
      toast.success('Email sent successfully');
      setFormData({ name: '', email: '', message: '' ,phone:'' }); // Clear form fields
    } catch (error) {
      console.error('Failed to send email:', error);
      toast.error('Failed to send email');
    }
  };

  return (
    <>
      <Header />


      <section className="contact_us">
        <div className="container">
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <div className="contact_inner">
                <div className="row">
                  <div className="col-md-10">
                    <form className="contact_form_inner" onSubmit={handleSubmit} >
                      <div className="contact_field">
                        <h3>Contact Us</h3>
                        <p>
                          Feel Free to contact us any time. We will get back to you
                          as soon as we can!.
                        </p>
                        <input
                          type="text"
                          className="form-control form-group"
                          placeholder="Name" name="name" value={formData.name} onChange={handleChange} required maxLength={20}
                        />
                        <input
                          type="text"
                          className="form-control form-group"
                          placeholder="Email" name="email" value={formData.email} onChange={handleChange} required maxLength={20}
                        />
                            <input
                          type="number"
                          className="form-control form-group"
                          placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} required maxLength={20}
                        />
                        <textarea
                          className="form-control form-group"
                          placeholder="Message"
                          name="message" value={formData.message} onChange={handleChange} required maxLength={100}
                        />
                        <button className="btn btn-accent d-flex align-items-center justify-content-center w-100 mt-4" type="submit">Submit</button>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-2">
                    <div className="right_conatct_social_icon d-flex align-items-end">
                      <div className="socil_item_inner d-flex">
                        <li>
                          <a href="#">
                            <i className="fab fa-facebook-square" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-instagram" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fab fa-twitter" />
                          </a>
                        </li>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contact_info_sec">
                  <h4 className='text-white'>Contact Info</h4>

                  {!isHeader && (
                    <>

                      <div className="d-flex info_single align-items-center text-white">
                        <i className="fas fa-headset" />
                        <span>+91 {Headers.phone}</span>
                      </div>

                      {Headers.alternative_phone && (
                        <div className="d-flex info_single align-items-center text-white">
                          <i className="fas fa-phone-alt" />
                          <span>+91 {Headers.alternative_phone}</span>
                        </div>
                      )}


                      <div className="d-flex info_single align-items-center text-white">
                        <i className="fas fa-envelope-open-text" />
                        <span>{Headers.email}</span>
                      </div>
                      <div className="d-flex info_single align-items-center text-white">
                        <i className="fas fa-map-marked-alt" />
                        {Headers.address_link ? (
                          <a href={Headers.address_link} className="text-white" target="_blank" rel="noreferrer">
                            {Headers.address}
                          </a>
                        ) : (
                          <span>
                            {Headers.address}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="map_sec">
        <div className="container">
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <div className="map_inner">
                <h4>Find Us on Google Map</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore
                  quo beatae quasi assumenda, expedita aliquam minima tenetur
                  maiores neque incidunt repellat aut voluptas hic dolorem sequi ab
                  porro, quia error.
                </p>
                <div className="map_bind">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d471220.5631094339!2d88.04952462217592!3d22.6757520733225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882db4908f667%3A0x43e330e68f6c2cbc!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1596988408134!5m2!1sen!2sin"
                    width="100%"
                    height={450}
                    frameBorder={0}
                    style={{ border: 0 }}
                    allowFullScreen=""
                    aria-hidden="false"
                    tabIndex={0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <div className="hero overlay inner-page bg-primary py-5 d-none">
        <div className="container">
          <div className="row align-items-center justify-content-center text-center pt-5">
            <div className="col-lg-6">
              <h1
                className="heading text-white mb-3 aos-init aos-animate"
                data-aos="fade-up"
              >
                Contact Us
              </h1>
            </div>
          </div>
        </div>
      </div>


      <div className="section d-none">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-4 mb-5 mb-lg-0 aos-init aos-animate"
              data-aos="fade-up"
              data-aos-delay={100}
            >
              <div className="contact-info">
                <div className="address mt-2">
                  <i className="icon-room" />
                  <h4 className="mb-2">Location:</h4>
                  <p>
                    43 Raymouth Rd. Baltemoer,
                    <br /> London 3910
                  </p>
                </div>
                <div className="open-hours mt-4">
                  <i className="icon-clock-o" />
                  <h4 className="mb-2">Open Hours:</h4>
                  <p>
                    Sunday-Friday:
                    <br />
                    11:00 AM - 2300 PM
                  </p>
                </div>
                <div className="email mt-4">
                  <i className="icon-envelope" />
                  <h4 className="mb-2">Email:</h4>
                  <p>info@Untree.co</p>
                </div>
                <div className="phone mt-4">
                  <i className="icon-phone" />
                  <h4 className="mb-2">Call:</h4>
                  <p>+1 1234 55488 55</p>
                </div>
              </div>
            </div>
            <div
              className="col-lg-8 aos-init aos-animate"
              data-aos="fade-up"
              data-aos-delay={200}
            >
              <form action="#">
                <div className="row">
                  <div className="col-6 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your Email"
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Subject"
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <textarea
                      name=""
                      id=""
                      cols={30}
                      rows={7}
                      className="form-control"
                      placeholder="Message"
                      defaultValue={""}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="submit"
                      defaultValue="Send Message"
                      className="btn btn-primary"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />

    </>

  )
}

export default Contact
