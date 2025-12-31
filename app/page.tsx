import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_circle_at_35%_20%,rgba(90,30,110,0.08),transparent_55%),radial-gradient(1000px_circle_at_70%_80%,rgba(243,106,33,0.05),transparent_50%)]" />
      
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center px-4">
        <div className="rounded-full bg-secondary/50 px-4 py-1.5 text-sm font-medium text-secondary-foreground shadow-sm backdrop-blur-md border border-border/50">
          Choir Management Simplified
        </div>
        
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">
          VocalEssence
        </h1>
        
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          The complete solution for managing your choir members, tracking attendance, handling subscriptions, and organizing programs.
        </p>
        
        <div className="flex gap-4 mt-6">
          <Link href="/login">
            <Button size="lg" className="gap-2 rounded-xl h-12 px-8 text-base bg-gradient-to-br from-[#5A1E6E] to-[#3D123F] hover:from-[#5A1E6E]/90 hover:to-[#3D123F]/90 shadow-lg shadow-[#5A1E6E]/20 transition-all hover:scale-[1.02]">
              Login to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
