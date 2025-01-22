'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { sanityFetch } from "../../sanity/lib/fetch";
import { allProductsQuery } from "../../sanity/lib/queries";
import Header from "../components/header";
import Footer from "../components/footer";

type Product = {
  _id: string;
  title: string;
  price: number;
  imageUrl?: string;
  quantity?: number;
};

const placeholderImage = "https://via.placeholder.com/300";

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination and Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16); // Default: 16 items per page
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    // Fetch products
    const fetchData = async () => {
      try {
        const data = await sanityFetch({ query: allProductsQuery });
        setProducts(data);
        setFilteredProducts(data); // Initialize filtered products
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply sorting logic
  const handleSort = (sortBy: string) => {
    setSortBy(sortBy);
    let sortedProducts = [...filteredProducts];

    if (sortBy === "priceLowHigh") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHighLow") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(sortedProducts);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (product: Product) => {
    const existingProductIndex = cart.findIndex((item) => item._id === product._id);
    let updatedCart;

    if (existingProductIndex !== -1) {
      updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity = (updatedCart[existingProductIndex].quantity || 1) + 1;
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${product.title} has been added to your cart!`);
  };

  if (loading) return <p className="text-center text-yellow-500">Loading products...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="h-[313px] w-full relative bg-gradient-to-r from-blue-500 to-purple-500">
        <img
          src="/shopbanner.png"
          alt="Shop Banner"
          className="absolute w-full h-full object-cover opacity-80"
        />
        <div className="flex justify-center items-center flex-col h-full z-10 relative text-white">
          <h2 className="text-4xl font-bold text-center">Shop Our Products</h2>
          <p className="mt-4 text-lg font-medium text-center">
            Discover our premium products and shop the best deals today!
          </p>
        </div>
      </div>

      {/* Filter and Sort UI */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center bg-white shadow-md rounded-md">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-gray-800 font-medium">
            <span className="material-icons">tune</span>
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-800 font-medium">
            <span className="material-icons">grid_view</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-800 font-medium">
            <span className="material-icons">view_list</span>
          </button>
          <span className="text-gray-500">|</span>
          <p className="text-gray-800">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="itemsPerPage" className="text-gray-800 font-medium">
            Show
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
          >
            <option value={8}>8</option>
            <option value={16}>16</option>
            <option value={32}>32</option>
          </select>
          <label htmlFor="sortBy" className="text-gray-800 font-medium">
            Sort by
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
          >
            <option value="default">Default</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Section */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
          {paginatedProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-transform hover:scale-105"
            >
              <Link href={`/shop/${product._id}`}>
                <div className="cursor-pointer">
                  <img
                    src={product.imageUrl || placeholderImage}
                    alt={product.title}
                    className="w-full h-56 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800">{product.title}</h2>
                    <p className="text-gray-600 mt-2">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(product.price)}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition-colors hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-md font-medium ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-blue-500 hover:text-white transition`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ShopPage;
