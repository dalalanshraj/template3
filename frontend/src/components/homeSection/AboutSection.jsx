import { useEffect, useState } from "react";
import api from "../../api/axios";
// import condoImg from "../assets/about-Img11.png";

export default function AboutSection() {
  const [images, setImages] = useState([]);
  const [owner, setOwner] = useState(null);

  const OWNER_ID = "6ab6aac6a7e7e82d7d700839";

  // =====================================
  // IMAGE URL
  // =====================================

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return "";

    const base = import.meta.env.VITE_API_URL || "";

    if (path.startsWith("http")) return path;

    return (
      base.replace(/\/$/, "") +
      "/" +
      path.replace(/^\//, "")
    );
  };

  // =====================================
  // FETCH GALLERY IMAGES
  // =====================================

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await api.get("/gallery/published");

        const savedSections =
          JSON.parse(
            localStorage.getItem("gallerySections") || "{}"
          );

        const galleryImages = Array.isArray(data)
          ? data.map((img) => ({
            ...img,

            sectionType:
              savedSections[img._id] ||
              img.sectionType ||
              "",
          }))
          : [];

        setImages(galleryImages);
      } catch (err) {
        console.log("Gallery fetch error:", err);
      }
    };

    fetchImages();
  }, []);

  // =====================================
  // FETCH OWNER
  // =====================================

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const { data } = await api.get(
          `/profile/public/${OWNER_ID}`
        );

        setOwner(data);
      } catch (err) {
        console.log("Owner fetch error:", err);
      }
    };

    fetchOwner();
  }, []);

  // =====================================
  // FALLBACK IMAGE
  // =====================================

  const fallbackImage =
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511";

  // =====================================
  // GET ALL IMAGES OF ONE SECTION
  // =====================================

  const getSectionImages = (type) => {
    return images
      .filter(
        (img) =>
          img.sectionType === type &&
          img.status === "published"
      )
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((img) => getImageUrl(img.image));
  };

  // =====================================
  // SECTIONS DATA
  // =====================================

  const sections = [
    {
      title: "SEYCHELLES BEACH RESORT",
      subtitle: "Blue mountain beach condo",
      description:
        "property is a gulf front condo located in Blue Mountain Beach off the famous Hwy 30a. Our recently updated condo boasts 3 bedrooms and 3 full bathrooms and can comfortably sleep up to 9 guests.",
      image: "/heroImg1.webp",
      sectionType: "gulf-views",
    },

    {
      title: "PRIME BEACHFRONT LOCATION",
      subtitle: "GULF-FRONT PRIMARY BEDROOM",
      description:
        "The gulf front condo master bedroom features a King bed with a new mattress and a 50 television. For families with infants, the master closet  accommodates a pack n play with the closet door left open. Step into the recently renovated bathroom, adorned with two stylish vanities, a luxurious marble walk-in shower, and a new soaking tub. ",
      sectionType: "gulf-views",
    },

    {
      title: "COMFORTABLE BEACHFRONT LIVING",
      subtitle: "GUEST BEDROOM WITH EN-SUITE BATHROOM",
      description:
        "This bedroom offers a King bed with a new mattress, an en-suite bathroom complete with a shower, and a 43 television.",
      sectionType: "living-room",
    },

    {
      title: "EVERYTHING FOR A HOME-COOKED MEAL",
      subtitle: "bunk ROOM With a hallway BATHROOM",
      description:
        "Prepare your favorite meals with a full-size refrigerator, stove, sink, microwave, coffee maker, and blender. The kitchen opens directly to the living area, making it easy to cook, dine, and spend time together during your stay.",
      sectionType: "kitchen",
    },

    {
      title: "YOUR PRIVATE GULF VIEW",
      subtitle: "KITCHEN",
      description:
        " The stocked kitchen includes a Keurig for single serve or a Ninja 12-cup coffee maker, double ice maker in refrigerator, new oven with built in air fryer, pots & pans, plenty of dishware, and built-in fridge filtered water.  Within a kitchen cabinet, you'll also find a stackable washer/ dryer for your laundry needs.",
      sectionType: "balcony",
    },

    {
      title: "POOL, FITNESS & RELAXATION",
      subtitle: "Amenities",
      description:
        "property 30a offers a range of amenities including covered parking, a fitness center, outdoor grilling area with Weber grills, basketball court, high-speed internet, and a newly renovated spacious atrium.Our property also includes one professional chair setup (March - October) that includes two chairs, one table and one umbrella. On the patio, you'll find extra backpack chairs, umbrellas and sand toys. We also provide beach towels for up to 8 guests.",
      sectionType: "pool-hot-tub",
    },



    {
      title: "PERFECT FOR A GETAWAY",
      subtitle: "FOR THE KIDS",
      description:
        "Our blue mountain beach vacation rental is designed with families in mind, providing a range of amenities to ensure a memorable and enjoyable stay for children of all ages.  For the littlest ones, we provide a high chair, booster seat and pack n play. In the hallway bathroom, a  we provide a fold-down potty seat and step stool. Outside on the patio, you'll find sandtoys for the kids to take to the beach!",
      sectionType: "family-friendly",
    },


  ];

  // =====================================
  // CONTENT COMPONENT
  // =====================================

  const SectionContent = ({ item }) => {
    return (
      <div className="flex flex-col justify-center text-center px-2 md:px-6">
        {/* <h3
          className="
            uppercase
            tracking-[4px]
            md:tracking-[6px]
            text-black
            text-lg
            md:text-xl
            xl:text-2xl
            mb-6
            font-light
          "
        >
          {item.title}
        </h3> */}

        <h4
          className="
            uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[19px]
            mb-6
          "
        >
          {item.subtitle}
        </h4>

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
          {item.description}
        </p>
      </div>
    );
  };

  return (
    <section className="bg-[#fff] py-0 overflow-hidden">
      <div className="max-w-[1450px] mx-auto px-5 md:px-10 mt-16 md:mt-0">

        <div
          className="
    mx-auto mb-20 mt-16
    flex w-full max-w-[1460px]
    flex-col items-center
    gap-8 px-5
    sm:px-8
    md:mb-28 md:mt-16
    md:flex-row md:items-center
    md:gap-10 md:px-10
    lg:gap-16 lg:px-12
  "
        >
          {/* Left Image */}
          <div className="w-full shrink-0 md:w-[48%]">
            <img
              src="https://img1.wsimg.com/isteam/ip/2e56267e-2454-402a-b8aa-7978b25f726c/Unit%20patio%20(1).png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1160,h:651"
              alt="property beachfront property"
              loading="lazy"
              className="
        block aspect-[1.5/1]
        h-auto w-full
        object-cover object-center
      "
            />
          </div>

          {/* Right Heading */}
          <div
            className="
      flex min-w-0 flex-1
      items-center justify-center
      text-center
      md:justify-start md:text-left
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
        xl:text-[54px]
      "
              style={{
                fontFamily: '"Oswald", sans-serif',
              }}
            >
              Welcome  to property
            </h2>
          </div>
        </div>
        <div className="text-center mb-10">
          <h1
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

            the condo

          </h1>
        </div>


        {/* PROPERTY SECTIONS */}

        <div className="space-y-24 md:space-y-32">
          {sections.map((item, index) => {
            /*
              COLLAGE SECTION
            */

            if (item.isCollage) {
              return (
                <div
                  key={item.title}
                  className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-12
                    lg:gap-20
                    items-center
                  "
                >
                  <div className="w-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="block w-full h-auto object-contain"
                    />
                  </div>

                  <SectionContent item={item} />
                </div>
              );
            }

            /*
              GET SECTION IMAGES
            */

            const sectionImages = getSectionImages(
              item.sectionType
            );

            const firstImage =
              sectionImages[0] || fallbackImage;

            const secondImage = sectionImages[1];

            const hasTwoImages =
              sectionImages.length >= 2;

            /*
              TWO IMAGE LAYOUT

              LEFT IMAGE | CONTENT | RIGHT IMAGE
            */

            if (hasTwoImages) {
              return (
                <div
                  key={item.title}
                  className="
                    grid
                    grid-cols-1
                    lg:grid-cols-[1fr_0.9fr_1fr]
                    gap-8
                    lg:gap-10
                    xl:gap-14
                    items-center
                  "
                >
                  {/* LEFT IMAGE */}

                  <div className="w-full">
                    <img
                      src={firstImage}
                      alt={`${item.title} 1`}
                      className="
                        block
                        w-full
                        h-[300px]
                        sm:h-[420px]
                        lg:h-[520px]
                        object-cover
                      "
                    />
                  </div>

                  {/* CENTER CONTENT */}

                  <SectionContent item={item} />

                  {/* RIGHT IMAGE */}

                  <div className="w-full">
                    <img
                      src={secondImage}
                      alt={`${item.title} 2`}
                      className="
                        block
                        w-full
                        h-[300px]
                        sm:h-[420px]
                        lg:h-[520px]
                        object-cover
                      "
                    />
                  </div>
                </div>
              );
            }

            /*
              ONE IMAGE NORMAL ALTERNATING LAYOUT
            */

            return (
              <div
                key={item.title}
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                  gap-12
                  lg:gap-20
                  items-center
                "
              >
                {/* IMAGE */}

                <div
                  className={
                    index % 2 !== 0
                      ? "lg:order-2"
                      : "lg:order-1"
                  }
                >
                  <img
                    src={firstImage}
                    alt={item.title}
                    className="
                      block
                      w-full
                      h-[300px]
                      sm:h-[420px]
                      lg:h-[500px]
                      object-cover
                    "
                  />
                </div>

                {/* CONTENT */}

                <div
                  className={
                    index % 2 !== 0
                      ? "lg:order-1"
                      : "lg:order-2"
                  }
                >
                  <SectionContent item={item} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
