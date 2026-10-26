import React, { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { IoSearch } from "react-icons/io5";
import {
  CalendarDays,
  Home,
  Search,
  ArrowRight,
} from "lucide-react";

// =====================================
// FALLBACK IMAGES
// =====================================

const fallbackImages = [
  "/property/property1.jpg",
  "/property/property2.jpg",
  "/property/property3.jpg",
  "/property/property4.jpg",
  "/property/property5.jpg",
];

// =====================================
// COMPONENT
// =====================================

const PropertyGallery = ({ images = [] }) => {
  const [open, setOpen] = useState(false);

  // =====================================
  // IMAGE URL
  // =====================================

  const getImageUrl = (photo) => {
    const base = import.meta.env.VITE_API_URL || "";

    // New Object Format
    if (photo?.url) {
      if (photo.url.startsWith("http")) {
        return photo.url;
      }

      return base.replace(/\/$/, "") + "/" + photo.url.replace(/^\//, "");
    }

    // Old String Format
    if (typeof photo === "string") {
      if (photo.startsWith("http")) {
        return photo;
      }

      // Manual Images (/property/...)
      if (photo.startsWith("/")) {
        return photo;
      }

      return base.replace(/\/$/, "") + "/" + photo.replace(/^\//, "");
    }

    return fallbackImages[0];
  };

  // =====================================
  // GALLERY IMAGES
  // =====================================

  const galleryImages = useMemo(() => {
    if (images?.length > 0) {
      return images;
    }

    return fallbackImages;
  }, [images]);

  // =====================================
  // MAIN IMAGE
  // =====================================

  const mainImage = getImageUrl(galleryImages[0]);

  // =====================================
  // LIGHTBOX IMAGES
  // =====================================

  const slides = galleryImages.map((img) => ({
    src: getImageUrl(img),
  }));

  // =====================================
  // NAVIGATION
  // =====================================

  const navigationItems = [
    {
      title: "Description",
      id: "description",
    },
    {
      title: "Pictures",
      id: "pictures",
    },
    {
      title: "Amenities",
      id: "amenities",
    },
    {
      title: "Location",
      id: "location",
    },
    {
      title: "Video",
      id: "videos",
    },
    {
      title: "Availability",
      id: "availability",
    },
    {
      title: "Reviews",
      id: "reviews",
    },
  ];

  return (
    <>
      {/* =====================================
          HERO IMAGE
      ===================================== */}

      <section className="w-full max-w-9xl   mx-auto px-3 sm:px-4 lg:px-6 pt-4 sm:pt-20">
       <div
  className="
    group relative isolate
    w-full overflow-hidden
    rounded-2xl shadow-2xl
    sm:rounded-[22px]
  "
>
  {/* Main Image */}
  <img
    src={mainImage}
    alt=" "
    className="
      block h-[240px] w-full object-cover object-center
      transition-transform duration-700 ease-out
      xs:h-[280px]
      sm:h-[360px]
      md:h-[450px]
      lg:h-[560px]
      xl:h-[650px]
      2xl:h-[700px]
       
    "
  />

  {/* Gradient Overlay */}
  <div
    className="
      pointer-events-none absolute inset-0
      bg-gradient-to-t
      from-black/40 via-black/5 to-transparent
    "
  />

  {/* View Pictures Button */}
  <button
    type="button"
    onClick={() => setOpen(true)}
    aria-label="View more property pictures"
    className="
      absolute bottom-6 left-1/8 z-10
      inline-flex min-h-[52px]
      -translate-x-1/2 items-center
      justify-center gap-3
      whitespace-nowrap
      bg-[#171717] px-5 py-3
      text-[11px] font-semibold
      tracking-[0.12em] text-white
      shadow-[6px_6px_0px_#252525]
      transition-all duration-300
      hover:bg-[#315F60]
      hover:shadow-[8px_8px_0px_#252525]
      active:translate-y-1
      active:shadow-none
      sm:bottom-8 sm:min-h-[58px]
      sm:px-7 sm:text-[13px]
      sm:tracking-[0.16em]
    "
    style={{ fontFamily: '"Montserrat", sans-serif' }}
  >
    <IoSearch size={18} className="shrink-0" />

    <span>VIEW MORE PICTURES</span>

    <ArrowRight
      size={16}
      className="transition-transform duration-300 group-hover:translate-x-1"
    />
  </button>
</div>
      </section>

      {/* =====================================
          PROPERTY NAVIGATION
      ===================================== */}

     <nav
  className="
    sticky top-[76px] lg:top-[80px]
    z-40 mt-5 sm:mt-6
    w-full border-y border-gray-200
    bg-white/95 shadow-sm backdrop-blur-md
  "
>
        <div className="w-full max-w-7xl mx-auto">
          <div
            className="
              flex
              items-center

              overflow-x-auto
              overscroll-x-contain

              scrollbar-hide

              px-2
              sm:px-4
              lg:px-6
            "
          >
            {navigationItems.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`
                  shrink-0

                  px-3
                  sm:px-4
                  md:px-5
                  lg:px-7
font-light
                  py-3
                  sm:py-4

                  text-xs
                  sm:text-sm
                  md:text-base
                  lg:text-lg

                  transition-all
                  duration-300

                  ${
                    index === 0
                      ? "text-black font-light  "
                      : "text-gray-500 hover:text-black"
                  }
                `}
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                }}
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* =====================================
          LIGHTBOX
      ===================================== */}

      <Lightbox open={open} close={() => setOpen(false)} slides={slides} />
    </>
  );
};

export default PropertyGallery;
