// app/dashboard/layout.tsx
'use client'

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'
import DashboardSidebar from "../../components/DashboardSidebar";
import Header from "@/components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

   
    return (
        <>
            <SignedIn>
                <div className='md:ml-[256px] mt-[60px] md:mt-0 bg-gradient-to-br from-white to-indigo-100 dark:bg-indigo-950'>
                    <Header  />
                    <DashboardSidebar />

                    {/* Main content */}
                    <main className="flex-1 min-h-screen  dark:bg-gray-800 ">{children}</main>
                </div>


            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
}
