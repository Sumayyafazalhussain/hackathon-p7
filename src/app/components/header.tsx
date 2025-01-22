import React from "react";
import { IoIosContact } from "react-icons/io";
import { FaSearch, FaHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-gray-300 bg-white">
      {/* Desktop and Tablet Header */}
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-16 py-4 max-w-[1270px] mx-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
          <h1 className="text-xl sm:text-2xl font-bold font-poppins text-black">
            Furniro
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 lg:space-x-12">
            {["Home", "Shop", "Blog", "Contact"].map((item, index) => (
              <li key={index}>
                <Link
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-black font-medium hover:text-gray-600"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Icons Section */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <FaSearch className="w-5 h-5 sm:w-6 sm:h-6 text-black cursor-pointer hover:text-gray-600" />
        
          <Link href="/cart">
            <MdOutlineShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-black cursor-pointer hover:text-gray-600" />
          </Link>
          <Link href="/account">
            <IoIosContact className="w-5 h-5 sm:w-6 sm:h-6 text-black cursor-pointer hover:text-gray-600" />
          </Link>
          <Link href="/wishlist">
            <FaHeart className="w-5 h-5 sm:w-6 sm:h-6 text-black cursor-pointer hover:text-gray-600" />
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="block md:hidden border-t border-gray-300 bg-white">
        <ul className="flex justify-around px-4 py-4 text-sm">
          {["Home", "Shop", "Blog", "Contact"].map((item, index) => (
            <li key={index}>
              <Link
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-black font-medium hover:text-gray-600"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
