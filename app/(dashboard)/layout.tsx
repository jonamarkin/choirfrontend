"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <motion.div whileTap={{ scale: 0.96 }}>
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-2xl shadow-lg"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>

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

        {/* Page Content */}
        <main className="flex-1 min-w-0 p-6 pt-20 md:pt-6 md:ml-[252px]">
          {children}
        </main>
      </div>
    </div>
  );
}
