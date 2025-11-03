import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate, useSearchParams } from "react-router";
import axios from "axios";

interface ExperienceWithSlots {
  id: number;
  name: string;
  location: string;
  price: number;
  image: string;
  description: string;
  slots: Slot[];
}

interface Slot {
  id: number;
  date: string;
  time: string;
  total_capacity: number;
  booked_count: number;
  available_count: number;
}


interface Discount {
  valid : boolean, 
  discount_price  : number, 
  final_price  : number
}


function Checkout() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const slotId = searchParams.get("slotId");
  const experienceId = searchParams.get("experienceId");

  const [experience, setExperience] = useState<ExperienceWithSlots | null>(
    null
  );

  const [slot, setSlot] = useState<Slot | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [name , setName]   = useState<string | null>(null) ; 

  const [email, setEmail]  = useState<string | null>(null) ; 

  const [promoCode, setPromoCode]  = useState<string | null>(null) ; 

  const[promoData, setPromoData] = useState<Discount | null>(null) ; 
  const [taxes, setTaxes] = useState(0);
  const [total, setTotal] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  
  const [isValidating, setIsValidating] = useState(false);

  const [loadingBookingStatus, setLoadingBookingStatus]  = useState<boolean | null>(true) ; 
  useEffect(() => {
    const fetchdetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/experience/${experienceId}`
        );

        setExperience(res.data);

        //Find the selected slot
        const selectedSlot = res.data.slots.find(
          (s: any) => s.id === parseInt(slotId!)
        );

        setSlot(selectedSlot);
        setLoading(false);
        setTaxes(59);
        setTotal(res.data.price);
      } catch (err) {
        console.log("Error:", err);
        setLoading(false);
      }
    };

    if (experienceId && slotId) {
      fetchdetails();
    }
  }, []);



  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toISOString().split("T")[0];
    return formattedDate;
  };

  const handlePromoValidate  = async()=>{
    console.log("hi")
   
    try {

      setIsValidating(true); 
        
        const res  = await axios.post("http://localhost:5000/api/promo/validate" , {
          promo_code : promoCode, 
          total_price : experience!.price
        })

        setPromoData(res.data) ; 
       
        setErrorMsg(null); 
    }catch(err : any){
        console.log(err.response.data.error) ;
        setErrorMsg(err.response.data.error)  ; 

    }finally {
      setIsValidating(false);      // stop loading
    }
   
  }

  const handleConfirmBooking = async ()=>{

    //
    let totalPrice = Math.floor(total)+ Math.floor(taxes) ; 
    try {

      const res   = await axios.post("http://localhost:5000/api/bookings" , {
        slot_id : slotId , 
        name, 
        email, 
        total_price : totalPrice , 
        promo_code : promoCode 
  
      })
      
      navigate(`/result?bookingId=${res.data.booking.booking_id}`)  ; 
       
    }catch(err){

      console.log(err) ; 

    }



   
  
    
  }


  return (
    <div>
      <Navbar />
      <div className="px-20 mt-5 ">
        <div className="flex    gap-2 ">
          <i
            className="fi fi-rr-arrow-small-left text-lg cursor-pointer"
            onClick={() => navigate("/experience/" + experienceId)}
          ></i>
          <p className="text-sm ">Checkout</p>
        </div>

        {loading ? (
          <div className="h-screen flex justify-center items-center text-lg">
            Loading Checkout...
          </div>
        ) : (
          experience &&
          slot && (
            <div className="grid grid-cols-3 gap-12">
              <div className="col-span-2 mb-6 ">
                <InputData  
                
                setName={setName}
               
                setEmail = {setEmail}
                
                setPromoCode={setPromoCode}
                
                onPromoValidate={handlePromoValidate}
                promoData={promoData}
                errorMsg={errorMsg}
                isValidating={isValidating}
                />
              </div>

              <div className={`bg-card-secondary  p-6 space-y-2 rounded-lg ${promoData?.valid  && !errorMsg ? "h-[330[x]" :"h-[300px]" }`}>
                <div className="flex justify-between items-center  text-sm">
                  <p className="text-[#656565]  font-normal font-inter">
                    Experience
                  </p>
                  <p className="text-button-secondary  font-medium font-inter">
                    {experience.name}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm ">
                  <p className="text-[#656565]  font-normal font-inter">Date</p>
                  <p className="text-button-secondary  font-medium font-inter">
                    {formatDate(slot.date)}
                  </p>
                </div>

                <div className="flex justify-between items-center font-inter text-sm">
                  <p className="text-[#656565] font-inter  font-normal ">
                    Time
                  </p>
                  <p className=" font-medium">{slot.time}</p>
                </div>

                <div className="flex justify-between items-center font-inter text-sm">
                  <p className="text-[#656565]  font-normal font-inter">Qty</p>
                  <p className="font-medium ">1</p>
                </div>

                <div className="flex justify-between font-inter  items-center text-sm">
                  <p className="text-[#656565]   font-normal font-inter">
                    Subtotal
                  </p>
                  <p className=" font-medium">
                    ₹{Math.floor(experience.price)}
                  </p>
                </div>

                <div className="flex justify-between font-inter  items-center text-sm">
                  <p className="text-[#656565]  font-normal font-inter">
                    Taxes
                  </p>
                  <p className="font-medium ">₹59</p>
                </div>

                <hr className="text-[#D9D9D9] "></hr>

                <div className="flex justify-between font-inter  items-center">
                  <p className="text-black text-lg font-normal font-inter">
                    Total
                  </p>
                  <p className="text-lg font-medium ">
                    ₹{Math.floor(total) + taxes}
                  </p>
                </div>

                {promoData?.valid  && !errorMsg &&
                 <div className=" font-inter  items-center ">
                  <div className="flex justify-between mb-2">
                  <p className="text-black text-lg font-normal font-inter">
                   PromoCode
                 </p>
                 <p className="text-lg font-medium ">
                   -₹{promoData.discount_price}
                 </p>
                  </div>
                
                 <hr className="text-[#D9D9D9] mb-2"></hr>

                 <div className="flex justify-between mb-2">
                  <p className="text-black text-lg font-normal font-inter">
                   Final Amount
                 </p>
                 <p className="text-lg font-medium ">
                   ₹{Math.floor(total) + taxes - promoData.discount_price}
                 </p>
                  </div>

               </div>}

                <button
                  className={`  w-full py-2 rounded-lg text-black bg-button-primary hover:bg-yellow-400`}
                  onClick={handleConfirmBooking}
                >
                  Pay and confirm
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}


interface Inputprops {

  
  setName: (name: string) => void;
 
  setEmail: (email: string) => void;
   
  setPromoCode : (promoCode : string)=>void ; 
  
  onPromoValidate :()=>void;  
  promoData : Discount |null;
  errorMsg : string | null  ; 
  isValidating : boolean | null;
}


export const InputData = ({
  
  setName, 
  
  setEmail, 
  
  setPromoCode,
  
  onPromoValidate,
  promoData,
  errorMsg,
  isValidating

}:Inputprops) => {

 
  const handleValidate = ()=>{
   onPromoValidate();
    
  }
  return (
    <div className="py-5 px-6 bg-[#EFEFEF] rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        <input placeholder="John Doe " className="w-1/2 p-2  bg-card-accent rounded-sm placeholder:text-[#727272]" onChange={(e)=>setName(e.target.value)}></input>

        <input placeholder="John Doe" className="w-1/2  p-2 bg-card-accent rounded-sm placeholder:text-[#727272]" onChange={(e)=>setEmail(e.target.value)}></input>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <input placeholder="Promo Code" className="w-4/2 p-2  bg-card-accent rounded-sm placeholder:text-[#727272]" onChange={(e)=>setPromoCode(e.target.value)}></input>

        <button  className="w-1/2  p-2 bg-black text-white rounded-sm  cursor-pointer hover:bg-gray-600" onClick={handleValidate}>Apply</button>
      </div>

      {isValidating ? <div className="text-md font-normal text-center">Validating...</div>  
      :
      <div>{!errorMsg ? promoData?.valid && <p className="text-md text-green-600 font-normal text-center">You Saved ₹{promoData.discount_price}!  </p> 
      : <p className="text-md text-red-600 font-normal text-center">{errorMsg}</p>}

      </div>
      }
      
      
    </div>
  );
};

export default Checkout;
