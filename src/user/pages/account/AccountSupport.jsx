import React from 'react'
import AccountSidebar from '../../components/AccountSidebar';
import { toast } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useBlogContext } from '../../../fetchdata/BlogContext';


const AccountSupport = () => {
  const { Headers, isHeader } = useBlogContext();

  return (
    <>
      <Header />

      <Helmet>
        <title> Account Support | {window.location.hostname}</title>

      </Helmet>

      <div className="user-dasboard whitesmoke" >

        <div className="container pt-4">
          <div className="row pb-4">

            <AccountSidebar />

            <div className="col-lg-9 my-lg-0 my-1">
              <div id="main-content" className="bg-white border">
                <h4 className="mb-2">Help &amp; Support</h4>
                <div className=" mt-4 ">

                  {!isHeader && (
                    <>

                      <div className="d-flex info_single align-items-center text-dark bg-light rounded p-3 mb-2">
                        <i className="fa-solid fa-phone me-2"></i>
                        <span>+91 {Headers.phone}</span>
                      </div>
                      <div className="d-flex info_single align-items-center text-dark bg-light rounded p-3 mb-2">
                       <i className="fa-solid fa-envelope me-2"></i>
                        <span> {Headers.email}</span>
                      </div>
                    </>
                  )

                  }

                  <div className="accordion " id="faqAccordion">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          How do I create an account?
                        </button>
                      </h2>
                      <div
                        id="collapseOne"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingOne"
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">
                          You can create an account by clicking on the 'Sign Up' or
                          'Register' link on the top right corner of the website and
                          following the prompts to provide your information.
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingTwo">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwo"
                          aria-expanded="false"
                          aria-controls="collapseTwo"
                        >
                          How do I track my order?
                        </button>
                      </h2>
                      <div
                        id="collapseTwo"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingTwo"
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">
                          You can track your order by logging into your account and visiting
                          the 'Order History' section. Alternatively, you can track your
                          order using the tracking number provided in your order
                          confirmation email.
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingThree">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThree"
                          aria-expanded="false"
                          aria-controls="collapseThree"
                        >
                          What payment methods do you accept?
                        </button>
                      </h2>
                      <div
                        id="collapseThree"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingThree"
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">
                          We accept all major credit cards (Visa, MasterCard, American
                          Express), PayPal, and bank transfers.
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingFour">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFour"
                          aria-expanded="false"
                          aria-controls="collapseFour"
                        >
                          What is your return policy?
                        </button>
                      </h2>
                      <div
                        id="collapseFour"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingFour"
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">
                          Our return policy allows you to return items within 30 days of
                          purchase for a full refund. Please visit our Returns &amp;
                          Exchanges page for more information.
                        </div>
                      </div>
                    </div>
                  
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingSix">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseSix"
                          aria-expanded="false"
                          aria-controls="collapseSix"
                        >
                          Can I cancel my order?
                        </button>
                      </h2>
                      <div
                        id="collapseSix"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingSix"
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">
                          Yes, you can cancel your order before it has been shipped. Please
                          contact our customer support team as soon as possible to request a
                          cancellation.
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingSeven">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseSeven"
                          aria-expanded="false"
                          aria-controls="collapseSeven"
                        >
                          Do you offer international shipping?
                        </button>
                      </h2>
                      <div
                        id="collapseSeven"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingSeven"
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">
                          Yes, we offer international shipping to most countries. Shipping
                          costs and delivery times may vary depending on the destination.
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingEight">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseEight"
                          aria-expanded="false"
                          aria-controls="collapseEight"
                        >
                          How do I return or exchange an item?
                        </button>
                      </h2>
                      <div
                        id="collapseEight"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingEight"
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">
                          To return or exchange an item, please visit our Returns &amp;
                          Exchanges page and follow the instructions provided. If you need
                          further assistance, you can contact our customer support team.
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingNine">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseNine"
                          aria-expanded="false"
                          aria-controls="collapseNine"
                        >
                          Are your products eco-friendly?
                        </button>
                      </h2>
                      <div
                        id="collapseNine"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingNine"
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">
                          Yes, we strive to offer eco-friendly products whenever possible.
                          Look for the 'Eco-Friendly' label on our product pages to identify
                          environmentally friendly options.
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingTen">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTen"
                          aria-expanded="false"
                          aria-controls="collapseTen"
                        >
                          How long will it take to receive my order?
                        </button>
                      </h2>
                      <div
                        id="collapseTen"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingTen"
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">
                          Delivery times vary depending on your location and the shipping
                          method selected at checkout. Please refer to our Shipping &amp;
                          Delivery page for estimated delivery times.
                        </div>
                      </div>
                    </div>
                    {/* Add more FAQs as needed */}
                  </div>

                </div>
              </div>
            </div>



          </div>
        </div>

      </div >


      <Footer />
    </>
  )
}

export default AccountSupport