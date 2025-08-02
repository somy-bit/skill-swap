'use client'
import {
  ClerkProvider

} from '@clerk/nextjs'
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"

    >
      <html lang="en">
        <body
          className="w-full "
        >
         
          {children}
           <ToastContainer position="top-right" autoClose={2500} />
        </body>
      </html>
    </ClerkProvider>

  );
}
