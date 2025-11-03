import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate, useSearchParams } from "react-router";

function Result() {

  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const navigate = useNavigate(); 

  return (
    <div>
      <Navbar />

      <div className= " flex flex-col items-center justify-center mx-auto mt-14  space-y-2 text-center">
        <i className="fi fi-ss-check-circle text-4xl text-green-700"></i>
        <p className="text-md font-medium font-inter">Booking Confirmed</p>
        <p className="font-inter text-[#656565]">Ref ID: {bookingId}</p>
        <button className="p-2  font-inter bg-[#E3E3E3] rounded-sm cursor-pointer hover:bg-gray-300" onClick={()=>navigate("/")}>Back to Home</button>
      </div>
    </div>
  );
}

export default Result;
