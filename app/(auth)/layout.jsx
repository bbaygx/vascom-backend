"use client";
import React, { useState } from "react";
import { logo, user } from "@/assets";
import Image from "next/image";
import { AiOutlineLogout, AiFillHome } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { PiNotebookDuotone } from "react-icons/pi";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Layouts({ children }) {
  // const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  // if (userProfile.role !== "admin") {
  //   window.location.href = "/";
  // }
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="p-4 w-full fixed translate-y-20 overflow-y-scroll h-full sm:w-[calc(100%-16rem)] sm:ml-64">
          <div className="">{children}</div>
        </main>
      </div>
    </>
  );
}

function Navbar() {
  const [isLoading, setIsLoading] = useState(false);
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASEURL}/api/auth/logout`);
      const data = await response.data;
      toast.success(data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      window.location.href = "/auth/login";
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userProfile");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <header className="fixed top-0 w-full z-50">
      <nav className="flex px-5 justify-between h-[4.4rem] shadow-md">
        <div className="logo flex items-center">
          <a href="/">
            <Image src={logo} width={150} height={200} alt="" />
          </a>
        </div>
        <div className="profile text-right flex space-x-6 items-center">
          <div className="">
            <span className="text-sm text-blue-500">Hallo Admin</span>
            <h1 className="text-base">Bayu Putra .E</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Image src={user} width={40} height={40} alt="" className="rounded-full" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-8 space-y-5 mx-6">
              <div className="flex justify-center">
                <Image src={user} width={40} height={40} alt="" className="rounded-full" />
              </div>
              <div className="">
                <div className="flex justify-center">
                  <DropdownMenuLabel className="text-xl">Bayu Putra Efendi</DropdownMenuLabel>
                </div>
                <DropdownMenuLabel className="font-normal text-center">bbaygx@gmail.com</DropdownMenuLabel>
              </div>
              {isLoading ? (
                <DropdownMenuItem className="text-red-500 space-x-2 flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <AiOutlineLogout size={24} className="-rotate-90" />
                  <span>Loading...</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="text-red-500 space-x-2 flex items-center justify-center" onClick={handleLogout}>
                  <AiOutlineLogout size={24} className="-rotate-90" />
                  <span>LogOut</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}

function Sidebar() {
  const currentRoute = usePathname();
  const sidebarItem = [
    { icon: AiFillHome, label: "Dashboard", link: "/dashboard" },
    { icon: FaUserAlt, label: "Management User", link: "/management/user" },
    { icon: PiNotebookDuotone, label: "Management Product", link: "/management/product" },
  ];

  return (
    <>
      <aside className="fixed top-[4.5rem] shadow-md left-0 z-10 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
        <div className="h-full px-3 py-4 overflow-y-auto bg-white shadow-md dark:bg-gray-800">
          <ul className="space-y-5 mt-5">
            {sidebarItem.map((item, index) => (
              <Link href={`${item.link}`} key={index} className="flex p-4 duration-300 transform-cpu hover:text-white hover:bg-blue-500 items-center space-x-6">
                {<item.icon size={24} />}
                <li className="bg-blue rounded-md">{item.label}</li>
              </Link>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
