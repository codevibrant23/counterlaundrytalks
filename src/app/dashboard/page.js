import React, { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import MenuList from "@/components/MenuList";
import EnhancedCart from "@/components/EnhancedCart";
import CustomerForm from "@/components/CustomerDetails";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import OutletInfo from "@/components/OutletInfo";
import QuickActions from "@/components/QuickActions";
import CashRegister from "@/components/CashRegister";

const UserDetails = dynamic(() => import("@/components/UserDetails"), {
  ssr: false,
});

const page = async ({ searchParams }) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;
  
  if (!accessToken) {
    redirect("/login");
  }

  const activeCategory = searchParams.category || "";
  const searchTerm = searchParams.search || "";

  return (
    <>
      <div className="h-screen flex bg-gray-100">
        {/* Left Side - 60% Products Section */}
        <div className="w-3/5 p-4 flex flex-col overflow-y-auto">
          {/* Header with Logo and Outlet Info */}
          <div className="w-full flex justify-between items-center pb-4">
            <div className="flex items-center gap-4">
              <Image
                src="/new_logo.png"
                alt="Laundry Talks Logo"
                width={200}
                height={40}
              />
              <OutletInfo />
            </div>
            <div className="flex items-center gap-1 text-sm">
              <QuickActions />
              <Link href="/products" className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded">
                Products
              </Link>
              <Link href="/workshop" className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded">
                Workshop
              </Link>
              <Link href="/receive" className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded">
                Receive
              </Link>
              <Link href="/pickups" className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded">
                Pickups
              </Link>
              <Link href="/order-details" className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded">
                Orders
              </Link>
              <Link href="/cash-register" className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded">
                Cash
              </Link>
              <Link href="/printer-settings" className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded">
                Print
              </Link>
              <Link href="/settings" className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded">
                Settings
              </Link>
              <Link href="/issues" className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded">
                Issues
              </Link>
              <Link href="/learning-centre" className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded">
                Help
              </Link>
              <UserDetails />
            </div>
          </div>
          
          <CustomerForm />
          <Header activeCategory={activeCategory} />
          <Suspense fallback={<LoadingSkeleton />}>
            <MenuList activeCategory={activeCategory} searchTerm={searchTerm} />
          </Suspense>
        </div>

        {/* Right Side - 40% Cart Section */}
        <div className="flex flex-col text-sm w-2/5 h-screen border-l border-gray-200">
          <EnhancedCart />
        </div>
      </div>
      
      {/* Cash Register Modal */}
      <CashRegister />
    </>
  );
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-3 gap-3 pb-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="h-24 bg-gray-200 animate-pulse rounded-md flex flex-col items-center justify-center"
      >
        <div className="w-3/4 h-5 bg-gray-300 rounded mb-2"></div>
        <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
      </div>
    ))}
  </div>
);
export default page;