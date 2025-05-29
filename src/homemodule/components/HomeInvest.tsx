import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HomeInvest() {
  return (
    <section className="container py-24 sm:py-32">
      <div className="relative overflow-hidden rounded-lg bg-primary px-6 py-24 shadow-2xl sm:px-24 xl:py-32">
        <div className="absolute inset-0 bg-[url('/invest-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Start Your Investment Journey Today
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/90">
            Join thousands of investors who trust us with their financial future. Take the first step towards a brighter financial future.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/sign-in">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/calculator">Try Calculator</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 