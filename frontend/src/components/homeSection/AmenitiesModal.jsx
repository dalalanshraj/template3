export default function AmenitiesModal({
  amenities,
  onClose,
}) {
  return (
    <div
      className="
      fixed 
      inset-0 
      bg-black/50 
      flex 
      items-center 
      justify-center 
      z-50
      p-4
    "
    >
      <div
        className="
        bg-white 
        w-full 
        max-w-5xl 
        rounded-3xl 
        p-8 
        relative 
        max-h-[90vh] 
        overflow-y-auto
      "
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="
          absolute 
          top-5 
          right-5 
          text-2xl
          hover:rotate-90
          transition-all
          duration-300
        "
        >
          ✕
        </button>

        {/* TITLE */}
        <h2
            className="
        text-[30px] font-semibold
        uppercase leading-tight
        tracking-[-0.035em]
        text-[#171717]
        drop-shadow-[2px_3px_1px_rgba(0,0,0,0.25)]
        sm:text-4xl
        lg:text-[48px]
        xl:text-[30px]
      "
            style={{
              fontFamily: '"Oswald", sans-serif',
            }}
          >
          Amenities ({amenities.length})
        </h2>

        {/* GRID */}
        <div
          className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          gap-5
        "
        >
          {amenities.map((name, i) => (
            <div
              key={i}
              className=" text-gray-600
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
            font-light"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}