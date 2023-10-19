"use client";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const handleClick = async () => {
    setIsLoading(true);
    try {
      console.log(formData);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Atur header Content-Type
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.statusCode === 401) {
        return toast.error(data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
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
      if (data.data.role == "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userProfile", JSON.stringify(data.data));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <form action="" className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-4">
          <h1 className="font-bold text-2xl">Selamat Datang Admin</h1>
          <p className="text-gray-500 ">Silahkan masukkan email atau nomor telepon dan password Anda untuk mulai menggunakan aplikasi</p>
        </div>
        <div className="col-span-6 text-gray-500 ">
          <label htmlFor="text" className="block text-sm font-medium text-gray-500">
            Email / Nomor Telpon
          </label>
          <Input
            type="text"
            id="text"
            name="text"
            placeholder="Cth : admin@gmail.com atau 08xxxx"
            required
            value={formData.identifier}
            className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-500 shadow-sm"
            onInput={(e) => setFormData({ ...formData, identifier: e.target.value })}
          />
        </div>

        <div className="col-span-6 text-gray-500 ">
          <label htmlFor="Password" className="block text-sm font-medium text-gray-500">
            Password
          </label>
          <Input
            type="password"
            id="Password"
            name="password"
            placeholder="Masukkan Password"
            required
            value={formData.password}
            className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-500 shadow-sm"
            onInput={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        {isLoading ? (
          <Button
            type="submit"
            className=" w-full shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
            disabled
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait...
          </Button>
        ) : (
          <Button
            type="submit"
            className=" w-full shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
            onClick={handleClick}
          >
            Login
          </Button>
        )}

        <div className="col-span-6 sm:flex sm:items-center sm:gap-4"></div>
      </form>
    </>
  );
};

export default LoginForm;
