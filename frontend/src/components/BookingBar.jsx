import { MdLocationOn, MdOutlineRemove, MdOutlineAdd } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FaStar } from "react-icons/fa";

import { useEffect, useState } from "react";
import api from "../api/axios";
import OwnerRezWidget from "./OwnerRezWidget";

export default function BookingBar({
  listing,
  arrival,
  departure,
  setArrival,
  setDeparture,
  guests,
  setGuests,
  setOpenBooking,
}) {
  const [preview, setPreview] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [showOwnerRez, setShowOwnerRez] = useState(false);

  useEffect(() => {
    if (!arrival || !departure || !listing?._id) {
      setPreview(null);
      return;
    }

    getPrice();
  }, [arrival, departure, guests, listing]);

  const getPrice = async () => {
    try {
      console.log({
        propertyId: listing._id,
        arrival: arrival.toISOString().split("T")[0],
        departure: departure.toISOString().split("T")[0],
        guests,
      });

      const { data } = await api.post("/bookings/preview", {
        propertyId: listing._id,
        checkIn: arrival.toISOString().split("T")[0],
        checkOut: departure.toISOString().split("T")[0],
        guests,
      });

      console.log("Preview Response:", data);

      setPreview(data);
    } finally {
      setLoadingPrice(false);
    }
  };
  return (
    <div
      className="
      fixed bottom-0 left-0 right-0 z-[999] bg-white border-t border-gray-200
      shadow-[0_-8px_25px_rgba(0,0,0,0.08)] px-3 md:px-6 lg:px-10 py-1"
    >
      <div
        className=" max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4"
      >
        {/* ===========================
             LEFT
        ============================ */}

        <div className="flex-1 w-full">
          <h2
            className=" text-xl md:text-2xl lg:text-2xl font-light leading-tight text-[#222] "
          >
            {listing?.property?.title}
          </h2>

          <div
            className="
            flex
            flex-wrap

            items-center

            gap-3

            mt-2

            text-gray-600
            "
          >
            <div className="flex items-center gap-1">
              <MdLocationOn className="text-[#18C8F5]" size={20} />

              <span className="text-sm md:text-base">
                {listing?.location?.address || "Panama City Beach"}
              </span>
            </div>

            <div
              className="
              flex
              items-center

              gap-1
              "
            >
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-[#18C8F5]" size={16} />
              ))}

              <span className="font-medium ml-1">5</span>
            </div>

            <div
              className="
              font-semibold
              text-[#333]
              "
            >
              from ₹{listing?.rates?.[0]?.nightly?.toLocaleString() || "0"} per
              night
            </div>
          </div>
        </div>

        {/* ===========================
             RIGHT
        ============================ */}

        <div
          className="
          w-full
          lg:w-auto

          flex

          flex-wrap
          lg:flex-nowrap

          gap-2

          items-center
          justify-end
          "
        >
          {/* ===========================
               CHECK IN
          ============================ */}

          <div
            className="
    max-w-[150px]
    h-[52px]
    border
    border-gray-300
    rounded-xl
    px-5
    flex
    flex-col
    justify-center
    bg-white
  "
          >
            <p className="text-gray-500 text-sm mb-1">Check-in</p>

            <DatePicker
              selected={arrival}
              onChange={(date) => setArrival(date)}
              selectsStart
              startDate={arrival}
              endDate={departure}
              minDate={new Date()}
              placeholderText="Select Date"
              dateFormat="MMM dd, yyyy"
              className="
      w-full
      font-semibold
      text-lg
      outline-none
      bg-transparent
      cursor-pointer
    "
            />
          </div>

          {/* ===========================
               CHECK OUT
          ============================ */}

          <div
            className="
    max-w-[150px]
    h-[52px]
    border
    border-gray-300
    rounded-xl
    px-5
    flex
    flex-col
    justify-center
    bg-white
  "
          >
            <p className="text-gray-500 text-sm mb-1">Check-out</p>

            <DatePicker
              selected={departure}
              onChange={(date) => setDeparture(date)}
              selectsEnd
              startDate={arrival}
              endDate={departure}
              minDate={arrival || new Date()}
              placeholderText="Select Date"
              dateFormat="MMM dd, yyyy"
              className="
      w-full
      font-semibold
      text-lg
      outline-none
      bg-transparent
      cursor-pointer
    "
            />
          </div>

          {/* ===========================
                 GUESTS
          ============================ */}

          <div
            className="
              h-[52px]
              min-w-[150px]

              border
              border-gray-300

              rounded-xl

              px-4

              flex
              items-center
              justify-between

              bg-white
            "
          >
            <button
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="
                w-10
                h-10

                rounded-full

                hover:bg-gray-100

                flex
                items-center
                justify-center
              "
            >
              <MdOutlineRemove size={24} />
            </button>

            <div className="text-center">
              <h4 className="font-semibold text-lg">{guests}</h4>

              <p className="text-sm text-gray-500">
                {guests === 1 ? "Guest" : "Guests"}
              </p>
            </div>

            <button
              onClick={() => setGuests((g) => g + 1)}
              className="
                w-10
                h-10

                rounded-full

                hover:bg-gray-100

                flex
                items-center
                justify-center
              "
            >
              <MdOutlineAdd size={24} />
            </button>
          </div>

          {/* ===========================
                 BOOK BUTTON
          ============================ */}

          <button
            disabled={!arrival || !departure || loadingPrice}
            onClick={() => setShowOwnerRez(true)}
            className={`
  className="
        group relative mb-2
        inline-flex min-h-[58px]
        min-w-[185px] items-center
        justify-center gap-3
        bg-[#171717] px-7 py-4
        text-[13px] font-semibold
        tracking-[0.19em] text-white
        shadow-[8px_8px_0px_#252525]
        transition-all duration-300
        hover:-translate-x-1 hover:-translate-y-1
        hover:bg-[#315F60]
        hover:shadow-[10px_10px_0px_#252525]
        active:translate-x-1 active:translate-y-1
        active:shadow-none
        sm:min-w-[200px]
      "
      style={{
        fontFamily: '"Montserrat", sans-serif',
      }}
    >
    ${
      !arrival || !departure || loadingPrice
        ? "bg-gray-400 cursor-not-allowed text-white"
        : " bg-[#00989c]  hover:bg-[#00989c] hover:text-[#fff] hover:border-[#00989c] text-white"
    }
  `}
          >
            {loadingPrice ? (
              "Calculating..."
            ) : preview?.total ? (
              <>Book for ${Number(preview.total).toLocaleString()}</>
            ) : (
              "Book Now"
            )}
          </button>
          {/* ===========================
                SEND INQUIRY
          ============================ */}

          {/* Uncomment if you want Inquiry Button */}

          {/*
          <button
            onClick={() => setOpenInquiry(true)}
            className="
              h-[82px]

              min-w-[180px]

              rounded-xl

              border-2
              border-[#18C8F5]

              text-[#18C8F5]

              font-semibold

              hover:bg-[#18C8F5]
              hover:text-white

              transition-all
              duration-300
            "
          >
            Send Inquiry
          </button>
          */}
        </div>
      </div>
      {showOwnerRez && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] relative overflow-hidden">
            <button
              onClick={() => setShowOwnerRez(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full w-10 h-10 shadow text-2xl"
            >
              ✕
            </button>

            <OwnerRezWidget />
          </div>
        </div>
      )}
    </div>
  );
}
