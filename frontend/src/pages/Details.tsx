import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

interface ExperienceWithSlots {
  id: number;
  name: string;
  location: string;
  price: number;
  image: string;
  description: string;
  slots: Array<{
    id: number;
    date: string;
    time: string;
    total_capacity: number;
    booked_count: number;
    available_count: number;
  }>;
}

interface Slots {
  slots: Array<{
    id: number;
    date: string;
    time: string;
    total_capacity: number;
    booked_count: number;
    available_count: number;
  }>;
}

export const Details = () => {
  const { id } = useParams();

  const [experience, setExperience] = useState<ExperienceWithSlots | null>(
    null
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [isloading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const [taxes, setTaxes] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getExperiencebyID = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/experience/${id}`
        );

        console.log(res.data);
        setExperience(res.data);
        setIsLoading(false);
        setTotal(res.data.price);
        setTaxes(59);
      } catch (err) {
        console.log(err);
      }
    };

    getExperiencebyID();
  }, []);

  const handleConfirm = () => {
    if (selectedDate && selectedTime && experience) {
      // Find the slot ID
      const slot = experience.slots.find((s) => {
        const date = new Date(s.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const time = new Date("1970-01-01T" + s.time + "Z").toLocaleTimeString(
          "en-US",
          {
            timeZone: "UTC",
            hour12: true,
            hour: "numeric",
            minute: "numeric",
          }
        );
        return date === selectedDate && time === selectedTime;
      });

      if (slot) {
        navigate(`/checkout?slotId=${slot.id}&experienceId=${experience.id}`);
      }
    }
  };

  
  return (
    <div>
      <Navbar />

      <div className="px-20 mt-5 ">
        <div className="flex    gap-2 ">
          <i
            className="fi fi-rr-arrow-small-left text-lg cursor-pointer"
            onClick={() => navigate("/")}
          ></i>
          <p className="text-sm ">Details</p>
        </div>

        {isloading ? <div className="h-screen flex justify-center items-center text-lg">Loading experience Details...</div> : experience && (
          <div className="grid grid-cols-3 gap-12">
            <div className="col-span-2  ">
              <img
                src={experience.image}
                className=" w-full  h-[381px] rounded-lg overflow-hidden object-cover object-fit mb-8"
              ></img>

              <h3 className="mb-4 text-2xl font-medium font-inter">
                {experience.name}
              </h3>

              <p className="text-sm text-[#6C6C6C] font-inter font-normal mb-8">
                {experience.description}{" "}
              </p>

              <DisplaySlotDates
                slots={experience.slots}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
              />

              <p className="text-lg font-medium mb-3">About</p>
              <p className="py-2 px-3 bg- w-full bg-about rounded text-[#838383] bg-[#EFEFEF] tracking-wide">
                Scenic routes, trained guides, and safety briefing. Minimum age
                10.
              </p>
            </div>

            <div className="bg-card-secondary  p-6 space-y-3 rounded-lg h-[290px]">
              <div className="flex justify-between items-center ">
                <p className="text-[#656565] text-base font-normal font-inter">
                  Starts at
                </p>
                <p className="text-button-secondary text-lg font-normal font-inter">
                  ₹{Math.floor(experience.price)}
                </p>
              </div>

              <div className="flex justify-between items-center  ">
                <p className="text-[#656565] text-base font-normal font-inter">
                  Quantity
                </p>
                <div className="flex items-center gap-2 font-inter ">
                  <button className="border border-[#C9C9C9]  px-1.5 py-2 flex items-center justify-center h-4 text-sm hover:border hover:border-black ">
                    {" "}
                    -{" "}
                  </button>
                  <p className="text-sm font-normal ">1</p>
                  <button className="border border-[#C9C9C9] px-1 py-2 flex items-center justify-center h-4  text-sm hover:border hover:border-black">
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center font-inter">
                <p className="text-[#656565] text-base font-normal ">
                  Subtotal
                </p>
                <p className="text-sm font-normal">
                  ₹{Math.floor(experience.price)}
                </p>
              </div>

              <div className="flex justify-between items-center font-inter">
                <p className="text-[#656565] text-base font-normal font-inter">
                  Taxes
                </p>
                <p className="text-sm font-normal ">₹{taxes}</p>
              </div>

              <hr className="text-[#D9D9D9] "></hr>

              <div className="flex justify-between font-inter  items-center">
                <p className="text-black text-lg font-medium font-inter">
                  Total
                </p>
                <p className="text-lg font-medium ">
                  ₹{Math.floor(total) + taxes}
                </p>
              </div>

              <button
                className={`bg-button-gray text-[#7F7F7F] w-full py-2 rounded-lg ${selectedDate && selectedTime ? "bg-yellow-400 text-black" : "bg-button-gray"}`}
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface DisplaySlotDatesProps {
  slots: Array<{
    id: number;
    date: string;
    time: string;
    total_capacity: number;
    booked_count: number;
    available_count: number;
  }>;

  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
}

export const DisplaySlotDates = ({
  slots,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}: DisplaySlotDatesProps) => {
  const dates = useMemo(() => {
    const formattedDates = slots.map((slot) =>
      new Date(slot.date).toLocaleDateString("en-Us", {
        month: "short",
        day: "numeric",
      })
    );
    return [...new Set(formattedDates)];
  }, [slots]);

  const slotsByDateAndTime = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {};

    slots.forEach((slot) => {
      const formattedDate = new Date(slot.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const formattedTime = new Date(
        "1970-01-01T" + slot.time + "Z"
      ).toLocaleTimeString("en-US", {
        timeZone: "UTC",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
      });

      if (!grouped[formattedDate]) grouped[formattedDate] = {};
      grouped[formattedDate][formattedTime] = slot.available_count;
    });

    return grouped;
  }, [slots]);

  useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  const times = useMemo(() => {
    const timeString12hr = slots.map((slot) =>
      new Date("1970-01-01T" + slot.time + "Z").toLocaleTimeString("en-US", {
        timeZone: "UTC",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
      })
    );

    return [...new Set(timeString12hr)];
  }, [slots]);

  const timeForSelectedDate = selectedDate
    ? Object.keys(slotsByDateAndTime[selectedDate] || {}).sort((a, b) => {
        const timeA = new Date(`1970-01-01 ${a}`).getTime();
        const timeB = new Date(`1970-01-01 ${b}`).getTime();
        return timeA - timeB;
      })
    : [];

  return (
    <div className="">
      <div className="space-y-4">
        <p className="font-inter text-base font-medium mb-3">Chooose date</p>

        {dates.map((date, i) => (
          <button
            className={` font-inter font-normal  mr-4 px-3 py-1.5 text-sm text-[#838383] border border-[#BDBDBD] rounded ${selectedDate === date ? "bg-button-primary" : ""}`}
            key={i}
            onClick={() => {
              setSelectedDate(date);
            }}
          >
            {date}
          </button>
        ))}
      </div>

      {/* Times Row */}
      <div>
        <p className="font-inter text-base font-medium mb-3">Chooose time</p>

        {selectedDate && (
          <div className="flex gap-3 flex-wrap mb-4">
            {timeForSelectedDate.map((time, i) => (
              <button
                className={` font-inter font-normal  mr-4 px-3 py-1.5 text-sm text-[#838383] border border-[#BDBDBD] rounded ${selectedTime === time ? "bg-button-primary" : ""}`}
                key={i}
                onClick={() => setSelectedTime(time)}
              >
                {time}{" "}
                <span className="text-red-500">
                  ({slotsByDateAndTime[selectedDate]?.[time] || 0} left)
                </span>
              </button>
            ))}
          </div>
        )}

        <p className="text-[#838383] text-xs mb-3">
          All times are in IST (GMT +5:30)
        </p>
      </div>
    </div>
  );
};
