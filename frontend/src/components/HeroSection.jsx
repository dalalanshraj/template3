
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import {
  CalendarDays,
  Home,
  Search,
  ArrowRight,
} from "lucide-react";

import "react-datepicker/dist/react-datepicker.css";

export default function HeroSection() {
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [bedrooms, setBedrooms] = useState("");

  const [isMobile, setIsMobile] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Responsive date picker
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  // Scroll to rental search form
  const handleBookNow = () => {
    document.getElementById("rental-search")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // Handle search
  const handleSearch = (event) => {
    event.preventDefault();
    setSearchError("");

    if (checkOut && !checkIn) {
      setSearchError("Please select your arrival date first.");
      return;
    }

    if (checkIn && checkOut && checkOut <= checkIn) {
      setSearchError("Departure must be after arrival.");
      return;
    }

    const params = new URLSearchParams();

    if (checkIn) {
      params.set("checkIn", formatDate(checkIn));
    }

    if (checkOut) {
      params.set("checkOut", formatDate(checkOut));
    }

    if (bedrooms) {
      params.set("bedrooms", bedrooms);
    }

    const query = params.toString();

    navigate(query ? `/properties?${query}` : "/properties");
  };

  // Format dates as YYYY-MM-DD using local time
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <>
      {/* =========================
          HERO SECTION
      ========================== */}
      <section
        className="
          relative isolate w-full
          h-[780px] min-h-[650px]
          overflow-hidden
          sm:h-[850px]
          lg:h-[min(100svh,950px)]
          lg:min-h-[720px]
        "
      >
        {/* Background video */}
        <img
  src="/hero.png"
  alt="Blue Mountain Beach beachfront vacation rentals"
  fetchPriority="high"
  className="
    absolute inset-0 -z-20
    h-[80%] w-full
    object-cover object-center
  "
/>

{/* Overlay */}
<div
  className="
    absolute   -z-10
    bg-black/10
    sm:bg-black/15
  "
/>
        {/* Booking card */}
     <div
  className="
    mx-auto flex h-full w-full max-w-[1600px]
    items-center justify-center px-4
    sm:justify-end sm:px-8
    lg:px-12 xl:px-16
  "
>
  <div
    className="
      mt-16 flex aspect-square
      w-[285px] shrink-0
      flex-col items-center justify-center
      rounded-full bg-[#f8a847]
      px-7 text-center text-[#171717]
      shadow-xl
      transition-transform duration-700
      hover:scale-[1.02]
      sm:mt-20 sm:w-[340px] sm:px-9
      lg:mr-[5%] lg:mt- lg:w-[390px]
      xl:mr-[7%]
    "
  >
    <h1
  className="
    max-w-[300px]
    text-[22px] font-semibold
    uppercase leading-[1.16]
    tracking-[-0.025em]
    sm:text-[27px]
    lg:text-[29px]
  "
  style={{
    fontFamily: '"Oswald", sans-serif',
    color: "#171717",
    textShadow: "2px 3px 1px rgba(239, 232, 232, 0.86)",
  }}
>
  New Millon Dollar  
  <br />
Cabin on a Peaceful
  <br />
 eaceful, Secluded
</h1>
    <button
      type="button"
      onClick={handleBookNow}
      className="
        group relative mt-6
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
      BOOK NOW

      <ArrowRight
        size={16}
        className="
          transition-transform duration-300
          group-hover:translate-x-1
        "
      />
    </button>
  </div>
</div>

        {/* Bottom edge */}
        <div
          className="
            pointer-events-none absolute
            bottom-0 left-0 h-1 w-full bg-white/90
          "
        />
      </section>

      {/* =========================
          RENTAL SEARCH SECTION
      ========================== */}
     
    </>
  );
}
