import React, { useState, useEffect, useContext, Component } from 'react';
import { useNavigate,Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/store';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';


const About = () => {

    return (
        <>
            <Header />

            <main className="page">
  {/* Header */}
  {/* Header */}
  {/* Page Title */}
  <div
    className="py-4 mb-4 mb-lg-10 whitesmoke"
  
  >
    <div className="container d-lg-flex justify-content-between align-items-center py-2 py-lg-4">
      <div className="pe-lg-4 text-center text-lg-start">
        <h1 className="h3 mb-0">About Us</h1>
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
              About Us
            </li>
          </ol>
        </nav>
      </div>
    </div>
  </div>
  {/* Page Title */}
  {/* Content */}
  <div className="container mb-4 mb-lg-10">
    <div className="row g-4 g-lg-10">
      <div className="col-12 col-lg-9">
        <h4>Who We Are</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat,
          maxime. Nobis iusto voluptatibus, nam iure exercitationem vel beatae
          repudiandae molestiae. Perferendis, fugiat. Illum reprehenderit a ea
          suscipit. Consequuntur mollitia inventore placeat aliquam similique
          beatae et, dolores deleniti architecto eos ex repudiandae voluptatem
          non fugit numquam vel, fugiat necessitatibus ullam odio. Commodi fuga
          optio, repudiandae fugiat ipsam dolorum. Ipsum illo veniam dignissimos
          maiores commodi facilis sed impedit, ea, vel possimus deleniti
          molestiae, eaque alias. Sunt magni corporis rerum laborum, hic optio
          magnam earum similique provident quos explicabo dolorem. Fugit ratione
          quo, architecto aut ut animi eveniet expedita nobis assumenda
          consequatur voluptas, impedit repellat omnis numquam. Quaerat
          exercitationem minima culpa temporibus dolorum assumenda asperiores,
          molestias sint. Praesentium, reiciendis veniam.
        </p>
        <p>
          Minima ullam aspernatur soluta officiis voluptatum dicta praesentium
          tempore aperiam veniam animi provident placeat, ad repellat, maxime
          impedit autem. Nisi ad excepturi repellat hic incidunt perferendis
          tenetur dolores illum aut. Nulla vero inventore cupiditate quos
          accusamus mollitia eos. Ex animi nisi blanditiis voluptas! Suscipit
          cupiditate beatae vitae eius laboriosam repellat nemo similique
          deserunt, quas doloremque enim praesentium fugit, tempore
          necessitatibus. Perferendis ullam ex similique accusamus sapiente?
          Natus, perferendis labore. Tempore labore molestiae itaque beatae
          deleniti sequi ex fugit accusamus tempora ducimus et magnam saepe,
          vitae neque repudiandae. Facilis, illo consequatur. Consectetur
          commodi hic magnam id fugit pariatur dolorem debitis neque quas magni
          dolores mollitia doloremque corrupti cum a ratione obcaecati nesciunt
          odio, aliquam dolorum architecto ipsa ex. Expedita, illo eos.
        </p>
        <h4>Our Story</h4>
        <p>
          Aspernatur soluta officiis voluptatum dicta praesentium tempore
          aperiam veniam animi provident placeat, ad repellat, maxime impedit
          autem. Nisi ad excepturi repellat hic incidunt perferendis tenetur
          dolores illum aut. Nulla vero inventore cupiditate quos accusamus
          mollitia eos. Ex animi nisi blanditiis voluptas! Suscipit cupiditate
          beatae vitae eius laboriosam repellat nemo similique deserunt, quas
          doloremque enim praesentium fugit, tempore necessitatibus.
        </p>
        <p>
          Perferendis ullam ex similique accusamus sapiente? Natus, perferendis
          labore. Tempore labore molestiae itaque beatae deleniti sequi ex fugit
          accusamus tempora ducimus et magnam saepe, vitae neque repudiandae.
          Facilis, illo consequatur. Consectetur commodi hic magnam id fugit
          pariatur dolorem debitis neque quas magni dolores mollitia doloremque
          corrupti cum a ratione obcaecati nesciunt odio, aliquam dolorum
          architecto ipsa ex. Expedita, illo eos.
        </p>
        <p className="lead text-body-secondary">
          {" "}
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt
          amet tempore ea accusantium repudiandae libero voluptates ad quis
          porro at officia deleniti ex cum esse ducimus, dolor fugit in
          accusamus"{" "}
        </p>
      </div>
      <div className="col-12 col-lg-3">
        <div className="row g-4 g-lg-10">
          <div className="col-12 col-sm-6 col-lg-12">
            <img src="https://img.freepik.com/premium-vector/photo-icon-picture-icon-image-sign-symbol-vector-illustration_64749-4409.jpg" alt="image" />
            <h6 className="p-5">CEO/Founder</h6>
          </div>
          <div className="col-12 col-sm-6 col-lg-12">
            <img src="https://img.freepik.com/premium-vector/photo-icon-picture-icon-image-sign-symbol-vector-illustration_64749-4409.jpg" alt="image" />
            <h6 className="p-5"> Co-Founder</h6>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Content */}
  {/* Cards */}
  <div className="py-4 py-lg-10">
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0">
            <div className="card-body">
              <i
                className="ri-truck-line text-info"
                style={{ fontSize: "3rem" }}
              />
              <h6>Fast Delivery</h6>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Asperiores iste dicta ullam, sit odio earum eius ex laborum
                fugit neque.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0">
            <div className="card-body">
              <i
                className="ri-exchange-dollar-line text-success"
                style={{ fontSize: "3rem" }}
              />
              <h6>Money Back Guarantee</h6>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Asperiores iste dicta ullam, sit odio earum eius ex laborum
                fugit neque.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0">
            <div className="card-body">
              <i
                className="ri-customer-service-2-line text-primary"
                style={{ fontSize: "3rem" }}
              />
              <h6>24/7 Online Support</h6>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Asperiores iste dicta ullam, sit odio earum eius ex laborum
                fugit neque.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Cards */}

</main>



           
            <Footer />
        </>

    );
};

export default About