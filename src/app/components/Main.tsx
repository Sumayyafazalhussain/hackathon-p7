'use client';

import React, { useState, useEffect } from "react";
import { sanityFetch } from "../../sanity/lib/fetch";
import { allProductsQuery } from "../../sanity/lib/queries";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Icons for wishlist

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  tags?: string[];
  dicountPercentage?: number;
  isNew?: boolean;
  quantity?: number;
};

const placeholderImage = "https://via.placeholder.com/300"; // Fallback image

const Main: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<Product[]>([]); // State for wishlist

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }

    const fetchData = async () => {
      try {
        const fetchedProducts = await sanityFetch({ query: allProductsQuery });
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setLoading(false);
        alert("There was an issue loading the products. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const toggleWishlist = (product: Product) => {
    const existingProductIndex = wishlist.findIndex((item) => item._id === product._id);
    let updatedWishlist;

    if (existingProductIndex !== -1) {
      // Remove from wishlist
      updatedWishlist = wishlist.filter((item) => item._id !== product._id);
    } else {
      // Add to wishlist
      updatedWishlist = [...wishlist, product];
    }

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <div className="min-h-screen bg-white px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Our Products</h1>
        <p className="text-xl text-gray-600 mt-2 mb-4">Our Best Products are Here</p>
      </div>

      {loading && <p className="text-center text-yellow-400">Loading...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-md rounded-lg overflow-hidden transition-transform hover:scale-105 duration-300 relative"
          >
            <div className="relative w-full h-64">
              <img
                src={product.imageUrl || placeholderImage}
                alt={product.title || "Product image"}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </div>

            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{product.description.slice(0, 100)}...</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-600">Price:</span>
                  <span className="text-xl font-bold text-gray-800">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(product.price)}
                  </span>
                </div>
                {product.dicountPercentage && (
                  <p className="text-green-500 text-sm">
                    {product.dicountPercentage}% Off
                  </p>
                )}
              </div>

              {/* Add to Cart Button and Wishlist Icon */}
              <div className="flex items-center justify-between mt-6">
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="text-2xl"
                >
                  {wishlist.find((item) => item._id === product._id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-400 hover:text-red-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
