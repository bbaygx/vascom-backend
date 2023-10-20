"use client";
import { user, overlay, macbook } from "@/assets";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Event() {
  const [data, setData] = useState([]);
  const [activeUser, setactiveUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const [productActive, setProductActive] = useState([]);
  const [productTable, setProductTable] = useState([])

  
//   if(localStorage.getItem("accessToken") == null){
//     window.location.href = "/auth/login";
//   } else {
//     setToken(localStorage.getItem("accessToken"));
// }

  useEffect(() => {
    async function getAllUser(active) {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/users?type=${active}`, {
          headers: {
            "x-access-token": localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : "",
          },
        });
        const datas = await response.data;
        if (datas.status == "success") {
          setData(datas);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    async function getAllUserActive() {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/users?type=active`, {
          headers: {
            "x-access-token": localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : "",
          },
        });
        const datas = await response.data;
        if (datas.status == "success") {
          setactiveUser(datas);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    async function getAllUserProduct() {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/product`, {
          headers: {
            "x-access-token": localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : "",
          },
        });
        const datas = await response.data;
        if (datas.status == "success") {
          setProduct(datas);
          setProductTable(datas.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    async function getAllUserProductActive() {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/product?type=active`, {
          headers: {
            "x-access-token": localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : "",
          },
        });
        const datas = await response.data;
        if (datas.status == "success") {
          setProductActive(datas);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getAllUser();
    getAllUserActive();
    getAllUserProduct();
    getAllUserProductActive();
  }, []);

  const statusBoard = [
    { title: "Jumlah User", user: data.total_users, name: "User" },
    { title: "Jumlah User Aktif", user: activeUser.total_users, name: "User" },
    { title: "Jumlah Product", user: product.total_item, name: "Product" },
    { title: "Jumlah Product Active", user: productActive.total_item, name: "Product" },
  ];

  return (
    <>
      <section>
        <h3 className="text-xl font-semibold">Dashboard</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-2 mb-4">
          {statusBoard.map((item, index) => (
            <>
              <div className="flex items-center mt-12 justify-start h-24 rounded relative" key={index}>
                <div className="absolute inset-0">
                  <Image src={overlay} alt="overlay" className="w-full h-[180px] object-fill bg-center" />
                </div>

                <div className="relative z-10 space-y-2 pt-10 pl-10">
                  <h1 className="text-sm">{item.title}</h1>
                  <h2 className="text-lg flex items-center font-bold text-zinc-800 dark:text-gray-500">{isLoading ? "Loading.." : `${item.user} ${item.name}`}</h2>
                </div>
              </div>
            </>
          ))}
        </div>
        <div className="mt-20">
          <Tables dataProduct={productTable}/>
        </div>
      </section>
    </>
  );
}

function Tables({dataProduct}) {

    console.log(dataProduct)
    
  return (
    <>
      <div className="p-4 space-y-5 ">
        <h1>Product Terbaru</h1>
        <Table className="p-3 md:w-[600px]">
          <TableCaption>Products</TableCaption>
          <TableHeader className="bg-blue-500">
            <TableRow className="rounded-lg">
              <TableHead className="text-white">Product</TableHead>
              <TableHead className="text-white">Tanggal Dibuat</TableHead>
              <TableHead className="text-white">Harga (RP)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
                     dataProduct.map((item, index) => (
                        <TableRow key={index}>

                        <TableCell className="flex gap-2 items-center">
                          <Image src={item.gambar_produk} alt="overlay" className="rounded-lg " width={50} height={50} />
                          <span>{item.nama}</span>
                        </TableCell>
                        <TableCell>12 Mei 2023</TableCell>
                        <TableCell>{item.harga}</TableCell>
                      </TableRow>
                     ))
                }

          </TableBody>
        </Table>
      </div>
    </>
  );
}
