'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  to: string;
  onClick: () => void;
}

const MenuItem = ({ name, icon, to, onClick }: MenuItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === to || (name === "Dashboard" && pathname === "/");
  
  const activeClass = isActive
    ? "bg-[#8FCAB5] text-gray-800 font-semibold"
    : "text-gray-600 hover:bg-gray-100";

  return (
    <Link
      href={to}
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
          {menuItems.admin.map((item) => (
            <MenuItem
              key={item.name}
              name={item.name}
              icon={item.icon}
              to={item.to}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </div>

        <div className="mt-4 mb-12 text-center text-xs text-gray-400">
          version 1.0.0
        </div>
      </aside>
    </>
  );
}

export default Sidebar;