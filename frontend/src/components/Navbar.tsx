// import logo from "@/assets/logo.png";
import { Link } from "react-router";

export const Navbar = () => {
  return (
    <div className="w-full py-4 px-20  bg-canvas shadow-lg flex justify-between items-center">
     
        <Link to="/">
          {/* <img src={logo} alt="Logo" className="w-20 "></img> */}
          <h2 className="text-2xl italic font-bold leading-1 tracking-wide ">BookIT</h2>
        </Link>

        <div className="flex  gap-4  justify-betweenitems-center  ">
          <input
            placeholder="Search experiences"
            className="text-shadow-[0.2px_0px_0px_#727272] px-4 py-2 w-100  font-inter   text-[#727272]  bg-input-primary rounded placeholder:text-xs"
          ></input>

          <button className=" text-sm bg-button-primary px-6 py-2  rounded-md cursor-pointer font-medium ">
            Search
          </button>
        </div>
      
    </div>
  );
};
