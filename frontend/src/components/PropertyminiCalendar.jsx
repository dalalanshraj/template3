import { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axios";

export default function PropertyminiCalendar({ listingId }) {
  const [calendarDates, setCalendarDates] = useState([]);
const [isMobile, setIsMobile] = useState(
  window.innerWidth <= 768
);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
  useEffect(() => {
    if (listingId) {
      fetchDates();
    }
  }, [listingId]);

  const fetchDates = async () => {
    try {
      const res = await api.get(`/calendar/${listingId}/calendar`);

      setCalendarDates(res.data.calendar || []);
    } catch (err) {
      console.log(err);
    }
  };
  // =====================================
  // FORMAT DATE
  // =====================================

  const formatLocalDate = (date) => {
    const d = new Date(date);

    if (isNaN(d)) {
      return "";
    }

    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  };

  // =====================================
  // BLOCKED MAP
  // =====================================

  const blockedMap = useMemo(() => {
    const map = {};

    calendarDates.forEach((item) => {
      // INVALID DATE SKIP
      if (!item?.date) return;

      const parsedDate = new Date(item.date);

      if (isNaN(parsedDate)) return;

      const itemDate = new Date(
        parsedDate.toLocaleString("en-US", {
          timeZone: "America/Chicago",
        }),
      );

      const key = formatLocalDate(itemDate);

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(item.status);
    });

    return map;
  }, [calendarDates]);

  // =====================================
  // DATE TYPE
  // =====================================

  const getDateType = (date) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const currentDate = new Date(date);

    currentDate.setHours(0, 0, 0, 0);

    // PAST
    if (currentDate < today) {
      return "past-day";
    }

    const currentKey = formatLocalDate(currentDate);

    const statuses = blockedMap[currentKey] || [];

    const hasCIN = statuses.includes("CIN");

    const hasCOUT = statuses.includes("COUT");

    const hasR = statuses.includes("R");

    // =====================================
    // PREVIOUS DAY
    // =====================================

    const prevDay = new Date(currentDate);

    prevDay.setDate(prevDay.getDate() - 1);

    const prevKey = formatLocalDate(prevDay);

    const prevStatuses = blockedMap[prevKey] || [];

    const prevHasBooking =
      prevStatuses.includes("R") || prevStatuses.includes("COUT");

    // =====================================
    // TURNOVER
    // =====================================

    // SAME DAY
    if (hasCIN && hasCOUT) {
      return "turnover-day";
    }

    // PREVIOUS DAY BOOKED
    // + CURRENT DAY CHECKIN
    if (hasCIN && prevHasBooking) {
      return "turnover-day";
    }

    // CHECK-IN
    if (hasCIN) {
      return "checkin-day";
    }

    // CHECK-OUT
    if (hasCOUT) {
      return "checkout-day";
    }

    // BOOKED
    if (hasR) {
      return "blocked-day";
    }

    return "available-day";
  };

  // =====================================
  // BLOCK CHECK
  // =====================================

  const isBlocked = (date) => {
    const key = formatLocalDate(date);

    const statuses = blockedMap[key] || [];

    return statuses.includes("R");
  };

  return (
    <div className="w-full">
      {/* HEADING */}
       <h2
            className="
        text-[30px] font-semibold
        uppercase leading-tight text-center mb-14
        tracking-[-0.035em]
        text-[#171717]
        drop-shadow-[2px_3px_1px_rgba(0,0,0,0.25)]
        sm:text-4xl
        lg:text-[48px]
        xl:text-[40px]
      "
            style={{
              fontFamily: '"Oswald", sans-serif',
            }}
          >
        Availability Calendar
      </h2>

      {/* CALENDAR */}
   <div className="w-full overflow-hidden flex justify-center">
 <DatePicker
  inline
  selected={null}
  onChange={() => {}}
  minDate={new Date()}
  monthsShown={isMobile ? 1 : 2}
  dayClassName={getDateType}
  showOtherMonths={false}
  fixedHeight
  filterDate={(date) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const current = new Date(date);

    current.setHours(0, 0, 0, 0);

    return current >= today && !isBlocked(date);
  }}
/>
</div>

      {/* LEGEND */}
      <div className="flex justify-center gap-6 mt-6 text-sm flex-wrap">
        {/* AVAILABLE */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-[#FFE7E7] rounded"></span>
          Available
        </div>

        {/* BOOKED */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-[#ADB8D6] rounded"></span>
          Booked
        </div>

        {/* CHECK-IN */}
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded border"
            style={{
              background: "linear-gradient(135deg, #FFE7E7 50% , #ADB8D6 50%)",
            }}
          ></span>
          Check-In
        </div>

        {/* CHECK-OUT */}
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded border"
            style={{
              background: "linear-gradient(315deg, #FFE7E7 50% ,  #ADB8D6 50%)",
            }}
          ></span>
          Check-Out
        </div>

        {/* TURNOVER */}
        <div className="flex items-center gap-2">
          <span className="relative w-4 h-4 rounded overflow-hidden border">
            <span
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom right, #ADB8D6 49%, #ADB8D6 51%)",
              }}
            ></span>

            <span
              className="
              absolute
              w-[180%]
              h-[2px]
              bg-black
              top-1/2
              left-[-40%]
              rotate-[-45deg]
            "
            ></span>
          </span>
          Turnover
        </div>
      </div>

      {/* STYLES */}
      <style>{`

/* =====================================================
   MAIN DATEPICKER
===================================================== */

.react-datepicker{

  width:100% !important;

  max-width:980px !important;

  border:none !important;

  display:flex !important;

  justify-content:center;

  align-items:flex-start;

  gap:40px;

  padding:20px;

  font-family:inherit;

  background:#fff;

}

/* =====================================================
   MONTH CONTAINER
===================================================== */

.react-datepicker__month-container{

  width:430px;

}

/* =====================================================
   HEADER
===================================================== */

.react-datepicker__header{

  background:white;

  border:none;

  padding-bottom:18px;

}

/* =====================================================
   MONTH TITLE
===================================================== */

.react-datepicker__current-month{

  font-size:26px;

  font-weight:200;

  margin-bottom:18px;

}

/* =====================================================
   NAVIGATION
===================================================== */

.react-datepicker__navigation{

  top:2px;
  right:40px

}

.react-datepicker__navigation-icon::before{

  border-color:#222;

  border-width:2px 2px 0 0;

}

/* =====================================================
   WEEK
===================================================== */

.react-datepicker__week{

  display:flex;

  justify-content:space-between;

}

/* =====================================================
   DAY NAME
===================================================== */

.react-datepicker__day-name{

  width:48px;

  height:48px;

  line-height:48px;

  margin:3px;

  font-size:15px;

  font-weight:200;

}

/* =====================================================
   DAY
===================================================== */

.react-datepicker__day{

  width:48px;

  height:48px;

  line-height:48px;

  margin:3px;

  border-radius:12px;

  position:relative;

  font-size:15px;

  transition:.25s;

}

.react-datepicker__day:hover{

  transform:scale(1.05);

}

/* =====================================================
   TODAY
===================================================== */

.react-datepicker__day--today{

  font-weight:bold;

}

/* =====================================================
   PAST
===================================================== */

.react-datepicker__day.past-day{

  background:#f3f4f6 !important;

  color:#bdbdbd !important;

  opacity:.7;

}

/* =====================================================
   AVAILABLE
===================================================== */

.react-datepicker__day.available-day{

  background: #FFE7E7!important;

  color:#111 !important;

}

/* =====================================================
   BOOKED
===================================================== */

.react-datepicker__day.blocked-day{

  background:#ADB8D6 !important;

  color:black !important;

}

/* =====================================================
   CHECK IN
===================================================== */

.react-datepicker__day.checkin-day{

  background:linear-gradient(
    135deg,
    #FFE7E7 50%,
    #ADB8D6 50%
  ) !important;

  color:black !important;

}

/* =====================================================
   CHECK OUT
===================================================== */

.react-datepicker__day.checkout-day{

  background:linear-gradient(
    315deg,
    #FFE7E7 50%,
    #ADB8D6 50%
  ) !important;

  color:black !important;

}

/* =====================================================
   TURNOVER
===================================================== */

.react-datepicker__day.turnover-day{

  position:relative;

  isolation:isolate;

  overflow:hidden;

  color:black !important;

}

.react-datepicker__day.turnover-day::before{

  content:"";

  position:absolute;

  inset:0;

  border-radius:12px;

  background:linear-gradient(
    to bottom right,
    #ADB8D6 0%,
    #ADB8D6 49%,
    #ADB8D6 51%,
    #ADB8D6 100%
  );

  z-index:-1;

}

.react-datepicker__day.turnover-day::after{

  content:"";

  position:absolute;

  width:180%;

  height:3px;

  background:black;

  top:50%;

  left:-40%;

  transform:rotate(-45deg);

}

/* =====================================================
   OUTSIDE MONTH
===================================================== */

.react-datepicker__day--outside-month{

  visibility:hidden !important;

  pointer-events:none;

}

/* =====================================================
   RESPONSIVE
===================================================== */

@media(max-width:992px){

.react-datepicker{

display:block !important;

max-width:430px !important;

padding:10px;

}

.react-datepicker__month-container{

width:100%;

margin-bottom:35px;

}

.react-datepicker__day,
.react-datepicker__day-name{

width:40px;

height:40px;

line-height:40px;

font-size:14px;

}

.react-datepicker__current-month{

font-size:22px;

}

}

@media(max-width:480px){

.react-datepicker__day,
.react-datepicker__day-name{

width:34px;

height:34px;

line-height:34px;

font-size:12px;

margin:2px;

}

.react-datepicker__current-month{

font-size:18px;

}

}


`}</style>
    </div>
  );
}
