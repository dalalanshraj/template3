import React from "react";
import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Users } from "lucide-react";

const PropertyCard = ({ listing }) => {
  if (!listing) return null;

  const getImageUrl = (photo) => {
    const base = import.meta.env.VITE_API_URL || "";

    if (photo?.url) {
      if (photo.url.startsWith("http")) return photo.url;

      return base.replace(/\/$/, "") + "/" + photo.url.replace(/^\//, "");
    }

    if (typeof photo === "string") {
      if (photo.startsWith("http")) return photo;

      return base.replace(/\/$/, "") + "/" + photo.replace(/^\//, "");
    }

    return "https://via.placeholder.com/600x400?text=No+Image";
  };

  const image = getImageUrl(listing?.photos?.[0]);

  const price = listing?.deal?.discountedRate || listing?.rates?.[0]?.nightly;

  return (
    <div className=" group relative w-full min-w-[270px] h-[420px] mx-auto rounded-[28px] overflow-hidden bg-white 
    shadow-[0_18px_45px_rgba(0,0,0,.18)] transition-all duration-700 hover:-translate-y-3
     hover:shadow-[0_30px_70px_rgba(0,0,0,.30)] " >
      {/* IMAGE */}

      <div className="absolute inset-0 overflow-hidden">
        <img
          src={image}
          alt={listing?.property?.title}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
          }}
          className=" w-full h-full object-cover transition-transform duration-[2200ms] ease-out group-hover:scale-110 "
        />

        {/* Dark Gradient */}

        <div className=" absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent " />

        {/* Shine Animation */}

        <div className=" absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full duration-[1200ms] " />
      </div>

      {/* Featured Badge */}

      {listing?.deal && (
        <div className=" absolute top-5 left-5 bg-[#00796B] text-white text-[11px] font-bold tracking-wide px-4 py-2 rounded-full shadow-lg ">
          SPECIAL DEAL
        </div>
      )}

      {/* Favorite Button */}

      <div className=" absolute bottom-0 left-0 right-0 bg-white/60 backdrop-blur- px-6 pt-6 pb-1 transition-all duration-500 group-hover:bg-white/94 ">
        {/* Property Title */}

        <h3 className=" text-[20px]   lg:text-[22px] font-bold leading-tight text-[#1B1B1B] line-clamp-2 min-h-[56px] duration-300 group-hover:text-[#80a3a6] ">
          {listing?.property?.title}
        </h3>

        {/* Location */}

        <div className="flex items-center gap-2  text-black">
          <MapPin size={18} className="text-black flex-shrink-0" />

          <span className="text-[15px] line-clamp-1">
            {listing?.location?.address || "Florida"}
          </span>
        </div>

        {/* Features */}

        {/* Divider */}

        <div className="h-px bg-gray-200 my-5"></div>

        {/* Price + Button */}

        <div className="flex items-end justify-between">
          <div>
            <p className="text-black text-sm">Starting From</p>

            <h3 className="mt-1 text-[18px] font-bold text-[#1B1B1B]">
              ${price || "Call"}
              <span className="text-[14px] font-normal"> /night</span>
            </h3>
          </div>

          <Link to={`/${listing._id}`}>
            <button className=" group/button bg-[#80a3a6] text-white rounded-full px-6 py-3 font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-[#44AAD8] ">
              View
              <span
                className="
                transition-transform
                duration-300
                group-hover/button:translate-x-1
              "
              >
                →
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
