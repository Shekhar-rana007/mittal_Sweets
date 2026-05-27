import React, { useState, useEffect, useContext, Component } from 'react';
import { useBlogContext } from '../../fetchdata/BlogContext';
import Header from '../components/Header'; // Replace this with your Header component
import Footer from '../components/Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { Helmet } from 'react-helmet';
const AllBlogs = () => {

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [Rblogs, setRBlogs] = useState([]);

  const getAllBlogs = async () => {
    try {
      setIsLoading(false);

      const response = await axiosInstance.get('/all-blogs');
      const { success, blogs, message } = response.data;
      console.log(response.data)
      if (success) {
        setBlogs(blogs.reverse());
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
        <title> All Blogs | {window.location.hostname}</title>

      </Helmet>

      <main className="page whitesmoke">
        {/* Header */}
        {/* Header */}
        {/* Blog Title */}
        <div className="py-4" >
          <div className="container d-lg-flex justify-content-between align-items-center py-2">
            <div className="pe-lg-4 text-center text-lg-start">
              <h1 className="h3 mb-0">All Blog</h1>
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

                  <li
                    className="breadcrumb-item text-nowrap active"
                    aria-current="page"
                  >
                    All Blog
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        {/* Blog Title */}
        {/* Blog List */}
        <div className="container ">
          <div className="row g-10 mt-1">
            {/* Blog List */}
            <div className="col-lg-8">
              {/* Article */}
              <article className="row border-bottom pb-8 mb-8">


                {!isLoading ? (
                  <>
                    <div className="row">

                      {Array.from({ length: 4 }).map((_, index) => (

                        <div className="blog-column-end col-md-6 mb-3">
                          <p className="skeleton" style={{ height: 219, borderRadius: 5, aspectRatio: "2/1" }} >  </p>
                          <p className="skeleton" style={{ width: "50%", borderRadius: 5 }} >  </p>
                          <p className="skeleton" style={{ width: "100%", borderRadius: 5 }} >  </p>
                          <p className="skeleton" style={{ width: 100, height: 30, borderRadius: 5 }} >  </p>

                        </div>

                      ))}
                    </div> </>
                ) : (blogs.map(blog => (

                  <>

                    <div className="blog-column-end col-md-6 mb-3" key={blog._id} >
                      {/* Thumbnail */}
                      <Link className="blog-article-thumb mb-3" to={`/blog/${blog._id}`} >
                        <img
                          src={blog.image} style={{ aspectRatio: "2/1", objectFit: "cover" }}
                          className="img-fluid"

                        />
                      </Link>
                      {/* Thumbnail */}
                      {/* Tags */}
                      <div className="d-flex justify-content-between mb-3">
                        <div className="fs-md text-body-secondary p-0">

                          <span> {formatDate(blog.createdAt)} </span>
                          <h4 class="m-0 p-0"> <Link to={`/blog/${blog._id}`} >  {blog.title}  </Link></h4>
                        </div>

                      </div>
                      {/* Tags */}
                      {/* Article Content */}
                      <p className="fs-md">
                        {" "}
                        {blog.metaDescription}
                      </p>
                      {/* Article Content */}
                      {/* Button */}
                      <Link to={`/blog/${blog._id}`} className="btn btn-sm btn-accent" role="button">
                        Read more
                      </Link>
                      {/* Button */}
                    </div >


                  </>

                ))
                )}



              </article>
              {/* Article */}

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

                  {/* <div className="widget border-bottom mx-lg-3 pb-4 mb-4">
                    <h3 className="widget-title">About blog</h3>
                    <p className="mb-0">
                      {" "}
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Possimus, eum? Earum excepturi, itaque odio eveniet omnis nisi
                      quidem suscipit laborum maxime tempore eos dicta laboriosam.{" "}
                    </p>
                  </div> */}


                  {/* <div className="widget widget-links mx-lg-3 pb-4 mb-4">
              <h3 className="widget-title">Categories</h3>
              <ul className="widget-list">
                <li className="widget-list-item border-bottom pb-2">
                  <a
                    className="widget-list-link d-flex justify-content-between align-items-center"
                    href="#"
                  >
                    <span>Shopping</span>
                    <i className="ri-arrow-right-s-line fs-md ms-3" />
                  </a>
                </li>
                <li className="widget-list-item border-bottom pb-2">
                  <a
                    className="widget-list-link d-flex justify-content-between align-items-center"
                    href="#"
                  >
                    <span>Entertainment</span>
                    <i className="ri-arrow-right-s-line fs-md ms-3" />
                  </a>
                </li>
                <li className="widget-list-item border-bottom pb-2">
                  <a
                    className="widget-list-link d-flex justify-content-between align-items-center"
                    href="#"
                  >
                    <span>Technology</span>
                    <i className="ri-arrow-right-s-line fs-md ms-3" />
                  </a>
                </li>
                <li className="widget-list-item border-bottom pb-2">
                  <a
                    className="widget-list-link d-flex justify-content-between align-items-center"
                    href="#"
                  >
                    <span>News</span>
                    <i className="ri-arrow-right-s-line fs-md ms-3" />
                  </a>
                </li>
                <li className="widget-list-item border-bottom pb-2">
                  <a
                    className="widget-list-link d-flex justify-content-between align-items-center"
                    href="#"
                  >
                    <span>Stories</span>
                    <i className="ri-arrow-right-s-line fs-md ms-3" />
                  </a>
                </li>
                <li className="widget-list-item border-bottom pb-2">
                  <a
                    className="widget-list-link d-flex justify-content-between align-items-center"
                    href="#"
                  >
                    <span>Fashion</span>
                    <i className="ri-arrow-right-s-line fs-md ms-3" />
                  </a>
                </li>
                <li className="widget-list-item">
                  <a
                    className="widget-list-link d-flex justify-content-between align-items-center"
                    href="#"
                  >
                    <span>Travel</span>
                    <i className="ri-arrow-right-s-line fs-md ms-3" />
                  </a>
                </li>
              </ul>
            </div> */}

                  {/* Categories */}
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
        </div >
        {/* Blog List*/}
      </main >



      <Footer />

    </>
  );
};

export default AllBlogs;
