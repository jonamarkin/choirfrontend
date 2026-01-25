import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        {googleClientId ? (
                            <GoogleOAuthProvider clientId={googleClientId}>
                                <TooltipProvider delayDuration={120}>
                                    {children}
                                </TooltipProvider>
                            </GoogleOAuthProvider>
                        ) : (
                            <TooltipProvider delayDuration={120}>
                                {children}
                            </TooltipProvider>
                        )}
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
