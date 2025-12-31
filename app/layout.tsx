import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <TooltipProvider delayDuration={120}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
