"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { cn } from "@/components/ui/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";

interface DashboardHeaderProps {
    onOpenMobileMenu: () => void;
}

export function DashboardHeader({ onOpenMobileMenu }: DashboardHeaderProps) {
    const pathname = usePathname();

    // Determine title based on path
    const getTitle = (path: string) => {
        if (path === "/home") return "Dashboard";
        if (path === "/members") return "Members Directory";
        if (path === "/subscriptions") return "My Subscriptions";
        if (path === "/programs") return "Programs & Events";
        if (path === "/attendance") return "Attendance Record";
        if (path === "/finance") return "Financial Overview";
        if (path === "/repertoire") return "Music Repertoire";
        if (path === "/profile") return "My Profile";
        if (path.includes("/manage-subscriptions")) return "Manage Plans";
        if (path.includes("/manage-users")) return "User Management";
        return "VocalEssence";
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-md">
            {/* Left: Mobile Menu & Title */}
            <div className="flex items-center gap-4">
                <motion.div whileTap={{ scale: 0.96 }} className="md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="-ml-2 h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={onOpenMobileMenu}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </motion.div>

                {/* Page Title (Desktop & Mobile) */}
                <div className="flex flex-col">
                    <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-lg">
                        {getTitle(pathname)}
                    </h1>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <ModeToggle />

                {/* Notifications (Mock) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-foreground relative"
                >
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-secondary border-2 border-background" />
                </Button>

                {/* User Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative h-9 w-9 rounded-full ring-offset-background focus-visible:ring-0 focus-visible:ring-offset-0 ml-1"
                        >
                            <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                    VE
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Account</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    View Profile
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
