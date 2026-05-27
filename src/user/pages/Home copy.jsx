import React, { useRef, useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import axiosInstance from '../../axiosInstance';

// import required modules
import { Pagination, Navigation,Autoplay } from 'swiper/modules';

import banner1 from '../assets_user/img/fullbanner1.webp';
import banner2 from '../assets_user/img/fullbanner2.webp';
import banner3 from '../assets_user/img/fullbanner3.webp';
import banner4 from '../assets_user/img/fullbanner4.webp';

import grid1 from '../assets_user/img/grid1.webp';
import grid2 from '../assets_user/img/grid2.webp';
import grid3 from '../assets_user/img/grid3.webp';
import grid4 from '../assets_user/img/grid4.webp';
import gridslide1 from '../assets_user/img/gridslide1.webp';
import gridslide2 from '../assets_user/img/gridslide2.webp';
import gridslide3 from '../assets_user/img/gridslide3.webp';
import gridslide4 from '../assets_user/img/gridslide4.webp';
import gridslide5 from '../assets_user/img/gridslide5.webp';
import CreateSlug from "../components/extra/CreateSlug";
import { motion } from "framer-motion";

const Home = () => {

  const [blogs, setBlogs] = useState([]);

    const getUserBlogs = async () => {
    try {
 
      const { data } = await axiosInstance.get(`/all-blogs`);
    
      if (data?.success) {
        setBlogs(data?.blogs);
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


  const swiperRefLocal = useRef()

  const handleMouseEnter = () => {
      swiperRefLocal?.current?.swiper?.autoplay?.stop()
  };

  const handleMouseLeave = () => {
      swiperRefLocal?.current?.swiper?.autoplay?.start()
  };


  
  const [ratings, setRatings] = useState([]);

  const [layout, setLayout] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isProducts, setIsProducts] = useState(true);


  const [Products, setProducts] = useState([]);

 


  const getData = async () => {
    try {
   const { data } = await axiosInstance.get(`/home-layout-data`);
      // setLayout(smapledata.homeLayout);
       setLayout(data.homeLayout);
      setIsLoading(false); // Set loading state to false in case of an error
      // console.log('data', data);

    }
    catch (error) {
      console.log(error);
      toast.error("Error fetching Home layout!");
      setIsLoading(false); // Set loading state to false in case of an error
    }
  };

  const SampleRating = {"success":true,"ratings":[]};

  const getRating = async () => {
    try {
      // const { data } = await axiosInstance.get(`/all-rating`);
      // setRatings(data.ratings);
      // console.log('getRating', data)
     setRatings(SampleRating.ratings);
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  useEffect(() => {
    getData();
    getRating();
  }, []);

 

  const getProducts = async () => {
    try {

      const { data } = await axiosInstance.get("/all-home-products");
      console.log("products", data);
      setProducts(data.products);
      // setProducts(sampleHomePro.products);
      
      setIsProducts(false); // Set loading state to false in case of an error
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsProducts(false); // Set loading state to false in case of an error
    }
  };


  useEffect(() => {
    getProducts();

  }, []);


   const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const cards = cardRefs.current;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left; // mouse X inside container
      const y = e.clientY - rect.top;  // mouse Y inside container

      const moveX = (x - rect.width / 2) / 25; // smaller divisor = stronger movement
      const moveY = (y - rect.height / 2) / 25;

      cards.forEach((card) => {
        if (card) {
          card.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      });
    };

    const handleMouseLeave = () => {
      cards.forEach((card) => {
        if (card) {
          card.style.transform = `translate(0, 0)`;
        }
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup event listeners on unmount
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);



  return (

    <>
      <Header />
{layout?.top_bar && 
<div className="bg-dark text-white"> <marquee> {layout.top_bar} </marquee>
</div>}
      <Helmet>
        {Headers && Headers.meta_favicon && (
          <link rel="apple-touch-icon" href={Headers.meta_favicon} />
        )}
        {Headers && Headers.meta_title && (
          <>
            <title>{Headers.meta_title}</title>
            {Headers.meta_description && (
              <meta name="description" content={Headers.meta_description} />
            )}
          </>
        )}
      </Helmet>

      <main className="page whitesmoke">
        {/* Hero Section */}
        <div className="hero hero-swiper d-none"    style={{ width: 1897, maxWidth: '100% ', height: 'auto', aspectRatio: "1897/591" }} >


          {isLoading ? (<>
            <div
              className="skeleton w-100"
              style={{ width: 1897, maxWidth: '100% ', height: 'auto', aspectRatio: "1897/591" }}

            ></div>
          </>) : (

<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>

            <Swiper pagination={true} navigation={true} gap={'30'}  ref={swiperRefLocal}
 autoplay={{
              delay: 1500,
              pauseOnMouseEnter: true,
          }}
          
          loop={true} modules={[Pagination, Navigation,Autoplay]} className="swiper-wrapper" >

              {layout.home_slider && (
                <>
                  {layout.home_slider.map((image, index) => (
                    <SwiperSlide key={index} >

                      <img className="img-fluid w-100"
                        src={image}
                        alt="Product"
                      />
                    </SwiperSlide>

                  ))}
                </>
              )}




            </Swiper>
            </div>

          )}


        </div>
        {/* Hero Section */}

        <section className="overflow-hidden card-container" ref={containerRef} style={{backgroundColor:'rgb(237 207 138 / 10%)'}} >

          <div className="container-none">
            <div className="row">
              <div className="col-md-5 position-relative">

       <div className="rounded-text rotating">
  <svg viewBox="0 0 200 200">
    <path
      id="textPath"
      d="M 85,0 A 85,85 0 0 1 -85,0 A 85,85 0 0 1 85,0"
      transform="translate(100,100)"
      fill="none"
      strokeWidth={0}
    />
    <g fontSize="13.1px">
      <text textAnchor="start">
        <textPath className="coloring" xlinkHref="#textPath" startOffset="0%">
         Easy delivery, dine-in & takeaway ,Access to the complete range of Mittal Sweet & Snacks, Exclusive offers & rewards
        </textPath>
      </text>
    </g>
  </svg>
  
</div>


             <div className="slidemulti "  ref={(el) => (cardRefs.current[1] = el)} >
<img src={layout?.home_slider?.[0] || ''} />
 <img src={layout?.home_slider?.[1] || ''} />

              </div>
              </div>

 <div className="col-md-2 center-slide " id="">
  <div>
    <h1 className="slideheading h2"> 
      <img
  src="/assets/img/sweets-icon.webp"
  style={{ width: 30, display: "block", margin: "auto" }}
/>

Welcome To Mittal Sweet & Snacks </h1>

    <button class="custom-button">
   Learn More
	<div class="button__horizontal"></div>
	<div class="button__vertical"></div>
</button>

  </div> 
              </div>

                  <div className="col-md-5">
                    <div className="slideone">
<img  src={layout?.home_slider?.[2] || ''}   ref={(el) => (cardRefs.current[2] = el)} className="w-100 "  />

                    </div>

              </div>

            </div>
          </div>

        </section>
        <section className="overflow-hidden">
          <div className="container">
 <div className="row">
            <div className="col-md-6">
              <div className="py-4 my-4">
               <img  src={layout?.home_slider?.[3] || ''}    className="w-100 "  />
              </div>
            </div>
              <div className="col-md-5 d-flex align-items-center">
                <div>
                <h4 className="stylefont"> About Our Company </h4>
                <h2 className="h1"> We Create Incredibly Tasty Sweets and Snacks </h2> <br/>
                <p> Our mission is to provide everyone with the finest quality traditional sweets and delicious snacks that bring joy to every occasion. Our goal is to make authentic Indian flavors reach every home and celebrate the richness of our culinary heritage.

                </p>

                <div className="mt-4 pt-4">
<button class="custom-button ">Learn More<div class="button__horizontal"></div><div class="button__vertical"></div></button>
                </div>


                </div>
             </div>
          </div>
          </div>
         
        </section>

        <section className="py-5 startbg d-none" style={{ backgroundColor: "rgb(4 34 88)" }}>
  <div className="container text-white text-center">
    <div className="row gy-4 undergold">
      {/* Loved by India */}
      <div className="col-12 col-md-3">
        <i className="ri-map-pin-2-line display-5 fw-light mb-2" />
        <h5 className="fw-medium mb-1">Loved By India</h5>
        <p className="mb-0">Loved by 5 lakh+ customers</p>
      </div>
      {/* Handmade */}
      <div className="col-12 col-md-3">
        <i className="ri-heart-2-line display-5 fw-light mb-2" />
        <h5 className="fw-medium mb-1">Handmade</h5>
        <p className="mb-0">Every piece is made with love</p>
      </div>
      {/* Ships In 5–7 Days */}
      <div className="col-12 col-md-3">
        <i className="ri-truck-line display-5 fw-light mb-2" />
        <h5 className="fw-medium mb-1">Ships In 5–7 Days</h5>
        <p className="mb-0">Write to us to expedite your order</p>
      </div>
      {/* No Preservatives */}
      <div className="col-12 col-md-3">
        <i className="ri-flask-line display-5 fw-light mb-2" />
        <h5 className="fw-medium mb-1">No Preservatives</h5>
        <p className="mb-0">Pure taste, naturally fresh</p>
      </div>
    </div>
  </div>
</section>


 

<div className="pt-50 pb-50 "   >

 <div className="slider-text-box" style={{marginBottom:'-100px'}}>
      <div className="slidetext text-uppercase">
        <span> exclusive sweets & snacks </span>
        <span> exclusive sweets & snacks </span>
               <span> exclusive sweets & snacks </span>
                      <span> exclusive sweets & snacks </span>
                             <span> exclusive sweets & snacks </span>
      </div>
    </div>        {/* Product Cards */}
        <div className="container pt-0 pt-sm-5">
          {/* Heading */}
          <motion.div  
             initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.5 }}  >

  
          <div className="d-flex flex-wrap justify-content-center align-items-center pt-1   pb-0 mb-0">
           
            <div className="ms-n4">
              {/* <a
                className="btn btn-sm btn-link link-info link-hover-primary d-flex align-items-center bg-btn-new"
                href="#"
              >
                View All
                <i className="ri-arrow-right-line ms-1" />
              </a> */}
            </div>
          </div>
       
                  </motion.div>

          {/* Heading */}
          {/* Product Cards */}
          <div className="row pt-2 mx-n2 hero-swiper hide-desk-arrow">
            {/* Product Card */}
            <Swiper breakpoints={{
              300: {
                slidesPerView: 2,
                spaceBetween: 10, // Set the gap between slides for window width <= 400px
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20, // Set the gap between slides for window width <= 768px
              },
              992: {
                slidesPerView: 4,
                spaceBetween: 25, // Set the gap between slides for window width <= 992px
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 20, // Set the gap between slides for window width <= 1200px
              },
            }}
              pagination={true} modules={[Pagination, Navigation]} className="swiper-wrapper p-0" >



              {isProducts ? (Array.from({ length: 7 }).map((_, index) => (
                <SwiperSlide key={index} >
                  <div
                    className="card-1 skeleton"
                    style={{ height: 371, borderRadius: 10 }}
                  ></div>

                </SwiperSlide>
              ))
              ) : (layout.trending_product && (
                <>
                  {Products
  .filter(product => layout.trending_product.includes(product._id))
  .map((product, index) => (
                      
                      layout.trending_product.includes(product._id) && (<>

                        <SwiperSlide key={index}>

                          <div 
                            
    className="card card-product custompro h-100" index={index}  
      style={{
  paddingTop: (index + 1) % 2 === 0 ? "80px" : undefined
  }}
   >
                            {/* Badges */}
                         
                            {/* Badges */}
                       
                            {/* Buttons */}
                            {/* Preview Image */}
                            <motion.div
                              className="card-img-top d-block flex-shrink-0"
                              
                               initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay:  0.2 + Number('0.'+index) }}
                            >
                              <Link to={`/product/${product.slug}/${product._id}`} className="morehover">
                             
                              <img
                                className="img-fluid"
                                src={product.pImage}
                                alt={` ${product.title} Product Image`}
                              />
                              <p className="viewmore">MORE</p>
                               </Link>
                            </motion.div>
                            {/* Preview Image */}
                            <div className="card-body d-flex flex-column align-items-start flex-grow-1 rounded-bottom h-100 py-3">
                              {/* Product Category */}

                              {/* Product Category */}
                              {/* Product Title */}
                              <motion.h3 
                                  initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay:  0.2 + Number('0.'+index) }}
    className="product-title flex-grow-1 d-flex align-items-end justify-content-between">
                                <Link   to={`/product/${product.slug}/${product._id}`} className="fs-4 fw-medium mt-2 text-dark"> {product.title} </Link>
                             <svg
  xmlns="http://www.w3.org/2000/svg"
  width={24}
  height={24}
  viewBox="0 0 24 24"
  fill="none"
  stroke="#daad45"
  strokeWidth={2}
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M7 17l9.2-9.2M17 17V7H7" />
</svg>


                              </motion.h3>
                              {/* Product Title */}
                
                              {/* Star Rating */}
                              {/* Product Price */}
                              <div className="product-price d-none">
                                <span className="text-danger fs-5">
                                 <b className="fw-medium">  ₹{product.salePrice} </b>
                                  <del className="text-body-secondary ms-1">
                                    <small>₹{product.regularPrice} </small>
                                  </del>
                                </span>
                              </div>
                              {/* Product Price */}
                              {/* Product Meta */}


                              <div className="d-flex gap-2 mb-2">
                         
                             


                             {product?.variations?.length > 0 &&
  product.variations.map((variation) => {

if (variation.name === "Color") {

  return variation.value.map((value, idx) => {
    const firstVisibleProduct = product.variant_products.find(product => product.Color === value && product.images.length !== 0 ) ;
    const firstImage = firstVisibleProduct?.images[0].src;
    const visibleVariant = product.variant_products.find(variant => variant.visible);

     return  (
      <button key={idx} className="border-none p-0 rounded-circle">
      <img src={firstImage} className="rounded-circle"  title={value} style={{
objectFit: "cover !important",
aspectRatio: "1/1",
width: 35
}}  onClick={(event) => {
  const productImage = event.target.closest('.card-product').querySelector('.card-img-top img');
  const visibleVariantSale = event.target.closest('.card-product').querySelector('.product-price span b');
  const visibleVariantRegular = event.target.closest('.card-product').querySelector('.product-price span del');

  if(visibleVariantSale){
    visibleVariantSale.innerText  = `₹${firstVisibleProduct.sale_price}`
  }
  if(visibleVariantRegular){
    visibleVariantRegular.innerText  = `₹${firstVisibleProduct.regular_price}`
  }
  if (productImage) {
    productImage.src = firstImage;
  }
}}

onLoad={(event) => {
 
  const visibleVariantSale = event.target.closest('.card-product').querySelector('.product-price span b');
  const visibleVariantRegular = event.target.closest('.card-product').querySelector('.product-price span del');

  if(visibleVariantSale){
    visibleVariantSale.innerText  = `₹${visibleVariant.sale_price}`
  }
  if(visibleVariantRegular){
    visibleVariantRegular.innerText  = `₹${visibleVariant.regular_price}`
  }
 
}} 

/> </button>
  )});
} else {
  return null; // If the name is not "Color", don't render anything
}
})}

  </div>

                              <span className="product-meta text-body-secondary fs-xs">
                                {" "}
                                {product.stock === 0 ? (
                                  <span className="text-danger" >Out of stock</span>
                                ) : product.stock <= 10 ? (
                                  <span>Only {product.stock} left in stock</span>
                                ) : (
                                  <></>
                                )}
                              </span>
                              {/* Product Meta */}
                            </div>
                            {/* Product Addon */}

                            {/* Product Addon */}
                          </div>
                          {/* Product Cards */}

                        </SwiperSlide>

                      </>)


                    ))} 
 
                </>
              )
              )}




            </Swiper >

          </div>
          {/* Product Cards */}
        </div>
        {/* Product Cards */}
</div>


        <div className=" pt-0 pt-sm-5 d-none">

          <div className=" py-0">

            {isLoading ? (<>
              <div
                className="skeleton "
                style={{ height: 380, borderRadius: 10 }}
              ></div>  <div
                className=" skeleton "
                style={{ height: 380, borderRadius: 10 }}
              ></div>
            </>) : (layout.trending_product_banner && (
              <>

                {layout.trending_product_banner.map((banner, index) => (

                  <Link class="w-100" key={index} to={banner.imageUrlInput} >
                    <img src={banner.imageInput} className="w-100 rounded" />
                  </Link>
                ))}
              </>
            )
            )}

          </div>
</div>


        <div className="container  pt-50 pb-50 d-none "> 
          <div className="row mt-4 pt-2 mx-n2 hero-swiper ">
            <Swiper breakpoints={{
              300: {
                slidesPerView: 2,
                spaceBetween: 10, // Set the gap between slides for window width <= 400px
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20, // Set the gap between slides for window width <= 768px
              },
              992: {
                slidesPerView: 4,
                spaceBetween: 25, // Set the gap between slides for window width <= 992px
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 25, // Set the gap between slides for window width <= 1200px
              },
            }}
              navigation={false} pagination={true} modules={[Pagination, Navigation]} className="swiper-wrapper" >


              {isLoading ? (Array.from({ length: 7 }).map((_, index) => (
                <SwiperSlide key={index} >
                  <div
                    className="card-1 skeleton"
                    style={{ height: 355, borderRadius: 10 }}
                  ></div>

                </SwiperSlide>
              ))
              ) : (layout.trending_product_carousal && (
                <>

                  {layout.trending_product_carousal.map((carousal, index) => (

                    <SwiperSlide key={index}>
                      <Link to={carousal.imageUrlInput}  >
                        <motion.img     initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay:  0.2 + Number('0.'+index) }}
     src={carousal.imageInput} className="w-100 rounded" />
                      </Link>

                    </SwiperSlide>

                  ))}
                </>
              )
              )}



            </Swiper>

          </div>

        </div>

<br/>

 
 
<div    className="mt-0 startbg"> 
        {/* Banner */}
        <div className="container py-4 py-lg-0">
          <div className="row ">

            {isLoading ? (<>
              <div
                className="col skeleton "
                style={{ height: 380, borderRadius: 10 }}
              ></div>
            </>) : (layout.latest_product_banner && (
              <>

                <div className="col ">
                  <div
                    className="row justify-content-between align-items-center overflow-hidden border rounded-1 customborder py-4 my-4"
                   
                  >
                    <div className="col-md-6">

                   <div className="py-4 my-4 my-md-0   px-4 ms-md-3 text-center text-sm-start ">
                      {/* <h6 className="fs-xs text-accent text-uppercase mb-2">
                        Weekend Discount
                      </h6> */}
                      <h2 className="fw-medium mb-4 h1">{layout.collection_heading || ''}</h2>
                      <p className=" text-dark">
                        {layout.collection_paragraph || ''}  


                      </p>
                      {/* <Link className="btn btn-shadow" style={{backgroundColor:'#333333',color:'#FFE1E1'}} to={layout.collection_url || ''}>
                        Shop Now
                      </Link> */}

                      <div className="mt-4 pt-4">
                        <button class="custom-button "> <Link to={layout.collection_url || ''} > Shop Now </Link> <div class="button__horizontal"></div><div class="button__vertical"></div></button>
                      </div>
                    </div>

                    </div>
                   
                    <div className="col-md-5 ms-auto">
                     <img
                      className="w-100 my-4"
                      src={layout.collection_img || ''}
                      alt="Shop Converse"
                      width={'100%'} 
                      style={{transform:'scale(1.1) rotatey(180deg) translateX(-40px)'}}
                    />
                    </div>
                   
                  </div>
                </div>
              </>
            )
            )}



          </div>
        </div>
        {/* Banner */}
</div>



        {/* Product Cards */}
        <div className="container pt-0 pt-sm-5 d-none">
          {/* Heading */}
          <div className="d-flex flex-wrap justify-content-between align-items-center pt-1 border-bottom pb-4 mb-4">
            <h2 className="h3 mb-0 me-2">Latest products</h2>
            <div className="ms-n4">
              {/* <a
                className="btn btn-sm btn-link link-info link-hover-primary d-flex align-items-center bg-btn-new"
                href="#"
              >
                View All
                <i className="ri-arrow-right-line ms-1" />
              </a> */}
            </div>
          </div>
          {/* Heading */}
          {/* Product Cards */}


          <div className="row pt-2 mx-n2 hero-swiper hide-desk-arrow">
            {/* Product Card */}
            <Swiper breakpoints={{
              300: {
                slidesPerView: 2,
                spaceBetween: 10, // Set the gap between slides for window width <= 400px
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20, // Set the gap between slides for window width <= 768px
              },
              992: {
                slidesPerView: 3,
                spaceBetween: 25, // Set the gap between slides for window width <= 992px
              },
              1200: {
                slidesPerView: 5,
                spaceBetween: 25, // Set the gap between slides for window width <= 1200px
              },
            }}
              pagination={true} navigation={true} modules={[Pagination, Navigation]} className="swiper-wrapper" >



              {isProducts ? (Array.from({ length: 7 }).map((_, index) => (
                <SwiperSlide key={index} >
                  <div
                    className="card-1 skeleton"
                    style={{ height: 371, borderRadius: 10 }}
                  ></div>

                </SwiperSlide>
              ))
              ) : (layout.latest_product && (
                <>
                  {Products.map((product, index) => {
                    const productRatings = ratings.filter(rating => rating.productId === product._id);
                    const totalRatings = productRatings.length;
                    const totalRatingValue = productRatings.reduce((acc, curr) => acc + curr.rating, 0);
                    const averageRating = totalRatings > 0 ? totalRatingValue / totalRatings : 0;
                    const myslug = CreateSlug(product.slug);

                    return (
                      layout.latest_product.includes(product._id) && (<>

<SwiperSlide key={index}>

<div className="card card-product custompro h-100">
  {/* Badges */}

  {/* Badges */}
  {/* Buttons */}
  <div className="product-buttons">
    <button
      className="btn-product btn-wishlist"
      type="button"
      data-bs-toggle="button"
      title="Add to wishlist"
    >
      <i className="ri-heart-line" />
    </button>
    <a
      className="btn-product btn-compare"
      href="#"
      title="Compare product"
    >
      <i className="ri-repeat-line" />
    </a>
    <a
      className="btn-product btn-view"
      href="#modal-quick-view"
      data-bs-toggle="modal"
      title="Quick preview"
    >
      <i className="ri-eye-line" />
    </a>
  </div>
  {/* Buttons */}
  {/* Preview Image */}
  <Link
    className="card-img-top d-block flex-shrink-0"
    to={`/product/${myslug}/${product._id}`}
  >
    <img
      className="img-fluid"
      src={product.pImage}
      alt={` ${product.title} Product Image`}
    />
  </Link>
  {/* Preview Image */}
  <div className="card-body d-flex flex-column align-items-start flex-grow-1 rounded-bottom h-100 py-3">
    {/* Product Category */}

    {/* Product Category */}
    {/* Product Title */}
    <h3 className="product-title flex-grow-1">
      <Link   to={`/product/${myslug}/${product._id}`} > {product.title} </Link>
    </h3>
    {/* Product Title */}
    {/* Star Rating */}
    <span className={`star-rating star-${Math.round(averageRating) * 2}`} />

    {/* Star Rating */}
    {/* Product Price */}
    <div className="product-price">
      <span className="text-danger fs-5">
       <b className="fw-medium">  ₹{product.salePrice} </b>
        <del className="text-body-secondary ms-1">
          <small>₹{product.regularPrice} </small>
        </del>
      </span>
    </div>
    {/* Product Price */}
    {/* Product Meta */}


    <div className="d-flex gap-2 mb-2">

   


  {product?.variations?.length > 0 &&
  product.variations.map((variation) => {

if (variation.name === "Color") {

return variation.value.map((value, idx) => {
const firstVisibleProduct = product.variant_products.find(product => product.Color === value && product.images.length !== 0 ) ;
const firstImage = firstVisibleProduct?.images[0].src;
const visibleVariant = product.variant_products.find(variant => variant.visible);

return  (
<button key={idx} className="border-none p-0 rounded-circle">
<img src={firstImage} className="rounded-circle"  title={value} style={{
objectFit: "cover !important",
aspectRatio: "1/1",
width: 35
}}  onClick={(event) => {
const productImage = event.target.closest('.card-product').querySelector('.card-img-top img');
const visibleVariantSale = event.target.closest('.card-product').querySelector('.product-price span b');
const visibleVariantRegular = event.target.closest('.card-product').querySelector('.product-price span del');

if(visibleVariantSale){
visibleVariantSale.innerText  = `₹${firstVisibleProduct.sale_price}`
}
if(visibleVariantRegular){
visibleVariantRegular.innerText  = `₹${firstVisibleProduct.regular_price}`
}
if (productImage) {
productImage.src = firstImage;
}
}}

onLoad={(event) => {

const visibleVariantSale = event.target.closest('.card-product').querySelector('.product-price span b');
const visibleVariantRegular = event.target.closest('.card-product').querySelector('.product-price span del');

if(visibleVariantSale){
visibleVariantSale.innerText  = `₹${visibleVariant.sale_price}`
}
if(visibleVariantRegular){
visibleVariantRegular.innerText  = `₹${visibleVariant.regular_price}`
}

}} 

/> </button>
)});
} else {
return null; // If the name is not "Color", don't render anything
}
})}

</div>

    <span className="product-meta text-body-secondary fs-xs">
      {" "}
      {product.stock === 0 ? (
        <span className="text-danger" >Out of stock</span>
      ) : product.stock <= 10 ? (
        <span>Only {product.stock} left in stock</span>
      ) : (
        <></>
      )}
    </span>
    {/* Product Meta */}
  </div>
  {/* Product Addon */}

  {/* Product Addon */}
</div>
{/* Product Cards */}

</SwiperSlide>


                      </>)


                    )
                  })}




                </>
              )
              )}




            </Swiper >

          </div>


          {/* Product Cards */}
        </div>
        {/* Product Cards */}

<div className="d-none">

        <div className="container pt-0 pt-sm-5">

          <div className="row g-3 py-0">

            {isLoading ? (<>
              <div
                className="col-md-12 skeleton "
                style={{ height: 380, borderRadius: 10 }}
              ></div>  <div
                className="col-md-12 skeleton "
                style={{ height: 380, borderRadius: 10 }}
              ></div>
            </>) : (layout.latest_product_banner && (
              <>

                {layout.latest_product_banner.map((banner, index) => (

                  <Link class="col-12" key={index} to={banner.imageUrlInput} >
                    <img src={banner.imageInput} className="w-100 rounded" />
                  </Link>
                ))}
              </>
            )
            )}

          </div>

      

        </div>

</div>

<br/>
      

      <div className="pt-50 pb-50 "   >

 <div className="slider-text-box" style={{marginBottom:'-100px'}}>
      <div className="slidetext text-uppercase">
        <span> exclusive sweets & snacks </span>
        <span> exclusive sweets & snacks </span>
               <span> exclusive sweets & snacks </span>
                      <span> exclusive sweets & snacks </span>
                             <span> exclusive sweets & snacks </span>
      </div>
    </div>        {/* Product Cards */}
        <div className="container pt-0 pt-sm-5">
          {/* Heading */}
          <motion.div  
             initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.5 }}  >

  
          <div className="d-flex flex-wrap justify-content-center align-items-center pt-1   pb-0 mb-0">
           
            <div className="ms-n4">
              {/* <a
                className="btn btn-sm btn-link link-info link-hover-primary d-flex align-items-center bg-btn-new"
                href="#"
              >
                View All
                <i className="ri-arrow-right-line ms-1" />
              </a> */}
            </div>
          </div>
       
                  </motion.div>

          {/* Heading */}
          {/* Product Cards */}
    
          <div className="row pt-2 mx-n2 hero-swiper hide-desk-arrow">
            {/* Product Card */}
            <Swiper breakpoints={{
              300: {
                slidesPerView: 2,
                spaceBetween: 10, // Set the gap between slides for window width <= 400px
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20, // Set the gap between slides for window width <= 768px
              },
              992: {
                slidesPerView: 4,
                spaceBetween: 25, // Set the gap between slides for window width <= 992px
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 20, // Set the gap between slides for window width <= 1200px
              },
            }}
              pagination={true} modules={[Pagination, Navigation]} className="swiper-wrapper p-0" >



              {isProducts ? (Array.from({ length: 7 }).map((_, index) => (
                <SwiperSlide key={index} >
                  <div
                    className="card-1 skeleton"
                    style={{ height: 371, borderRadius: 10 }}
                  ></div>

                </SwiperSlide>
              ))
              ) : (layout.best_selling_laptop && (
                <>
                  {Products
  .filter(product => layout.best_selling_laptop.includes(product._id))
  .map((product, index) => (
                      
                      layout.best_selling_laptop.includes(product._id) && (<>

                        <SwiperSlide key={index}>

                          <div 
                            
    className="card card-product custompro h-100" index={index}  
      style={{
  paddingTop: (index + 1) % 2 === 0 ? "80px" : undefined
  }}
   >
                            {/* Badges */}
                         
                            {/* Badges */}
                       
                            {/* Buttons */}
                            {/* Preview Image */}
                            <motion.div
                              className="card-img-top d-block flex-shrink-0"
                              
                               initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay:  0.2 + Number('0.'+index) }}
                            >
                              <Link to={`/product/${product.slug}/${product._id}`} className="morehover">
                             
                              <img
                                className="img-fluid"
                                src={product.pImage}
                                alt={` ${product.title} Product Image`}
                              />
                              <p className="viewmore">MORE</p>
                               </Link>
                            </motion.div>
                            {/* Preview Image */}
                            <div className="card-body d-flex flex-column align-items-start flex-grow-1 rounded-bottom h-100 py-3">
                              {/* Product Category */}

                              {/* Product Category */}
                              {/* Product Title */}
                              <motion.h3 
                                  initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay:  0.2 + Number('0.'+index) }}
    className="product-title flex-grow-1 d-flex align-items-end justify-content-between">
                                <Link   to={`/product/${product.slug}/${product._id}`} className="fs-4 fw-medium mt-2 text-dark"> {product.title} </Link>
                             <svg
  xmlns="http://www.w3.org/2000/svg"
  width={24}
  height={24}
  viewBox="0 0 24 24"
  fill="none"
  stroke="#daad45"
  strokeWidth={2}
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M7 17l9.2-9.2M17 17V7H7" />
</svg>


                              </motion.h3>
                              {/* Product Title */}
                
                              {/* Star Rating */}
                              {/* Product Price */}
                              <div className="product-price d-none">
                                <span className="text-danger fs-5">
                                 <b className="fw-medium">  ₹{product.salePrice} </b>
                                  <del className="text-body-secondary ms-1">
                                    <small>₹{product.regularPrice} </small>
                                  </del>
                                </span>
                              </div>
                              {/* Product Price */}
                              {/* Product Meta */}


                              <div className="d-flex gap-2 mb-2">
                         
                             


                             {product?.variations?.length > 0 &&
  product.variations.map((variation) => {

if (variation.name === "Color") {

  return variation.value.map((value, idx) => {
    const firstVisibleProduct = product.variant_products.find(product => product.Color === value && product.images.length !== 0 ) ;
    const firstImage = firstVisibleProduct?.images[0].src;
    const visibleVariant = product.variant_products.find(variant => variant.visible);

     return  (
      <button key={idx} className="border-none p-0 rounded-circle">
      <img src={firstImage} className="rounded-circle"  title={value} style={{
objectFit: "cover !important",
aspectRatio: "1/1",
width: 35
}}  onClick={(event) => {
  const productImage = event.target.closest('.card-product').querySelector('.card-img-top img');
  const visibleVariantSale = event.target.closest('.card-product').querySelector('.product-price span b');
  const visibleVariantRegular = event.target.closest('.card-product').querySelector('.product-price span del');

  if(visibleVariantSale){
    visibleVariantSale.innerText  = `₹${firstVisibleProduct.sale_price}`
  }
  if(visibleVariantRegular){
    visibleVariantRegular.innerText  = `₹${firstVisibleProduct.regular_price}`
  }
  if (productImage) {
    productImage.src = firstImage;
  }
}}

onLoad={(event) => {
 
  const visibleVariantSale = event.target.closest('.card-product').querySelector('.product-price span b');
  const visibleVariantRegular = event.target.closest('.card-product').querySelector('.product-price span del');

  if(visibleVariantSale){
    visibleVariantSale.innerText  = `₹${visibleVariant.sale_price}`
  }
  if(visibleVariantRegular){
    visibleVariantRegular.innerText  = `₹${visibleVariant.regular_price}`
  }
 
}} 

/> </button>
  )});
} else {
  return null; // If the name is not "Color", don't render anything
}
})}

  </div>

                              <span className="product-meta text-body-secondary fs-xs">
                                {" "}
                                {product.stock === 0 ? (
                                  <span className="text-danger" >Out of stock</span>
                                ) : product.stock <= 10 ? (
                                  <span>Only {product.stock} left in stock</span>
                                ) : (
                                  <></>
                                )}
                              </span>
                              {/* Product Meta */}
                            </div>
                            {/* Product Addon */}

                            {/* Product Addon */}
                          </div>
                          {/* Product Cards */}

                        </SwiperSlide>

                      </>)


                    ))} 
 
                </>
              )
              )}




            </Swiper >

          </div>
       
          {/* Product Cards */}
        </div>
        {/* Product Cards */}
</div>



<br/>
 
<div   className="pt-50 pb-50 d-none">
  <div className="container">

    <div className="row mt-4 pt-2 mx-n2 hero-swiper " >
            <Swiper breakpoints={{
              300: {
                slidesPerView: 2,
                spaceBetween: 10, // Set the gap between slides for window width <= 400px
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20, // Set the gap between slides for window width <= 768px
              },
              992: {
                slidesPerView: 3,
                spaceBetween: 25, // Set the gap between slides for window width <= 992px
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 25, // Set the gap between slides for window width <= 1200px
              },
            }}
              navigation={false} pagination={true} modules={[Pagination, Navigation]} className="swiper-wrapper" >


              {isLoading ? (Array.from({ length: 7 }).map((_, index) => (
                <SwiperSlide key={index} >
                  <div
                    className="card-1 skeleton"
                    style={{ height: 355, borderRadius: 10 }}
                  ></div>

                </SwiperSlide>
              ))
              ) : (layout.latest_product_carousal && (
                <>

                  {layout.latest_product_carousal.map((carousal, index) => (

                    <SwiperSlide key={index}>
                      <Link to={carousal.imageUrlInput}  >
                        <img src={carousal.imageInput} className="w-100 rounded" />
                      </Link>

                    </SwiperSlide>

                  ))}
                </>
              )
              )}



            </Swiper>

          </div>

  </div>
</div>




        {/* Brand Slider */}

        {/* <div className="barnd-logos py-4 py-lg-10">
    <div className="container">
      <div className="row">
        
        <div className="barnd-swiper">

        <Swiper     breakpoints={{
    300: {
      slidesPerView: 2,
      spaceBetween: 10,  
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,  
    },
    992: {
      slidesPerView: 3,
      spaceBetween: 25,  
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 25,  
    },
  }} className="swiper-wrapper" >
           <SwiperSlide>
           <a className="d-block bg-white py-4 py-sm-3 px-2" href="#">
                    <img
                      className="d-block mx-auto"
                      src="/assets/front_img/shop/brands/01.png"
                      style={{ width: 165 }}
                      alt="Brand Logo"
                    />
                  </a>
           </SwiperSlide>

           <SwiperSlide>
           <a className="d-block bg-white py-4 py-sm-3 px-2" href="#">
                    <img
                      className="d-block mx-auto"
                      src="/assets/front_img/shop/brands/02.png"
                      style={{ width: 165 }}
                      alt="Brand Logo"
                    />
                  </a>
           </SwiperSlide>

           <SwiperSlide>
           <a className="d-block bg-white py-4 py-sm-3 px-2" href="#">
                    <img
                      className="d-block mx-auto"
                      src="/assets/front_img/shop/brands/03.png"
                      style={{ width: 165 }}
                      alt="Brand Logo"
                    />
                  </a>
           </SwiperSlide>

           <SwiperSlide>
           <a className="d-block bg-white py-4 py-sm-3 px-2" href="#">
                    <img
                      className="d-block mx-auto"
                      src="/assets/front_img/shop/brands/04.png"
                      style={{ width: 165 }}
                      alt="Brand Logo"
                    />
                  </a>
           </SwiperSlide>


           <SwiperSlide>
           <a className="d-block bg-white py-4 py-sm-3 px-2" href="#">
                    <img
                      className="d-block mx-auto"
                      src="/assets/front_img/shop/brands/05.png"
                      style={{ width: 165 }}
                      alt="Brand Logo"
                    />
                  </a>
           </SwiperSlide>

           <SwiperSlide>
           <a className="d-block bg-white py-4 py-sm-3 px-2" href="#">
                    <img
                      className="d-block mx-auto"
                      src="/assets/front_img/shop/brands/06.png"
                      style={{ width: 165 }}
                      alt="Brand Logo"
                    />
                  </a>
           </SwiperSlide>

           <SwiperSlide>
           <a className="d-block bg-white py-4 py-sm-3 px-2" href="#">
                    <img
                      className="d-block mx-auto"
                      src="/assets/front_img/shop/brands/07.png"
                      style={{ width: 165 }}
                      alt="Brand Logo"
                    />
                  </a>
           </SwiperSlide>


           <SwiperSlide>
           <a className="d-block bg-white py-4 py-sm-3 px-2" href="#">
                    <img
                      className="d-block mx-auto"
                      src="/assets/front_img/shop/brands/08.png"
                      style={{ width: 165 }}
                      alt="Brand Logo"
                    />
                  </a>
           </SwiperSlide>



           </Swiper >



        </div>

      </div>
    </div>
  </div> */}

        {/* Brand Slider */}


        {/* Product Widgets */}

        {/* Product Widgets */}
<div className="bg-white pt-50 b-50 border-top">

<div className="container " >
  <h2 className="text-uppercase mb-50 text-center"> our latest blogs </h2>
 
 <div className="row col-md-11 mx-auto">
  {blogs.map((blog) => (
    <div className="col-md-4 mb-3" key={blog._id}>
     
      <Link to={`/blog/${blog._id}`} className="abutton"> <img
        src={blog.image}
        alt={blog.title}
        className="w-100"
        style={{aspectRatio:'1/1',objectFit:'cover'}}
      />

      <h4 className="mt-3">{blog.title}</h4>  </Link>

      <Link to={`/blog/${blog._id}`} className="abutton">
        READ MORE
      </Link>
    </div>
  ))}
</div>


</div>
<div className="text-center mt-50 ">
  <button class="custom-button mx-auto"  > <Link to="/allblogs"> All Blogs</Link><div class="button__horizontal"></div><div class="button__vertical"></div></button>
</div>
 
</div>

        <img src="https://wgl-dsites.net/estiene/wp-content/uploads/2023/02/homepage_1-6.jpg" />
      </main>


      <Footer />

    </>
  )
}

export default Home