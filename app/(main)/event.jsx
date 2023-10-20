"use client";

import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { carousel, parfume } from "@/assets";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
export default function Event() {
  const [getAllProduct, setGetAllProduct] = useState([]);
//   const [token, setToken] = useState([]);
  const breakpoints = {
    // when window width is >= 320px
    320: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
  };
//   const getToken = localStorage.getItem("accessToken");

// if(localStorage.getItem("accessToken") == null){
//     window.location.href = "/auth/login";
//   } else {
//     setToken(localStorage.getItem("accessToken"));
// }


  useEffect(() => {


    
    async function fetchProduct() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/product`, {
          headers: {
            "x-access-token": localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : "",
          },
        });
        const data = await response.data;
        setGetAllProduct(data.data);
      } catch (err) {
        console.log(err);
      } finally {
      }
    }
    fetchProduct();
  }, []);

//   console.log(token)

  return (
    <div>
      <div className="carousel w-10/12 mx-auto py-5 rounded-md">
        <Swiper spaceBetween={50} slidesPerView={1} onSwiper={(swiper) => swiper} loop={true} autoplay>
          <SwiperSlide>
            <Image src={carousel} alt="carousel" />
          </SwiperSlide>
          <SwiperSlide>
            <Image src={carousel} alt="carousel" />
          </SwiperSlide>
        </Swiper>
      </div>
      <main className="md:w-10/12 mx-auto py-6 px-6 sm:px-0">
        <div className="py-6" id="terbaru">
          <h1 className="text-3xl font-serif font-semibold">Terbaru</h1>
          <div className="products py-6">
            <Swiper spaceBetween={50} slidesPerView={5} onSwiper={(swiper) => swiper} loop={true} autoplay breakpoints={breakpoints}>
             {
                getAllProduct.map((item, i) => (
                    <SwiperSlide key={i}>
                    <div className="p-6 cursor-pointer flex justify-center hover:shadow-lg duration-500 ease-in-out hover:border rounded-md">
                      <div>
                        <Image src={item.gambar_produk} alt="carousel" width={150} height={100}/>
                        <Link href="#">
                          <h2 className="text-xl font-serif font-semibold">{item.nama}</h2>
                          <h4 className="text-blue-600">IDR {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.harga).replace(" ")}</h4>
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
             }
             

            </Swiper>
          </div>
        </div>
        <div className="py-7 px-4" id="product_tersedia">
          <h1 className="text-3xl font-serif font-semibold">Product Terbaru</h1>
          <div className="grid py-6 grid-cols-2 gap-3 sm:grid-cols-4">
            {getAllProduct.map((item, i) => (
              <div className="p-6 flex justify-center cursor-pointer hover:shadow-lg duration-200 hover:border rounded-md" key={i}>
                <div className="card">
                  <Image src={item.gambar_produk} alt="" className="p-2" width={150} height={100}/>
                  <Link href={`/product/details/${item.id}`}>
                    <h2 className="text-xl font-serif font-semibold">{item.nama}</h2>
                    <h4 className="text-blue-600">IDR {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.harga).replace(" ")}</h4>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center" id="see_more">
          <Button className="bg-white hover:bg-gray-100 text-blue-500 border border-blue-500">Lihat lebih banyak</Button>
        </div>
      </main>
    </div>
  );
}
