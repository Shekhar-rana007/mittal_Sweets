import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const MyBlogs = () => {

  const [blog, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserBlogs = async () => {
    try {
      const id = localStorage.getItem('userId');
      const { data } = await axiosInstance.get(`/all-blogs}`);
      console.log(id);
      if (data?.success) {
        setBlogs(data?.userBlog.blogs);
      }
      setIsLoading(false); // Set loading state to false after fetching data
    } catch (error) {
      console.log(error);
      setIsLoading(false); // Set loading state to false in case of an error
    }
  };

  useEffect(() => {
    getUserBlogs();
  }, []); // Empty dependency array ensures that the effect runs once after the initial render

  useEffect(() => {
    // This useEffect runs whenever the 'blog' state variable changes
    console.log(blog); // Log the updated 'blog' state
  }, [blog]); // Dependency array with 'blog' ensures the effect runs when 'blog' state changes

  return (
    <>
      <Header />


      <section className="section posts-entry posts-entry-sm bg-light">
        <div className="container">
          <h1>My Blogs</h1>
          <div className="row">

            {isLoading ? (
              // Display loading skeletons while data is being fetched
              Array.from({ length: 4 }).map((_, index) => (
                <div className="col-md-6 col-lg-3" key={index}>

                  <div className="blog-entry mb-4">
                    <div className="skeleton mb-3" style={{ height: 200, borderRadius: 10 }}>

                    </div>

                    <p className="skeleton" style={{ width: 130, borderRadius: 5 }} > </p>
                    <p className="skeleton" style={{ width: 150, borderRadius: 5 }}> </p>
                    <p className="skeleton" style={{ width: 170, borderRadius: 5 }}> </p>
                    <p className="skeleton" style={{ width: 110, borderRadius: 5 }}> </p>
                  </div>


                  <div className="blog-entry mb-4">
                    <div className="skeleton mb-3" style={{ height: 200, borderRadius: 10 }}>

                    </div>

                    <p className="skeleton" style={{ width: 130, borderRadius: 5 }} > </p>
                    <p className="skeleton" style={{ width: 150, borderRadius: 5 }}> </p>
                    <p className="skeleton" style={{ width: 170, borderRadius: 5 }}> </p>
                    <p className="skeleton" style={{ width: 110, borderRadius: 5 }}> </p>
                  </div>


                  <div className="blog-entry mb-4">
                    <div className="skeleton mb-3" style={{ height: 200, borderRadius: 10 }}>

                    </div>

                    <p className="skeleton" style={{ width: 130, borderRadius: 5 }} > </p>
                    <p className="skeleton" style={{ width: 150, borderRadius: 5 }}> </p>
                    <p className="skeleton" style={{ width: 170, borderRadius: 5 }}> </p>
                    <p className="skeleton" style={{ width: 110, borderRadius: 5 }}> </p>
                  </div>


                </div>
              ))
            ) :
              (blog.map(blog => (

                <div className="col-md-6 col-lg-3" key={blog._id}>
                  <div className="blog-entry">
                    <Link to={`/blog/${blog._id}`} className="img-link">
                      <img
                        src={blog.image}
                        className="img-fluid"
                      />
                    </Link>
                    <span className="date">Apr. 14th, 2022</span>
                    <h2>
                      <a href="single.html">
                        {blog.title}
                      </a>
                    </h2>
                    <p>
                      <a href="#" className="read-more">
                        Continue Reading
                      </a>
                    </p>
                  </div>
                </div>
              ))
              )}
          </div>
        </div>
      </section>



      <Footer />


    </>
  )

};

export default MyBlogs;
