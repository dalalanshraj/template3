
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import PropertyMap from "../components/PropertyMap";
import {
  ArrowUpRight,
  BedDouble,
  Bath,
  Users,
  MapPin,
  Map,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const res = await api.get("/listings/published");
        const data = res.data.listings || res.data || [];

        setProperties(data);
        if (data.length > 0) setSelectedProperty(data[0]);
      } catch (err) {
        console.error("Error loading properties:", err);
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

  const filteredProperties = properties
    .filter((p) => {
      const query = search.trim().toLowerCase();

      return (
        !query ||
        p.property?.title?.toLowerCase().includes(query) ||
        p.location?.address?.toLowerCase().includes(query) ||
        p.property?.community?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return (
          (a.deal?.discountedRate ?? a.rates?.[0]?.nightly ?? Infinity) -
          (b.deal?.discountedRate ?? b.rates?.[0]?.nightly ?? Infinity)
        );
      }

      if (sortBy === "price-high") {
        return (
          (b.deal?.discountedRate ?? b.rates?.[0]?.nightly ?? 0) -
          (a.deal?.discountedRate ?? a.rates?.[0]?.nightly ?? 0)
        );
      }

      return 0;
    });

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      {/* Page heading */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-9 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-[4px] text-[#80a3a6] font-semibold mb-3">
                Find your perfect stay
              </p>

              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#171b24]">
                Explore Our Properties
              </h1>

              <p className="text-gray-500 mt-3 max-w-xl leading-7">
                Discover beautiful places to stay and find the right property
                for your next getaway.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-2xl font-semibold text-[#80a3a6]">
                  {loading ? "—" : properties.length}
                </p>
                <p className="text-xs text-gray-500">Available properties</p>
              </div>

              <button
                type="button"
                onClick={() => setShowMap((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl bg-[#80a3a6] px-4 py-3 text-sm font-semibold text-white hover:bg-[#08396f] transition"
              >
                {showMap ? <X size={17} /> : <Map size={17} />}
                {showMap ? "Hide map" : "Show map"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and sorting */}
      <section className="max-w-[1600px] mx-auto px-5 md:px-8 pt-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by property, location or community..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#80a3a6] focus:ring-4 focus:ring-blue-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-gray-500" />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#80a3a6]"
            >
              <option value="default">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 mb-4">
          <p className="text-sm text-gray-600">
            {loading
              ? "Finding properties..."
              : `Showing ${filteredProperties.length} of ${properties.length} properties`}
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-sm font-medium text-[#80a3a6] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Main map and listings */}
      <section className="max-w-[1600px] mx-auto px-5 md:px-8 pb-10">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-pulse">
            <div className="h-[450px] rounded-2xl bg-gray-200" />
            <div className="h-[450px] rounded-2xl bg-gray-200" />
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
            <MapPin size={36} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">
              No properties available
            </h2>
            <p className="text-gray-500 mt-2">
              Published properties will appear here.
            </p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
            <Search size={30} className="mx-auto text-gray-400 mb-3" />
            <h2 className="text-lg font-semibold text-gray-800">
              No matching properties
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Try a different property name or location.
            </p>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-lg bg-[#80a3a6] px-5 py-2.5 text-white text-sm"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 gap-6 ${
              showMap ? "xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]" : ""
            }`}
          >
            {/* Map */}
            {showMap && (
              <div className="h-[420px] sm:h-[520px] xl:h-[calc(100vh-210px)] xl:min-h-[550px] xl:sticky xl:top-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <PropertyMap
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                />
              </div>
            )}

            {/* Property cards */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-5 content-start ${
                showMap ? "xl:grid-cols-1" : "lg:grid-cols-3"
              }`}
            >
              {filteredProperties.map((p) => {
                const isSelected = selectedProperty?._id === p._id;
                const nightlyRate =
                  p.deal?.discountedRate ??
                  p.rates?.[0]?.nightly ??
                  null;

                return (
                  <article
                    key={p._id}
                    onClick={() => setSelectedProperty(p)}
                    className={`group overflow-hidden rounded-2xl border bg-white/10 backdrop-blur-sm cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "border-[#80a3a6] ring-2 ring-blue-100 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
                    }`}
                  >
                    <div className="relative h-52 sm:h-48 overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(p)}
                        alt={p.property?.title || "Property"}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute top-3 left-3 rounded-full border border-white/40 bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-gray-800">
                        {p.property?.community || "Vacation Rental"}
                      </div>

                      <Link
                        to={`/${p._id}`}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`View ${p.property?.title || "property"}`}
                        className="absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#80a3a6] shadow-md transition hover:bg-[#80a3a6] hover:text-white"
                      >
                        <ArrowUpRight size={19} />
                      </Link>
                    </div>

                    <div className="p-5 bg-white/10 backdrop-blur-sm">
                      <h2 className="text-lg font-semibold leading-snug text-[#1b1b1b] transition-colors group-hover:text-[#80a3a6] line-clamp-2">
                        {p.property?.title || "Untitled Property"}
                      </h2>

                      <p className="mt-2 flex items-start gap-1.5 text-sm text-gray-500">
                        <MapPin size={16} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-2">
                          {p.location?.address || "Florida"}
                        </span>
                      </p>

                      <div className="mt-4 grid grid-cols-3 divide-x divide-gray-100 rounded-xl bg-gray-50 py-3">
                        <div className="flex flex-col items-center gap-1 text-gray-600">
                          <BedDouble size={18} className="text-[#80a3a6]" />
                          <span className="text-sm font-semibold text-gray-800">
                            {p.property?.bedrooms ?? 0}
                          </span>
                          <span className="text-xs">Beds</span>
                        </div>

                        <div className="flex flex-col items-center gap-1 text-gray-600">
                          <Bath size={18} className="text-[#80a3a6]" />
                          <span className="text-sm font-semibold text-gray-800">
                            {p.property?.bathrooms ?? 0}
                          </span>
                          <span className="text-xs">Baths</span>
                        </div>

                        <div className="flex flex-col items-center gap-1 text-gray-600">
                          <Users size={18} className="text-[#80a3a6]" />
                          <span className="text-sm font-semibold text-gray-800">
                            {p.property?.maxSleeps ?? 0}
                          </span>
                          <span className="text-xs">Guests</span>
                        </div>
                      </div>

                      <div className="mt-5 flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
                        <div>
                          <p className="text-xs text-gray-500">
                            Starting from
                          </p>
                          <p className="mt-1 text-xl font-bold text-[#80a3a6]">
                            {nightlyRate != null ? `$${nightlyRate}` : "Call"}
                            {nightlyRate != null && (
                              <span className="ml-1 text-xs font-normal text-gray-500">
                                / night
                              </span>
                            )}
                          </p>
                        </div>

                        <Link
                          to={`/${p._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#80a3a6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#08396f]"
                        >
                          View Details
                          <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Properties;
