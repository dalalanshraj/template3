
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { title: "ALL RENTALS", to: "/properties/6adb7a6a6101b6fb9bebdd9b" },
    { title: "ABOUT US", to: "/about-us" },
    { title: "CONTACT US", to: "/contect-us" },
  ];

  return (
    <>
      <header
        className={`
          fixed inset-x-0 top-0 z-50
          transition-all duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isScrolled
            ? "bg-white/95 shadow-lg backdrop-blur-xl"
            : "bg-white/10 shadow-none backdrop-blur-[2px]"
          }
        `}
      >
        <div
          className={`
    relative mx-auto flex max-w-[1600px]
    items-center justify-between
    px-5 sm:px-8 lg:px-12
    transition-all duration-700
    ease-in-out
    ${isScrolled
              ? "min-h-[76px] py-2"
              : "min-h-[80px] py-3 bg-white"
            }
  `}
        >
          {/* Logo */}
          {/* <Link
            to="/"
            aria-label="property Home"
            className="
    absolute   top-1/2 z-10
flex shrink-0 items-center justify-center
  "
          >
            <img
              src="https://img1.wsimg.com/isteam/ip/2e56267e-2454-402a-b8aa-7978b25f726c/Mainlogo_REELPARADISE_Webpreview_Transparent.png/:/rs=h:386,cg:true,m/qt=q:95"
              alt="property Santa Rosa Beach"
              className={`
       block w-auto object-contain
      transition-all duration-700
      ease-in-out
      ${isScrolled
                  ? "h-[58px] mt-[-30px] sm:h-[64px]"
                  : "h-[100px] sm:h-[120px] lg:h-[150px]"
                }
    `}
            />
          </Link> */}
           <Link
              to="/"
              aria-label="Go to homepage"
              className="inline-block"
            >
              <span
                className="text-3xl font-semibold uppercase tracking-tight text-[#171717] sm:text-4xl"
                style={{ fontFamily: '"Oswald", sans-serif' }}
              >
                LOGO
              </span>
            </Link>

          {/* Desktop Navigation */}
          <nav className="ml-auto hidden items-center gap-7 lg:flex xl:gap-10">
            {navLinks.map((item) => (
              <Link key={item.to} to={item.to}
                
                className={`
        relative py-2 text-[13px] font-medium
        tracking-[0.16em] xl:text-[14px]
        transition-colors duration-300
        hover:text-teal-600
        after:absolute after:bottom-0 after:left-0
        after:h-[1px] after:w-0 after:bg-teal-600
        after:transition-all after:duration-300
        hover:after:w-full
        ${location.pathname === item.to
                    ? "text-teal-700"
                    : "text-[#252525]"
                  }
      `}
                style={{ fontFamily: "Quicksand, sans-serif" }}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            className="
              relative z-50 flex h-11 w-11 shrink-0
              items-center justify-center rounded-full
              border border-gray-200/80 bg-white/80
              text-gray-900 shadow-sm
              transition-all duration-300
              hover:bg-teal-50 hover:text-teal-700
              lg:hidden
            "
          >
            <span
              className={`
                absolute transition-all duration-300
                ${mobileOpen
                  ? "rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
                }
              `}
            >
              <Menu size={25} />
            </span>

            <span
              className={`
                absolute transition-all duration-300
                ${mobileOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0"
                }
              `}
            >
              <X size={25} />
            </span>
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        <div
          className={`
            absolute inset-x-0 top-full
            overflow-hidden bg-white/98 shadow-xl
            transition-all duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            lg:hidden
            ${mobileOpen
              ? "visible max-h-[80vh] translate-y-0 opacity-100"
              : "invisible max-h-0 -translate-y-2 opacity-0"
            }
          `}
        >
          <nav className="max-h-[80vh] overflow-y-auto px-6 pb-6 pt-3">
            {navLinks.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center justify-between
                  border-b border-gray-100 py-5
                  text-sm font-medium tracking-[0.12em]
                  transition-all duration-300
                  hover:pl-2 hover:text-teal-600
                  ${location.pathname === item.path
                    ? "text-teal-700"
                    : "text-gray-800"
                  }
                `}
                style={{
                  fontFamily: "Quicksand, sans-serif",
                  transitionDelay: mobileOpen
                    ? `${index * 60}ms`
                    : "0ms",
                }}
              >
                {item.title}
                <ChevronDown
                  size={16}
                  className="-rotate-90 text-gray-400"
                />
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
