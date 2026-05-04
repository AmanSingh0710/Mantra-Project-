"use client";

import { fetchFromAPI } from "@/utils/api";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shipping, setShipping] = useState({
    name: "", email: "", mobile: "", address: "", city: "", state: "", country: "", pin: "",
  });
  const [shippingErrors, setShippingErrors] = useState({});

  // ✅ 1. Discount Calculation Logic (Model compatible)
  const getDiscountedPrice = (price, discount, type) => {
    if (!discount || discount <= 0) return price;
    if (type === "Percent") return price - (price * discount) / 100;
    return price - discount;
  };

  const fetchCart = async () => {
    try {
      const data = await fetchFromAPI("/cart");
      setCart(data.items || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch cart");
    }
  };

  useEffect(() => { fetchCart(); }, []);

  //updateQty
  const updateQty = async (productId, delta) => {
    try {
      await fetchFromAPI("/cart/add", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: delta }),
      });

      fetchCart();
    } catch (err) {
      toast.error(err.message || "Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      await fetchFromAPI("/cart/remove", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });

      fetchCart();
    } catch (err) {
      toast.error(err.message || "Failed to remove item");
    }
  };

  const openShippingForm = (product) => { setSelectedProduct(product); setShowShippingForm(true); };
  const closeShippingForm = () => { setShowShippingForm(false); setShippingErrors({}); };

  const validateShipping = () => {
    const errors = {};
    if (!shipping.name.trim()) errors.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(shipping.email)) errors.email = "Invalid email";
    if (!/^[0-9]{10}$/.test(shipping.mobile)) errors.mobile = "10 digits required";
    if (!shipping.address.trim()) errors.address = "Address required";
    if (!/^[0-9]{6}$/.test(shipping.pin)) errors.pin = "6 digits required";
    return errors;
  };

  const handlePlaceOrder = async () => {
    const errors = validateShipping();
    setShippingErrors(errors);

    if (Object.keys(errors).length > 0) {
      return toast.error("Please fix errors");
    }

    try {
      const finalPrice = getDiscountedPrice(
        selectedProduct.price,
        selectedProduct.discountAmount,
        selectedProduct.discountType
      );

      await fetchFromAPI("/order", {
        method: "POST",
        body: JSON.stringify({
          shipping,
          products: [selectedProduct],
          totalAmount: finalPrice * (selectedProduct.quantity || 1),
          paymentMethod: "COD",
        }),
      });

      toast.success("Order successful!");
      closeShippingForm();
      fetchCart();

    } catch (err) {
      toast.error(err.message || "Order failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Toaster />
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Shopping Cart</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-xl shadow">Cart is empty</div>
          ) : (
            cart.map((item) => {
              // AdminProduct logic
              const priceAfterDiscount = getDiscountedPrice(item.price, item.discountAmount, item.discountType);

              return (
                <div key={item.productId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg border" />

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{item.category} | {item.brand}</p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xl font-bold text-green-600">₹{priceAfterDiscount}</span>
                      {item.discountAmount > 0 && (
                        <span className="text-sm line-through text-gray-400">₹{item.price}</span>
                      )}
                    </div>

                    {/* Stock Alert */}
                    {item.currentStock < 5 && item.currentStock > 0 && (
                      <p className="text-orange-500 text-xs mt-1">Only {item.currentStock} left!</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3 text-black">
                    <div className="flex items-center border rounded-lg bg-gray-50">
                      <button onClick={() => updateQty(item.productId, -1)} className="px-3 py-1 hover:bg-gray-200">-</button>
                      <span className="px-3 font-medium">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, 1)} className="px-3 py-1 hover:bg-gray-200">+</button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => removeItem(item.productId)} className="text-red-500 text-sm font-medium">Remove</button>
                      <button onClick={() => openShippingForm(item)} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Buy</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-white text-black p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{cart.reduce((s, i) => s + (i.price * i.quantity), 0)}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Total Savings</span>
              <span>- ₹{cart.reduce((s, i) => s + (i.price - getDiscountedPrice(i.price, i.discountAmount, i.discountType)) * i.quantity, 0)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>₹{cart.reduce((s, i) => s + (getDiscountedPrice(i.price, i.discountAmount, i.discountType) * i.quantity), 0)}</span>
            </div>
          </div>
          <button className="w-full bg-black text-white mt-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition">
            Proceed to All Checkout
          </button>
        </div>
      </div>

      {/* Shipping Form Modal - Same as your code but styled better */}
      {showShippingForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white text-black rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Delivery Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black font-bold">
              {/* Inputs yahan aayenge */}
              {Object.keys(shipping).map((key) => (
                <div key={key} className={key === 'address' ? 'md:col-span-2' : ''}>
                  <label className="text-xs font-bold text-gray-500 uppercase">{key}</label>
                  <input
                    className="w-full border-b-2 border-gray-100 focus:border-blue-500 outline-none py-2 transition"
                    value={shipping[key]}
                    onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })}
                  />
                  {shippingErrors[key] && <p className="text-red-500 text-[10px]">{shippingErrors[key]}</p>}
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={closeShippingForm} className="flex-1 py-3 border rounded-xl font-bold">Cancel</button>
              <button onClick={handlePlaceOrder} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700">Confirm Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}