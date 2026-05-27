import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { useBlogContext } from '../../fetchdata/BlogContext';
import axiosInstance from '../../axiosInstance';
import toast from 'react-hot-toast';


const Footer = () => {


  const { Headers, isHeader, cartItems, AllProducts, AllCategoriess } = useBlogContext();

const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const aboutUs = Headers.about_us || '';
  const addressContent = <span className="small text-white opacity-75">{Headers.address}</span>;
  const rawWhatsappNumber =
    Headers && typeof Headers === "object"
      ? Headers.whatsapp_number ||
        Headers.whatsappUrl ||
        Headers.whatsapp_url ||
        Headers.whatsapp_link ||
        Headers.whatsapp ||
        Headers.whatsapp_no ||
        ""
      : "";
  const whatsappText =
    typeof rawWhatsappNumber === "string" || typeof rawWhatsappNumber === "number"
      ? String(rawWhatsappNumber).trim()
      : "";
  const whatsappDigits = whatsappText.replace(/\D/g, "");
  const whatsappLinkNumber = whatsappDigits.length === 10 ? `91${whatsappDigits}` : whatsappDigits;
  const whatsappUrl = whatsappText.startsWith("http")
    ? whatsappText
    : whatsappLinkNumber
      ? `https://wa.me/${whatsappLinkNumber}`
      : "";
  const whatsappLabel =
    whatsappDigits.length === 10
      ? `+91 ${whatsappDigits}`
      : whatsappDigits
        ? `+${whatsappDigits}`
        : "WhatsApp";
  const socialLinks = [
    {
      key: 'instagram',
      url: Headers.instagram_link || '',
      icon: 'ri-instagram-fill',
      label: 'Instagram',
    },
    {
      key: 'facebook',
      url: Headers.facebook_link ||  '',
      icon: 'ri-facebook-box-fill',
      label: 'Facebook',
    },
    {
      key: 'linkedin',
      url: Headers.linkedin_link ||  '',
      icon: 'ri-linkedin-box-fill',
      label: 'LinkedIn',
    },
    {
      key: 'youtube',
      url: Headers.youtube_link ||  '',
      icon: 'ri-youtube-fill',
      label: 'Youtube',
    },
  ].filter((item) => item.url);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubscribing(true);
    try {
      await axiosInstance.post('/contact-enquire', {
        name:    'Newsletter Subscriber',
        email:   email,
        phone:   '',
        message: 'Newsletter Subscription Request',
      });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      console.error('Subscription failed:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };


  return (

    <>
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          className="position-fixed d-flex align-items-center justify-content-center text-white text-decoration-none"
          style={{
            right: 20,
            bottom: '10%',
            height: 54,
            minWidth: 54,
            padding: "0 16px",
            borderRadius: 999,
            backgroundColor: "#25D366",
            zIndex: 1050,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            gap: 8,
          }}
          target="_blank"
          rel="noreferrer"
          aria-label={`Chat on WhatsApp ${whatsappLabel}`}
          title={whatsappUrl}
        >
          <i className="ri-whatsapp-line" style={{ fontSize: "1.75rem" }} />
          <span className="fw-medium small">{whatsappLabel}</span>
          <span className="visually-hidden">{whatsappUrl}</span>
        </a>
      )}

      {/* Footer */}
      <footer
        className="footer startbg pb-0 overflow-hidden position-relative" style={{backgroundColor:'rgb(4, 34, 88)'}}
      
      >
   
        <div className="footer-top py-4 py-lg-10 border-top position-relative z-2">
          <div className="container ">
               <div className='row mb-4 border-bottom'>
        <div className='col-md-8'>
          <h2 className='text-white'>With Love, From Mittal Sweet & Snacks </h2>
          <p className='text-white opacity-75'> Subscribe to our newsletter for Mittal Sweet & Snacks offers. </p>

        </div>
  {/* 👇 Newsletter subscription with loading state */}
              <div className='col-md-4'>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder='Enter Email Id'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                    disabled={subscribing}
                  />
                  <div className="input-group-append" style={{ backgroundColor: '#29447a' }}>
                    <button
                      className="btn h-100"
                      type="button"
                      onClick={handleSubscribe}
                      disabled={subscribing}
                    >
                      {subscribing ? (
                        <span className="spinner-border spinner-border-sm text-white" role="status" aria-hidden="true" />
                      ) : (
                        <i className="text-white ri-arrow-right-line" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
      <hr/>

            <div className="row mt-4 g-4 g-lg-10">
              <div className="col">
                <div className="row g-4">

                      <div className="col-12 col-md-4 ps-4" >
                        <div className='col-md-9'>
 <div className="widget widget-links ">
                          {Headers.meta_logo && Headers.meta_logo !== undefined ? (
                    <img src={Headers.meta_logo}  className=" " style={{ maxHeight: 150, width: "auto"}} 
                    alt="logo" />
                  ) : (
                    <div
                      className="card-1 skeleton"
                      style={{ height: 60, width: 200, borderRadius: 5 }}
                    ></div>
                  )}
                          <p className='mt-2 text-white opacity-75'>{aboutUs}
                            </p>
                        </div>
                        </div>
                       
                      </div>

                  {isHeader
                    ? // Display loading skeletons while data is being fetched
                    Array.from({ length: 8 }).map((_, index) => (
                      <div className="nav-item" key={index}>
                        <div
                          className="skeleton mt-1"
                          style={{
                            height: 22,
                            width: 100,
                            borderRadius: 5,
                          }}
                        ></div>
                      </div>
                    ))
                    :
                    (Headers.footer !== undefined && Headers.footer.map((item, index) => (
                      <div className="col-12 col-md" key={index}>
                        <div className="widget widget-links">
                          <h4 className="widget-title fw-medium h4 text-white">{item.text}</h4>
                          <ul className="widget-list">
                            {item.children.map((childItem, childIndex) => (
                              <li className="widget-list-item" key={childIndex}>
                                <Link className="widget-list-link text-white opacity-75 " to={childItem.link}>
                                  {childItem.text}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )))
                  }

                </div>
              </div>
              <div className="col-lg-3">
                <div className="mb-4">
                  <h4 className="mb-2 h4 fw-medium text-white">Contact Us</h4>


                </div>
                <div className="mb-4">
                  <div className="row align-items-center">
                    <div className="col-auto ps-0 pe-0">
                      
                      <i
                        className="text-dark ri-customer-service-2-fill text-white"  
                        style={{ fontSize: "1.5rem" }}
                      />
                    </div>
                    {!isHeader && (
                      <div className="col">
                        <h6 className="mb-0 text-white">24/7 Tech Support</h6>
                        <a href={`tel:+91${Headers.phone}`} className="nav-link-base text-white opacity-75 ">
                          +91 {Headers.phone}
                        </a>  <br/>
                        {Headers.alternative_phone && (
                          <a href={`tel:+91${Headers.alternative_phone}`} className="nav-link-base text-white opacity-75 ">
                            +91 {Headers.alternative_phone}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="row">
                    <div className="col-auto ps-0 pe-0">
                      <i
                        className="text-dark ri-map-pin-2-fill text-white"
                        style={{ fontSize: "1.5rem" }}
                      />
                    </div>
                    {!isHeader && (<div className="col">
                      <h6 className="mb-1 font-weight-bold small text-white">Address Info</h6>
                      {Headers.address_link ? (
                        <a href={Headers.address_link} className="text-decoration-none" target="_blank" rel="noreferrer">
                          {addressContent}
                        </a>
                      ) : (
                        addressContent
                      )}
                    </div>)}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="row">
                    <div className="col-auto ps-0 pe-0">   
                      <i
                        className="text-dark ri-mail-send-fill text-white"
                        style={{ fontSize: "1.5rem" }}
                      />
                    </div>
                    {!isHeader && (
                      <div className="col">
                        <h6 className="mb-0 small text-white">24/7 Email Support</h6>
                        <a href={`mailto:${Headers.email}`} className="nav-link-base small text-white ">
                          {Headers.email}
                        </a>
                      </div>
                    )}
                  </div>
                  <h4 className='text-white fw-light fs-6 mt-4 mb-0 border-top pt-2'> Follow Us</h4>
                  <div className='d-flex mt-0 gap-2 '>

                    {socialLinks.map((item) => (
                      <a href={item.url} target="_blank" rel="noreferrer" aria-label={item.label} key={item.key}>
                        <i className={`${item.icon} text-white fs-4 fw-light`} />
                      </a>
                    ))}
                  

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom border-top py-4">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-lg-3 text-center text-lg-start">
                <ul className="list-inline mb-0 d-none">
                  <li className="list-inline-item">
                    <a className="link-accent fs-xl" href="#">
                      <i className="ri-facebook-line" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="link-danger fs-xl" href="#">
                      <i className="ri-google-line" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="link-info fs-xl" href="#">
                      <i className="ri-twitter-line" />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-12 col-lg-6 text-center">
                <p title="https://seotowebdesign.com/" className="nav-link-base fs-sm text-white " >
                  <span className='opacity-75'> {!isHeader && (Headers.footer_credit)}
                     {/* | Design by   */}

                  </span>
                 {/* <a href="https://seotowebdesign.com/" target="blank" className='text-white'>Seo To Webdesign </a> */}
                </p>
              </div>

              {/* <div className="col-12 col-lg-3 text-center text-lg-end mt-3 mt-lg-0">
            <img
              className="d-inline-block align-middle"
              src="assets/img/shop/cards.png"
              width={246}
              alt="Cerdit Cards"
            />
          </div> */}


            </div>
          </div>
        </div>
      </footer>
    </>



  )
}

export default Footer
