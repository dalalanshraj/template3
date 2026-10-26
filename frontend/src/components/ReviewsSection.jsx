import { useState, useEffect } from "react";
import api from "../api/axios";
import {
  ArrowRight,
} from "lucide-react";

export default function ReviewsSection() {
  const [open, setOpen] = useState(false);

  const [reviews, setReviews] = useState([]);

  // FETCH REVIEWS FROM LISTING
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get("/listings/published");

        let allReviews = [];

        data.forEach((listing) => {
          const publishedReviews = (listing.reviews || []).filter(
            (review) => review.published === true
          );

          allReviews.push(
            ...publishedReviews.map((review) => ({
              ...review,
              listingId: listing._id,
              propertyTitle: listing.property?.title || "",
              propertyImage: listing.photos?.[0]?.url || "",
            }))
          );
        });

        // NO DUPLICATE FILTER
        // Show every published review
        allReviews.sort(
          (a, b) =>
            new Date(b.stayDate || 0) -
            new Date(a.stayDate || 0)
        );

        console.log("ALL REVIEWS:", allReviews);

        setReviews(allReviews);
      } catch (err) {
        console.error(
          "FAILED TO LOAD REVIEWS:",
          err.response?.data || err
        );
      }
    };

    fetchReviews();
  }, []);

  // PREVIEW
  const preview = reviews.slice(0, 3);

  return (
    <section className="bg-[#f5f5f5] py-20 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-14 text-center">
          <h2
            className="
        text-[30px] font-semibold
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
            What Our Clients Say
          </h2>
        </div>

        {/* NO REVIEWS */}
        {reviews.length === 0 ? (
          <div className="text-center text-gray-500">No reviews available</div>
        ) : (
          <>
            {/* REVIEWS GRID */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* BIG REVIEW */}
              <div
                className="
                relative 
                bg-white/80 
                backdrop-blur-xl 
                p-8 
                md:p-10 
                rounded-3xl 
                shadow-lg 
                hover:shadow-2xl 
                transition 
                duration-500
              "
              >
                <div
                  className="
                  absolute 
                  -inset-1 
                  bg-[#FFE8BE]/10 
                  blur-xl 
                  rounded-3xl
                "
                ></div>

                <div className="relative">
                  {/* STARS */}
                  <div className="text-yellow-500 text-lg mb-3">
                    {"★".repeat(preview[0]?.rating || 5)}
                  </div>

                  {/* MESSAGE */}
                  <p
                    className="
                    text-gray-600
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
            font-light
                  "
                  >
                    {preview[0]?.message}
                  </p>

                  {/* USER */}
                  <div className="mt-6 flex items-center gap-3">
                    <div
                      className="
                      w-10  uppercase
                      h-10 
                      bg-[#FFE8BE] 
                      rounded-full 
                      flex 
                      items-center 
                      justify-center 
                      text-black 
                      font-bold
                    "
                    >
                      {preview[0]?.name?.charAt(0)}
                    </div>

                    <div>
                      <p className=" text-gray-600
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
            font-light">
                        {preview[0]?.name}
                      </p>

                      <p className="text-sm text-gray-400">
                        {preview[0]?.stayDate
                          ? new Date(preview[0].stayDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SMALL REVIEWS */}
              <div className="flex flex-col gap-6">
                {preview.slice(1).map((r, i) => (
                  <div
                    key={i}
                    className="
                      bg-white 
                      p-6 
                      rounded-2xl 
                      shadow-md 
                      hover:shadow-xl 
                      hover:-translate-y-1 
                      transition 
                      duration-300
                    "
                  >
                    {/* STARS */}
                    <div className="text-yellow-500 mb-2 text-sm">
                      {"★".repeat(r?.rating || 5)}
                    </div>

                    {/* TITLE */}
                    <h4 className="font-semibold text-lg mb-2">{r?.title}</h4>

                    {/* MESSAGE */}
                    <p className="text-gray-600 text-sm">{r?.message}</p>

                    {/* USER */}
                    <div className="mt-4 flex items-center gap-2">
                      <div
                        className="
                          w-8 
                          h-8 
                          bg-gray-200 
                          rounded-full 
                          flex 
                          items-center 
                          justify-center 
                          text-sm 
                          font-bold
                        "
                      >
                        {r?.name?.charAt(0)}
                      </div>

                      <div>
                        <p
                          className="
                            font-semibold 
                            text-gray-800 
                            text-sm
                          "
                        >
                          {r?.name}
                        </p>

                        <p className="text-sm text-gray-400">
                          {preview[0]?.stayDate
                            ? new Date(preview[0].stayDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-center mt-14">
              <button
                onClick={() => setOpen(true)}
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
                View All Reviews
                <ArrowRight
                  size={16}
                  className="
                      transition-transform duration-300
                      group-hover:translate-x-1
                    "
                />

              </button>
            </div>
          </>
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div
          className="
          fixed 
          inset-0 
          bg-black/70 
          flex 
          items-center 
          justify-center 
          z-50 
          px-4
        "
        >
          <div
            className="
            bg-white 
            w-full 
            max-w-3xl 
            rounded-2xl 
            p-6 
            relative 
            shadow-xl
          "
          >
            {/* TOP */}
            <div
              className="
              flex 
              justify-between 
              items-center 
              mb-6
            "
            >
              <h2
                className="
        text-[30px] font-semibold
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
                Reviews ({reviews.length})
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="
                text-2xl 
                text-gray-600 
                hover:text-black
              "
              >
                ✕
              </button>
            </div>

            {/* LIST */}
            <div
              className="
              max-h-[65vh] 
              overflow-y-auto 
              space-y-6 
              pr-2
            "
            >
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="
                  shadow-xl 
                  rounded-2xl 
                  p-6 
                  bg-gray-50 
                  hover:shadow-md 
                  transition
                "
                >
                  {/* STARS */}
                  <div className="text-yellow-500 text-lg mb-2">
                    {"★".repeat(r?.rating || 5)}
                  </div>

                  {/* TITLE */}
                  <h4
                    className="
                     text-black
                     font-bold
                     uppercase
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
             
                  "
                  >
                    {r?.title}
                  </h4>

                  {/* MESSAGE */}
                  <p
                    className="
                    text-gray-600
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
            font-light
                  "
                  >
                    {r?.message}
                  </p>

                  {/* DATE */}
                  <p className="text-sm text-gray-400">
                    {preview[0]?.stayDate
                      ? new Date(preview[0].stayDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )
                      : ""}
                  </p>

                  {/* USER */}
                  <div className="mt-4 flex items-center gap-2">
                    <div
                      className="
                      w-10 
                      h-10 
                      uppercase
                      bg-[#FFE8BE] 
                      rounded-full 
                      flex 
                      items-center 
                      justify-center 
                      text-black 
                      font-bold
                    "
                    >
                      {r?.name?.charAt(0)}
                    </div>

                    <p
                      className="
                       text-gray-600
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
            font-light
                    "
                    >
                      {r?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
