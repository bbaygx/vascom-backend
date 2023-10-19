"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiToggleRight } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SyncLoader } from "react-spinners";
import axios from "axios";

const override = {
  display: "flex",
  margin: "50px auto",
  justifyContent: "center",
};
export default function page() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(true);
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/users`, {
          method: "GET",
          headers: {
            "x-access-token": token,
          },
        });
        const user = await response.json();
        if (user.status == "success") {
          setData(user.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [currentStatus]);

  const handleUpdateStatusUser = async (id, status) => {
    setIsLoading(true);
    const validate = status ? false : true;
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASEURL}/api/users/edit/${id}`,
        {
          status: `${validate}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );
      const datas = await response.data;
      toast.success("Berhasil di Update", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setCurrentStatus(!currentStatus);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div className="flex justify-end">
        <Button className="bg-blue-500">
          <ModalBox title="Tambah Data ">
            <span>Tambah Data User</span>
          </ModalBox>
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <SyncLoader color="#3693d6" cssOverride={override} loading margin={4} size={12} speedMultiplier={1} aria-label="Loading Spinner" data-testid="loader" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>No Telepon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, i) => (
              <TableRow className="bg-gray-200" key={i}>
                <TableCell>{i}</TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>081380952872</TableCell>
                <TableCell>
                  {item.status ? <Badge className="bg-green-500">Active</Badge> : <Badge className="bg-red-500">Not Active</Badge>}
                  {/* <span className="py-2 text-sm px-5 rounded-full bg-green-400">Active</span> */}
                </TableCell>
                <TableCell className="flex gap-3 text-2xl">
                  <button onClick={() => handleUpdateStatusUser(item.id, item.status)} disabled={item.role === "admin"}>
                    <BsEye className={`p-1 ${item.role === "admin" ? "bg-gray-300 cursor-not-allowed" : "bg-green-500"}  rounded-full text-white `} />
                  </button>
                  <div>
                    <ModalBoxEdit title="Ubah Data" id={item.id}>
                      <BiEdit className="p-1 bg-yellow-500 rounded-full text-white" />
                    </ModalBoxEdit>
                  </div>
                  <div>
                    <DeleteBox id={item.id}>
                      <RiDeleteBinLine className="p-1 bg-red-500 rounded-full text-white" />
                    </DeleteBox>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function ModalBoxEdit({ title, id, children }) {
  const [data, setData] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/users/${id}`, {
          headers: {
            "x-access-token": token,
          },
        });
        const datas = await response.data;
        setData(datas.data[0]);
      } catch (err) {
        console.log(err);
      }
    }
    fetchUser();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const handlePostUser = async () => {
    if (data.username == "" || data.email == "" || data.phone == "") {
      return console.log("Semua Field Wajib diisi");
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/users/edit/${id}`, {
        method: "PUT",
        headers: {
          "x-access-token": localStorage.getItem("accessToken"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const user = await response.json();
      if (user.status == "failed") {
        return console.log(user.message);
      }
      window.location.reload();
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">{title} User</DialogTitle>
        </DialogHeader>
        <form action="#" className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input type="text" id="username" placeholder="Masukkan username" required value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="no_telp">Nomor Telepon</Label>
            <Input type="number" id="no_telp" placeholder="Masukkan Nomor Telepon" required value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Masukkan Email" required value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
          </div>
          <div className="">
            {isLoading ? (
              <Button className="bg-blue-600 w-full" onClick={handlePostUser} disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </Button>
            ) : (
              <Button className="bg-blue-600 w-full" onClick={handlePostUser}>
                Simpan
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ModalBox({ title, children }) {
  const [data, setData] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handlePostUser = async () => {
    if (data.username == "" || data.email == "" || data.phone == "") {
      return console.log("Semua Field Wajib diisi");
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/users/create`, {
        method: "POST",
        headers: {
          "x-access-token": localStorage.getItem("accessToken"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const user = await response.json();
      if (user.status == "failed") {
        return console.log(user.message);
      }

      window.location.reload();
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">{title} User</DialogTitle>
        </DialogHeader>
        <form action="#" className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input type="text" id="username" placeholder="Masukkan username" required value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="no_telp">Nomor Telepon</Label>
            <Input type="number" id="no_telp" placeholder="Masukkan Nomor Telepon" required value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Masukkan Email" required value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
          </div>
          <div className="">
            {isLoading ? (
              <Button className="bg-blue-600 w-full" onClick={handlePostUser} disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </Button>
            ) : (
              <Button className="bg-blue-600 w-full" onClick={handlePostUser}>
                Simpan
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteBox({ children, id }) {
  const [data, setData] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/users/${id}`, {
          headers: {
            "x-access-token": token,
          },
        });
        const datas = await response.data;
        setData(datas.data[0]);
        console.log(datas);
      } catch (err) {
        console.log(err);
      }
    }
    fetchUser();
  }, []);
  const handleDeleteUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/users/delete/${id}`, {
        method: "DELETE",
        headers: {
          "x-access-token": localStorage.getItem("accessToken"),
        },
      });
      const user = await response.json();
      if (user.status == "failed") {
        return console.log(user.message);
      }
      window.location.reload();
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <div className="">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#0099ff"
              d="M0,192L80,202.7C160,213,320,235,480,224C640,213,800,171,960,176C1120,181,1280,235,1360,261.3L1440,288L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            ></path>
          </svg>
        </div>
        <div className="flex justify-center -translate-y-12">
          <FiToggleRight size={70} className="p-4 text-white rounded-full bg-red-700" />
        </div>
        <DialogTitle className="text-center text-xl">Konfirmasi Hapus</DialogTitle>
        <DialogDescription className="text-center">Apa kamu yakin ingin menghapus {data.username} ?</DialogDescription>
        <hr className="border" />
        <div className="flex w-full gap-3 justify-end" onClick={handleDeleteUser}>
          {isLoading ? (
            <Button className="bg-gray-600 w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          ) : (
            <Button className="bg-red-600 w-full" onClick={handleDeleteUser}>
              Hapus
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
