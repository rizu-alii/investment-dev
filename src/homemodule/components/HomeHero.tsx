import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HomeHero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-gradient-to-b from-primary/80 to-background/80 flex items-center justify-center">
      {/* If you add /hero-bg.jpg to public, you can uncomment the next line */}
      {/* <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center" /> */}
      <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Invest in Your Future
          <span className="block text-primary">Today</span>
        </h1>
        <p className="mt-6 max-w-[600px] text-lg text-muted-foreground sm:text-xl">
          Join thousands of investors who trust us with their financial future. Start your investment journey today.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link to="/sign-in">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/calculator">Try Calculator</Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 