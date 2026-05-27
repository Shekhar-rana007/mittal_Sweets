import React, { useState, useEffect, useContext, Component } from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";
import { Helmet } from 'react-helmet';
import Header from '../components/Header'
import Footer from '../components/Footer';
import axiosInstance from '../../axiosInstance';

const Blog = () => {

  const [blog, setBlog] = useState({});
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [Rblogs, setRBlogs] = useState([]);

  const getBlog = async () => {
    try {
      const { data } = await axiosInstance.get(`/get-blog/${slug}`);
      setBlog(data.blog);

      // Delay the execution of buildScript by 1 secon

    }
    catch (error) {
      console.log(error);
      // toast.error("Error fetching Single Blog!");
    }
  };

  const getAllBlogs = async () => {
    try {
      setIsLoading(false);
      const response = await axiosInstance.get('/all-blogs');
      const { success, blogs, message } = response.data;
      console.log(response.data)
      if (success) {
        setRBlogs(blogs.reverse().slice(0, 8))
      } else {
        console.error('Error fetching blogs:', message);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(true);
    }

  };


  useEffect(() => {
    getBlog();
    getAllBlogs();
  }, []); // Empty dependency array ensures that the effect runs once after the initial render

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }


  return (
    <>
      <Header />
      <Helmet>
        <title>{blog.metaTitle}</title>
        <meta name="metaDescription" content={blog.title} />

      </Helmet>



      <main className="page whitesmoke">
        {/* Header */}
        {/* Header */}
        {/* Blog Title */}
        <div className="py-4" >
          <div className="container d-lg-flex justify-content-between align-items-center py-2">
            <div className="pe-lg-4 text-center text-lg-start">
              <h1 className="h3 mb-0"> {blog.title} </h1>
            </div>
            <div className="pt-2 pt-lg-0">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb flex-lg-nowrap justify-content-center justify-content-lg-start">
                  <li className="breadcrumb-item">
                    <Link
                      className="text-nowrap"
                      to="/"
                      previewlistener="true"
                    >
                      <i className="ri-store-2-line" /> Home{" "}
                    </Link>
                  </li>


                  <li className="breadcrumb-item  text-nowrap">
                    <Link
                      className="text-nowrap"
                      to="/allblogs"
                      previewlistener="true"
                    >
                      All Blogs
                    </Link>
                  </li>


                </ol>
              </nav>
            </div>
          </div>
        </div>
        {/* Blog Title */}
        {/* Blog List */}
        <div className="container ">
          <div className="row g-10 pt-4 mt-2">
            {/* Blog List */}
            <div className="col-lg-8">
              {/* Article */}
              <img src={blog.image} className="d-block w-100" />
              <br>
              </br>

              <div dangerouslySetInnerHTML={{ __html: blog.description }} />


            </div>
            {/* Blog List */}
            {/* Sidebar */}
            <aside className="col-lg-4">
              {/* Offcanvas */}
              <div
                className="offcanvas offcanvas-collapse offcanvas-end border-start"
                id="blog-sidebar"
              >
                <div className="offcanvas-header align-items-center shadow-sm">
                  <h2 className="h5 mb-0">Sidebar</h2>
                  <button
                    className="btn-close ms-auto"
                    type="button"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  />
                </div>
                <div className="offcanvas-body py-lg-1 px-lg-4">
                  {/* Search */}
                  {/* Search */}

                  {/* Recent Posts */}


                  <div className="widget border-bottom mx-lg-3 pb-4 mb-4">
                    {/* Title */}
                    <h3 className="widget-title">Recent posts</h3>
                    {/* Title */}
                    {/* Post */}




                    {!isLoading ? (
                      <>
                        <div className="row">

                          {Array.from({ length: 4 }).map((_, index) => (

                            <div className="blog-column-end col-md-12 mb-3">
                              <div className="row">
                                <div className="col-md-2 p-0">
                                  <p className="skeleton" style={{ height: 50, borderRadius: 5, width: '100%' }} >  </p>

                                </div>

                                <div className="col-md-10">
                                  <p className="skeleton p-0 mb-2" style={{ height: 20, width: '100%', borderRadius: 5, lineHeight: 0 }} >  </p>
                                  <p className="skeleton" style={{ width: '30%', height: 20, borderRadius: 5, aspectRatio: "2/1" }} >  </p>

                                </div>

                              </div>

                            </div>


                          ))}
                        </div> </>
                    ) : (Rblogs.map(blog => (

                      <>

                        <div className="d-flex align-items-center mb-4" key={blog._id}>
                          <Link className="flex-shrink-0" to={`/blog/${blog._id}`}  >
                            <img
                              src={blog.image} style={{ aspectRatio: "2/1.5", objectFit: "cover", width: 64 }}
                              className="img-fluid"

                            />
                          </Link>
                          <div className="ps-4">
                            <h6 className="blog-article-title fs-sm mb-0">
                              <Link to={`/blog/${blog._id}`} > {blog.title}</Link>
                            </h6>
                            <span className="fs-ms text-body-secondary">{formatDate(blog.createdAt)}</span>
                          </div>
                        </div>




                      </>

                    ))
                    )}




                    {/* Post */}

                  </div>


                  {/* Recent Posts*/}
                  {/* Tags */}
                  {/* Tags*/}
                </div>
              </div>
              {/* Offcanvas */}
            </aside>
            {/* Sidebar */}
          </div>
        </div>
        {/* Blog List*/}
      </main >




      <div
        className="site-cover site-cover-sm same-height overlay single-page d-none"
        style={{ backgroundImage: `url("${blog.image}")` }}
      > {blog.title}
        <div className="container">
          <div className="row same-height justify-content-center">
            <div className="col-md-6">
              <div className="post-entry text-center">
                <h1 className="mb-4">    {blog.title}</h1>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section d-none">

        <div className="container">

          <div dangerouslySetInnerHTML={{ __html: blog.description }} />


        </div>

      </div>

      <Footer />
    </>

  )
}

export default Blog