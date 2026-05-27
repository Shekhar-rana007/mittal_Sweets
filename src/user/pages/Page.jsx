import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from "react-hot-toast";
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axiosInstance from '../../axiosInstance';

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // 👈 new state
  const [Page, setPage] = useState({});
  const { slug } = useParams();
  const contentRef = useRef(null);

  const getBlog = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/admin/get-page/${slug}`);
      setPage(data.Mpage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDynamicFormSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    // 👇 Find submit button and disable it
    const submitBtn = form.querySelector('button[type="submit"], button:not([type])');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Sending...
      `;
    }

    const formData = {};
    Array.from(form.elements).forEach(el => {
      if (el.name) {
        formData[el.name] = el.value;
      }
    });

    const payload = {
      name:    formData.name    || formData['full-name'] || '',
      email:   formData.email   || '',
      phone:   formData.phone   || '',
      message: formData.requirement || formData.message || '',
      persons: formData.persons || formData.persons || '',
      date: formData.date || formData.date || '',
      time: formData.time || formData.time || '',

    };

    try {
      await axiosInstance.post('/contact-enquire', payload);
      toast.success('Enquiry sent successfully!');
      form.reset();
    } catch (error) {
      console.error('Failed to send enquiry:', error);
      toast.error('Failed to send enquiry');
    } finally {
      // 👇 Restore button after success or error
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Enquiry';
      }
    }
  };

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    container.addEventListener('submit', handleDynamicFormSubmit);
    return () => {
      container.removeEventListener('submit', handleDynamicFormSubmit);
    };
  }, [loading]);

  useEffect(() => {
    getBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <>
      <Header />
      <Helmet>
        <title>{Page.metaTitle}</title>
        <meta name="metaDescription" content={Page.metaDescription} />
      </Helmet>

      <main className="page whitesmoke">
        <div className="py-4">
          <div className="container d-lg-flex justify-content-between align-items-center py-2">
            <div className="pe-lg-4 text-center text-lg-start">
              <h1 className="h3 mb-0">{!loading && Page.title}</h1>
            </div>
            <div className="pt-2 pt-lg-0">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb flex-lg-nowrap justify-content-center justify-content-lg-start">
                  <li className="breadcrumb-item">
                    <Link className="text-nowrap" to="/">
                      <i className="ri-store-2-line" /> Home
                    </Link>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row g-10 pb-5">
            <div className="col-lg-12">
              {!loading ? (
                <>
                  {Page.image && <img src={Page.image} className="d-block w-100" alt={Page.title} />}
                  <br />
                  <div
                    ref={contentRef}
                    dangerouslySetInnerHTML={{ __html: Page.description }}
                  />
                </>
              ) : (
                <h1>Loading....</h1>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Page;