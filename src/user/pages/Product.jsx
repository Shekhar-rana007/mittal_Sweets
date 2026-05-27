import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useCart } from "react-use-cart";
import toast from "react-hot-toast";
import axiosInstance from '../../axiosInstance';
import { Swiper, SwiperSlide } from "swiper/react";
import Magnifier from "../components/extra/Magnifier";

import QuantitySelector from '../components/extra/QuantitySelector';


// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/pagination";

// import required modules
import { FreeMode, Navigation, Thumbs, Pagination } from "swiper/modules";
import { useBlogContext } from '../../fetchdata/BlogContext';
import { Helmet } from "react-helmet";
import getCookie from "../components/extra/getCookie";
import CreateSlug from "../components/extra/CreateSlug";


const Product = () => {

  const navigate = useNavigate();

  const [layout, setLayout] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isProducts, setIsProducts] = useState(true);

  const [Products, setProducts] = useState([]);


  const { promoCodeInfo } = useBlogContext();

  // const userId = localStorage.getItem('userId');
  const userId = getCookie('userId');

  const [SubmitLoading, setSubmitLoading] = useState(true); // Add loading state

  const [SubmitWishlist, setWishlistLoading] = useState(true); // Add loading state

  const [SubmitCompare, setCompareLoading] = useState(true); // Add loading state

  const { addItemToCart } = useBlogContext();

  const [selectedValues, setSelectedValues] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };



  const { id } = useParams();

  const [formData, setFormData] = useState({
    userId: userId || '',
    productId: id,
    rating: "",
    comment: "",
  });

  useEffect(() => {
    setIsLoading(true);
    setIsProducts(true);
    // Update the productId in the formData when id changes
    setFormData(prevState => ({
      ...prevState,
      productId: id,
      rating: "",
      comment: "",
    }));
  }, [id]); // This useEffect will re-run whenever id changes


  const { addItem, updateItemQuantity, items } = useCart();
  const [selectedColor, setSelectedColor] = useState(""); // State to hold the selected color

  const [pdfBase64, setPdfBase64] = useState(""); // State to hold the PDF as Base64 string

  const [SelectedSizes, setSelectedSizes] = useState({});
  const [TotalQuantity, setTotalQuantity] = useState(1);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [isOpenReview, setIsOpenReview] = useState(false);
  const [activeData, setActiveData] = useState([]);


  


  const toggleReviewPopup = () => {
    if (userId) {
      setIsOpenReview(!isOpenReview);
    }
    else {
      toast.error("Please Login First", TotalQuantity);
    }

  };


  const handleColorChange = (event) => {
    setSelectedColor(event.target.value); // Update the selected color state when a radio button is checked
  };

  const getProducts = async () => {
    try {
      const { data } = await axiosInstance.get("/all-home-products");
      setProducts(data.products);
      setIsProducts(false); // Set loading state to false in case of an error
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsProducts(false); // Set loading state to false in case of an error
    }
  };


  const getData = async () => {
    try {
      const { data } = await axiosInstance.get(`/home-layout-data`);
      setLayout(data.homeLayout);
      setIsLoading(false); // Set loading state to false in case of an error
    }
    catch (error) {
      console.log(error);
      toast.error("Error fetching Home layout!");
      setIsLoading(false); // Set loading state to false in case of an error
    }
  };

  useEffect(() => {
    getData();
    getProducts();
  }, [id]);

  // Function to handle button click
  const handleButtonClick = async (variantTitle, value) => {

    setSelectedValues(prevState => {
      // Check if the value is already selected
      const isSelected = prevState[variantTitle] && prevState[variantTitle][0][variantTitle] === value;
      // Toggle selection state
      return {
        ...prevState,
        [variantTitle]: isSelected ? [] : [{ [variantTitle]: value }]
      };
    });
    try {
      setIsLoading(false)
      
      const response = await axiosInstance.get(`/products-variations-fillter?title=${variantTitle}&value=${value}&hsn=${prohsn}`);
      const proid = response.data
      if (proid[0]._id) {
        navigate(`/product/${proid[0]._id}`)
      }

      // console.log(proid[0]._id)
    } catch (error) {
      console.error("Error fetching products:", error);
    }finally{
      setIsLoading(true);
    }


  };



  const handleAddToCart = async (product, buy) => {
    // if (!selectedColor) {
    //   toast.error("Please select a color");
    // } else if (!TotalQuantity) {
    //   toast.error("Please select a Quantity", TotalQuantity);
    // } else { }
    const existingProduct = items.find(
      (item) => item.id === product.id 
    );

    if (existingProduct) {
      // const updatedQuantity = existingProduct.quantity + 1;
      const updatedQuantity = TotalQuantity;

      updateItemQuantity(existingProduct.id, updatedQuantity);

      if (buy) {
        navigate('/checkout')
      }
      toast.success("Product quantity updated in cart");
    } else {
      
   
     await addItemToCart(
        
        { ...product, color: selectedColor,TotalQuantity },
        TotalQuantity
      );
      
      // updateItemQuantity(product.id, updatedQuantity);

      if (buy) {
        navigate('/checkout')
      }
      // toast.success("Product Added To Cart");
    }

  };

  const handleBuyNow = (product) => {

    const buy = TotalQuantity;
    handleAddToCart(product, buy);

  };



  const [frontImage, setFrontImage] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const overlayRef = useRef(null);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [overlaySize, setOverlaySize] = useState({ width: 200, height: 200 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({
    width: 0,
    height: 0,
  });

  const [text, setText] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 10, y: 10 });
  const [isTextDragging, setIsTextDragging] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(16);

  const [loading, setLoading] = useState(true); // Add loading state
  const [Image, setImage] = useState("");
  const [Specifications, setspecifications] = useState([]);

  const [mainImage, setMainImage] = useState("");

  const [Product, setProduct] = useState({});
  const [Attr, setAttr] = useState([]);
  const [sizeQuantities, setSizeQuantities] = useState({});
  const [variations, setVariations] = useState([]);
  const [Images, SetImages] = useState([]);

  const [variationsSize, setVariationsSize] = useState([]);

  const [Varloading, SetVarLoading] = useState(true); // Add loading state
  const [ratings, setRatings] = useState([]);
  const [totalRating, settotalRating] = useState('');
  const [averageRating, setaverageRating] = useState('');
  const [HSNvariations, setHSNVariations] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);

  const [variationsmap, setVariationsmap] = useState([]);
  const [prohsn, setprohsn] = useState('');


  const [activevariations, setactiveVariations] = useState({});

  const handleSmallImageClick = (newImageSrc) => {
    setFrontImage(newImageSrc);
  };

  const getCategory = async () => {
    window.scrollTo(0, 0);
    setLoading(true); // Set loading to false when data is fetched
    SetVarLoading(true);
    try {
      const { data } = await axiosInstance.get(`/user-product/${id}`);
      const myslug = CreateSlug(data.Product.slug); 
      const {success} = data;
      // if(success){
      //   console.log('datasucess',data)
      //   navigate(`/product/${myslug}/${data.Product._id}`)
      //   }

    } catch (error) {
      console.error("Error getting product:", error);
    } finally {
      setLoading(false); // Set loading to false when data is fetched
      SetVarLoading(false);
      console.log("Image", Image);
    }
  };




  const getRating = async () => {
    try {
      const { data } = await axiosInstance.get(`/view-product-rating/${id}`);
      console.log("rating", data);
      const myrating = data.productRatings.reverse()
      setRatings(myrating);
      hasUserReviewed();

      // Calculate total rating
      const totalRating = data.productRatings.length;
      settotalRating(totalRating);

      // Calculate average rating
      const averageRating = totalRating > 0 ? data.productRatings.reduce((acc, rating) => acc + rating.rating, 0) / totalRating : 0;
      setaverageRating(averageRating);


    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };
  const hasUserReviewed = () => {
    const reviewedRating = ratings.find((rating) => rating.userId === userId);
    const hasReviewed = !!reviewedRating; // Convert to boolean
    // console.log('User has reviewed:', hasReviewed);
    return hasReviewed;
  };



  const getAttribute = async () => {
    try {
      const { data } = await axiosInstance.get("/all-attribute");
      console.log("attr", data);
      setAttr(data.Attribute);
    } catch (error) {
      console.error("Error fetching attributes:", error);
    }
  };

  const handleIncrement = (stock) => {
    if (TotalQuantity <=  stock) { // Check input length before updating

      setTotalQuantity(TotalQuantity + 1);
    }else{
      toast.error("Product out of stock. ")
    }

  };

  const handleDecrement = () => {
    if (TotalQuantity > 1) {
      setTotalQuantity(TotalQuantity - 1);
    }
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setTotalQuantity(newQuantity);
    }
  };

  // const handleIncrement = (size, maxLength) => {
  //   const currentValue = sizeQuantities[size] || 0;
 
  //   if (currentValue < maxLength ) {
  //     setSizeQuantities((prevQuantities) => ({
  //       ...prevQuantities,
  //       [size]: currentValue + 1,
  //     }));
  //   } else {
  //     toast.error(`Maximum quantity (${maxLength}) reached for ${size}.`);
  //   }
  // };

  // // Function to handle decrement for a particular size
  // const handleDecrement = (size) => {
  //   if (sizeQuantities[size] > 0) {
  //     setSizeQuantities((prevQuantities) => ({
  //       ...prevQuantities,
  //       [size]: prevQuantities[size] - 1,
  //     }));
  //   }
  // };

  // Function to handle input change for a particular size
  const handleInputChange = (size, event) => {
    const value = parseInt(event.target.value, 10) || 0;
    setSizeQuantities((prevQuantities) => ({
      ...prevQuantities,
      [size]: value,
    }));
  };








  useEffect(() => {
    setVariationsmap([])
    getRating()
    getCategory();
    getAttribute();

  }, [id]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextDrag = (e, data) => {
    setTextPosition({ x: data.x, y: data.y });
  };

  const handleTextResize = (e) => {
    setTextSize(parseInt(e.target.value, 10));
  };

  const handleTextColorChange = (e) => {
    setTextColor(e.target.value);
  };

  const handleTextMouseDown = () => {
    setIsTextDragging(true);
  };

  const handleTextMouseUp = () => {
    setIsTextDragging(false);
  };

  const handleAddText = () => {
    setText("Add Text Here");
  };

  const handleDeleteText = () => {
    setText("");
  };

  const handleOverlayImageUpload = (e) => {
    const overlayFile = e.target.files[0];

    if (overlayFile) {
      // Check file size
      const fileSizeInKB = overlayFile.size / 1024; // Convert bytes to kilobytes
      const maxSizeKB = 500; // Maximum file size allowed in kilobytes (500KB in this example)

      if (fileSizeInKB > maxSizeKB) {
        // Show alert if file size exceeds the limit
        alert(
          "File size exceeds the limit (500KB). Please choose a smaller file."
        );
        return; // Exit function if file size is too large
      } else {
        const reader = new FileReader();

        reader.onload = (event) => {
          const overlayImg = new window.Image();
          overlayImg.onload = () => {
            setOverlayImage(overlayImg);
          };
          overlayImg.src = event.target.result;
        };

        reader.readAsDataURL(overlayFile);
      }
    }
  };

  const handleMouseDown = (e, position) => {
    setOverlayPosition(position);
  };

  // const handleMouseMove = (e) => {
  //     if (isResizing && overlayRef.current) {
  //         const deltaX = e.clientX - resizeStart.x;
  //         const deltaY = e.clientY - resizeStart.y;

  //         const newWidth = Math.max(20, resizeStartSize.width + deltaX);
  //         const newHeight = Math.max(20, resizeStartSize.height + deltaY);

  //         setOverlaySize({ width: newWidth, height: newHeight });
  //     }
  // };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleResizeMouseDown = (e) => {
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY });
    setResizeStartSize({
      width: overlaySize.width,
      height: overlaySize.height,
    });
  };

  // product zoom js

  const [isZoomed, setIsZoomed] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const handleMouseEnter = (product) => {
    setIsZoomed(true);
    setHoveredProduct(product);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setHoveredProduct(null);
  };

  const handleMouseMove = (e) => {
    setCursorPosition({
      x: (e.nativeEvent.offsetX / e.target.offsetWidth) * 100,
      y: (e.nativeEvent.offsetY / e.target.offsetHeight) * 100,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const AddWhishlistData = async () => {
    setWishlistLoading(false);

    if (formData.userId === '') {
      toast.error('Please Login First');
      setWishlistLoading(true);

    }
    else {
      try {
        await axiosInstance.post('/add-wishlist', formData);
        toast.success("wishlist Added successfully!");
      } catch (error) {
        console.error("Error on wishlist added:", error);
        toast.error(error.response.data.message);
      } finally {
        setWishlistLoading(true);
      }
    }

  }

  const AddCompareData = async () => {
    setCompareLoading(false);

    if (formData.userId === '') {
      toast.error('Please Login First');
      setCompareLoading(true);


    }
    else {
      try {
        await axiosInstance.post('/add-compare', formData);
        toast.success("Comparsion Added successfully!");
      } catch (error) {
        console.error("Error on compare added:", error);
        toast.error(error.response.data.message);

      } finally {
        setCompareLoading(true);
      }
    }

  }

  const submitData = async () => {
    setSubmitLoading(false);

    if (formData.userId === '') {
      toast.error('Please Login First');
      setSubmitLoading(true);

      return;

    }
    else {
      if (formData.rating !== '' || formData.comment !== '') {
        try {
          await axiosInstance.post('/add-rating', formData);
          toggleReviewPopup();
          toast.success("Rating Added successfully!");
          getRating();
        } catch (error) {
          console.error("Error on rating added:", error);
          toast.error(error.response.data.message);
          setRatings([])
        } finally {
          setSubmitLoading(true);
        }

      }
      else {
        toast.error('Please Fill All Fields');
        setSubmitLoading(true);
      }
    }

  };

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  const isActive = (title, value) => {
    // Check if there is a selected variation in the state
    if (!selectedVariation) {
      return false; // No selected variation, so no value is active
    }

    // Check if the selected variation's title and value match the current title and value
    return selectedVariation.title === title && selectedVariation.value === value;
  };

  return (
    <>
      <Header />


      <Helmet>
        {Product.metaTitle && (
          <title>{Product.metaTitle}</title>
        )}
        {Product.metaDescription && (
          <meta name="description" content={Product.metaDescription} />
        )}
        {Product.metaKeywords && (
          <meta name="keywords" content={Product.metaKeywords} />
        )}
      </Helmet>

      <div className="whitesmoke pt-4">
        
        {/* Page Title */}
        {/* Product Card */}
        <div className="container">
          <div className=" border rounded-3 p-10 pb-8 mb-10 bg-white probox-pad">
            <div className="row g-5 g-lg-10">
              {/* Product gallery */}
              <div className="col-lg-5 productpage">

              {frontImage && (
  <>
    <Swiper
      onClick={togglePopup}
      style={{
        "--swiper-navigation-color": "#335599",
        "--swiper-pagination-color": "#335599",
      }}
      spaceBetween={10}
      navigation={true}
      thumbs={{ swiper: thumbsSwiper }}
      modules={[FreeMode, Navigation, Thumbs]}
      className={`mySwiper2 hide-desk-pagenation ${isLoading && 'd-none'}`}
    >
      <SwiperSlide>
        <div style={{ aspectRatio: "1 / 1", display: "flex", alignItems: "center" }}>
          <img
            src={frontImage}
            onMouseEnter={() => handleMouseEnter(frontImage)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            className="m-auto d-block"
            alt="Product Image"
            style={{ height: "100%", width: "auto", objectFit: "cover", cursor: "url(/assets/img/zoomm.png), auto" }}
          />
        </div>
      </SwiperSlide>

      {Images.map((imageUrl, index) => (
        <SwiperSlide key={index}>
          <div style={{ aspectRatio: "1 / 1", display: "flex", alignItems: "center" }}>
            <img
              src={imageUrl}
              onMouseEnter={() => handleMouseEnter(imageUrl)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              className="m-auto d-block"
              alt="Product Image"
              style={{ height: "100%", width: "auto", objectFit: "cover", cursor: "url(/assets/img/zoomm.png), auto" }}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    <Swiper
      onSwiper={setThumbsSwiper}
      spaceBetween={10}
      slidesPerView={4}
      freeMode={true}
      watchSlidesProgress={true}
      modules={[FreeMode, Navigation, Thumbs]}
      className={`mySwiper ${isLoading && 'd-none'}`}
    >
      <SwiperSlide>
        <img src={frontImage} alt="Product Image" style={{ aspectRatio: "1 / 1", objectFit: "contain" }} />
      </SwiperSlide>

      {Images.map((imageUrl, index) => (
        <SwiperSlide key={index}>
          <img src={imageUrl} alt="Product Image" style={{ aspectRatio: "1 / 1", objectFit: "contain" }} />
        </SwiperSlide>
      ))}
    </Swiper>
  </>
)}


                {isLoading && (
                  <>
                    <div
                      className="card-1 skeleton"
                      style={{ height: 480, borderRadius: 20 }}
                    ></div>
                  </>
                )}

                
              </div>

              {frontImage && isOpen && <>
                <div class="propop">
                  < i onClick={togglePopup} class="ri-close-line"></i>

                  <Swiper
                    style={{
                      "--swiper-navigation-color": "#335599",
                      "--swiper-pagination-color": "#335599",
                      "padding-bottom": "40px",
                    }}
                    spaceBetween={10}
                    navigation={true}
                    pagination={true}
                    modules={[FreeMode, Navigation, Pagination]}
                    className="mySwiper2 hide-desk-pagenation"
                  >
                    <SwiperSlide>
                      <img
                        src={frontImage}
                        alt="Product Image"
                        className="m-auto d-block"
                      />
                    </SwiperSlide>

                    {Images.map((imageUrl, index) => (
                      <>
                        <SwiperSlide>
                          <img
                            src={imageUrl}
alt="Product Image"
                            className="m-auto d-block"
                          />
                        </SwiperSlide>
                      </>
                    ))}
                  </Swiper>

                </div>
              </>}


              {/* Product gallery */}
              {/* Product details */}
              <div className="col-lg-7">
                <div className="product-details">
                  {/* Zoom overlay */}

                  {isZoomed && hoveredProduct && (
                    <div
                      className="zoom-overlay"
                      style={{
                        backgroundImage: `url(${hoveredProduct})`,
                        backgroundPosition: `${cursorPosition.x}% ${cursorPosition.y}%`,
                        backgroundColor: "white",
                      }}
                    ></div>
                  )}



                  <h3 className="product-title fs-3">
                    {Product.salePrice   && !isLoading ? (
                      <>{Product.title} </>
                    ) : (
                      <>
                        <div className=" border-bottom pb-2 mb-2"
                        > <div
                          className="card-1 skeleton"
                          style={{ height: 32, borderRadius: 5 }}
                        ></div>

                        </div>

                      </>
                    )}
                  </h3>
                  <div className="border-bottom pb-2 mb-2">
                    {!averageRating || !totalRating && !isLoading ? (<>
                      <span className={`star-rating star-0 } fs-6 align-middle`} />
                      <span className="d-inline-block fs-sm ms-2">
                        0 by 0 Reviews
                      </span>
                    </>) : (<>
                      <span className={`star-rating star-${averageRating * 2} fs-6 align-middle`} />
                      <span className="d-inline-block fs-sm ms-2">
                        {averageRating} by {totalRating} Reviews
                      </span>
                    </>)}
                  </div>
                  {/* Product Price */}
                  <div className="product-price mb-3">
                    {Product.salePrice && !isLoading ? (
                      <>
                        <div className="row g-2">
                          <div className="col-auto d-flex flex-column justify-content-center">
                            <span className="text-accent fs-2">
                              ₹{Product.salePrice}{" "}
                            </span>
                          </div>
                          <div className="col d-flex flex-column justify-content-center">
                            <del className="text-body-secondary">
                              <span className="fs-sm">
                                ₹{Product.regularPrice}
                              </span>
                            </del>
                            <span className="text-danger fs-sm mt-n1">
                              You save{" "}
                              {Math.round(
                                ((Product.regularPrice - Product.salePrice) /
                                  Product.regularPrice) *
                                100
                              )}
                              % (₹{Product.regularPrice - Product.salePrice})
                            </span>

                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="row g-2 mb-2">
                          <div
                            className="card-1 skeleton"
                            style={{ height: 56, borderRadius: 10 }}
                          ></div>
                        </div>
                      </>
                    )}
                  </div>
                  {/* Product Price */}


         


                  {/* <h5 className="h6 mb-2">Color</h5>
                
                  <div class="colorchoose">
                    {Varloading ? (
                      <div
                        className="card-1 skeleton  mb-2"
                        style={{ height: 36, borderRadius: 10 }}
                      ></div>
                    ) : (
                      <>
                        {Attr.length > 0 ? (
                          <>
                            {Attr.map((row, index) => (
                              <>
                                {row.name === "Color" ? (
                                  <>
                                    <div className="color-options d-flex">
                                      {variations && variations.length > 0 ? (
                                        variations.map((colorInfo, index) => (
                                          <label
                                            key={index}
                                            htmlFor={"att" + index}
                                          >
                                            <input
                                              id={"att" + index}
                                              type="radio"
                                              style={{ display: "none" }}
                                              name="color"
                                              value={colorInfo.Color}
                                              onChange={handleColorChange}
                                            />

                                            <span
                                              className="color-circle"
                                              style={{
                                                backgroundColor: `${row.color[index]}`,
                                              }}
                                            ></span>
                                            <span className="hovercolor">
                                              {colorInfo.Color}
                                            </span>
                                          </label>
                                        ))
                                      ) : (
                                        <p>No color Found</p>
                                      )}
                                    </div>

                                    {Product.stock === 0 ? (
                                      <span className="text-danger mb-2" >Out of stock</span>
                                    ) : Product.stock <= 10 ? (
                                      <span className="mb-2">Only {Product.stock} left in stock</span>
                                    ) : (
                                      <></>
                                    )}


                                    <hr />
                                  </>
                                ) : (
                                  <></>
                                )}
                              </>
                            ))}
                          </>
                        ) : (
                          <div> Loading .....</div>
                        )}
                      </>
                    )}
                  </div> */}

                  <div class="variationsmapbutton mb-4">
                    {/* {variationsmap?.length > 0 && variationsmap.map((variant, index) => (
                      <div key={index} className="row d-block mb-2">
                        <div className="col-md-12 mb-2 mb-2"> <b> {variant.title} </b></div>
                        <div className="col-md-12" >
                          {variant?.values.length > 0 && variant?.values.map((value, idx) => {
                            console.log('variant?.values', variant?.values)
                            return (
                              
                              <button
                                key={idx}
                                // className={`btn me-2 ${selectedValues[variant.title] && selectedValues[variant.title][0][variant.title] === value ? 'active' : ''}`}
                                className={`btn me-2 ${selectedValues[variant.title]?.[0]?.[variant.title] === value ? 'active' : ''}`}
                                onClick={() => handleButtonClick(variant.title, value)}
                                disabled={selectedValues[variant.title] && selectedValues[variant.title][0][variant.title] === value ? true : false}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))} */}

{variationsmap?.length > 0 && variationsmap.map((variant, index) => (
  <div key={index} className="row d-block mb-2">
    {variant.title !== 'Discount' && (
      <>
       <div className="col-md-12 mb-2 mb-2"> <b> {variant.title} </b></div>
    <div className="col-md-12" >
      {variant?.values.length > 0 && variant?.values
        .filter((value, idx, self) => self.indexOf(value) === idx) // Filter out duplicates
        .map((value, idx) => {
          console.log('variant?.values', variant?.values)
          return (
            <button
              key={idx}
              className={`btn me-2 ${selectedValues[variant.title]?.[0]?.[variant.title] === value ? 'active' : ''}`}
              onClick={() => handleButtonClick(variant.title, value)}
              disabled={selectedValues[variant.title] && selectedValues[variant.title][0][variant.title] === value}
            >
              {value}
            </button>
          );
        })}
    </div>
       </>
    )}
   
  </div>
))}


                    <div>
                      {/* Selected values:
                      <ul>
                        {Object.keys(selectedValues).map((key, idx) => (
                          <li key={idx}>
                            {key}: {selectedValues[key][0][key]}
                          </li>
                        ))}
                      </ul> */}
                    </div>

                  </div>
                  <hr />
 
      
                  {isLoading ? (
                  <>
                    <div
                      className="card-1 skeleton"
                      style={{ height: 480, borderRadius: 20 }}
                    ></div>
                  </>
                ):(  

                  <div className="d-flex align-items-center">
           

  <div className="quantity-products d-flex justify-content-center">
      <button className="quantity-btn-minus" onClick={handleDecrement}>
        <i className="ri-subtract-line" />
      </button>
      <input
        id="quantityNumber1"
        className="quantity-number"
        type="number"
        value={TotalQuantity}
        maxLength={Product?.stock}
        onChange={handleQuantityChange}
      />
      <button className="quantity-btn-plus" onClick={() => handleIncrement(Product && Product?.stock)}>
        <i className="ri-add-line" />
      </button>
    </div>


        
   <div className="d-flex gap-2 justify-content-between ps-3 d-none">
                      <button disabled={Product.stock === 0}
                        className="btn btn-primary d-flex align-items-center justify-content-center w-100"
                        type="button" onClick={() => {

                          handleAddToCart({
                            id: Product._id,
                            title: Product.title,
                            image: frontImage,
                            regularPrice: Product.regularPrice,
                            price: Product.salePrice,
                            color: selectedColor,
                            customise: pdfBase64,
                            TotalQuantity: TotalQuantity,
                            SelectedSizes: SelectedSizes,
                            weight: Product.weight,
                            gst: Product.gst,
                            stock: Product.stock,
                          });
                        }}
                      >
                        <i className="ri-shopping-cart-2-line" />
                        <span className="d-none d-sm-inline ms-2">
                          Add To Cart
                        </span>
                      </button>

                      <button
                        className="btn btn-success d-flex align-items-center justify-content-center w-100"
                        type="button"
                        onClick={() => {

                          handleBuyNow({
                            id: Product._id,
                            title: Product.title,
                            image: frontImage,
                            regularPrice: Product.regularPrice,
                            price: Product.salePrice,
                            color: selectedColor,
                            customise: pdfBase64,
                            TotalQuantity: TotalQuantity,
                            SelectedSizes: SelectedSizes,
                            weight: Product.weight,
                            gst: Product.gst,
                          });
                        }}

                      >

                        <span className="d-sm-inline ms-2">Buy Now</span>
                      </button>
                    </div> 
 
                  </div>
                  )}

                  
                  {/* Buttons */}
                  <div className="d-flex pt-2 mb-4 col-lg-6">
                    <div className="w-50 me-3">

                      {SubmitWishlist ? (
                        <button
                          className="btn btn-accent d-block w-100"
                          type="button"
                          onClick={AddWhishlistData}
                        >
                          Add to
                          Wishlist
                        </button>
                      ) : (
                        <button
                          class="btn btn-accent d-block w-100"
                          type="button"
                          disabled
                        >
                          <span class="ms-1">Loading...</span>
                          <span
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        </button>
                      )}


                    </div>
                    <div className="w-50">

                      {SubmitCompare ? (
                        <button
                          className="btn btn-accent d-block w-100"
                          type="button"
                          onClick={AddCompareData}
                        >
                          Compare
                        </button>
                      ) : (
                        <button
                          class="btn btn-accent d-block w-100"
                          type="button"
                          disabled
                        >
                          <span class="ms-1">Loading...</span>
                          <span
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        </button>
                      )}


                    </div>
                  </div>
                  {/* Buttons */}
                  {/* Info List */}
                  <h5 className="h6 mb-3 py-2 border-bottom">
                    <i className="ri-information-line text-body-secondary fs-lg align-middle me-2" />
                    Key Features
                  </h5>
                  <ul>
                    {" "}

                    {Product.features && (Product.features.map(feature => (<li key={feature._id}  > {feature} </li>)))}
                  </ul>

                  {/* Info List */}
                </div>
              </div>
              {/* Product details */}
            </div>
          </div>
        </div>
        {/* Product Card */}
        {/* Product Description */}
        <div className="container">
          <div className="accordion mb-4 d-none" id="Specifications">
            <div className="accordion-item">
              <h3 className="accordion-header ">
                <a
                  className="accordion-button collapsed "
                  href="#card"
                  data-bs-toggle="collapse"
                  aria-expanded="false"
                >
                  <b className="h4"> Specifications </b>
                </a>
              </h3>
              <div
                className="accordion-collapse collapse show"
                id="card"
                data-bs-parent="#Specifications"
                style={{}}
              >
                <div className="accordion-body">
                  <div className="row g-10">

                    {Specifications.map(
                      (specification, specIndex) => (

                        <>
                          <div key={specIndex} className="col-12 col-md-6">
                            <h6 className="text-accent border-bottom pb-2 mb-2">
                              {specification.heading}
                            </h6>
                            <ul className="list-unstyled fs-sm pb-2">

                              {specification.labels.map((label, labelIndex) => (
                                <>
                                  <li className="d-flex justify-content-between gap-2"  >
                                    <span className="text-body-secondary" style={{ width: "50%" }} >{label.label}</span>
                                    <span style={{ width: "50%" }}>{label.value}</span>
                                  </li>

                                </>

                              ))}



                            </ul>

                          </div>


                        </>

                      )
                    )}



                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion mb-4 " id="Overview">
            <div className="accordion-item">
              <h3 className="accordion-header ">
                <a
                  className="accordion-button collapsed "
                  href="#Overviewbx"
                  data-bs-toggle="collapse"
                  aria-expanded="false"
                >
                  <b className="h4"> Overview </b>
                </a>
              </h3>
              <div
                className="accordion-collapse collapse show"
                id="Overviewbx"
                data-bs-parent="#Overview"
                style={{}}
              >
                <div className="accordion-body">
                  <div
                    dangerouslySetInnerHTML={{ __html: Product.description }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="accordion mb-4 " id="Reviews">
            <div className="accordion-item">
              <h3 className="accordion-header ">
                <a
                  className="accordion-button collapsed "
                  href="#Reviewsbx"
                  data-bs-toggle="collapse"
                  aria-expanded="false"
                >
                  <b className="h4"> Reviews </b>
                </a>
              </h3>
              <div
                className="accordion-collapse collapse show"
                id="Reviewsbx"
                data-bs-parent="#Reviews"
                style={{}}
              >
                <div className="accordion-body">

                  <div>
                    <div className="mb-2">
                      <span className="mb-1 h4 d-block ">
                        Review this product
                      </span>
                      <span className="ms-0 mb-2 d-block">
                        {" "}
                        Help other customers make their decision{" "}
                      </span>
                      {!hasUserReviewed() && (
                        <button
                          className="btn btn-primary btn-sm d-flex align-items-center justify-content-center"
                          type="button"
                          onClick={toggleReviewPopup}
                        >
                          <i className="ri-add-line me-1" />
                          Write a Review
                        </button>
                      )}


                      {isOpenReview && (<>

                        <div className="custom-popup ">

                          <div className="popup-container ">
                            <button
                              className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                              type="button" onClick={toggleReviewPopup}
                            >
                              <i className="ri-close-line" />

                            </button>

                            <div
                              className="card border-0"
                            >
                              <div className="card-body border-0" >
                                <h4 className="mb-2">Review And Rating
                                </h4>
                                <div className="needs-validation" >

                                  <div className="mb-4">
                                    <label className="form-label" htmlFor="review-rating">
                                      How was your experience about our product?

                                    </label>

                                    <div className="d-flex gap-2 ratingbox">




                                      <input type="radio" onChange={handleChange} name="rating" id="rating5" defaultValue="5" className="d-none" />
                                      <label htmlFor="rating5">

                                        <i className="ri-star-fill" /> </label>


                                      <input type="radio" onChange={handleChange} name="rating" id="rating4" defaultValue="4" className="d-none" />
                                      <label htmlFor="rating4">

                                        <i className="ri-star-fill" /> </label>

                                      <input type="radio" onChange={handleChange} name="rating" id="rating3" defaultValue="3" className="d-none" />
                                      <label htmlFor="rating3">

                                        <i className="ri-star-fill" /> </label>


                                      <input type="radio" onChange={handleChange} name="rating" id="rating2" defaultValue="2" className="d-none" />
                                      <label htmlFor="rating2">

                                        <i className="ri-star-fill" /> </label>

                                      <input type="radio" onChange={handleChange} name="rating" id="rating1" defaultValue="1" className="d-none" />
                                      <label htmlFor="rating1">

                                        <i className="ri-star-fill" /> </label>



                                    </div>


                                  </div>
                                  <div className="mb-4">
                                    <label className="form-label" htmlFor="review-text">
                                      Review<span>*</span>
                                    </label>
                                    <textarea
                                      className="form-control"
                                      rows={5}
                                      maxLength={300}
                                      name="comment"
                                      id="review-text"
                                      value={formData.comment} onChange={handleChange}
                                    />
                                    <div className="invalid-feedback">Please leave your review.</div>
                                  </div>

                                  {SubmitLoading ? (
                                    <button
                                      className="btn btn-primary"
                                      type="button"
                                      onClick={submitData}
                                    >
                                      Add Review
                                    </button>
                                  ) : (
                                    <button
                                      class="btn btn-secondary btn-sm"
                                      type="button"
                                      disabled
                                    >
                                      <span class="ms-1">Loading...</span>
                                      <span
                                        class="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                      ></span>
                                    </button>
                                  )}

                                </div>
                              </div>
                            </div>

                          </div>

                        </div>

                      </>)}


                    </div>

                    <hr />

                    <span className="mb-3 h4 d-block ">
                      Customer Reviews
                    </span>

                  </div>
                  <div className="row g-4 g-md-10">
                    <div className="col-12">
                      {ratings.length === 0 ? (
                        <p>No reviews found.</p> // Render message if no reviews are available
                      ) : (
                        ratings.map((rating, index) => (
                          <div key={index} className="card border-0 mb-5">
                            <div className="card-body">
                              <div className="row g-0">
                                <div className="col-auto">
                                  <span className="blog-article-meta-link"  >
                                    <div className="avatar">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 64 64"
                                        style={{ isolation: "isolate", transform: "scale(0.6)" }}
                                      >
                                        <defs>
                                          <clipPath id="a">
                                            <rect width={64} height={64} />
                                          </clipPath>
                                        </defs>
                                        <g clipPath="url(#a)">
                                          <path d="M19.247 18.468C17.383 11.511 21.584 4.331 28.622 2.445 35.66.559 42.888 4.677 44.753 11.634 46.617 18.592 42.416 25.772 35.378 27.658 28.34 29.544 21.112 25.426 19.247 18.468zM44.003 31.262C53.176 33.928 61.012 43.833 61.012 55.553L61.012 58.776C61.012 60.556 59.567 62 57.788 62L6.212 62C4.433 62 2.988 60.556 2.988 58.776L2.988 55.553C2.988 43.833 10.824 33.928 19.997 31.262 20.851 31.014 21.986 31.384 22.53 32.088 23.946 33.922 27.739 35.922 32 35.922 36.261 35.922 40.054 33.922 41.47 32.088 42.014 31.384 43.149 31.014 44.003 31.262z" />
                                        </g>
                                      </svg>

                                    </div>
                                  </span>
                                </div>
                                <div className="col">
                                  <h6 className="mb-0 fs-base text-capitalize">
                                    {rating.username || ''}
                                  </h6>
                                  <span className={`star-rating star-${rating.rating * 2 || ''}`} />{" "}
                                  <span className="ms-2"> {formatDate(rating.createdAt)} </span> {/* Assuming you have a function formatDate() to format date */}
                                  <p className="fs-md mb-2">
                                    {rating.comment || ''}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}


                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Product Description */}




        {/* Product Cards */}
        <div className="container pb-4 pb-lg-10">
          {/* Heading */}
          <div className="d-flex flex-wrap justify-content-between align-items-center pt-1 border-bottom pb-4 mb-4">
            <h2 className="h3 mb-0 me-2">Recommended Products</h2>
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
                slidesPerView: 6,
                spaceBetween: 20, // Set the gap between slides for window width <= 1200px
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
              ) : (layout.trending_product && (
                <>
                  {Products.map((product, index) => {

                    const productRatings = ratings.filter(rating => rating.productId === product._id);
                    const totalRatings = productRatings.length;
                    const totalRatingValue = productRatings.reduce((acc, curr) => acc + curr.rating, 0);
                    const averageRating = totalRatings > 0 ? totalRatingValue / totalRatings : 0;
                    return (

                      layout.trending_product.includes(product._id) && (<>

                        <SwiperSlide key={index}>

                          <div className="card card-product h-100">
                            {/* Badges */}
                            <div className="product-badges">
                              <span className="badge bg-danger">12%</span>
                              <span className="badge bg-success">Top</span>
                            </div>
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
                              className="card-img-top d-block overflow-hidden flex-shrink-0"
                              to={`/product/${product._id}`}
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
                                <Link to={`/product/${product._id}`} > {product.title} </Link>
                              </h3>
                              {/* Product Title */}
                              {/* Star Rating */}
                              {/* <span className={`star-rating star-${Math.round(averageRating) * 2}`} /> */}

                              {/* Star Rating */}
                              {/* Product Price */}
                              <div className="product-price">
                                <span className="text-danger fs-5">
                                  ₹{product.salePrice}
                                  <del className="text-body-secondary ms-1">
                                    <small>₹{product.regularPrice} </small>
                                  </del>
                                </span>
                              </div>
                              {/* Product Price */}
                              {/* Product Meta */}

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



      </div>

      <Footer />
    </>
  );
};

export default Product;
