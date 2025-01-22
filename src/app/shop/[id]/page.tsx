'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { sanityFetch } from "../../../sanity/lib/fetch";

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  discountPercentage?: number;
  tags?: string[];
  quantity?: number; // Added optional quantity property for cart
};

const placeholderImage = "https://via.placeholder.com/300";

const ProductDetail: React.FC = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // Fetch product details
        const productQuery = `
          *[_type == "product" && _id == $id][0] {
            _id,
            title,
            description,
            price,
            discountPercentage,
            tags,
            "imageUrl": productImage.asset->url
          }
        `;
        const productResult = await sanityFetch({ query: productQuery, params: { id } });
        setProduct(productResult);

        // Fetch related products if tags are available
        if (productResult?.tags?.length) {
          const relatedQuery = `
            *[_type == "product" && _id != $id && count(tags[@ in $tags]) > 0] {
              _id,
              title,
              price,
              "imageUrl": productImage.asset->url
            }
          `;
          const relatedResult = await sanityFetch({
            query: relatedQuery,
            params: { id, tags: productResult.tags },
          });
          setRelatedProducts(relatedResult);
        }

        // Load cart from localStorage
        const storedCart = localStorage.getItem("cart");
        if (storedCart) setCart(JSON.parse(storedCart));

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch product or related products:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const existingProductIndex = cart.findIndex((item) => item._id === product._id);
    let updatedCart;

    if (existingProductIndex !== -1) {
      updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity =
        (updatedCart[existingProductIndex].quantity || 1) + quantity;
    } else {
      updatedCart = [...cart, { ...product, quantity }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${product.title} x${quantity} added to cart!`);
  };

  if (loading) {
    return <p className="text-center text-yellow-500">Loading...</p>;
  }

  if (!product) {
    return <p className="text-center text-red-500">Product not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-100 to-gray-100 p-6">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src={product.imageUrl || placeholderImage}
              alt={product.title}
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Product Info */}
          <div className="col-span-2 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
              <p className="mt-4 text-sm text-gray-600">
                {product.description.length > 100
                  ? `${product.description.slice(0, 100)}...`
                  : product.description}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-xl font-bold text-gray-800">
                ${product.price.toFixed(2)}
              </p>
              {product.discountPercentage && (
                <p className="text-green-500 text-sm mt-2">
                  {product.discountPercentage}% Off!
                </p>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mt-8 flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <button
                  className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="text-xl font-semibold text-gray-800">{quantity}</span>
                <button
                  className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
              <button
                className="bg-blue-600 text-white py-3 px-8 rounded-md font-medium text-lg shadow-lg transition hover:bg-blue-700 hover:shadow-xl focus:ring focus:ring-blue-300"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedProducts.map((related) => (
              <div
                key={related._id}
                className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-transform hover:scale-105 cursor-pointer"
                onClick={() => router.push(`/shop/${related._id}`)}
              >
                <img
                  src={related.imageUrl || placeholderImage}
                  alt={related.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{related.title}</h3>
                  <p className="text-gray-600 mt-2">${related.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
