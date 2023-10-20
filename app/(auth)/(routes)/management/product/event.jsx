"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState, useEffect } from "react";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiToggleRight } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { SyncLoader } from "react-spinners";
import axios from "axios";
import Image from "next/image";

const override = {
  display: "flex",
  margin: "50px auto",
  justifyContent: "center",
};

export default function Event() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
//   const token = localStorage.getItem("accessToken");
  useEffect(() => {
    async function fetchProduk() {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/product`, {
          headers: {
            "x-access-token": localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : "",
          },
        });
        const data = await response.json();
        if (data.status == "success") {
          setData(data.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduk();
  }, []);

  return (
    <div>
      <div className="flex justify-end">
        <Button className="bg-blue-500">
          <ModalBox title="Tambah Data ">
            <span>Tambah Product Baru</span>
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
              <TableHead>Gambar</TableHead>
              <TableHead>Nama Product</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Terbaru</TableHead>
              <TableHead>Tersedia</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, i) => (
              <TableRow className="bg-gray-200" key={i}>
                <TableCell>{i}</TableCell>
                <TableCell>
                  <Image src={item.gambar_produk} alt="" width={40} height={40} />
                </TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.harga}</TableCell>
                <TableCell>
                  <Badge className="bg-red-500">No</Badge>
                </TableCell>
                <TableCell>{item.status ? <Badge className="bg-green-500">Yes</Badge> : <Badge className="bg-red-500">No</Badge>}</TableCell>
                <TableCell className="flex items-center gap-3 text-2xl">
                  <div>
                    <BsEye className="p-1 bg-green-500 rounded-full text-white" />
                  </div>
                  {/* onClick={() => fetchuserEdit(item.id)} */}
                  <div>
                    <ModalBoxEdit title="Ubah Data" id={item.id}>
                      <BiEdit className="p-1 bg-yellow-500 rounded-full text-white" />
                    </ModalBoxEdit>
                  </div>
                  <div className="mt-1">
                    <DeleteBox deleteId={item.id}>
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

function ModalBoxEdit({ title, id, deleteId, children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    nama: "",
    harga: "",
    status: "",
    gambar_produk: "",
  });

  useEffect(() => {
    const fetchuserEdit = async () => {
      const getToken = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/product/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": getToken,
          },
        });
        const datas = await response.data;
        setData(datas.data[0]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchuserEdit();
  }, []);


  const handlePostProduct = async () => {
    if (data.nama === "" || data.harga === "" || data.status === "" || data.gambar_produk === "") {
      return console.log("Semua field harus diisi");
    }
    let formData = new FormData();
    formData.append("images", data.gambar_produk);
    formData.append("nama", data.nama);
    formData.append("harga", data.harga);
    formData.append("status", data.status);
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/product/edit/${id}`, {
        method: "PUT",
        headers: {
          "x-access-token": localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : "",
        },
        body: formData,
      });
      const data = await response.json();
      if (data.status == "success") {
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">{title} Product</DialogTitle>
        </DialogHeader>
        <form action="#" className="space-y-8 mt-3" onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="nama">Nama</Label>
            <Input type="text" value={data.nama} id="nama" placeholder="Masukkan Nama" required onChange={(e) => setData({ ...data, nama: e.target.value })} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="harga">Harga</Label>
            <Input type="number" value={data.harga} id="harga" placeholder="Masukkan Harga" required onChange={(e) => setData({ ...data, harga: e.target.value })} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="status">Status</Label>
            <select
              name=""
              id=""
              value={data.status}
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-transparent"
              onChange={(e) => setData({ ...data, status: e.target.value })}
            >
              <option disabled value="" className="text-sm">
                Pilih Status Produk
              </option>
              <option value="true" className="text-sm">
                Aktif
              </option>
              <option value="false" className="text-sm">
                Tidak Aktif
              </option>
            </select>
          </div>
          <div className="">
            <Label htmlFor="image">Pilih Gambar</Label>
            <Input type="file" accept="image/*" id="image" onChange={(e) => setData({ ...data, gambar_produk: e.target.files[0] })} />
          </div>
          <div className="">
            {isLoading ? (
              <Button className="bg-blue-600 w-full" onClick={handlePostProduct}>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </Button>
            ) : (
              <Button className="bg-blue-600 w-full" onClick={handlePostProduct}>
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
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    nama: "",
    harga: "",
    status: "",
    images: "",
  });

  const handlePostProduct = async () => {
    if (data.nama === "" || data.harga === "" || data.status === "" || data.images === "") {
      return console.log("Semua field harus diisi");
    }
    let formData = new FormData();
    formData.append("images", data.images);
    formData.append("nama", data.nama);
    formData.append("harga", data.harga);
    formData.append("status", data.status);
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/product/create`, {
        method: "POST",
        headers: {
          "x-access-token": localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : "",
        },
        body: formData,
      });
      const data = await response.json();
      if (data.status == "success") {
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">{title} Product</DialogTitle>
        </DialogHeader>
        <form action="#" className="space-y-8 mt-3" onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="nama">Nama</Label>
            <Input type="text" value={data.nama} id="nama" placeholder="Masukkan Nama" required onChange={(e) => setData({ ...data, nama: e.target.value })} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="harga">Harga</Label>
            <Input type="number" value={data.harga} id="harga" placeholder="Masukkan Harga" required onChange={(e) => setData({ ...data, harga: e.target.value })} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="status">Status</Label>
            <select
              name=""
              id=""
              value={data.status}
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-transparent"
              onChange={(e) => setData({ ...data, status: e.target.value })}
            >
              <option disabled value="" className="text-sm">
                Pilih Status Produk
              </option>
              <option value="true" className="text-sm">
                Aktif
              </option>
              <option value="false" className="text-sm">
                Tidak Aktif
              </option>
            </select>
          </div>
          <div className="">
            <Label htmlFor="image">Pilih Gambar</Label>
            <Input type="file" accept="image/*" id="image" onChange={(e) => setData({ ...data, images: e.target.files[0] })} />
          </div>
          <div className="">
            {isLoading ? (
              <Button className="bg-blue-600 w-full" onClick={handlePostProduct}>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </Button>
            ) : (
              <Button className="bg-blue-600 w-full" onClick={handlePostProduct}>
                Simpan
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteBox({ children, deleteId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    nama: "",
    harga: "",
    status: "",
    images: "",
  });


  const deleteProduk = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASEURL}/api/product/delete/${deleteId}`, {
        headers: {
          "x-access-token": localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : "",
        },
      });
      await response.data;
      window.location.reload();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchuserEdit = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/product/${deleteId}`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : "",
          },
        });
        const datas = await response.data;
        setData(datas.data[0]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchuserEdit();
  }, []);

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
        <DialogDescription className="text-center">Apa kamu yakin ingin menghapus {data.nama} ?</DialogDescription>
        <hr className="border" />
        <div className="flex w-full gap-3 justify-end" onClick={deleteProduk}>
          {isLoading ? (
            <Button className="bg-blue-600 w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          ) : (
            <Button className="bg-red-600 w-full" onClick={deleteProduk}>
              Hapus
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
