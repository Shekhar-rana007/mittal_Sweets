import { useRef, useState, useEffect, React } from "react";
import { useBlogContext } from "../../fetchdata/BlogContext";
import Header from "../components/Header"; // Replace this with your Header component
import Footer from "../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import axiosInstance from '../../axiosInstance';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation } from "swiper/modules";
import RangeSlider from "../components/extra/RangeSlider";
import { Helmet } from "react-helmet";

const Category = () => {


  const [layout, setLayout] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isProducts, setIsProducts] = useState(true);

  const [RProducts, setRProducts] = useState([]);


  const getProducts = async () => {
    try {
      const { data } = await axiosInstance.get("/all-home-products");
      setRProducts(data.products);
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
  }, []);





  const startMin = 0;
  const startMax = 100;
  const min = 0;
  const max = 200;
  const step = 1;

  const [selectedRanges, setSelectedRanges] = useState([]);

  const [selectedFilters, setSelectedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [Cat, setCat] = useState([]);
  const [CatT, setTCat] = useState("");
  const [CatImage, setTCatImage] = useState("");

  const [CatM, setMCat] = useState([]);

  const [Pro, setPro] = useState([]);
  const [Attr, setAttr] = useState([]);
  const [fillter, setfillter] = useState('');

  const [Viewfillter, setViewfillter] = useState([]);


  const [isCat, setIsCat] = useState(true);
  const [count, setcount] = useState('100');
  const [Sidebar, setIsSidebar] = useState(false);



  const handlecountChange = (event) => {
    setcount(event.target.value);
  };

  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState([]);


  const getRating = async () => {
    try {
      const { data } = await axiosInstance.get(`/all-rating`);
      setRatings(data.ratings);
      // console.log('getRating', data)

    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  const getCategory = async (fillter, page, price) => {
    setIsSidebar(false)
    try {
      window.scrollTo(0, 0);
      setIsCat(true);
      const encodedFilter = encodeURIComponent(fillter); // Encode the filter string

      const { data } = await axiosInstance.get(`/all/category/${id}?filter=${encodedFilter}&price=${price}&page=${page}&perPage=${count}`);
      setCat([]);
      setTCat("");
      setMCat([])
      if (data?.success) {
        setCat(data?.categories);
        setTCat(data.MainCat.title);
        setTCatImage(data.MainCat.image)
        setTotalPages(data?.proLength);
        setfillter(fillter);

        setProducts(data?.productsFilter);

        setPro(data?.products);
        setMCat(data?.MainCat)
      }

      // console.log('datadatadata', data)
    } catch (error) {
      console.log(error);
      toast.error("Error fetching Category!");
    } finally {
      setIsCat(false);
    }
  };

  const Opensidebar = async () => {
    setIsSidebar(true)
  }
  const Closesidebar = async () => {
    setIsSidebar(false)
  }

  const getAttribute = async () => {
    try {
      const { data } = await axiosInstance.get("/all-attribute");
      // console.log("attr", data);
      setAttr(data.Attribute);
    } catch (error) {
      console.error("Error fetching attributes:", error);
    }
  };

  // Function to handle checkbox selection
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    // console.log('valuevaluevalue', value)
    setSelectedFilters((prevState) => {
      // If checked, add the value to selectedFilters, otherwise remove it
      if (checked) {
        return { ...prevState, [value]: checked };
      } else {
        const { [value]: removedValue, ...rest } = prevState;
        return rest;
      }
    });

    // console.log('selectedFilters', selectedFilters)
    setCurrentPage(1);
  };

  const removeFilter = ({ key, val }) => {
    const value = `${key},${val}`;
    setSelectedFilters((prevState) => {
      const { [value]: removedValue, ...rest } = prevState;
      return rest;
    });

    setCurrentPage(1); // Set current page to 1
  };









  const generateQueryString = () => {
    const filterObj = {};

    // Construct filter object from selected filters
    Object.entries(selectedFilters).forEach(([key, value]) => {
      const [attrKey, attrValue] = key.split(",");

      // Check if attribute key already exists in filter object
      if (filterObj[attrKey]) {
        // Append to existing attribute value if key exists
        filterObj[attrKey] += `,${attrValue}`;
      } else {
        // Create new attribute if key doesn't exist
        filterObj[attrKey] = attrValue;
      }
    });

    // Convert filter object to JSON string
    const filterString = JSON.stringify(filterObj);

    // console.log(filterString); // Output the generated filter string
    setViewfillter(filterString)
    setTimeout(function () { getCategory(filterString, currentPage, selectedRanges); }, 100);
  };

  // const handleCategoryLinkClick = (categoryId) => {
  //   getCategory(fillter, currentPage, selectedRanges);
  // };

  useEffect(() => {
    generateQueryString(); // Call generateQueryString when selectedFilters change
    getRating();
    setIsCat(true); // Set loading state to true
    getAttribute();
    // getCategory(fillter,currentPage,selectedRanges);
  }, [id, currentPage, selectedFilters, selectedRanges, count]); // Empty dependency array ensures that the effect runs once after the initial render

  useEffect(() => {
  setSelectedRanges([]);
}, [id]); // Empty dependency array ensures that the effect runs once after the initial render

  // useEffect(() => {
  //   generateQueryString(); // Call generateQueryString when selectedFilters change
  // }, [selectedFilters,selectedRanges]); // Add selectedFilters as a dependency

  // Function to filter products based on selected attributes

  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });

  function handleChange(e) {
    setPriceRange({
      priceRange,
      [e.target.name]: parseInt(e.target.value),
    });
  }


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  // Calculate the maximum sale price to determine the range
  const maxSalePrice = Math.max(...products.map(product => product.salePrice));

  // Determine the number of ranges based on the maximum sale price
  const numRanges = Math.ceil(maxSalePrice / 10000);

  // Generate price ranges dynamically
  const priceRanges = Array.from({ length: numRanges }, (_, index) => ({
    min: index * 10000,
    max: (index + 1) * 10000,
  }));

  // Filter out the price ranges that match the actual sale prices of your products
  const filteredPriceRanges = priceRanges.filter(range =>
    products.some(product =>
      product.salePrice >= range.min && product.salePrice < range.max
    )
  );

  const handleCheckpriceboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedRanges([...selectedRanges, value]);
    } else {
      setSelectedRanges(selectedRanges.filter(range => range !== value));
    }
    setCurrentPage(1);
    // console.log(selectedRanges)
  };

  const addedVariations = new Set();

  return (
    <>
      <Header />

      <Helmet>
        {CatM.metaTitle && (
          <title>{CatM.metaTitle}</title>
        )}
        {CatM.metaDescription && (
          <meta name="description" content={CatM.metaDescription} />
        )}
        {CatM.metaKeywords && (
          <meta name="keywords" content={CatM.metaKeywords} />
        )}
      </Helmet>



      <div className="whitesmoke">
        {/* Page Title */}
        <div
          className="py-4 mb-4 mb-lg-0 white"
          style={{ backgroundColor: "whitesmoke" }}
        >
          <div className="container d-lg-flex justify-content-between align-items-center py-2 py-lg-4">
            <div className="pe-lg-4 text-center text-lg-start">
              <h1 className="h3 mb-0">  {CatT ? <>  {CatT}  </> : <> </>}  </h1>
            </div>
            <div className="pt-2 pt-lg-0">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb flex-lg-nowrap justify-content-center justify-content-lg-start">
                  <li className="breadcrumb-item">
                    <Link className="text-nowrap" to="/">
                      <i className="ri-store-2-line" /> Home{" "}
                    </Link>
                  </li>

                  <li
                    className="breadcrumb-item text-nowrap active"
                    aria-current="page"
                  >
                    {CatT ? <>  {CatT}  </> : <> </>} 
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        {/* Page Title */}
        {/* Product Category */}
        <div className="container pb-4 pb-lg-10">
          <div className="row g-md-4">
            {/* Sidebar */}
            <div className="col-mg-4 mystickyFillter d-none">
              <div
                className={`offcanvas offcanvas-collapse offcanvas-start rounded-3 shadow ${Sidebar && 'show'}`}
                id="category-sidebar"
                style={{ maxWidth: "23rem" }}
              >
                <div className="offcanvas-header align-items-center shadow-sm">
                  <h2 className="h5 mb-0">Filters</h2>
                  <button
                    className="btn-close ms-auto"
                    type="button" onClick={Closesidebar}
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  />
                </div>
                <div className="offcanvas-body p-lg-8">
                  {/* Categories */}
                  <div className="widget widget-categories pb-5 mb-5 ">
                    {/* Price Range Slider */}
                    <div className="widget pb-5 mb-5">




                      <h2>Filtered Products</h2>
                      {/* <ul>
          {filteredProducts.map(product => (
            <li key={product._id}>
              <img src={product.pImage} alt={product.title} />
              <p>{product.title}</p>
              <p>{`Sale Price: $${product.salePrice}`}</p>
            </li>
          ))}
        </ul>
 */}


                      {/* <h3 className="widget-title">Price</h3> */}
                      {filteredPriceRanges && filteredPriceRanges.length > 0 && <b>Price</b>}
                      <ul className="widget-list pt-1">
                        {filteredPriceRanges.map((range, index) => {
                          const isChecked = selectedRanges.includes(`${range.min}-${range.max}`);
                          return (
                            <li key={index} className="mb-1">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`checkbox-${index}`}
                                  value={`${range.min}-${range.max}`}
                                  onChange={handleCheckpriceboxChange}
                                  checked={isChecked}
                                />
                                <label className="form-check-label" htmlFor={`checkbox-${index}`}>
                                  ₹{range.min} - ₹{range.max}
                                </label>
                              </div>
                            </li>
                          );
                        })}
                      </ul>


                    </div>
                    {/* Price Range Slider */}
                    {/* <h3 className="widget-title">Categories</h3> */}


  {/* Product category */}

  {Cat && Cat.length > 0 && (
  <div className="accordion-item">
  <h2 className="accordion-header" id="heading1">
    <button
      className="accordion-button"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#categories"
      aria-expanded="flase"
      aria-controls="categories"
    >

  Categories
    </button>
  </h2>
  <div
    id="categories"
    className="accordion-collapse collapse"
    aria-labelledby="heading1"
    style={{}}
  >
    <div className="accordion-body">
      <ul className="widget-list pt-1">
      {isCat
                    ? Array.from({ length: 4 }).map((_, index) => (
                     

                        <div
                          className="card-1 skeleton mb-2"
                          style={{ height: 20, borderRadius: 10 }}
                        ></div>
               
                    ))
                    : Cat.map((Cat) => (
                      <>

<li className="mb-1">
<Link to={`/category/${Cat._id}`} className="text-black" >{Cat.title} </Link>

         </li>


                      </>
                    ))}


    
       
      </ul>
    </div>
  </div>
</div>
)}


 


                    {Attr.map((attr, index) => {
                      let hasVariations = false;


                      const checkVariationsExist = () => {
                        // for (const product of products) {
                        //   if (product.variations?.Color?.length > 0) {
                        //     return true;
                        //   }
                        // }
                        return true;
                      };

                      if (checkVariationsExist()) {
                        hasVariations = products.some(product => product?.variations && product.variations[attr.name] !== undefined);
                      }

                      if (hasVariations) {
                        return (


                          <div className="accordion-item" key={attr._id}>
                            <h2
                              className="accordion-header"
                              id={`heading${index + 1}`}
                            >
                              <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse${index + 1}`}
                                aria-expanded="true"
                                aria-controls={`collapse${index + 1}`}
                              >
                                {attr.name}
                              </button>
                            </h2>
                        

                          </div >


                        )

                      }
                    })}


                  </div >
                  {/* Categories */}
                </div>
              </div>
            </div>
            {/* Sidebar */}
            {/* Content */}

            <aside className="col-md-12 mt-10 pt-5 mx-auto" >


<div className="container mb-4 pb-4">
  {Cat.map((category) => (
    <div key={category._id} className="mb-5">

      {/* CATEGORY TITLE */}
      <div className="d-flex align-items-center mb-3 justify-content-between mb-3">
        
        <h4 className="mb-0 fw-bold text-capitalize">
          {category.title}
        </h4>

   <Link to={`/category/${category._id}`} className="mb-0 text-capitalize bg-black text-white rounded-pill px-3 py-1" >
         View All
        </Link>

      </div>

      {/* PRODUCTS GRID */}
      <div className="row g-3">
        {category.latestProducts.map((Pro) => (
          <div key={Pro._id} className="col-6 col-md-3 col-lg-2">
            <div className="card border-0 shadow-sm h-100 product-card">

              {/* Image Section */}
              <div className="position-relative">
                <Link to={`/product/${Pro.slug}/${Pro._id}`}>
                  <img
                    src={Pro.pImage}
                    alt={Pro.title}
                    className="img-fluid rounded"
                    style={{ aspectRatio: "1/1", objectFit: "cover" }}
                  />
                </Link>

                {/* VIEW Button */}
                <Link
                  to={`/product/${Pro.slug}/${Pro._id}`}
                  className="btn btn-outline-danger btn-sm fw-bold add-btn"
                >
                  VIEW
                </Link>
              </div>

              {/* Card Body */}
              <div className="card-body px-2 pt-2 pb-1">

                {/* Price */}
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="fw-bold text-white px-2 py-1 rounded bg-success">
                    ₹{Pro.salePrice}
                  </span>
                  <del className="text-muted small">
                    ₹{Pro.regularPrice}
                  </del>
                </div>

                {/* Discount */}
                <div className="text-success small fw-semibold mb-1">
                  ₹{Pro.regularPrice - Pro.salePrice} OFF
                </div>

                {/* Title */}
                <h6 className="fw-semibold mb-0 text-truncate">
                  {Pro.title}
                </h6>

              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  ))}
</div>
 

       {/* {CatImage !== undefined ? (<>
            { CatImage !== '' &&    <img src={CatImage} width={'100%'} className="rounded" style={{ aspectRatio: "5/1", objectFit: "cover" }} />
 }
            </>) :(
                     <div className="skeleton w-100 h-auto"   style={{ aspectRatio: "5/1", objectFit: "cover"   }} />
            )} */}


              {/* Recommended Products Slider */}
              {/* Toolbar */}
              <div
                className="card mt-5 mb-4  "
                style={{ backgroundColor: "white" }}
              >
                <div className="card-body py-2 ">
                  <div className="d-flex align-items-center justify-content-between">
                    <form className="row row-cols-auto g-4 align-items-center me-3">
                      <div className="col">
                        <div className="row g-2">
                          <label
                            htmlFor="sorting"
                            className="col-auto col-form-label d-none d-sm-block"
                          >
                            No of products
                          </label>
                          <div className="col-auto">
                            <select className="form-select" id="sorting" value={count} onChange={handlecountChange} >
                              <option value="50">50</option>
                              <option value="100">100</option>

                              <option value="200">200</option>

                              <option value="500">500</option>

                            </select>
                          </div>
                        </div>
                      </div>
                    </form>
                    <ul
                      className="nav nav-pills flex-nowrap"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li className="nav-item d-lg-none" role="presentation">
                        <button onClick={Opensidebar}
                          className="nav-link active py-2 px-3"
                          id="pills-home-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-home"
                          type="button"
                          role="tab"
                          aria-controls="pills-home"
                          aria-selected="true"
                        >
                          Fillter {' '}<i className="ri-function-line fs-5 ms-2" />
                        </button>
                      </li>

                      {/* <li className="nav-item" role="presentation">
                        <button
                          className="nav-link py-2 px-3"
                          id="pills-profile-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-profile"
                          type="button"
                          role="tab"
                          aria-controls="pills-profile"
                          aria-selected="false"
                        >
                          <i className="ri-list-check fs-5" />
                        </button>
                      </li> */}

                    </ul>
                  </div>
                </div>
              </div>
              {/* Toolbar */}
              {Viewfillter && (
                <div className="w-100">
                  {(() => {
                    try {
                      const parsedFilters = JSON.parse(Viewfillter);
                      return Object.entries(parsedFilters).map(([key, value]) => (
                        <span key={key} className="w-100">

                          {value.split(',').map(val => (
                            <button onClick={() => removeFilter({ key, val })}
                              className="btn btn-sm btn-secondary py-1 px-2 ms-1 mb-2" key={`${key}-${val}`}>
                              {`${key}: ${val}`}  <i class="ri-close-line"></i>
                            </button >
                          ))}
                        </span >
                      ));
                    } catch (error) {
                      console.error("Error parsing Viewfillter:", error);
                      return <div>No filters Found</div>;
                    }
                  })()}
                </div>
              )}


           
              {/* <h2 className="h3 border-bottom pb-4 mb-4">
                Results for   {CatT ? <>  {CatT}  </> : <> loading.. </>}
              </h2> */}
              
              {/* Heading */}
              <div className="tab-content" id="pills-tabContent">
                {/* Product Grid */}
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  {/* Product Cards */}
                  <div className="row pt-2 mx-n2 mb-4 mb-sm-8">
                    {isCat
                      ? Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={index}
                          className="col-lg-4 col-md-4 col-sm-6 mt-4"
                        >
                          <div
                            className="card-1 skeleton"
                            style={{ height: 430, borderRadius: 5 }}
                          ></div>
                        </div>
                      ))
                      : Pro.map((Pro) => {
                        // Calculate average rating for the current product
                        const productRatings = ratings.filter(rating => rating.productId === Pro._id);
                        const totalRatings = productRatings.length;
                        const totalRatingValue = productRatings.reduce((acc, curr) => acc + curr.rating, 0);
                        const averageRating = totalRatings > 0 ? totalRatingValue / totalRatings : 0;

                        return (
                          <>
                 
    <div key={Pro._id} className="col-6 col-md-3 col-lg-2 mb-4">

                                <div className="card border-0 shadow-sm h-100 product-card">

      {/* Image Section */}
      <div className="position-relative">
        <Link to={`/product/${Pro.slug}/${Pro._id}`}>
          <img
            src={Pro.pImage}
            alt={Pro.title}
            className="img-fluid rounded"
            style={{ aspectRatio: "1/1", objectFit: "cover" }}
          />
        </Link>

        {/* ADD Button */}
        <Link  to={`/product/${Pro.slug}/${Pro._id}`} className="btn btn-outline-danger btn-sm fw-bold add-btn">
          VIEW
        </Link>
      </div>

      {/* Card Body */}
      <div className="card-body px-2 pt-2 pb-0">

        {/* Price */}
        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="fw-bold text-white px-2 py-1 rounded bg-green btn-shadow">₹{Pro.salePrice}</span>
          <del className="text-muted small">₹{Pro.regularPrice}</del>
        </div>

        {/* Discount */}
        <div className="text-success small fw-semibold mb-1">
          ₹{Pro.regularPrice - Pro.salePrice} OFF
        </div>

        {/* Title */}
        <h6 className="fw-semibold mb-1">{Pro.title}</h6>

        {/* Quantity */}
        <div className="text-muted small mb-1">{Pro.quantity}</div>

        {/* Tags */}
        {Pro.tag && (
          <span className="badge bg-light text-primary fw-semibold mb-1">
            {Pro.tag}
          </span>
        )}

        {/* Rating */}
        {Pro.rating && (
          <div className="d-flex align-items-center gap-1 mt-1">
            <span className="badge bg-success">
              ⭐ {Pro.rating}
            </span>
            <span className="text-muted small">
              ({Pro.ratingCount})
            </span>
          </div>
        )}
      </div>
    </div>

                              </div>
                            {/* Product */}
                          </>
                        );
                      })}

                    {Pro.length === 0 && !isCat && (
                      <div
                        className="container mx-auto my-2 mt-5 py-2 bg-white text-center"
                        style={{
                          height: 193,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <p>No products found for this category.</p>
                      </div>

                    )}

                    <hr className="d-none d-sm-block" />
                    {/* Pagination */}
                    {/* 
              <div className="d-flex justify-content-between mt-6">
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#">
                      <i className="ri-arrow-left-s-line me-1" />
                      Prev
                    </a>
                  </li>
                </ul>
                <ul className="pagination">
                  <li className="page-item d-sm-none">
                    <span className="page-link page-link-static">1 / 5</span>
                  </li>
                  <li
                    className="page-item active d-none d-sm-block"
                    aria-current="page"
                  >
                    <span className="page-link">
                      1<span className="visually-hidden">(current)</span>
                    </span>
                  </li>
                  <li className="page-item d-none d-sm-block">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item d-none d-sm-block">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item d-none d-sm-block">
                    <a className="page-link" href="#">
                      4
                    </a>
                  </li>
                  <li className="page-item d-none d-sm-block">
                    <a className="page-link" href="#">
                      5
                    </a>
                  </li>
                </ul>
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      Next
                      <i className="ms-1 ri-arrow-right-s-line" />
                    </a>
                  </li>
                </ul>
              </div> */}



                    <div className="d-flex justify-content-between mt-6">
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" type="button" onClick={() => handlePageChange(currentPage - 1)}><i className="ri-arrow-left-s-line me-1"></i>Prev</button>
                        </li>
                      </ul>
                      {/* <ul className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <li className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} key={index}>
              <button className="page-link"  type="button" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
            </li>
          ))}
        </ul> */}
                      <ul className="pagination">
                        <li className={`page-item ${totalPages === 0 ? 'disabled' : ''}`}>
                          <button className="page-link" type="button" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">Next<i className="ms-1 ri-arrow-right-s-line"></i></button>
                        </li>
                      </ul>
                    </div>


                    {/* Pagination */}
                  </div>
                  {/* Product Cards */}
                </div>
                {/* Product Grid */}
                {/* Product List */}
                <div
                  className="tab-pane fade"
                  id="pills-profile"
                  role="tabpanel"
                  aria-labelledby="pills-profile-tab"
                >
                  {/* Product */}
                  <div className="card card-product product-list">
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
                    <div className="d-sm-flex align-items-center">
                      {/* Preview Image */}
                      <a
                        className="product-list-img d-block flex-shrink-0 mx-auto"
                        href="#"
                      >
                        <img
                          src="https://marketop.realthe.me/assets/img/product-card/product-pixel-4a.png"
                          alt="Product"
                        />
                      </a>
                      {/* Preview Image */}
                      <div className="card-body">
                        {/* Product Category */}
                        <a
                          className="product-category d-block fs-sm pb-1"
                          href="#"
                        >
                          Smartphones
                        </a>
                        {/* Product Category */}
                        {/* Product Title */}
                        <h3 className="product-title me-sm-10">
                          <a href="#">Google Pixel 4a 128GB Barely Blue</a>
                        </h3>
                        {/* Product Title */}
                        {/* Star Rating */}
                        <span className="star-rating star-8" />
                        {/* Star Rating */}
                        {/* Product Price */}
                        <div className="product-price">
                          <span className="text-danger fs-5">
                            ₹349
                            <del className="text-body-secondary ms-1">
                              <small>₹499</small>
                            </del>
                          </span>
                        </div>
                        {/* Product Price */}

                        {/* Button */}
                        <button
                          className="btn btn-primary btn-sm d-flex align-items-center justify-content-center mt-1"
                          type="button"
                        >
                          <i className="ri-shopping-cart-2-line me-2" />
                          Add to Cart
                        </button>
                        {/* Button */}
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Product */}
                  {/* Product */}
                  <div className="card card-product product-list">
                    {/* Badges */}
                    <div className="product-badges">
                      <span className="badge bg-danger">11%</span>
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
                    <div className="d-sm-flex align-items-center">
                      {/* Preview Image */}
                      <a
                        className="product-list-img d-block flex-shrink-0 mx-auto"
                        href="#"
                      >
                        <img
                          src="https://marketop.realthe.me/assets/img/product-card/product-iphone-yellow.png"
                          alt="Product"
                        />
                      </a>
                      {/* Preview Image */}
                      <div className="card-body">
                        {/* Product Category */}
                        <a
                          className="product-category d-block fs-sm pb-1"
                          href="#"
                        >
                          Smartphones
                        </a>
                        {/* Product Category */}
                        {/* Product Title */}
                        <h3 className="product-title me-sm-10">
                          <a href="#">Apple iPhone 11 128GB Yellow</a>
                        </h3>
                        {/* Product Title */}
                        {/* Star Rating */}
                        <span className="star-rating star-8" />
                        {/* Star Rating */}
                        {/* Product Price */}
                        <div className="product-price">
                          <span className="text-danger fs-5">
                            ₹699
                            <del className="text-body-secondary ms-1">
                              <small>₹749</small>
                            </del>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Product */}
                  {/* Product */}
                  <div className="card card-product product-list">
                    {/* Badges */}
                    <div className="product-badges">
                      <span className="badge bg-danger">15%</span>
                      <span className="badge bg-info">New</span>
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
                    <div className="d-sm-flex align-items-center">
                      {/* Preview Image */}
                      <a
                        className="product-list-img d-block flex-shrink-0 mx-auto"
                        href="#"
                      >
                        <img
                          src="https://marketop.realthe.me/assets/img/product-card/product-macbook-pro-14.png"
                          alt="Product"
                        />
                      </a>
                      {/* Preview Image */}
                      <div className="card-body">
                        {/* Product Category */}
                        <a
                          className="product-category d-block fs-sm pb-1"
                          href="#"
                        >
                          Notebooks
                        </a>
                        {/* Product Category */}
                        {/* Product Title */}
                        <h3 className="product-title me-sm-10">
                          <a href="#">Apple MacBook Pro 14" 1Tb Silver</a>
                        </h3>
                        {/* Product Title */}
                        {/* Star Rating */}
                        <span className="star-rating star-9" />
                        {/* Star Rating */}
                        {/* Product Price */}
                        <div className="product-price">
                          <span className="text-danger fs-5">
                            ₹2399
                            <del className="text-body-secondary ms-1">
                              <small>₹2499</small>
                            </del>
                          </span>
                        </div>
                        {/* Product Price */}

                        <button
                          className="btn btn-primary btn-sm d-flex align-items-center justify-content-center mt-1"
                          type="button"
                        >
                          <i className="ri-shopping-cart-2-line me-2" />
                          Add to Cart
                        </button>
                        {/* Button */}
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Product */}
                  {/* Product */}
                  <div className="card card-product product-list">
                    {/* Badges */}
                    <div className="product-badges">
                      <span className="badge bg-danger">10%</span>
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
                    <div className="d-sm-flex align-items-center">
                      {/* Preview Image */}
                      <a
                        className="product-list-img d-block flex-shrink-0 mx-auto"
                        href="#"
                      >
                        <img
                          src="https://marketop.realthe.me/assets/img/product-card/product-jbl-earphones.png"
                          alt="Product"
                        />
                      </a>
                      {/* Preview Image */}
                      <div className="card-body">
                        {/* Product Category */}
                        <a
                          className="product-category d-block fs-sm pb-1"
                          href="#"
                        >
                          Headphones
                        </a>
                        {/* Product Category */}
                        {/* Product Title */}
                        <h3 className="product-title me-sm-10">
                          <a href="#">JBL Tune TWS Blue</a>
                        </h3>
                        {/* Product Title */}
                        {/* Star Rating */}
                        <span className="star-rating star-8" />
                        {/* Star Rating */}
                        {/* Product Price */}
                        <div className="product-price">
                          <span className="text-danger fs-5">
                            ₹89
                            <del className="text-body-secondary ms-1">
                              <small>₹99</small>
                            </del>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Product */}
                  {/* Product */}
                  <div className="card card-product product-list">
                    {/* Badges */}
                    <div className="product-badges">
                      <span className="badge bg-danger">15%</span>
                      <span className="badge bg-info">New</span>
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
                    <div className="d-sm-flex align-items-center">
                      {/* Preview Image */}
                      <a
                        className="product-list-img d-block flex-shrink-0 mx-auto"
                        href="#"
                      >
                        <img
                          src="https://marketop.realthe.me/assets/img/product-card/product-apple-watch.png"
                          alt="Product"
                        />
                      </a>
                      {/* Preview Image */}
                      <div className="card-body">
                        {/* Product Category */}
                        <a
                          className="product-category d-block fs-sm pb-1"
                          href="#"
                        >
                          Smart watches
                        </a>
                        {/* Product Category */}
                        {/* Product Title */}
                        <h3 className="product-title me-sm-10">
                          <a href="#">Apple Watch 7 Aluminum 45 mm</a>
                        </h3>
                        {/* Product Title */}
                        {/* Star Rating */}
                        <span className="star-rating star-10" />
                        {/* Star Rating */}
                        {/* Product Price */}
                        <div className="product-price">
                          <span className="text-danger fs-5">
                            ₹399
                            <del className="text-body-secondary ms-1">
                              <small>₹499</small>
                            </del>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Product */}
                  {/* Product */}
                  <div className="card card-product product-list">
                    {/* Badges */}
                    <div className="product-badges">
                      <span className="badge bg-danger">10%</span>
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
                    <div className="d-sm-flex align-items-center">
                      {/* Preview Image */}
                      <a
                        className="product-list-img d-block flex-shrink-0 mx-auto"
                        href="#"
                      >
                        <img
                          src="https://marketop.realthe.me/assets/img/product-card/product-sony-speaker.png"
                          alt="Product"
                        />
                      </a>
                      {/* Preview Image */}
                      <div className="card-body">
                        {/* Product Category */}
                        <a
                          className="product-category d-block fs-sm pb-1"
                          href="#"
                        >
                          Speakers
                        </a>
                        {/* Product Category */}
                        {/* Product Title */}
                        <h3 className="product-title me-sm-10">
                          <a href="#">Sony Smart Speaker</a>
                        </h3>
                        {/* Product Title */}
                        {/* Star Rating */}
                        <span className="star-rating star-8" />
                        {/* Star Rating */}
                        {/* Product Price */}
                        <div className="product-price">
                          <span className="text-danger fs-5">
                            ₹49
                            <del className="text-body-secondary ms-1">
                              <small>₹59</small>
                            </del>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Product */}
                  {/* Product */}
                  <div className="card card-product product-list">
                    {/* Badges */}
                    <div className="product-badges">
                      <span className="badge bg-danger">11%</span>
                      <span className="badge bg-info">New</span>
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
                    <div className="d-sm-flex align-items-center">
                      {/* Preview Image */}
                      <a
                        className="product-list-img d-block flex-shrink-0 mx-auto"
                        href="#"
                      >
                        <img
                          src="https://marketop.realthe.me/assets/img/product-card/product-samsung-tablet.png"
                          alt="Product"
                        />
                      </a>
                      {/* Preview Image */}
                      <div className="card-body">
                        {/* Product Category */}
                        <a
                          className="product-category d-block fs-sm pb-1"
                          href="#"
                        >
                          Tablets
                        </a>
                        {/* Product Category */}
                        {/* Product Title */}
                        <h3 className="product-title me-sm-10">
                          <a href="#">Samsung Galaxy Tab S6</a>
                        </h3>
                        {/* Product Title */}
                        {/* Star Rating */}
                        <span className="star-rating star-8" />
                        {/* Star Rating */}
                        {/* Product Price */}
                        <div className="product-price">
                          <span className="text-danger fs-5">
                            ₹399
                            <del className="text-body-secondary ms-1">
                              <small>₹449</small>
                            </del>
                          </span>
                        </div>
                        {/* Product Price */}
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Product */}
                  {/* Product */}
                  <div className="card card-product product-list">
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
                    <div className="d-sm-flex align-items-center">
                      {/* Preview Image */}
                      <a
                        className="product-list-img d-block flex-shrink-0 mx-auto"
                        href="#"
                      >
                        <img
                          src="https://marketop.realthe.me/assets/img/product-card/product-bose-headphones.png"
                          alt="Product"
                        />
                      </a>
                      {/* Preview Image */}
                      <div className="card-body">
                        {/* Product Category */}
                        <a
                          className="product-category d-block fs-sm pb-1"
                          href="#"
                        >
                          Headphones
                        </a>
                        {/* Product Category */}
                        {/* Product Title */}
                        <h3 className="product-title me-sm-10">
                          <a href="#">Bose QuietComfort 45</a>
                        </h3>
                        {/* Product Title */}
                        {/* Star Rating */}
                        <span className="star-rating star-8" />
                        {/* Star Rating */}
                        {/* Product Price */}
                        <div className="product-price">
                          <span className="text-danger fs-5">
                            ₹299
                            <del className="text-body-secondary ms-1">
                              <small>₹349</small>
                            </del>
                          </span>
                        </div>
                        {/* Product Price */}
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Product */}
                  {/* Product */}
                  <div className="card card-product product-list">
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
                    <div className="d-sm-flex align-items-center">
                      {/* Preview Image */}
                      <a
                        className="product-list-img d-block flex-shrink-0 mx-auto"
                        href="#"
                      >
                        <img
                          src="https://marketop.realthe.me/assets/img/product-card/product-xiaomi-redmi.png"
                          alt="Product"
                        />
                      </a>
                      {/* Preview Image */}
                      <div className="card-body">
                        {/* Product Category */}
                        <a
                          className="product-category d-block fs-sm pb-1"
                          href="#"
                        >
                          Smartphones
                        </a>
                        {/* Product Category */}
                        {/* Product Title */}
                        <h3 className="product-title me-sm-10">
                          <a href="#">Xiaomi Redmi 10 128GB Coral Blue</a>
                        </h3>
                        {/* Product Title */}
                        {/* Star Rating */}
                        <span className="star-rating star-8" />
                        {/* Star Rating */}
                        {/* Product Price */}
                        <div className="product-price">
                          <span className="text-danger fs-5">
                            ₹199
                            <del className="text-body-secondary ms-1">
                              <small>₹249</small>
                            </del>
                          </span>
                        </div>
                        {/* Product Price */}
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Product */}
                  {/* Pagination */}
                  <div className="d-flex justify-content-between mt-6">
                    <ul className="pagination">
                      <li className="page-item">
                        <a className="page-link" href="#">
                          <i className="ri-arrow-left-s-line me-1" />
                          Prev
                        </a>
                      </li>
                    </ul>
                    <ul className="pagination">
                      <li className="page-item d-sm-none">
                        <span className="page-link page-link-static">
                          1 / 5
                        </span>
                      </li>
                      <li
                        className="page-item active d-none d-sm-block"
                        aria-current="page"
                      >
                        <span className="page-link">
                          1<span className="visually-hidden">(current)</span>
                        </span>
                      </li>
                      <li className="page-item d-none d-sm-block">
                        <a className="page-link" href="#">
                          2
                        </a>
                      </li>
                      <li className="page-item d-none d-sm-block">
                        <a className="page-link" href="#">
                          3
                        </a>
                      </li>
                      <li className="page-item d-none d-sm-block">
                        <a className="page-link" href="#">
                          4
                        </a>
                      </li>
                      <li className="page-item d-none d-sm-block">
                        <a className="page-link" href="#">
                          5
                        </a>
                      </li>
                    </ul>
                    <ul className="pagination">
                      <li className="page-item">
                        <a className="page-link" href="#" aria-label="Next">
                          Next
                          <i className="ms-1 ri-arrow-right-s-line" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  {/* Pagination */}
                </div>
                {/* Product List */}
              </div>
            </aside>
            {/* Content */}


     



          </div>


                 {/* Product Cards */}
                 <div className="container pb-4 pb-lg-10 mt-5">
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
                  ) : (layout.recommended_products && (
                    <>
                      {RProducts.map((product, index) => {
                        const productRatings = ratings.filter(rating => rating.productId === product._id);
                        const totalRatings = productRatings.length;
                        const totalRatingValue = productRatings.reduce((acc, curr) => acc + curr.rating, 0);
                        const averageRating = totalRatings > 0 ? totalRatingValue / totalRatings : 0;


                        return (

                          layout.recommended_products.includes(product._id) && (<>

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
                                  <span className="product-meta text-body-secondary fs-xs d-none">
                                    {" "}
                                    Only <span>6</span> left in stock{" "}
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


        </div>

        {/* Product Category */}

      </div >

      <Footer />
    </>
  );
};

export default Category;
