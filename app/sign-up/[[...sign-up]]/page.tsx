"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { BarChart3 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Page() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = resolvedTheme === "dark";

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 relative transition-colors duration-300">

            {/* Absolute Mode Toggle */}
            <div className="absolute top-4 right-4 z-50">
                <ModeToggle />
            </div>

            {/* Logo & Name Section */}
            <div className="mb-8 flex flex-col items-center gap-2 text-foreground">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-foreground text-background mb-2">
                    <BarChart3 className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Asoy Analytic Ads</h1>
                <p className="text-sm text-muted-foreground">Join to start tracking your leads</p>
            </div>

            {/* Sign Up Component */}
            <SignUp
                appearance={{
                    baseTheme: isDark ? dark : undefined,
                    variables: {
                        colorPrimary: isDark ? "#ffffff" : "#000000",
                        colorTextOnPrimaryBackground: isDark ? "#000000" : "#ffffff",
                        colorBackground: isDark ? "#000000" : "#ffffff",
                    },
                    elements: {
                        card: "bg-card border border-border shadow-xl rounded-xl p-6 sm:p-8",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "bg-background border-border hover:bg-muted text-foreground",
                        formFieldLabel: "text-muted-foreground",
                        formFieldInput: "bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-0",
                        footerActionLink: "text-primary hover:underline",
                        formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90"
                    }
                }}
            />
        </div>
    );
}
