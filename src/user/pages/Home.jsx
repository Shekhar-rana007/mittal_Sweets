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
import { useBlogContext } from '../../fetchdata/BlogContext';

const Home = () => {
  const { Headers } = useBlogContext();
  const defaultHomeHighlights = [ 
  ];
  const homeHighlights =
    Array.isArray(Headers?.home_highlights) && Headers.home_highlights.length
      ? Headers.home_highlights
      : defaultHomeHighlights;
  const getHighlightValue = (item, field, fallback = "") => {
    const value = item && typeof item === "object" ? item[field] : "";
    return typeof value === "string" ? value : fallback;
  };
  const getThemeString = (field) => {
    const value = Headers && typeof Headers === "object" ? Headers[field] : "";
    return typeof value === "string" ? value : "";
  };
  const metaFavicon = getThemeString("meta_favicon");
  const metaTitle = getThemeString("meta_title");
  const metaDescription = getThemeString("meta_description");

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

 


  
  const isMobileScreen = () => {
  return window.innerWidth <= 768; // you can adjust breakpoint (768px = Bootstrap's md)
};
  const [isMobile, setIsMobile] = useState(isMobileScreen());

  useEffect(() => {
    const handleResize = () => setIsMobile(isMobileScreen());
    window.addEventListener("resize", handleResize);

    // Cleanup listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  return (

    <>
      <Header />
{layout?.top_bar && 
<div className="bg-dark text-white"> <marquee> {layout.top_bar} </marquee>
</div>}
      <Helmet>
        {metaFavicon && (
          <link rel="apple-touch-icon" href={metaFavicon} />
        )}
        {metaTitle && (
          <title>{metaTitle}</title>
        )}
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
      </Helmet>

      <main className="page whitesmoke">

          {/* Hero Section */}
                <div className="hero hero-swiper "    style={{ width: '100% ', maxWidth: '100% ', height: 'auto',  aspectRatio: isMobile ? "800/1000" : "1897/591" }} >
        
        
              {isLoading ? (
  <>
    <div
      className="skeleton w-100"
      style={{
        width: "100%",
        maxWidth: "100%",
        height: "auto",
        aspectRatio: isMobile ? "800/1000" : "1897/591",
      }}
    ></div>
  </>
) : (
 <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
  <Swiper
    ref={swiperRefLocal}
    pagination={true}
    navigation={true}
    gap={"30"}
    autoplay={{
      delay: 2000,
      pauseOnMouseEnter: true,
    }}
    loop={true}
    modules={[Pagination, Navigation, Autoplay]}
    className="swiper-wrapper"
  >
    {layout.home_slider &&
      layout.home_slider
        // ODD for desktop, EVEN for mobile
        .filter((_, index) =>
          !isMobile ? index % 2 === 0 : index % 2 === 1
        )
        .map((image, index) => (
          <SwiperSlide key={index}>
            <img
              className="img-fluid w-100"
              src={image}
              alt="Product"
            />
          </SwiperSlide>
        ))}
  </Swiper>
</div>
)}

        
        
                </div>
 
 
  {/* <section className="py-5 startbg" style={{ backgroundColor: "rgb(4 34 88)" }}>
    <div className="container text-white text-center">
      <div className="row gy-4 undergold">
        {homeHighlights.slice(0, 4).map((item, index) => {
          const fallbackItem = defaultHomeHighlights[index] || {};
        const icon = getHighlightValue(item, "icon", fallbackItem.icon || "ri-star-line");
        const title = getHighlightValue(item, "title", fallbackItem.title || "");
        const description = getHighlightValue(item, "description", fallbackItem.description || "");

        return (
        <div className=" col-md-3 col-6" key={index}>
          <i className={`${icon} display-5 fw-light mb-2 fs-sm-5`} />
          <h5 className="fw-medium mb-1 fs-sm-6">{title}</h5>
          <p className="mb-0 fs-sm-6 d-none d-md-block">{description}</p>
        </div>
        );
      })}
    </div>
  </div>
</section> */}
 

    <section className="py-5 startbg d-none" style={{ backgroundColor: "rgb(4 34 88)" }}>
  <div className="container text-white text-center">
    <div className="row gy-4 undergold">
      {/* Loved by India */}
      <div className=" col-md-3 col-6">
        <i className="ri-map-pin-2-line display-5 fw-light mb-2 fs-sm-5" />
        <h5 className="fw-medium mb-1 fs-sm-6">Loved By India</h5>
        <p className="mb-0 fs-sm-6  d-none d-md-block">Loved by 5 lakh+ customers</p>
      </div>
      {/* Handmade */}
      <div className=" col-md-3 col-6">
        <i className="ri-heart-2-line display-5 fs-sm-5 fw-light mb-2" />
        <h5 className="fw-medium mb-1 fs-sm-6">Handmade</h5>
        <p className="mb-0 fs-sm-7 fs-sm-6 d-none d-md-block">Every piece is made with love</p>
      </div>
      {/* Ships In 5–7 Days */}
      <div className=" col-md-3 col-6">
        <i className="ri-truck-line display-5 fw-light mb-2 fs-sm-5" />
        <h5 className="fw-medium mb-1 fs-sm-6">Ships In 5–7 Days</h5>
        <p className="mb-0 fs-sm-6  d-none d-md-block ">Write to us to expedite your order</p>
      </div>
      {/* No Preservatives */}
      <div className=" col-md-3 col-6">
        <i className="ri-flask-line display-5 fw-light mb-2 fs-sm-5" />
        <h5 className="fw-medium mb-1 fs-sm-6">No Preservatives</h5>
        <p className="mb-0 fs-sm-6  d-none d-md-block">Pure taste, naturally fresh</p>
      </div>
    </div>
  </div>
</section>



        {/* Product Cards */}
        <div className="container pt-0 pt-sm-5">
          {/* Heading */}
          <div className="d-flex flex-wrap justify-content-between align-items-center pt-1 border-bottom pb-4 mb-4">
            <h2 className="h3 mb-0 me-2">Trending products</h2>
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
                  {Products.map((product, index) => {

                    const productRatings = ratings.filter(rating => rating.productId === product._id);
                    const totalRatings = productRatings.length;
                    const totalRatingValue = productRatings.reduce((acc, curr) => acc + curr.rating, 0);
                    const averageRating = totalRatings > 0 ? totalRatingValue / totalRatings : 0;
                    const myslug = CreateSlug(product.slug);
                     
                    return (

                      layout.trending_product.includes(product._id) && (<>

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
                  }
                  )}




                </>
              )
              )}




            </Swiper >

          </div>
          {/* Product Cards */}
        </div>
        {/* Product Cards */}

   

        <div className=" pt-0 pt-sm-5">

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
  
  
          <div className="container mt-2 py-0 mb-4"> 
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



<div style={{overflow:"hidden",position:"relative"}}>
  <div className="container p-0 my-4">
 <iframe
  width={"100%"}
  height={isMobile ? 350 : 500}
  src="https://www.youtube.com/embed/HKlEYhGd3pk?si=ZllrCDol6iFafcKB"
  title="YouTube video player"
  frameBorder={0}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerPolicy="strict-origin-when-cross-origin"
  allowFullScreen=""
  className="rounded"
/>

  </div>


</div>


    {/* Product Cards */}
        <div className="container pt-0 pt-sm-5">
          {/* Heading */}
          <div className="d-flex flex-wrap justify-content-between align-items-center pt-1 border-bottom pb-4 mb-4">
            <h2 className="h3 mb-0 me-2">Best Selling Products</h2>
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
                slidesPerView: 4,
                spaceBetween: 25, // Set the gap between slides for window width <= 1200px
              },
            }}
              pagination={true} modules={[Pagination, Navigation]} className="swiper-wrapper" >



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
                  {Products.map((product, index) => {
                    const productRatings = ratings.filter(rating => rating.productId === product._id);
                    const totalRatings = productRatings.length;
                    const totalRatingValue = productRatings.reduce((acc, curr) => acc + curr.rating, 0);
                    const averageRating = totalRatings > 0 ? totalRatingValue / totalRatings : 0;
                    const myslug = CreateSlug(product.slug);

                    return (
                      layout.best_selling_laptop.includes(product._id) && (<>

<SwiperSlide key={index}>

<div className="card card-product custompro2 h-100">
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

   

{product?.variations?.length > 0 && product?.variations.map((variation) => {

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
 

 
 <div style={{backgroundColor:'#042258'}} className="mt-3 startbg"> 
         {/* Banner */}
         <div className="container py-4 py-lg-10">
           <div className="row undergold">
 
             {isLoading ? (<>
               <div
                 className="col skeleton "
                 style={{ height: 380, borderRadius: 10 }}
               ></div>
             </>) : (layout.latest_product_banner && (
               <>
 
                 <div className="col">
                   <div
                     className="row justify-content-between align-items-center overflow-hidden border rounded-1 customborder"
                    
                   >
                     <div className="py-4 my-2 my-md-0 py-md-5 px-4 ms-md-3 text-center text-sm-start col-md-7">
                       <h6 className="fs-xs text-uppercase mb-2 bg-white d-inline-block p-2 rounded text-black">
                         Weekend Discount
                       </h6>
                       <h3 className="fw-medium mb-2">{layout.collection_heading || ''}</h3>
                       <p className="fs-base fw-light mb-4">
                         {layout.collection_paragraph || ''}
                       </p>
                       <Link className="btn bg-white btn-shadow" to={layout.collection_url || ''}>
                         Shop Now
                       </Link>
                     </div>
                     <img
                       className="col-md-4 my-4 d-none"
                       src={ 'https://mittal-back-olb5.onrender.com/uploads/new/image-1767606188224.webp'}
                       alt="Shop Converse"
                       width={'100%'}
                       style={{maxWidth:200}}
                     />
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
         <div className="container pt-0 pt-sm-5">
           {/* Heading */}
           <div className="d-flex flex-wrap justify-content-between align-items-center pt-1 border-bottom pb-4 mb-4">
             <h2 className="h3 mb-0 me-2">Trending products</h2>
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
               ) : (layout.best_selling_smartphone && (
                 <>
                   {Products.map((product, index) => {
                     const productRatings = ratings.filter(rating => rating.productId === product._id);
                     const totalRatings = productRatings.length;
                     const totalRatingValue = productRatings.reduce((acc, curr) => acc + curr.rating, 0);
                     const averageRating = totalRatings > 0 ? totalRatingValue / totalRatings : 0;
                     const myslug = CreateSlug(product.slug);
 
                     return (
                       layout.best_selling_smartphone.includes(product._id) && (<>
 
 <SwiperSlide key={index}>
 
 <div className="card card-product custompro2 h-100">
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
  
  <br/>
    <br/>
 
      

       </main>


      <Footer />

    </>
  )
}

export default Home
