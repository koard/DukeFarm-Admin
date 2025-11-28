'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import DashboardIcon from "../../assets/dashboard.svg";
import FishIcon from "../../assets/fish.svg";
import ResearchIcon from "../../assets/research.svg";
import FoodIcon from "../../assets/food.svg";
import AdminIcon from "../../assets/admin.svg";
import LockIcon from "../../assets/lock.svg";
import LogoutIcon from "../../assets/logout.svg";
import Logo from "../../assets/duke-farm.png";

const menuItems = {
  main: [
    { name: "Dashboard", icon: DashboardIcon, to: "/dashboard" },
    { name: "ข้อมูลเกษตรกร", icon: FishIcon, to: "/farmers" },
    { name: "ข้อมูลนักวิจัย", icon: ResearchIcon, to: "/researchers" },
    { name: "สูตรอาหาร", icon: FoodIcon, to: "/recipes" },
  ],
  admin: [
    { name: "ผู้ดูแลระบบ", icon: AdminIcon, to: "/admins" },
    { name: "สิทธิ์การเข้าถึง", icon: LockIcon, to: "/permissions" },
    { name: "Log out", icon: LogoutIcon, to: "/logout" },
  ],
};

interface MenuItemProps {
  name: string;
  icon: any;
  to?: string;
  onClick: () => void;
  isButton?: boolean;
}

const MenuItem = ({ name, icon, to, onClick, isButton = false }: MenuItemProps) => {
  const pathname = usePathname();
  const isActive = to && (pathname === to || (name === "Dashboard" && pathname === "/"));
  
  const activeClass = isActive
    ? "bg-[#8FCAB5] text-gray-800 font-semibold"
    : "text-gray-600 hover:bg-gray-100";

  if (isButton) {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-start p-3 rounded-lg transition-colors duration-200 ${activeClass}`}
      >
        <Image src={icon} alt={name} width={20} height={20} className="w-5 h-5" />
        <span className="text-sm inline ml-3">{name}</span>
      </button>
    );
  }

  return (
    <Link
      href={to!}
      onClick={onClick}
      className={`flex items-center justify-start p-3 rounded-lg transition-colors duration-200 ${activeClass}`}
    >
      <Image src={icon} alt={name} width={20} height={20} className="w-5 h-5" />
      <span className="text-sm inline ml-3">{name}</span>
    </Link>
  );
};

const HamburgerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    // Clear auth token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    setShowLogoutDialog(false);
    setIsOpen(false);
    router.push('/login');
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
      {!isOpen && (
        <button
          className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-md shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <HamburgerIcon />
        </button>
      )}

      <aside
        className={`flex flex-col w-64 h-screen bg-white border-r border-gray-200 shadow-xl font-inter fixed top-0 left-0 z-50 
                   transition-transform duration-300 ease-in-out 
                   lg:translate-x-0 
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 pb-4 flex flex-col items-center">
          <div className="w-full mb-2 flex flex-col items-center relative">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image
                src={Logo}
                alt="DUKE FARM Logo"
                width={160}
                height={60}
                className="w-40 h-auto cursor-pointer"
                priority
              />
            </Link>
            
            <button
              className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2"
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="mt-2 text-lg font-bold text-gray-800 mb-2 w-full text-center">
            Admin
          </div>
        </div>

        <nav className="px-4 space-y-1 flex-grow">
          {menuItems.main.map((item) => (
            <MenuItem
              key={item.name}
              name={item.name}
              icon={item.icon}
              to={item.to}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </nav>

        <div className="border-b border-gray-400 mb-4 w-10/12 mx-auto"></div>

        <div className="px-4 space-y-1">
          {menuItems.admin.map((item) => {
            if (item.name === 'Log out') {
              return (
                <MenuItem
                  key={item.name}
                  name={item.name}
                  icon={item.icon}
                  onClick={handleLogoutClick}
                  isButton={true}
                />
              );
            }
            return (
              <MenuItem
                key={item.name}
                name={item.name}
                icon={item.icon}
                to={item.to}
                onClick={() => setIsOpen(false)}
              />
            );
          })}
        </div>

        <div className="mt-4 mb-12 text-center text-xs text-gray-400">
          version 1.0.0
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-[rgba(0,0,0,0.5)]">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">ออกจากระบบ</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              คุณต้องการออกจากระบบใช่หรือไม่?
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-200 font-medium"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;