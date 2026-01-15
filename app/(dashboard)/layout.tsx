"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[280px]"
            >
              <Sidebar isMobile onClose={() => setMobileMenuOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex fixed w-[240px] h-[calc(100vh-24px)] ml-3 mt-3">
          <Sidebar />
        </aside>

        {/* Main Content Wrapper */}
        <main className="flex-1 min-w-0 md:ml-[252px] flex flex-col min-h-screen">
          <DashboardHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
