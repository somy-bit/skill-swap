'use client'

import React, { useState } from 'react'
import { useClerk } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'

const LogoutBtn: React.FC = () => {
  const { signOut } = useClerk()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <>
      {/* Custom Button */}
      <button
        onClick={() => setOpen(true)}
        className=" hover:text-indigo-300 text-xl flex flex-row items-center space-x-3 font-semibold transition ease-out "
      >
        <LogOut className='w-4 h-4' />
        <span>Logout</span>

      </button>

      {/* Confirmation Dialog */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 flex flex-col space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Logout</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LogoutBtn
