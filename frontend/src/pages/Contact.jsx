import { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axios";
import { IoLocation } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
} from "lucide-react";

export default function Contact({ listingId }) {
  const [listing, setListing] = useState(null);

  const [calendarData, setCalendarData] = useState([]);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    adults: "",
    kids: "",
    checkIn: null,
    checkOut: null,
    message: "",
  });

  // =====================================
  // FETCH LISTING
  // =====================================

  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}`)

      .then((res) => {
        setListing(res.data);
      })

      .catch(console.log);
  }, [listingId]);

  // =====================================
  // FETCH CALENDAR
  // =====================================

  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/calendar/${listingId}/calendar`)

      .then((res) => {
        setCalendarData(res.data.calendar || []);
      })

      .catch(console.log);
  }, [listingId]);

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatLocalDate = (date) => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Chicago",

      year: "numeric",

      month: "2-digit",

      day: "2-digit",
    }).format(new Date(date));
  };

  // =====================================
  // BLOCKED MAP
  // =====================================

  const blockedMap = useMemo(() => {
    const map = {};

    calendarData.forEach((item) => {
      const itemDate = new Date(
        new Date(item.date).toLocaleString("en-US", {
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
  }, [calendarData]);

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

    const hasH = statuses.includes("H");

    // TURNOVER
    if (hasCIN && hasCOUT) {
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

    // BLOCKED
    if (hasR) {
      return "blocked-day";
    }

    // HOLD
    if (hasH) {
      return "hold-day";
    }

    return "available-day";
  };

  // =====================================
  // BLOCKED CHECK
  // =====================================

  const isBlocked = (date) => {
    const key = formatLocalDate(date);

    const statuses = blockedMap[key] || [];

    return statuses.includes("R");
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const dbPayload = {
        property: listingId,

        name: form.name,

        email: form.email,

        phone: form.phone,

        message: form.message,

        Arrival: form.checkIn,

        Departure: form.checkOut,

        Adults: form.adults,

        Kids: form.kids,
      };

      await api.post("/inquiries", dbPayload);

      const recipients = [
        listing?.property?.email,
        listing?.property?.email,
      ].filter(Boolean);

      const emailPayload = {
        to_email: recipients.join(","),

        Recipients: recipients.join(", "),

        property: listing?.property?.title,

        name: form.name,
        email: form.email,
        phone: form.phone,

        Arrival: formatLocalDate(form.checkIn),
        Departure: formatLocalDate(form.checkOut),

        adults: form.adults,
        kids: form.kids,

        message: form.message,
      };

      for (const recipient of recipients) {
        await emailjs.send(
          "service_04sk77i",
          "template_h8d4zrt",
          {
            ...emailPayload,
            to_email: recipient,
          },
          "xppi5YZRRXZI6aHUJ",
        );
      }

      setStatus({
        type: "success",

        message: "Booking request sent successfully ✅",
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        adults: "",
        kids: "",
        checkIn: null,
        checkOut: null,
        message: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.log(err);

      setStatus({
        type: "error",

        message: "Something went wrong ❌",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // NIGHTS
  // =====================================

  const nights =
    form.checkIn && form.checkOut
      ? Math.ceil((form.checkOut - form.checkIn) / (1000 * 60 * 60 * 24))
      : 0;

  return (
    <>
      {/* =========================================
                    HERO
      ========================================= */}

      <section className="relative h-[20vh] flex items-center justify-center text-white mt-20">
        <div className="relative text-center px-6">
          <h2
            className="
        text-[30px] font-semibold
        uppercase leading-tight
        tracking-[-0.035em]
        text-[#171717]
        drop-shadow-[2px_3px_1px_rgba(0,0,0,0.25)]
        sm:text-4xl
        lg:text-[48px]
        xl:text-[50px]
      "
            style={{
              fontFamily: '"Oswald", sans-serif',
            }}
          >
           Plan Your Getaway
          </h2>
          {/* <p className="text-gray-500 max-w-xl mx-auto">
            Discover comfort, luxury, and unforgettable stays with us.
          </p> */}
        </div>
      </section>


      <section className="bg-[] py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          {/* HEADING */}

          {/* MAIN */}

          <div className="">
            {/* LEFT */}

            <div>
              <div className="space-y-6 mb-1 grid grid-cols-1 lg:grid-cols-3 gap-14 lg:gap-20">
                {/* LOCATION */}

                <div className="bg-white rounded-[28px] p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-full bg-[#f8a847] flex items-center justify-center  
                    text-[#fff]
                  "
                      style={{
                        fontFamily: "'Quicksand' , sans-serif",
                      }}
                    >
                      <IoLocation size={24} />
                    </div>

                    <div>
                      <h4 className="  uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[16px]
            mb-1
          ">
                        Location
                      </h4>

                      <p className="text-gray-600 text-base md:text-xl lg:text-[18px] leading-relaxed font-light">
                        Panama City Beach
                      </p>
                    </div>
                  </div>
                </div>

                {/* EMAIL */}

                <div className="bg-white rounded-[28px] p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-full bg-[#f8a847] flex items-center justify-center  
                    text-[#fff]
                  "
                      style={{
                        fontFamily: "'Quicksand' , sans-serif",
                      }}
                    >
                      <MdEmail size={24} />
                    </div>

                    <div>
                      <h4 className="  uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[16px]
            mb-1
          ">
                        Email
                      </h4>

                      <p className="text-gray-600 text-base md:text-xl lg:text-[18px] leading-relaxed font-light">
                        {listing?.property?.email || "info@example.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PHONE */}

                <div className="bg-white rounded-[28px] p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-full bg-[#f8a847] flex items-center justify-center  
                    text-[#fff]
                  "
                      style={{
                        fontFamily: "'Quicksand' , sans-serif",
                      }}
                    >
                      <FaPhoneAlt size={20} />
                    </div>

                    <div>
                      <h4 className="  uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[16px]
            mb-1
          ">
                        Phone
                      </h4>

                      <p className="text-gray-600 text-base md:text-xl lg:text-[18px] leading-relaxed font-light">
                        {listing?.property?.phone || "Phone not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}

         
<form
  onSubmit={handleSubmit}
  className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl sm:rounded-3xl"
>
  {/* FORM HEADER */}
  <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-7 sm:px-8 sm:py-9 md:px-10">
     

    <h2
      className="text-3xl font-semibold uppercase leading-tight tracking-tight text-[#171717] sm:text-4xl md:text-5xl"
      style={{ fontFamily: '"Oswald", sans-serif' }}
    >
      Book Your Stay
    </h2>

  
  </div>

  {/* FORM BODY */}
  <div className="space-y-7 p-5 sm:p-8 md:p-10">

    {/* CONTACT DETAILS */}
    <div>
      {/* <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
        Contact Information
      </h3> */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[13px]
            mb-6">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Enter your full name"
            required
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#315F60] focus:bg-white focus:ring-2 focus:ring-[#315F60]/10"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[13px]
            mb-6">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#315F60] focus:bg-white focus:ring-2 focus:ring-[#315F60]/10"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        <div className="sm:col-span-2">
          <label className="uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[13px]
            mb-6">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="Enter your phone number"
            required
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#315F60] focus:bg-white focus:ring-2 focus:ring-[#315F60]/10"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
        </div>
      </div>
    </div>

    {/* STAY DETAILS */}
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
        Your Stay
      </h3>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <label className="uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[13px]
            mb-6">
            Check In <span className="text-red-500">*</span>
          </label>
          <DatePicker
            selected={form.checkIn}
            selectsStart
            startDate={form.checkIn}
            endDate={form.checkOut}
            minDate={new Date()}
            placeholderText="Select check-in date"
            dateFormat="MMM dd, yyyy"
            required
            onChange={(date) => {
              setForm({
                ...form,
                checkIn: date,
                checkOut:
                  form.checkOut && date && form.checkOut <= date
                    ? null
                    : form.checkOut,
              });
            }}
            wrapperClassName="block w-full"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#315F60] focus:bg-white focus:ring-2 focus:ring-[#315F60]/10"
          />
        </div>

        <div className="min-w-0">
          <label className="uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[13px]
            mb-6">
            Check Out <span className="text-red-500">*</span>
          </label>
          <DatePicker
            selected={form.checkOut}
            selectsEnd
            startDate={form.checkIn}
            endDate={form.checkOut}
            minDate={
              form.checkIn
                ? new Date(form.checkIn.getFullYear(), form.checkIn.getMonth(), form.checkIn.getDate() + 1)
                : new Date(new Date().setHours(0, 0, 0, 0))
            }
            placeholderText="Select check-out date"
            dateFormat="MMM dd, yyyy"
            required
            onChange={(date) =>
              setForm({ ...form, checkOut: date })
            }
            wrapperClassName="block w-full"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#315F60] focus:bg-white focus:ring-2 focus:ring-[#315F60]/10"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Adults <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="adults"
            min="1"
            required
            placeholder="Number of adults"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#315F60] focus:bg-white focus:ring-2 focus:ring-[#315F60]/10"
            value={form.adults}
            onChange={(e) =>
              setForm({ ...form, adults: e.target.value })
            }
          />
        </div>

        <div>
          <label className="uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[13px]
            mb-6">
            Kids
          </label>
          <input
            type="number"
            name="kids"
            min="0"
            placeholder="Number of kids"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#315F60] focus:bg-white focus:ring-2 focus:ring-[#315F60]/10"
            value={form.kids}
            onChange={(e) =>
              setForm({ ...form, kids: e.target.value })
            }
          />
        </div>
      </div>
    </div>

    {/* MESSAGE */}
    <div>
      <label className="uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[13px]
            mb-6">
        Additional Message
      </label>
      <textarea
        name="message"
        rows={4}
        placeholder="Tell us about any special requests..."
        className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#315F60] focus:bg-white focus:ring-2 focus:ring-[#315F60]/10"
        value={form.message}
        onChange={(e) =>
          setForm({ ...form, message: e.target.value })
        }
      />
    </div>

    {/* NIGHTS */}
    {nights > 0 && (
      <div className="flex items-center justify-between rounded-xl border border-[#315F60]/15 bg-[#315F60]/5 px-4 py-3.5">
        <span className="text-sm text-gray-600">Length of stay</span>
        <span className="font-semibold text-[#315F60]">
          {nights} {nights === 1 ? "night" : "nights"}
        </span>
      </div>
    )}

    {/* STATUS */}
    {status.message && (
      <div
        role="status"
        className={`rounded-xl border px-4 py-3.5 text-sm ${
          status.type === "success"
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}
      >
        {status.message}
      </div>
    )}

    {/* SUBMIT */}
    <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="max-w-sm text-xs leading-relaxed text-gray-500">
        Submitting this form sends an inquiry. Your booking is not confirmed
        until our team confirms it.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="group inline-flex min-h-[54px] w-full shrink-0 items-center justify-center gap-3 bg-[#171717] px-6 py-4 text-xs font-semibold tracking-[0.15em] text-white shadow-[5px_5px_0px_#252525] transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#315F60] hover:shadow-[7px_7px_0px_#252525] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[210px]"
        style={{ fontFamily: '"Montserrat", sans-serif' }}
      >
        {loading ? "SENDING..." : "SEND BOOKING"}

        <ArrowRight
          size={17}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </button>
    </div>
  </div>
</form>
 
          </div>
        </div>

        {/* DATEPICKER CSS */}

        <style>{`

.react-datepicker {
  border: none !important;
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  font-family: inherit;
}

.react-datepicker__header {
  background: white !important;
  border-bottom: 1px solid #eee !important;
  padding-top: 15px;
}

.react-datepicker__current-month {
  font-weight: 600;
  font-size: 16px;
}

.react-datepicker__day-name,
.react-datepicker__day {
  width: 38px;
  height: 38px;
  line-height: 38px;
  margin: 2px;
  border-radius: 10px;
}

.react-datepicker__day.available-day {
  background: #d1fae5 !important;
}

.react-datepicker__day.blocked-day {
  background: #5C5CFF !important;
  color: white !important;
}

.react-datepicker__day.hold-day {
  background: #facc15 !important;
  color: black !important;
}

.react-datepicker__day.checkin-day {
  background: linear-gradient(
    135deg,
    #d1fae5 50%,
    #5C5CFF 50%
  ) !important;
}

.react-datepicker__day.checkout-day {
  background: linear-gradient(
    315deg,
    #d1fae5 50%,
    #5C5CFF 50%
  ) !important;
}

.react-datepicker__day.turnover-day {
  position: relative !important;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #5C5CFF 50%,
    #5C5CFF 50%
  ) !important;
}

.react-datepicker__day.turnover-day::after {
  content: "";
  position: absolute;
  width: 160%;
  height: 2px;
  background: black;
  top: 50%;
  left: -30%;
  transform: rotate(-45deg);
}

.react-datepicker__day.past-day {
  background: #f1f1f1 !important;
  opacity: 0.5;
}

.react-datepicker__day--outside-month {
  visibility: hidden !important;
}

      `}</style>
      </section>
    </>
  );
}
