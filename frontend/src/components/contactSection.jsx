import React from "react";
import { Link } from "react-router-dom";

export default function ContactSection() {
  return (
    <>
      <section className="relative overflow-hidden z-0">
        {/* Background Image */}
        <div
          className="relative h-[520px] md:h-[600px] lg:h-[680px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://le-de.cdn-website.com/c5f5db73735f44758e7635e0dd9aae8f/dms3rep/multi/opt/My-Florida-Real-Estate-and-Vacation-Rentals-feature25-1920w.jpg')",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/15"></div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto h-full px-5 sm:px-8 lg:px-1 flex items-center">
            {/* Glass Card */}

            <div
              className="
        w-full
        max-w-xl
        lg:max-w-2xl

        bg-white/72
        backdrop-blur-md

        rounded-[28px]

        border
        border-white/40

        shadow-[0_30px_70px_rgba(0,0,0,.18)]

        p-8
        sm:p-10
        lg:p-14
      "
            >
              {/* Badge */}

              <span
                className="
          inline-block

          bg-[#00796B]

          text-white

          uppercase

          tracking-[2px]

          text-[11px]

          font-semibold

          px-5

          py-2

          rounded
        "
              >
                Contact Us Today
              </span>

              {/* Heading */}

              <h2
                className="mt-6 text-5xl xl:text-5xl leading-tight font-light"
                style={{ fontFamily: '"Montserrat", "sans-serif"' }}
              >
               Start Your Southwest <br/>  Florida Journey Today!
              </h2>

              {/* Description */}

              <p
                className="
          mt-8

          text-gray-700

          text-base

          md:text-lg

          leading-8

          max-w-xl
        "
              >
                Whether you're looking to buy, sell, or rent, we're here to make
                the process effortless. Explore our listings or get in touch
                with our experienced team to find your perfect home or vacation
                rental.
              </p>

              {/* Button will come in Part 2 */}
              {/* CTA Button */}

              <div className="mt-10">
               <button className=" group/button bg-[#80a3a6] mt-6 text-white rounded-full px-6 py-3 font-semibold flex items-center gap-2 transition-all duration-300  hover:shadow-2xl 
            hover:scale-99 group">
              Book Now
              <span
                className=" transition-transform duration-300 group-hover/button:translate-x-1 "
              >
                →
              </span>
            </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
