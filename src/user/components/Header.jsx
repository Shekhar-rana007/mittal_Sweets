import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../redux/store";
import toast from "react-hot-toast";
import TokenValidator from "../../fetchdata/TokenValidator";
import Cart from "./Cart";
import logo from "../assets_user/img/logo/ecomm-logo.svg"; // Import the logo image
import { useBlogContext } from "../../fetchdata/BlogContext";
import $ from "jquery";
import { Helmet } from "react-helmet";
import getCookie from "./extra/getCookie";
import eraseCookie from "./extra/eraseCookie";
import CreateSlug from "./extra/CreateSlug";

const MenuItem = ({ item }) => {
  return (
    <li key={item.id} className={item.children ? 'has_submenu' : ''}>
      {item.children && item.children.length > 0 ? (
        <>
          <span>
            <Link to={item.link} target={item.target === '_blank' ? '_blank' : ''}>
              {item.text}
            </Link>
            <i class="ri-arrow-right-s-line"></i>
          </span>
          <SubMenu items={item.children} />
        </>
      ) : (
        <Link to={item.link} target={item.target === '_blank' ? '_blank' : ''}>
          {item.text}
        </Link>
      )}
    </li>
  );
};

const SubMenu = ({ items }) => {



  return (
    <ul className="submenu">
      <li>
        <span className="mobile_menu_back">
          <i class="ri-arrow-left-line"></i> Back
        </span>
      </li>
      {items.map(child => (
        <MenuItem key={child.id} item={child} />
      ))}
    </ul>
  );
};

const Header = () => {
  const location = useLocation();

  const [user, setUser] = useState(null);


  const [showSearch, setShowSearch] = useState('false');
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };


  // require("../assets_user/css/style.css");
  // require("../assets_user/css/plugins.css");
  // require('../assets_user/fonts/icons.css')

  const { Headers, isHeader, cartItems, AllProducts, AllCategoriess } = useBlogContext();
  if (isHeader) {
    // console.log("Headers", Headers);
  }



  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleSubMenu = (event) => {
    const submenu = event.target.nextElementSibling;
    submenu.classList.toggle("open");
  };

  const goBack = (event) => {
    const parentSubMenu = event.target.closest(".submenu");
    parentSubMenu.classList.remove("open");
  };


  useEffect(() => {
    $("#mobile_menu_container").removeClass("open");
    const storedUser = JSON.parse(getCookie("user"));
    setUser(storedUser);
  }, [location.pathname]);



  useEffect(() => {
    window.scrollTo(0, 0);

    $("#mobile_menu_trigger").click(function () {
      $("#mobile_menu_container").toggleClass("open");
    });

    $("#mobile_menu_trigger_mob").click(function () {
      $("#mobile_menu_container").toggleClass("open");
    });


    $("#mobile_menu_container, .mobile_menu_close, .mobile_menu_close i").on(
      "click",
      function (e) {
        if (e.target === this) {
          $("#mobile_menu_container").toggleClass("open");
          /* $('#mobile_menu_container_inner').toggleClass('open'); */
        }
      }
    );

    $(document).on("click", "#mobile_menu .has_submenu > span", function () {
      $("+ .submenu", $(this)).addClass("open");
    });

    $(document).on("click", "#mobile_menu .sub_sub_menu > span", function () {
      $("+ ul", $(this)).addClass("open");
    });

    $(document).on("click", "#mobile_menu .mobile_menu_back", function () {
      $(this).closest("ul").removeClass("open");
    });
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearClick = () => {
    setSearchQuery("");
  };

  const filteredProducts = AllProducts.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCategories = AllCategoriess.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsStuck(true);
      } else {
        setIsStuck(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures that this effect runs only once after initial render

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the value of isMenuOpen
  };

  // const isLogin = useSelector(state => state.isLogin)
  // console.log(isLogin)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  //state
  const [value, setValue] = useState();

  // const isLoginFromLocalStorage = localStorage.getItem("token") ? true : false;
  const isLoginFromLocalStorage = getCookie('token') ? true : false;
  const [isLogin, setIsLogin] = useState(isLoginFromLocalStorage);

  useEffect(() => {
    setIsLogin(isLoginFromLocalStorage);
  }, [isLoginFromLocalStorage]);

  //logout
  const handleLogout = () => {
    try {
      dispatch(authActions.logout());
      toast.success("Logout Successfully");
      navigate("/login");
       localStorage.clear();
       eraseCookie('token');
       eraseCookie('userId');
       eraseCookie('user');
    //  localStorage.removeItem("token");
      // localStorage.removeItem("userId");
      // localStorage.removeItem("user");
      
    } catch (error) {
      console.log(error);
    }
  };
  const [isCartActive, setCartIsActive] = useState(false);

  const toggleCartClass = () => {
    setCartIsActive(!isCartActive);
  };

  return (
    <>
      <TokenValidator />

      <Helmet>
        {typeof Headers?.meta_favicon === "string" && Headers.meta_favicon && (
          <link rel="apple-touch-icon" href={Headers.meta_favicon} />
        )}
        {typeof Headers?.meta_title === "string" && Headers.meta_title && (
          <title>{Headers.meta_title}</title>
        )}
      </Helmet>

{/* <div className="bg-dark p-2 text-center text-white"> FLAT ₹200 OFF on 1st App order|Download Now </div> */}
      <nav class="navbar" style={{ display: "none" }}>
        <div class="container-fluid">
          <div className="logo">
            <Link to="/"> Ecomm App </Link>
          </div>

          <div>
            <ul className="link-list2 ms-auto">
              <div className="search  me-4">
                <input placeholder="Search" type="text" className="" />
                <button type="submit" className="search-icon">
                  <i class="bi bi-search"></i>
                </button>
              </div>
              <li>
                <button
                  className={
                    isCartActive ? "cartbutton Isactive" : "cartbutton"
                  }
                  onClick={toggleCartClass}
                >
                  {isCartActive ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={25}
                        height={25}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1d1d1d"
                        strokeWidth={2}
                        strokeLinecap="square"
                        strokeLinejoin="arcs"
                      >
                        <line x1={18} y1={6} x2={6} y2={18} />
                        <line x1={6} y1={6} x2={18} y2={18} />
                      </svg>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        fill="currentColor"
                        class="bi bi-bag"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                      </svg>
                      {cartItems.length > 0 && (
                        <span class="carttotal">{cartItems.length}</span>
                      )}
                    </>
                  )}
                </button>
              </li>

              {!isLogin && (
                <>
                  <li>
                    <Link to="/login">login</Link>
                  </li>

                  <li>
                    <Link to="/signup">Signup</Link>
                  </li>
                </>
              )}

              {isLogin && (
                <>
                  <li>
                    <Link to="/account">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        fill="currentColor"
                        class="bi bi-person"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                      </svg>
                    </Link>
                  </li>

                  <li>
                    <Link onClick={handleLogout}>Logout</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div
        className={isCartActive ? "cart-sidebar Isactive" : "cart-sidebar"}
        style={{ display: "none" }}
      >
        <Cart />
      </div>

      <>
        {/* Header */}
        <header className="navigation shadow-sm border-bottom">
          {/* Topbar */}

          {/* Topbar */}
          {/* Navbar Sticky */}
          <div
            className={isStuck ? "navbar-sticky navbar-stuck" : "navbar-sticky"}
          >
            {/* Navbar */}
            <div className="navbar navbar-middle navbar-expand-lg">
              <div className="container">
                 {/* Logo */}
                               <Link className="navbar-brand flex-shrink-0 d-sm-none" to="/">
                                 {Headers.meta_logo && Headers.meta_logo !== undefined ? (
                                   <img src={Headers.meta_logo} width={120} alt="logo" style={{ maxHeight: 50, width: "auto" }} 
                                   className=" " />
                                 ) : (
                                   <div
                                     className="card-1 skeleton"
                                     style={{ borderRadius: 5,aspectRatio:'300/42' }}
                                   ></div>
                                 )}
                               </Link>
                               <Link
                                 className="navbar-brand flex-shrink-0 d-none d-sm-block"
                                 to="/"
                               >
                                 {Headers.meta_logo && Headers.meta_logo !== undefined ? (
                                   <img src={Headers.meta_logo}  className=" " style={{ maxHeight: 80, width: "auto" }} 
                                   alt="logo" />
                                 ) : (
                                   <div
                                     className="card-1 skeleton"
                                     style={{ height: 50, width: 300, borderRadius: 5 }}
                                   ></div>
                                 )}
                               </Link>
                               {/* Logo */}
           
                {/* Navbar Actions */}
                <div className="navbar-actions">
                

  {/* Primary Menu */}
                  <ul className="navbar-nav w-100 d-flex justify-content-between d-mob-none">
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        id="mobile_menu_trigger"
                        to="#"
                        onClick={toggleMenu}
                      >
                        All
                      </Link>
                    </li>

                 

                 {isHeader
  ? Array.from({ length: 8 }).map((_, index) => (
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
  : Headers.header !== undefined &&
    Headers.header.slice(0, 8).map((item) => {
      return (
        <li
          className={`nav-item dropdown ${
            item.children && item.children.length > 0 ? "position-static" : ""
          }`}
          key={item.id}
        >
          <Link
            className={`nav-link ${
              item.children && item.children.length > 0
                ? "dropdown-toggle"
                : ""
            }`}
            to={item.link}
            target={item.target === "_blank" ? "_blank" : ""}
          >
            {item.text}
          </Link>

          {item.children && item.children.length > 0 && (
            <div className="dropdown-menu p-0 mega-menu">
              <div className="row px-4 py-4">
                {item.children.slice(0, 50).map((child) => (
                  <div className="col-md-3" key={child.id}>
                    <div className="widget widget-links mb-4">
                      <h6 className="fs-base mb-3">
                        <Link
                          className="widget-list-link"
                          to={child.link}
                          target={child.target === "_blank" ? "_blank" : ""}
                        >
                          <b>{child.text}</b>
                        </Link>
                      </h6>

                      <ul className="widget-list">
                        {child.children &&
                          child.children.slice(0, 20).map((subChild) => (
                            <li
                              className="widget-list-item"
                              key={subChild.id}
                            >
                              <Link
                                className="widget-list-link"
                                to={subChild.link}
                                target={
                                  subChild.target === "_blank"
                                    ? "_blank"
                                    : ""
                                }
                              >
                                {subChild.text}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </li>
      );
    })}
                  </ul>

                    <Link
                    className="navbar-actions-item navbar-stuck-toggle"
                    onClick={handleMenuToggle}
                  >
                    <div className="navbar-actions-icon-box">
                      {isMenuOpen ? (
                        <i className="navbar-actions-icon ri-close-line fs-7" />
                      ) : (
                        <i className="navbar-actions-icon ri-search-line fs-5" />
                      )}
                    </div>
                  </Link>
                  <Link
                    href="#"
                    className="navbar-actions-item d-lg-none"
                    id="mobile_menu_trigger_mob"
                  >
                    <div className="navbar-actions-icon-box">
                      {isMenuOpen ? (
                        <i className="navbar-actions-icon ri-close-line fs-7" />
                      ) : (
                        <i className="navbar-actions-icon ri-menu-line fs-5" />
                      )}
                    </div>
                  </Link>

                  
                  {isLogin ? (<>


                    <div class="d-flex">

                      <Link to='/account' className="navbar-actions-item">
                        <div className="navbar-actions-icon-box">
                          <i className="navbar-actions-icon ri-user-line fs-5" />
                        </div>
                        {/* <div className="navbar-actions-text d-none d-lg-block fs-md pe-3">
                          <small className="d-block mb-n1"> {user && user.username !== '' && user.username !== undefined ? (
      user.username 
      ) : (
    <> Welcome, User  </> 
      )} </small>  <b  > My Account</b>
                        </div> */}
                      </Link>

                      <Link onClick={handleLogout} className="navbar-actions-item d-mob-none">
                        <div className="navbar-actions-icon-box ">
                          < i class="navbar-actions-icon  ri-logout-box-r-line fs-5" />
                        </div>
                        <div className="navbar-actions-text d-none d-lg-block fs-md pe-3">
                          <small className="d-block mb-n1"> Account </small>  <b className="text-danger"> Logout</b>
                        </div>
                      </Link>

                    </div>

                    <Link to="/wishList" className="navbar-actions-item d-mob-none">
                    <div className="navbar-actions-icon-box">
                      <svg
                        style={{ width: 30, height: 30 }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M349.6 64c-36.4 0-70.718 16.742-93.6 43.947C233.117 80.742 198.8 64 162.4 64 97.918 64 48 114.221 48 179.095c0 79.516 70.718 143.348 177.836 241.694L256 448l30.164-27.211C393.281 322.442 464 258.61 464 179.095 464 114.221 414.082 64 349.6 64zm-80.764 329.257l-4.219 3.873-8.617 7.773-8.616-7.772-4.214-3.869c-50.418-46.282-93.961-86.254-122.746-121.994C92.467 236.555 80 208.128 80 179.095c0-22.865 8.422-43.931 23.715-59.316C118.957 104.445 139.798 96 162.4 96c26.134 0 51.97 12.167 69.11 32.545L256 157.661l24.489-29.116C297.63 108.167 323.465 96 349.6 96c22.603 0 43.443 8.445 58.686 23.778C423.578 135.164 432 156.229 432 179.095c0 29.033-12.467 57.459-40.422 92.171-28.784 35.74-72.325 75.709-122.742 121.991z" />
                      </svg>
                    </div>
                  </Link>

                  </>) : (<>

                    <Link to="/login" className="navbar-actions-item">
                      <div className="navbar-actions-icon-box">
                        <i className="navbar-actions-icon ri-user-line fs-5" />
                      </div>
                      <div className="navbar-actions-text d-none d-lg-block fs-md pe-3">
                        <small className="d-block mb-n1">Login</small> Account
                      </div>
                    </Link>
                  </>)}



                 

                  <Link to="/cart" className="navbar-actions-item">
                    <div className="navbar-actions-icon-box">
                      <svg
                        style={{ width: 30, height: 30 }}
                        xmlns="http://www.w3.org/2000/svg"
                        data-name="Your Icons"
                        viewBox="0 0 48 48"
                      >
                        <path d="M12.11 44h23.78A4 4 0 0 0 40 39.6l-2.26-22a4.07 4.07 0 0 0-4.11-3.6H32v-2a8 8 0 0 0-16 0v2h-1.63a4.07 4.07 0 0 0-4.09 3.6L8 39.6a4 4 0 0 0 4.11 4.4ZM18 12a6 6 0 0 1 12 0v2H18Zm-5.73 5.81a2.07 2.07 0 0 1 2.1-1.81H16v2.89a1.5 1.5 0 1 0 2 0V16h12v2.89a1.5 1.5 0 1 0 2 0V16h1.63a2.07 2.07 0 0 1 2.1 1.81l2.26 22a1.89 1.89 0 0 1-.5 1.49 2.16 2.16 0 0 1-1.6.7H12.11a2.16 2.16 0 0 1-1.6-.7A1.93 1.93 0 0 1 10 40h24a1 1 0 0 0 0-2H10.2Z" />
                      </svg>

                      {/* <i className="navbar-actions-icon ri-shopping-cart-2-line fs-5" /> */}
                    </div>

                    {cartItems.length > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"> {cartItems.length}</span>
                    )}


                  </Link>

                  <button onClick={toggleSearch} className="navbar-actions-item border-0 d-lg-none">
                    <div className="navbar-actions-icon-box">
                      <i className="navbar-actions-icon ri-search-line fs-5" />
                    </div>

                  </button>


                </div>
                {/* Navbar Actions */}
              </div>
            </div>
            {/* Navbar */}
            {/* Navs */}
            <div
              className={`${isMenuOpen ? "overlayshow d-lg-none" : "d-lg-none"
                }`}
            >
              {" "}
            </div>

            <div
              className={`navbar navbar-expand-lg navbar-stuck-menu py-0 py-lg-1 bg-body-tertiary${isMenuOpen ? " show" : ""
                }`}
            >
              <div className="container">

 {/* Search */}
                <div className={`input-group d-none d-lg-flex me-5 w-500 searchbox ${!showSearch && ('search-view')} `}>
                  <button
                    type="button"
                    className="btn btn-primary bg-gradient d-none d-lg-block search"
                  >
                    <i class="ri-search-line"></i>
                  </button>
            
                  <input
                    id="searchInput"
                    className="form-control searchinput"
                    type="text"
                    placeholder="Search for products,category and more"
                    value={searchQuery}
                    onChange={handleInputChange}
                  />

                  {searchQuery && (<>
                    <ul class="searchfloat">


                      {searchQuery && filteredProducts && filteredProducts.map(item =>{
                        console.log('item.slug',item.slug)
                         const myslug = CreateSlug(item.slug); // Make sure `data` and `Product` are defined and available in the scope.
                        return (

                        <li key={item.id}>
                          <Link to={`/product/${myslug}/${item._id}`} onClick={handleClearClick} > <i class="ri-shopping-bag-line"></i> {item.title}</Link>
                        </li>

                 
);
})}
                      {searchQuery && filteredCategories && filteredCategories.map(item => {
                        
  return (
  
                        <li key={item.id}>
                          <Link to={`/category/${item._id}`} onClick={handleClearClick} > <i class="ri-list-check-2"></i> {item.title}</Link>
                        </li>

);
})}

{filteredProducts.length === 0 && filteredCategories.length === 0 ? (
    <li className="bg-danger "> <p className="pt-1 px-3 text-center text-white"> Not Product & Category Found </p> </li>
) : null}


                    </ul>

                  </>)}

                  {/* <select
              id="searchSelect"
              className="form-select flex-shrink-0"
              style={{ maxWidth: "11rem" }}
            >
              <option>All categories</option>
              <option>Computers</option>
              <option>Notebooks</option>
              <option>Smartphones</option>
              <option>TV, Monitors</option>
              <option>Cameras</option>
              <option>Headphones</option>
              <option>Headsets</option>
              <option>Printers</option>
              <option>Consoles</option>
              <option>Games</option>
              <option>Storage</option>
            </select> */}
                  {searchQuery && (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary bg-gradient d-none d-lg-block close"
                        onClick={handleClearClick}
                      >
                        {" "}
                        <i class="navbar-actions-icon ri-close-line fs-7"></i>{" "}
                      </button>
                    </>
                  )}
                </div>
                {/* Search */}
				

                <div
                  className="collapse navbar-collapse d-none"
                  id="navbarCollapse"
                >
                  {/* Departments Menu */}
                  <ul className="navbar-nav mega-nav pe-lg-1 me-lg-1  mt-3 mt-lg-0 d-lg-none">
                    <div className="navbar-actions d-lg-none w-100 justify-content-between mb-2 bg-black p-3">
                      <a
                        href="account-login"
                        className="navbar-actions-item bg-black"
                        previewlistener="true"
                      >
                        <div className="navbar-actions-icon-box">
                          <i className="navbar-actions-icon ri-user-line fs-5" />
                        </div>
                        <div className="navbar-actions-text fs-md pe-3">
                          <small className="d-block mb-n1">Sign In</small>{" "}
                          Account
                        </div>
                      </a>

                      <Link
                        href="#"
                        className="navbar-actions-item d-lg-none bg-black"
                        onClick={handleMenuToggle}
                      >
                        <div className="navbar-actions-icon-box">
                          {isMenuOpen ? (
                            <i className="navbar-actions-icon ri-close-line fs-7" />
                          ) : (
                            <i className="navbar-actions-icon ri-menu-line fs-5" />
                          )}
                        </div>
                      </Link>
                    </div>

                    <li className="nav-item dropdown">
                      {/* <a
                  className="nav-link dropdown-toggle ps-lg-0"
                  href="#"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  <i className="ri-function-line me-2" /> All Departments{" "}
                </a> */}

           
                    </li>
                  </ul>
                  {/* Departments Menu */}
                
                  {/* Primary Menu */}
                </div>
              </div>
            </div>
            {/* Navs */}
          </div>
          {/* Navbar Sticky */}
        </header>

        <div id="mobile_menu_container" className="">
          <div id="mobile_menu_container_inner">
            <div className="mobile_menu_top">
              <Link to="/">
              {Headers.meta_logo && Headers.meta_logo !== undefined ? (
                    <img src={Headers.meta_logo} width={120} alt="logo" style={{ maxHeight: 50, width: "auto" }}  />
                  ) : (
                    <div
                      className="card-1 skeleton"
                      style={{ borderRadius: 5,aspectRatio:'300/42' }}
                    ></div>
                  )}
              </Link>
              <div className="mobile_menu_close">
                <i class="ri-close-line"></i>
              </div>
            </div>
            <div id="mobile_menu_image_links"></div>


            {/* <ul id="mobile_menu">
              <li>
                <a href="https://learn.storecomet.com/">
                  Father's day gift baskets
                </a>
              </li>
              <li className="has_submenu">
                <span>
                  <a href="https://learn.storecomet.com/">
                    Gift Baskets &amp; towers 1{" "}
                  </a>{" "}
                  <i className="fa fa-chevron-right" />
                </span>
                <ul className="submenu">
                  <li>
                    <span className="mobile_menu_back">
                      <i className="fa fa-arrow-left" /> Back
                    </span>
                  </li>

                  

                  <li className="has_submenu">
                    <span>
                      <a href="https://learn.storecomet.com/">
                        Gift Baskets &amp; towers 2{" "}
                      </a>{" "}
                      <i className="fa fa-chevron-right" />
                    </span>

                    <ul className="submenu">
                      <li>
                        <span className="mobile_menu_back">
                          <i className="fa fa-arrow-left" /> Back
                        </span>
                      </li>

                      <li className="has_submenu">
                        <span>
                          <a href="https://learn.storecomet.com/">
                            Gift Baskets &amp; towers 3
                          </a>{" "}
                          <i className="fa fa-chevron-right" />
                        </span>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li>
                <a href="https://learn.storecomet.com/">Birthday</a>
              </li>
              <li>
                <a href="https://learn.storecomet.com/">Sympathy</a>
              </li>
              <li>
                <a href="https://learn.storecomet.com/">Corporate</a>
              </li>
              <li>
                <a href="https://learn.storecomet.com/">wine gifts</a>
              </li>
              <li>
                <a href="https://learn.storecomet.com/">Bakery gifts</a>
              </li>
              <li>
                <a href="https://learn.storecomet.com/">Kosher gifts</a>
              </li>
              <li>
                <a className="no_bg_color" href="https://learn.storecomet.com/">
                  <i className="fa fa-percent static" /> Sale
                </a>
              </li>
              <li>
                <a className="no_bg_color" href="https://learn.storecomet.com/">
                  <i className="fa fa-phone-alt static" /> Contact us
                </a>
              </li>
              <li>
                <a className="no_bg_color" href="https://learn.storecomet.com/">
                  <i className="fa fa-cube static" /> Bulk order
                </a>
              </li>
              <li>
                <a className="no_bg_color" href="https://learn.storecomet.com/">
                  <i className="fa fa-map-marker static" /> Track order
                </a>
              </li>
              <li>
                <a className="no_bg_color" href="https://learn.storecomet.com/">
                  <i className="fa fa-user-o static" /> Sign up
                </a>
              </li>
            </ul> */}



            <ul id="mobile_menu">
              {Headers.header && Headers.header.length > 0 && Headers.header.map(item => (
                <MenuItem key={item.id} item={item} />
              ))}

              <li className="has_submenu">
                <Link
                  to="/allblogs"
                >
                  All Blogs
                </Link>
              </li>

              {isLogin ? (<>
                <li className="has_submenu">
                  <Link
                    to="/account"
                  >
                    Account
                  </Link>
                </li>

                <li className="has_submenu">
                  <Link
                    to="/wishList"
                  >
                    Wishlist
                  </Link>
                </li>


                <li className="has_submenu">
                  <Link
                    to="/comparsion"
                  >
                    Comparsion
                  </Link>
                </li>

                <li className="has_submenu">
                  <Link
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </li>


              </>) : (<>

                <li className="has_submenu">
                  <Link
                    to="/comparsion"
                  >
                    Login / Signup
                  </Link>
                </li>



              </>)
              }

            </ul>



          </div>
        </div>

        {/* Header */}
      </>
    </>
  );
};

export default Header;
