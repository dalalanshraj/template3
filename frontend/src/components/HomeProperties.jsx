
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { ArrowUpRight, BedDouble, Bath, Users } from "lucide-react";

const HomeProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProperties = async () => {
            try {
                const res = await api.get("/listings/published");
                const data = res.data.listings || res.data || [];

                // Home page par sirf 3 published properties
                setProperties(data.slice(0, 3));
            } catch (error) {
                console.error("Error loading home properties:", error);
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };

        loadProperties();
    }, []);

    const getImageUrl = (p) => {
        const photo = p.photos?.[0];
        const path =
            typeof photo === "string"
                ? photo
                : photo?.url || photo?.image || "";

        if (!path) return "/placeholder.jpg";
        if (path.startsWith("http")) return path;

        const cleanPath = path.replace(/^\/api/, "");
        const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

        return `${baseUrl}${cleanPath.startsWith("/") ? "" : "/"}${cleanPath}`;
    };

    // if (loading) {
    //     return (
    //         <p className="py-10 text-center text-gray-500">
    //             Loading properties...
    //         </p>
    //     );
    // }

    if (!properties.length) return null;

    return (
        <section className="py-16 px-5 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between gap-4 mb-8">
                    <div>
                        <span className="inline-block bg-[#00796B] text-white text-[9px] tracking-[2px] uppercase px-4 py-2 rounded">

                            Find Your Stay
                        </span>
                       <h2
                className="
          mt-6
          text-4xl
          md:text-5xl
          xl:text-6xl
          font-light
          leading-tight
          text-[#222]
        "
                style={{ fontFamily: '"Montserrat", "sans-serif"' }} >
                            Featured Properties
                        </h2>
                    </div>

                    <Link
                        to="/properties"
                        className="hidden sm:inline-flex items-center gap-2 text-[#80a3a6] font-semibold"
                    >
                        View All <ArrowUpRight size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((p) => (

                        <article
                            key={p._id}
                            className="group relative h-[430px] overflow-hidden rounded-2xl border border-white/30 shadow-lg"
                        >
                            {/* Background Image */}
                            <Link to={`/${p._id}`} className="absolute inset-0 block">
                                <img
                                    src={getImageUrl(p)}
                                    alt={p.property?.title || "Property"}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "/placeholder.jpg";
                                    }}
                                />
                            </Link>

                            {/* Glass Content Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 z-10 p-5 bg-white/10 backdrop-blur-sm border-t border-white/30">
                                <h3 className="text-xl font-bold text-black line-clamp-2">
                                    {p.property?.title || "Untitled Property"}
                                </h3>

                                <p className="text-sm text-gray-800 mt-2">
                                    {p.location?.address || "Florida"}
                                </p>

                                <div className="flex items-center justify-between gap-2 mt-5 text-sm text-gray-800">
                                    <span className="flex items-center gap-1">
                                        <BedDouble size={17} />
                                        {p.property?.bedrooms ?? 0} Beds
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <Bath size={17} />
                                        {p.property?.bathrooms ?? 0} Baths
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <Users size={17} />
                                        {p.property?.maxSleeps ?? 0} Sleeps
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-white/40">
                                    <div>
                                        <p className="text-xs text-gray-700 uppercase">
                                            Starting From
                                        </p>

                                        <p className="text-2xl font-bold text-[#80a3a6]">
                                            {p.deal?.discountedRate != null
                                                ? `$${p.deal.discountedRate}`
                                                : p.rates?.[0]?.nightly != null
                                                    ? `$${p.rates[0].nightly}`
                                                    : "Call"}

                                            <span className="text-sm font-normal text-gray-700">
                                                {" "}/ night
                                            </span>
                                        </p>
                                    </div>

                                    <Link
                                        to={`/${p._id}`}
                                        aria-label={`View ${p.property?.title || "property"}`}
                                        className="w-11 h-11 shrink-0 rounded-full bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-sky-600 transition-colors group/btn"
                                    >
                                        <ArrowUpRight
                                            size={20}
                                            className="text-sky-800 group-hover/btn:text-white"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </article>

                    ))}
                </div>

                <div className="text-center mt-8 sm:hidden">
                    <Link
                        to="/properties"
                        className="inline-flex items-center gap-2 text-[#80a3a6] font-semibold"
                    >
                        View All Properties <ArrowUpRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeProperties;
