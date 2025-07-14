// src/components/Layout.jsx
import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 shadow-sm">
        <div
          dir="rtl"
          className="container mx-auto flex justify-between items-center px-4 gap-x-6"
        >
          {/* כותרת */}
          <Link
            to="/"
            className="text-2xl font-bold text-[#1F3A93] hover:text-[#162D6F] transition-colors"
          >
            פגישות קטינים
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
