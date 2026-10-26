import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  CalendarDays,
  Home,
  Search,
  ArrowRight,
} from "lucide-react";
import PropertyGallery from "../components/PropertyGallery";
import ReviewModal from "../components/ReviewModal";
import BookingPreviewModal from "../components/BookingModal";
import ProCalendar from "../components/ProCalendar.jsx";

import { MdFamilyRestroom, MdOutlineDoorBack } from "react-icons/md";
import { LuBath } from "react-icons/lu";
import { IoHome } from "react-icons/io5";

import { amenitiesData } from "../amenitiesData.js";
import { activitiesData } from "../activitiesData.js";
import InquiryModal from "../components/InquiryModal.jsx";
import DisplayCalendar from "../components/miniCalendar.jsx";
import PropertyminiCalendar from "../components/PropertyminiCalendar.jsx";
import GallerySection from "../components/gallarySection.jsx";
import BookingBar from "../components/BookingBar.jsx";
import OwnerRezWidget from "../components/OwnerRezWidget.jsx";

const PropertyDetail = () => {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openReview, setOpenReview] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const [blockedDates, setBlockedDates] = useState([]);
  const [openInquiry, setOpenInquiry] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  const [arrival, setArrival] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [guests, setGuests] = useState(1);
  const [preview, setPreview] = useState(null);

  // ================= FETCH LISTING =================
  useEffect(() => {
    api
      .get(`/listings/${id}`)
      .then((res) => {
        setListing(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);
  const formatDisplayDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ================= FETCH CALENDAR =================
  useEffect(() => {
    api.get(`/listings/${id}/calendar`).then((res) => {
      const blocked = res.data
        .filter((d) => d.status === "R" || d.status === "H")
        .map((d) => {
          const dt = new Date(d.date);
          dt.setHours(0, 0, 0, 0);
          return dt;
        });

      setBlockedDates(blocked);
    });
  }, [id]);
  const getMinNightsForDate = (date) => {
    if (!listing?.rates || !date) return 1;

    const selected = listing.rates.find((r) => {
      const from = new Date(r.from);
      const to = new Date(r.to);

      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);

      return date >= from && date <= to;
    });

    return selected?.minNights || 1;
  };

  // 🔹 useEffect
  useEffect(() => {
    if (checkIn && checkOut && listing) {
      const minNights = getMinNightsForDate(checkIn);

      const diff = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

      if (diff < minNights) {
        const newDate = new Date(checkIn);
        newDate.setDate(newDate.getDate() + minNights);
        setCheckOut(newDate);
      }
    }
  }, [checkIn, checkOut, listing]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white animate-pulse">
        {/* Hero */}
        <div className="h-[450px] bg-gray-200" />

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Title */}
          <div className="h-8 w-2/3 bg-gray-200 rounded mb-4" />

          {/* Location */}
          <div className="h-5 w-1/3 bg-gray-200 rounded mb-10" />

          {/* Content */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="h-5 w-full bg-gray-200 rounded" />
              <div className="h-5 w-5/6 bg-gray-200 rounded" />
              <div className="h-5 w-4/6 bg-gray-200 rounded" />
            </div>

            <div className="h-48 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // ================= IMAGES =================
  const imageUrls = listing.photos || [];

  // ================= REVIEWS =================
  const publishedReviews =
    listing.reviews?.filter((r) => r.published === true) || [];

  // ================= YOUTUBE =================
  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    if (url.includes("embed")) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`;
    return null;
  };

  // ================= MAP =================
  const getMapEmbedUrl = (lat, lng) => {
    const finalLat = Number(lat);
    const finalLng = Number(lng);

    return `https://maps.google.com/maps?q=${finalLat},${finalLng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };
  const formatDate = (date) => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ================= MIN NIGHT AUTO FIX =================
  // 🔹 single function

  return (
    <>
      {/* GALLERY */}
      <PropertyGallery images={imageUrls} />

      <div className=" w-full max-w-full mx-auto px-4 sm:px-5 lg:px-6 mt-0 mb-20 overflow-hidden ">
        {/* LEFT */}
        <div className=" w-full max-w-full bg-white rounded-3xl p-4 sm:p-6 md:p-0 overflow-hidden ">
          <section
            id="description"
            className=" scroll-mt-[90px] sm:scroll-mt-[100px] lg:scroll-mt-[150px] w-full max-w-full px-4
            lg:px-6 py-10 lg:py-14 "
          >
            <div className="w-full flex justify-center">
              <div className="w-full max-w-6xl">
                {/* Location */}

                <p
                  className=" uppercase tracking-[3px] md:tracking-[4px] text-center text-black text-xs
            md:text-[16px] mb-6 "
                  style={{
                    fontFamily: "'Quicksand' , sans-serif",
                  }}
                >
                  {listing.location?.address || "Panama City Beach, Florida"}
                </p>

                {/* Title */}

                <h2
                  className="
        text-[30px] font-semibold
        text-center
        mb-10
        uppercase leading-tight
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
                  {listing.property?.title}
                </h2>

                {/* PROPERTY INFO */}

                <div className=" flex flex-wrap gap-8 lg:gap-90 mb-10 ">
                  {/* Sleeps */}

                  <div
                    className="flex items-center gap-3   text-gray-600
                text-base md:text-lg xl:text-xl leading-relaxed font-light"
                  >
                    <MdFamilyRestroom className="text-3xl text-gray-700 " />

                    <div className="flex gap-1 ">
                      <p className=" text-md">
                        {listing.property?.maxSleeps || 0}
                      </p>

                      <span
                        className="text-gray-600 text-base md:text-lg xl:text-xl leading-relaxed
                 font-light"
                      >
                        Guests
                      </span>
                    </div>
                  </div>

                  {/* Bedrooms */}

                  <div
                    className="flex items-center gap-3   text-gray-600
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
            font-light"
                  >
                    <MdOutlineDoorBack className="text-3xl text-gray-700" />

                    <div className="flex gap-1 ">
                      <p className=" text-md">
                        {listing.property?.bedrooms || 0}
                      </p>

                      <span className="text-black text-md">Bedrooms</span>
                    </div>
                  </div>

                  {/* Bathrooms */}

                  <div
                    className="flex items-center gap-3   text-gray-600
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
            font-light"
                  >
                    <LuBath className="text-3xl text-gray-700" />

                    <div className="flex gap-1 ">
                      <p className=" text-md">
                        {listing.property?.bathrooms || 0}
                      </p>

                      <span className="text-black text-md">Bathrooms</span>
                    </div>
                  </div>

                  {/* Category */}

                  {/* <div className="flex items-center gap-3">
                    <IoHome className="text-3xl text-gray-700" /> */}

                  {/* <div  className="flex gap-1 ">
                          <p className="font-light text-sm">
                        {listing.property?.category || "Home"}
                      </p>

                      <span className="text-gray-500 text-sm">
                        Property Type
                      </span>
                    </div> */}
                  {/* </div> */}
                </div>

                {/* DESCRIPTION */}

                <div
                  className=" text-gray-600 text-base md:text-lg xl:text-xl leading-relaxed font-light prose
    prose-lg max-w-none prose-headings:text-black prose-headings:font-bold prose-headings:mb-4 prose-p:text-gray-600
    prose-p:leading-8 prose-p:mb-5 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-black
    prose-strong:font-semibold prose-ul:my-5 prose-ol:my-5 prose-li:text-gray-600 prose-li:marker:text-blue-600 prose-li:mb-2
 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:text-gray-600 
    prose-img:rounded-xl prose-img:shadow-lg leading-relaxed
    
  "
                  style={{
                    fontFamily: "Quicksand, sans-serif",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: listing.description || "",
                  }}
                />
              </div>
            </div>
          </section>
          <div
            id="pictures"
            className="
    scroll-mt-[90px]
    sm:scroll-mt-[100px]
    lg:scroll-mt-[150px]

    w-full
    max-w-full
    overflow-hidden
  "
          >
            <GallerySection />
          </div>

          {/* AMENITIES */}
          {/* =========================
      AMENITIES
========================= */}

          <section
            id="amenities"
            className="
    scroll-mt-[90px]
    sm:scroll-mt-[100px]
    lg:scroll-mt-[150px]

    w-full
    max-w-full
    mt-16
    overflow-hidden
  "
          >
            <div className="max-w-7xl mx-auto">
              <h2
                className="
        text-[30px] font-semibold text-center
        uppercase leading-tight   mb-14 
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
                Amenities
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-10">
                {amenitiesData.map((section) => {
                  const selected = section.options.filter(
                    (item) => listing.amenities?.[item],
                  );

                  if (!selected.length) return null;

                  return (
                    <div key={section.title}>
                      <h3
                        className="
                uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[16px]
            mb-6
                  "
                        style={{
                          fontFamily: "'Quicksand' , sans-serif",
                        }}
                      >
                        {section.title}
                      </h3>

                      <p
                        className="
                text-gray-600
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
            font-light
                  "
                        style={{
                          fontFamily: "Quicksand, sans-serif",
                        }}
                      >
                        {selected.join(" , ")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
          {/* Activities */}

          {/* {activitiesData.map((section) => {
            const selected = section.options.filter(
              (item) => listing.activities?.[item],
            );
            if (selected.length === 0) return null;

            return (
              <div key={section.title} className="mb-6">
                <h2 className="text-2xl font-semibold mt-8 mb-4">Activities</h2>
                <h5 className="bg-[#2f9bad] text-white p-2 rounded-xl text-lg mb-2">
                  {section.title}
                </h5>

                <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 list-disc ml-6">
                  {selected.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })} */}

          {/* VIDEO */}

          {/* PROPERTY VIDEO + LOCATION MAP */}
          <div
            className="
    mx-auto mt-10 grid w-full max-w-7xl
    grid-cols-1 gap-10 px-4
    sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8
  "
          >
            {/* PROPERTY VIDEO */}
            {listing.video?.youtube && (
              <section
                id="videos"
                className="
        min-w-0 w-full scroll-mt-[100px]
        sm:scroll-mt-[120px]
        lg:scroll-mt-[150px]
      "
              >
                <h2
                  className="
          mb-6 text-center text-[30px]
          font-semibold uppercase leading-tight
          tracking-[-0.035em] text-[#171717]
          drop-shadow-[2px_3px_1px_rgba(0,0,0,0.25)]
          sm:text-4xl lg:text-[40px]
        "
                  style={{ fontFamily: '"Oswald", sans-serif' }}
                >
                  Property Video
                </h2>

                <div className="aspect-video w-full overflow-hidden rounded-xl border border-gray-200 shadow-md">
                  <iframe
                    src={getYoutubeEmbed(listing.video.youtube)}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    title="Property Video"
                  />
                </div>
              </section>
            )}

            {/* PROPERTY LOCATION MAP */}
            {listing?.location?.lat != null &&
              listing?.location?.lng != null && (
                <section
                  id="location"
                  className="
          min-w-0 w-full scroll-mt-[100px]
          sm:scroll-mt-[120px]
          lg:scroll-mt-[150px]
        "
                >
                  <h2
                    className="
            mb-6 text-center text-[30px]
            font-semibold uppercase leading-tight
            tracking-[-0.035em] text-[#171717]
            drop-shadow-[2px_3px_1px_rgba(0,0,0,0.25)]
            sm:text-4xl lg:text-[40px]
          "
                    style={{ fontFamily: '"Oswald", sans-serif' }}
                  >
                    Location
                  </h2>

                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-gray-200 shadow-md">
                    <iframe
                      src={getMapEmbedUrl(
                        listing.location.lat,
                        listing.location.lng,
                      )}
                      className="h-full w-full"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Property Location"
                    />
                  </div>
                </section>
              )}
          </div>

          {/* Calendar  */}
          <div
            id="availability"
            className="
    scroll-mt-[90px]
    sm:scroll-mt-[100px]
    lg:scroll-mt-[150px]

    w-full
    max-w-full

    mt-6

    px-3
    sm:px-6
    md:px-10
    lg:px-20
  "
          >
            <PropertyminiCalendar listingId={listing._id} />
          </div>
          {/* ======================================================
                    PREMIUM REVIEWS
====================================================== */}

          <section
            id="reviews"
            className="
    mx-auto w-full max-w-7xl
    scroll-mt-[100px]
    px-4 py-12
    sm:px-6 sm:py-16
    lg:px-8 lg:py-20
  "
          >
            {/* HEADER */}
            <div
              className="
      mb-8 flex flex-col gap-6
      sm:mb-10
      lg:flex-row lg:items-center
      lg:justify-between
    "
            >
              <div className="min-w-0">
                <h2
                  className="
          text-3xl   font-semibold uppercase
          leading-tight tracking-[-0.025em]
          text-[#171717]
          drop-shadow-[2px_3px_1px_rgba(0,0,0,0.20)]
          sm:text-4xl lg:text-[46px]
        "
                  style={{ fontFamily: '"Oswald", sans-serif' }}
                >
                  Guest Reviews
                </h2>

                {/* Average Rating */}
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-3xl font-semibold text-[#222]">
                    {publishedReviews.length > 0
                      ? (
                        publishedReviews.reduce(
                          (sum, item) => sum + Number(item.rating || 0),
                          0,
                        ) / publishedReviews.length
                      ).toFixed(1)
                      : "0.0"}
                  </span>

                  <span
                    className="text-xl tracking-[2px] text-amber-500 sm:text-2xl"
                    aria-label="5 star rating display"
                  >
                    ★★★★★
                  </span>

                  <span
                    className="text-gray-600
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
            font-light"
                  >
                    ({publishedReviews.length}{" "}
                    {publishedReviews.length === 1 ? "Review" : "Reviews"})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpenReview(true)}
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
                Write a Review
                 <ArrowRight
        size={16}
        className="
          transition-transform duration-300
          group-hover:translate-x-1
        "
      />
              </button>
            </div>

            {/* REVIEWS LIST */}
            <div
              className="
      custom-scrollbar
      max-h-[650px] space-y-5
      overflow-y-auto overscroll-contain
      pr-1 sm:pr-3
    "
            >
              {publishedReviews.length === 0 ? (
                <div
                  className="
          rounded-2xl border border-gray-200
          bg-gray-50 px-5 py-12 text-center
          sm:rounded-3xl sm:px-8 sm:py-16
        "
                >
                  <h3
                    className="text-2xl font-semibold text-gray-900 sm:text-3xl"
                    style={{ fontFamily: '"Oswald", sans-serif' }}
                  >
                    No Reviews Yet
                  </h3>

                  <p className="mt-3 text-sm text-gray-500 sm:text-base">
                    Be the first guest to share your experience.
                  </p>

                  <button
                    type="button"
                    onClick={() => setOpenReview(true)}
                    className="
            mt-6 rounded-lg bg-[#00989c]
            px-6 py-3 font-semibold text-white
            transition hover:bg-[#087b7e]
          "
                  >
                    Write the First Review
                  </button>
                </div>
              ) : (
                publishedReviews.map((review) => (
                  <article
                    key={review._id}
                    className="
            rounded-2xl border border-gray-200
            bg-white p-5 shadow-sm
            transition-all duration-300
            hover:border-gray-300 hover:shadow-lg
            sm:rounded-3xl sm:p-7
            lg:p-8
          "
                  >
                    {/* Review Header */}
                    <div
                      className="
              flex flex-col gap-4
              sm:flex-row sm:items-start
              sm:justify-between
            "
                    >
                      <div className="min-w-0">
                        <h3 className="uppercase break-words text-xl font-semibold text-[#222] sm:text-2xl">
                          {review.title || "Guest Review"}
                        </h3>

                        <p
                          className=" text-gray-600
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
            font-light"
                        >
                          By{" "}
                          <span
                            className=" text-gray-600
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
            font-light"
                          >
                            {review.name || "Guest"}
                          </span>
                        </p>
                      </div>

                      <div className="shrink-0 sm:text-right">
                        <div
                          className="text-xl tracking-[2px] text-amber-500 sm:text-2xl"
                          aria-label={`${review.rating} out of 5 stars`}
                        >
                          {"★".repeat(
                            Math.max(
                              0,
                              Math.min(5, Number(review.rating) || 0),
                            ),
                          )}
                          {"☆".repeat(
                            5 -
                            Math.max(
                              0,
                              Math.min(5, Number(review.rating) || 0),
                            ),
                          )}
                        </div>

                        {(review.stayDate || review.createdAt) && (
                          <p
                            className=" text-gray-600
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
            font-light"
                          >
                            Stayed{" "}
                            {new Date(
                              review.stayDate || review.createdAt,
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Review Message */}
                    <p
                      className="
              mt-5 whitespace-pre-line break-words
              text-sm leading-7 text-gray-600  leading-relaxed
            font-light
              sm:mt-7 sm:text-base sm:leading-8
            "
                    >
                      {review.message}
                    </p>

                    {/* Owner Reply */}
                    {review.reply && (
                      <div
                        className="
                mt-6 rounded-xl border-l-4
                border-[#00989c] bg-[#f3fafa]
                p-4 sm:mt-7 sm:rounded-2xl sm:p-6
              "
                      >
                        <h4 className="mb-2 font-semibold text-[#087b7e]">
                          Owner Response
                        </h4>

                        <p className="whitespace-pre-line break-words text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                          {review.reply}
                        </p>
                      </div>
                    )}

                    {/* Review Footer */}
                    <div
                      className="
              mt-6 flex flex-wrap items-center
              justify-between gap-3 border-t
              border-gray-100 pt-4 sm:mt-7 sm:pt-5
            "
                    >
                      <span className="text-xs text-gray-400 sm:text-sm">
                        Guest Review
                      </span>

                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#087b7e] sm:text-sm">
                        <span className="h-2 w-2 rounded-full bg-[#00989c]" />
                        Verified Stay
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          {/* Review Modal */}

          {openReview && (
            <ReviewModal listingId={id} onClose={() => setOpenReview(false)} />
          )}
        </div>
        <BookingBar
          listing={listing}
          arrival={arrival}
          departure={departure}
          setArrival={setArrival}
          setDeparture={setDeparture}
          guests={guests}
          setGuests={setGuests}
          setOpenBooking={setOpenBooking}
          setOpenInquiry={setOpenInquiry}
        />
        {/* <OwnerRezWidget /> */}

        {/* RIGHT BOOKING */}
        {/* CALENDAR */}

        <div className="lg:col-span-1">
          <div className="sticky top-[100px] bg-white rounded-3xl shadow-xl p-6 "></div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {openBooking && (
        <BookingPreviewModal
          propertyId={id}
          checkIn={formatDate(checkIn)}
          checkOut={formatDate(checkOut)}
          onClose={() => setOpenBooking(false)}
        />
      )}
    </>
  );
};

export default PropertyDetail;
