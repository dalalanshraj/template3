import { useEffect, useState } from "react";
import api from "../api/axios";

import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";

// ========================================
// FALLBACK IMAGES
// ========================================

// Recommended:
// Put these images inside:
//
// public/gallery/
//
// Example:
// public/gallery/1.jpg
// public/gallery/2.jpg
// ...
// public/gallery/9.jpg

const fallbackImages = [
 "https://anchorsaway30a.com/wp-content/uploads/2024/08/Gilbert_House7_websize.jpg",
  "https://anchorsaway30a.com/wp-content/uploads/2024/08/Gilbert_House7_websize.jpg",
  "https://anchorsaway30a.com/wp-content/uploads/2024/08/Gilbert_House12_websize.jpg",
  "https://anchorsaway30a.com/wp-content/uploads/2024/08/Gilbert_House17_websize.jpg",
  "https://anchorsaway30a.com/wp-content/uploads/2024/08/Gilbert_House53_websize.jpg",
  "https://anchorsaway30a.com/wp-content/uploads/2024/08/Gilbert_House4_websize.jpg",
  "https://anchorsaway30a.com/wp-content/uploads/2024/08/Gilbert_House38_websize.jpg",
  "https://anchorsaway30a.com/wp-content/uploads/2024/08/Gilbert_House56_websize.jpg",
  "https://anchorsaway30a.com/wp-content/uploads/2024/08/Gilbert_House24_websize.jpg",
 
 
];

export default function GallerySection() {
  // ========================================
  // STATES
  // ========================================

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);

  // ========================================
  // IMAGE URL
  // ========================================

  const getImageUrl = (path) => {
    if (!path) return "";

    const base = import.meta.env.VITE_API_URL || "";

    // Already full URL
    if (path.startsWith("http")) {
      return path;
    }

    return (
      base.replace(/\/$/, "") +
      "/" +
      path.replace(/^\//, "")
    );
  };

  // ========================================
  // FETCH GALLERY
  // ========================================

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get(
          "/gallery/published"
        );

        const backendImages = (data || [])
          .map((item) => getImageUrl(item.image))
          .filter(Boolean);

        // Backend images available
        if (backendImages.length > 0) {
          setImages(backendImages);
        }

        // No backend images
        else {
          setImages(fallbackImages);
        }
      } catch (error) {
        console.log(error);

        // API failed
        setImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <section className="py-24 flex justify-center items-center">
        <div className="text-lg font-medium text-gray-500">
          Loading Gallery...
        </div>
      </section>
    );
  }

  // ========================================
  // RETURN
  // ========================================

  return (
    <section className="bg-white py-16 lg:py-24">

      <div className="max-w-7xl mx-auto px-5">

        {/* Heading */}

        <div className="text-center mb-14">

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
            Photo Gallery
          </h2>
        </div>

        {/* Gallery starts here... */}
                <Gallery
          options={{
            loop: true,
            bgOpacity: 0.95,
            wheelToZoom: true,
            arrowKeys: true,
            escKey: true,
            pinchToClose: true,
            showHideAnimationType: "zoom",
          }}
        >
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-5
            "
          >
            {images.slice(0, visibleCount).map((img, index) => (
              <Item
                key={index}
                original={img}
                thumbnail={img}
                width={1600}
                height={1000}
              >
                {({ ref, open }) => (
                  <div
                    ref={ref}
                    onClick={open}
                    className="
                      relative
                      overflow-hidden
                      rounded-lg
                      cursor-pointer
                      group
                      bg-gray-100
                      shadow-md
                      hover:shadow-2xl
                      transition-all
                      duration-500
                    "
                  >
                    {/* Image */}

                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImages[0];
                      }}
                      className="
                        w-full

                        h-[260px]
                        sm:h-[280px]
                        lg:h-[320px]
                        xl:h-[340px]

                        object-cover

                        transition-all
                        duration-700

                        group-hover:scale-110
                      "
                    />

                    {/* Overlay */}

                    <div
                      className="
                        absolute
                        inset-0

                        bg-black/0

                        group-hover:bg-black/20

                        transition-all
                        duration-500
                      "
                    />

                    {/* Zoom Icon */}

                    <div
                      className="
                        absolute
                        inset-0

                        flex
                        items-center
                        justify-center

                        opacity-0
                        group-hover:opacity-100

                        transition-all
                        duration-500
                      "
                    >
                      <div
                        className="
                          w-14
                          h-14

                          rounded-full

                          bg-white/90

                          flex
                          items-center
                          justify-center

                          text-2xl
                          text-gray-800

                          shadow-xl
                        "
                      >
                        +
                      </div>
                    </div>
                  </div>
                )}
              </Item>
            ))}
          </div>
        </Gallery>
{/* ===========================
      SEE MORE / SEE LESS
=========================== */}

{images.length > 9 && (
  <div className="flex justify-center mt-14">
    <button
      onClick={() => {
        if (visibleCount >= images.length) {
          setVisibleCount(9);

          // Smooth scroll back to gallery
          window.scrollTo({
            top: document.getElementById("gallery-section").offsetTop - 100,
            behavior: "smooth",
          });
        } else {
          setVisibleCount((prev) =>
            Math.min(prev + 9, images.length)
          );
        }
      }}
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
      {visibleCount >= images.length ? (
        <>
          ↑ See Less
        </>
      ) : (
        <>
          ↓ See More
        </>
      )}
    </button>
  </div>
)}
      </div>
    </section>
  );
}