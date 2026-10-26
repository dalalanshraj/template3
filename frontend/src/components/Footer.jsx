import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiMail, FiPhone, FiArrowUpRight } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

export default function Footer({ listingId }) {
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
  if (!listingId) return;

  const fetchContact = async () => {
    try {
      const res = await api.get(`/listings/${listingId}`);

      const phone = res.data?.property?.phone || "";
      const emailAddress = res.data?.property?.email || "";

      setContactNumber(phone);
      setEmail(emailAddress);

      console.log("Phone:", phone);
      console.log("Email:", emailAddress);
    } catch (error) {
      console.error("Error fetching contact:", error);
    }
  };

  fetchContact();
}, [listingId]);


  const quickLinks = [
    { name: "Home", to: "/" },
    { name: " All Rentals", to: "/properties/6adb7a6a6101b6fb9bebdd9b" },
    { name: "About Us", to: "/about" },
    { name: "Contact Us", to: "/contect-us" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: " ",
      icon: FaFacebookF,
    },
    {
      name: "Instagram",
      href: " ",
      icon: FaInstagram,
    },
    {
      name: "LinkedIn",
      href: " ",
      icon: FaLinkedinIn,
    },
  ];

  return (
    <footer className="relative mt-16 overflow-hidden bg-[#f7f8f7] text-[#171717] sm:mt-20">
      {/* Decorative top line */}
      <div className="h-1 w-full bg-[#315F60]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* MAIN FOOTER */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:grid-cols-3 lg:gap-16 lg:py-16">
          {/* BRAND & ADDRESS */}
          <div>
            <Link to="/" aria-label="Go to homepage" className="inline-block">
              <span
                className="text-3xl font-semibold uppercase tracking-tight text-[#171717] sm:text-4xl"
                style={{ fontFamily: '"Oswald", sans-serif' }}
              >
                LOGO
              </span>
            </Link>

            <p className="text-gray-600 text-base md:text-xl lg:text-[15px] leading-relaxed font-light">
              Your next coastal escape starts here. Discover a comfortable stay
              and make your vacation memorable.
            </p>

            <div className="mt-6 flex items-start gap-3">
              <HiOutlineLocationMarker
                size={22}
                className="mt-1 shrink-0 text-[#315F60]"
              />

              <a
                href="https://www.google.com/maps/search/?api=1&query=34990+Emerald+Coast+Pkwy+Suite+300+Destin+FL+32541"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 text-base md:text-xl lg:text-[15px] leading-relaxed font-light"
              >
               Panama City Beach, Florida
              </a>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3
              className="mb-5 text-xl font-semibold uppercase tracking-wide"
              style={{ fontFamily: '"Oswald", sans-serif' }}
            >
              Get In Touch
            </h3>

            <div className="space-y-4">
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="group flex min-w-0 items-start gap-3 text-sm text-gray-600 transition hover:text-[#315F60]"
                >
                  <FiMail
                    size={19}
                    className="mt-0.5 shrink-0 text-[#315F60]"
                  />
                  <span className="break-all">{email}</span>
                </a>
              ) : (
                <p className="flex items-center gap-3 text-gray-600 text-base md:text-xl lg:text-[15px] leading-relaxed font-light">
                  <FiMail size={19} className="shrink-0 text-[#315F60]" />
                  Contact us by email
                </p>
              )}

              {contactNumber ? (
                <a
                  href={`tel:${contactNumber.replace(/[^\d+]/g, "")}`}
                  className="flex items-start gap-3 text-sm text-gray-600 transition hover:text-[#315F60]"
                >
                  <FiPhone
                    size={19}
                    className="mt-0.5 shrink-0 text-[#315F60]"
                  />
                  <span>{contactNumber}</span>
                </a>
              ) : (
                <p className="flex items-center gap-3 text-gray-600 text-base md:text-xl lg:text-[15px] leading-relaxed font-light">
                  <FiPhone size={19} className="shrink-0 text-[#315F60]" />
                  Contact number available upon request
                </p>
              )}
            </div>

            {/* SOCIAL LINKS */}
            <div className="mt-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Follow Us
              </p>

              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ name, href, icon: Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8a847] text-white transition duration-300 hover:-translate-y-1  "
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3
              className="mb-5 text-xl font-semibold uppercase tracking-wide"
              style={{ fontFamily: '"Oswald", sans-serif' }}
            >
              Quick Links
            </h3>

            <ul className="space-y-1">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="group flex items-center justify-between gap-3 border-b border-gray-200 py-3 text-sm text-gray-600 transition hover:border-[#315F60] hover:text-[#315F60]"
                  >
                    <span>{item.name}</span>
                    <FiArrowUpRight
                      size={16}
                      className="shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="flex flex-col gap-5 border-t border-gray-200 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="order-2 text-center text-xs  leading-relaxed font-light text-gray-500 sm:order-1 sm:text-left sm:text-sm">
            © {new Date().getFullYear()}{" "} &nbsp;
            <a className="uppercase text-[#315F60]
            tracking-[3px]
            md:tracking-[3px] hover:underline hover:text-black
           " href="https://digifyamerica.com/">Digify America</a> &nbsp;All
            Rights Reserved.
          </p>

          <Link
            to="/admin/login"
            className="order-1 inline-flex items-center justify-center gap-2 self-center   px-4 py-2.5 text-sm font-medium text-[#171717]  hover:underline sm:order-2 sm:self-auto"
          >
            <MdOutlineAdminPanelSettings size={18} />
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}