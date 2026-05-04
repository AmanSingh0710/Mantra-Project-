"use client";

import { fetchFromAPI } from "@/utils/api";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  FaBell, FaShoppingCart, FaGlobe, FaSearch, FaBars,
  FaCog, FaSignOutAlt, FaChevronDown, FaCheck, FaUser, FaLock, FaCamera, FaEye, FaEyeSlash, FaSpinner
} from "react-icons/fa";


export const AdminSettings = ({ data }) => {
  const [activeSubTab, setActiveSubTab] = useState('basic');
  const [phone, setPhone] = useState("919876543210");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState(data?.admin?.avatar || "/Lebrostone logo.png");

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    mobile: "",
  });


  useEffect(() => {
    const loadInitialData = async () => {
      if (hasLoaded) return;

      if (data?.admin) {
        fillForm(data.admin);
        setHasLoaded(true);
      } else {
        try {
          const result = await fetchFromAPI("/auth/admin-profile");

          if (result.success && result.admin) {
            fillForm(result.admin);
            setHasLoaded(true);
          }
        } catch (err) {
          console.error("Data fetch fail:", err);
        }
      }
    };

    const fillForm = (admin) => {
      if (!admin) return;
      console.log("Admin object received in fillForm:", admin);
      setFormData({
        _id: admin._id || "",
        name: admin.name || "",
        email: admin.email || "",
        mobile: admin.mobile || "",
      });
      setPhone(admin.mobile || "");
      if (admin.image) {
        const imageUrl = admin.image.startsWith('http')
          ? admin.image
          : `${BASE_URL}${admin.image}`;
        setPreviewImage(imageUrl);
      }
    };

    loadInitialData();
  }, [data, hasLoaded]); // hasLoaded ko dependency mein add karein

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {

    const adminId = formData._id || data?.admin?._id;

    if (!formData._id) return toast.error("Admin ID not found");

    try {
      setIsUpdating(true);

      const dataToSend = new FormData();
      dataToSend.append("id", formData._id);
      dataToSend.append("name", formData.name);
      dataToSend.append("email", formData.email);
      dataToSend.append("mobile", formData.mobile);
      dataToSend.append("address", data?.admin?.address || "N/A");
      dataToSend.append("pin", data?.admin?.pin || "000000");

      if (selectedFile) {
        dataToSend.append("image", selectedFile);
      }
      const result = await fetchFromAPI("/auth/update-admin", {
        method: "PATCH",
        body: dataToSend,
      });


      if (response.ok && result.success) {
        toast.success("Admin Profile Updated!");
      } else {
        toast.error(result.message || "Failed to update admin profile");
      }
    } catch (error) {
      toast.error("Network error, please try again");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    // Basic Validations
    if (!newPassword || !confirmPassword) {
      return toast.error("Please fill all password fields");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setIsUpdating(true); // Aap loading state use kar sakte hain
      const result = await fetchFromAPI("/auth/update-password", {
        method: "PATCH",
        body: JSON.stringify({ password: newPassword }),
      });


      if (response.ok && result.success) {
        toast.success("Password Updated Successfully!");
        setNewPassword(""); // Update ke baad field khali kar dein
        setConfirmPassword("");
      } else {
        toast.error(result.message || "Failed to update password");
      }
    } catch (error) {
      toast.error("Network error, please try again");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 p-3 md:p-6 bg-gray-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8">

        {/* --- LEFT SIDEBAR TABS (Responsive: Row on mobile, Column on desktop) --- */}
        <div className="w-full lg:w-72 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
          <button
            onClick={() => setActiveSubTab('basic')}
            className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeSubTab === 'basic'
              ? 'bg-white border-l-0 lg:border-l-4 border-b-4 lg:border-b-0 border-blue-600 text-blue-600 shadow-md'
              : 'text-gray-500 hover:bg-white'
              }`}
          >
            <div className={`p-1.5 md:p-2 rounded-lg hidden sm:block ${activeSubTab === 'basic' ? 'bg-blue-50' : 'bg-gray-100'}`}>
              <FaUser size={14} />
            </div>
            Basic Info
          </button>

          <button
            onClick={() => setActiveSubTab('password')}
            className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeSubTab === 'password'
              ? 'bg-white border-l-0 lg:border-l-4 border-b-4 lg:border-b-0 border-blue-600 text-blue-600 shadow-md'
              : 'text-gray-500 hover:bg-white'
              }`}
          >
            <div className={`p-1.5 md:p-2 rounded-lg hidden sm:block ${activeSubTab === 'password' ? 'bg-blue-50' : 'bg-gray-100'}`}>
              <FaLock size={14} />
            </div>
            Password
          </button>
        </div>

        {/* --- RIGHT CONTENT AREA --- */}
        <div className="flex-1 space-y-6 md:space-y-8">

          {/* 1. BASIC INFORMATION SECTION */}
          <div className={`bg-white rounded-2xl md:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden transition-all ${activeSubTab !== 'basic' && 'hidden'}`}>
            <div className="h-32 md:h-40 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 relative">
              <div className="absolute -bottom-10 md:-bottom-14 left-6 md:left-10">
                <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full border-4 md:border-8 border-white bg-white shadow-xl overflow-hidden group">
                  <Image src={previewImage} alt="Avatar" fill className="object-cover" />
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer text-white">
                    <FaCamera className="text-sm md:text-xl" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-14 md:pt-20 pb-6 md:pb-10 px-4 md:px-12">
              <h3 className="text-lg md:text-xl font-extrabold text-gray-800 border-b border-gray-50 pb-4 mb-6">Personal Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border text-black border-gray-200 rounded-xl md:rounded-2xl px-4 py-3 md:py-4 text-sm font-semibold focus:border-blue-500 outline-none bg-gray-50/30" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                  <div className="custom-phone-container">
                    <PhoneInput
                      country={'in'}
                      value={formData.mobile}
                      onChange={(val) => {
                        setPhone(val);
                        setFormData({ ...formData, mobile: val });
                      }}
                      enableSearch={true}
                      containerClass="!w-full"
                      inputClass="!w-full !h-[48px] md:!h-[54px] !text-base !font-bold !bg-gray-50/50 !rounded-xl md:!rounded-2xl !border-gray-200 !text-black !pl-[55px]"
                      buttonClass="!bg-transparent !border-none !rounded-l-xl md:!rounded-l-2xl !w-[45px]"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-gray-200 rounded-xl text-black md:rounded-2xl px-4 py-3 md:py-4 text-sm font-semibold focus:border-blue-500 outline-none bg-gray-50/30" />
                </div>
              </div>

              <div className="mt-8 md:mt-12">
                <button onClick={handleSaveProfile} disabled={isUpdating} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-12 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm shadow-xl shadow-blue-200 transition-all active:scale-95">
                  {isUpdating ? <><FaSpinner className="animate-spin" /> SAVING...</> : "SAVE SETTINGS"}
                </button>
              </div>
            </div>
          </div>

          {/* 2. PASSWORD SECTION */}
          <div className={`bg-white rounded-2xl md:rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-12 transition-all ${activeSubTab !== 'password' && 'hidden'}`}>
            <h3 className="text-lg md:text-xl font-extrabold text-gray-800 border-b border-gray-50 pb-4 mb-6">
              Security & Password
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full border border-gray-200 rounded-xl md:rounded-2xl px-5 py-3 md:py-4 text-sm md:text-base font-bold text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none bg-gray-50/50 transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full border border-gray-200 rounded-xl md:rounded-2xl px-5 py-3 md:py-4 text-sm md:text-base font-bold text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none bg-gray-50/50 transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showConfirmPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 md:mt-12 pt-6 border-t border-gray-50">
              <button type="button" onClick={() => handleUpdatePassword()} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-xl md:rounded-2xl font-black text-sm shadow-xl shadow-blue-200 transition-all active:scale-95">
                UPDATE PASSWORD
              </button>
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .custom-phone-container .react-tel-input .form-control {
          font-family: inherit;
          font-size: 16px !important; /* Larger text for readability */
          color: #000000 !important; /* Pure black text */
          background-color: #f9fafb !important;
          width: 100% !important;
          border: 1px solid #e5e7eb !important;
        }
        .custom-phone-container .react-tel-input .flag-dropdown {
          background-color: transparent !important;
          border: none !important;
        }
        .custom-phone-container .react-tel-input .selected-flag {
          background-color: transparent !important;
          padding-left: 12px !important;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default function AdminNavbar({ data, toggleSidebar, activeTab, setActiveTab }) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const profileRef = useRef(null);
  const langRef = useRef(null);

  const languageFlags = {
    English: "/en.png",
    Hindi: "/hi.png",
    Spanish: "/es.png",
    French: "/fr.png",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (langRef.current && !langRef.current.contains(event.target)) setIsLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#f59e0b",
      confirmButtonText: "Yes, logout!"
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };



  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-3 md:px-4 sticky top-0 z-50 w-full shadow-sm">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="lg:hidden text-gray-600 p-2 hover:bg-gray-100 rounded-lg">
          <FaBars size={20} />
        </button>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <input type="text" placeholder="Search anything..." className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={14} />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1 p-1.5 sm:p-2 hover:bg-gray-100 rounded-md transition border border-transparent">
            <Image src={languageFlags[data?.language] || "/en.png"} alt="Lang" width={18} height={12} className="rounded-sm" />
            <span className="hidden sm:block text-xs font-medium text-gray-700">{data?.language || "English"}</span>
            <FaChevronDown size={8} className="text-gray-400" />
          </button>
          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-50">
              {Object.keys(languageFlags).map((lang) => (
                <button key={lang} onClick={() => setIsLangOpen(false)} className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-700 hover:bg-amber-50 transition">
                  <div className="flex items-center gap-2"><Image src={languageFlags[lang]} alt={lang} width={16} height={10} /> {lang}</div>
                  {(data?.language || "English") === lang && <FaCheck size={8} className="text-amber-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => router.push("/")} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"><FaGlobe size={18} /></button>

        <button onClick={() => setActiveTab("notifications")} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative transition">
          <FaBell size={18} />
          {data?.notifications > 0 && <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[8px] px-1 rounded-full border border-white">{data.notifications}</span>}
        </button>

        <button onClick={() => setActiveTab("orders_pending")} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative transition">
          <FaShoppingCart size={18} />
          {data?.pendingOrders > 0 && <span className="absolute top-1 right-1 bg-amber-600 text-white text-[8px] px-1 rounded-full border border-white">{data.pendingOrders}</span>}
        </button>

        <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden xs:block"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 md:gap-3 pl-1 cursor-pointer group">
            <div className="text-right hidden lg:block leading-none">
              <p className="text-sm font-bold text-gray-800 group-hover:text-amber-600 transition">{data?.admin?.name || "Lebrostone"}</p>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Master Admin</span>
            </div>
            <div className="relative h-9 w-9 border-2 border-amber-100 rounded-full overflow-hidden shadow-sm group-hover:border-amber-400 transition">
              <Image src={data?.admin?.avatar || "/Lebrostone logo.png"} alt="Admin" fill className="object-cover" />
            </div>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <button onClick={() => { setActiveTab("settings"); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition">
                <FaCog className="text-gray-400" /> Settings
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-50 mt-1 transition">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}