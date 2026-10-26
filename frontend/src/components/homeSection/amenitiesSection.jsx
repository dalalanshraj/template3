import { useState, useEffect } from "react";
import api from "../../api/axios";
import AmenitiesModal from "./AmenitiesModal";
import {
   
  ArrowRight,
} from "lucide-react";

export default function AmenitiesSection( ) {
  const [open, setOpen] = useState(false);

  const [amenities, setAmenities] = useState([]);

  // FETCH AMENITIES FROM BACKEND
useEffect(() => {
  const fetchAmenities = async () => {
    try {
      const { data } = await api.get("/listings/published")
// console.log("Listing:", data);

data.forEach((listing) => {
  // console.log("Amenities:", listing.amenities);
});
      let allAmenities = [];

      data.forEach((listing) => {
    //  console.log(listing);

const amenitiesObject =
  listing.amenities ??
  listing.property?.amenities ??
  {};

// console.log("Amenities Object:", amenitiesObject);

        const amenities = Object.keys(amenitiesObject).filter(
          (key) => amenitiesObject[key] === true
        );

        allAmenities.push(...amenities);
      });

      // Remove duplicates
      const uniqueAmenities = [...new Set(allAmenities)].sort();

      setAmenities(uniqueAmenities);
    } catch (err) {
      console.log(err);
    }
  };

  fetchAmenities();
}, []);


  // PREVIEW
  const preview = amenities.slice(0, 12);

  return (
    <section className="py-1 px-6 md:px-16 mt-20">
      {/* TOP */}
      {/* <p
        className="
        uppercase 
        text-center 
        text-xs 
        tracking-[3px] 
        text-[#2f9bad]
        mb-3
      "
      >
        Amenities
      </p> */}
      <div className="text-center mb-15">

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
        Our Common Amenities
      </h2>
</div>
      {/* PREVIEW */}
      <div
        className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        gap-5
        
      "
      >
        {preview
          .filter((item) => item?.trim() !== "")
          .map((name, i) => (
            <p key={i} className="   text-gray-600
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
            font-light
          " >
              {name}
            </p>
          ))}
      </div>

      {/* BUTTON */}
      {amenities.length > 0 && (
        <div className="flex justify-center p-3">
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
            
            Show all {amenities.length} Amenities
            <ArrowRight
                    size={16}
                    className="
                      transition-transform duration-300
                      group-hover:translate-x-1
                    "
                  />
          </button>
        </div>
      )}

      {/* MODAL */}
      {open && (
        <AmenitiesModal amenities={amenities} onClose={() => setOpen(false)} />
      )}
    </section>
  );
}
