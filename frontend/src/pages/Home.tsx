import  { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router";


const API_URL = import.meta.env.VITE_API_URL;

interface Experience {
  id: number;
  name: string;
  location: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export const Home = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate() ; 
  useEffect(() => {
    const getExperiences = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/experiences`);
        console.log(res.data);
        setExperiences(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    getExperiences();
  }, []);


  const handleClick  =(id:number)=>{

    navigate(`/experience/${id}`)
  }
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className=" mt-10 px-20  ">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-white rounded-xl overflow-hidden  hover:shadow-lg transition curosr-pointer"
              >
                {/*image  */}
                <div className="h-42 bg-gray-200 ">
                  <img src={exp.image} className="w-full h-full object-cover  object-fit hover:scale-105 transition"></img>
                </div>

                {/* content */}
                <div className="py-3 px-4 bg-card-primary ">
                  <div className="flex justify-between items-center mb-3 ">
                    <h2 className="text-base  text-inter text-black font-medium  ">{exp.name}</h2>
                    <span className="bg-card-accent  shadow-sm text-xs px-2 py-1 rounded-md font-medium ">{exp.location}</span>
                  </div>

                  <p className=" w-full font-inter text-[11px]  text-[#6C6C6C] font-normal  leading-4 mb-4 line-clamp-2   " >{exp.description}</p>

                  <div className="flex justify-between items-center ">
                    <div className="flex justify-between gap-2 items-center">
                        <p className="text-xs font-normal text-inter">From  </p>
                        <span className="text-xl text-inter font-medium">₹{Math.floor(exp.price)}</span>
                        </div>
                    <button className="px-2  py-1.5 text-sm text-shaodow-md text-medium text-inter rounded bg-button-primary" onClick={()=>handleClick(exp.id)}>View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
