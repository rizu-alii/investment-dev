import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">OPESSOCIUS</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/blog" className="text-sm font-medium transition-colors hover:text-primary">
              Blog
            </Link>
            <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About Us
            </Link>
            <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/sign-in">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/sign-up">Sign Up</Link>
            </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4">
                <Link to="/blog" className="text-sm font-medium">
                  Blog
                </Link>
                <Link to="/about" className="text-sm font-medium">
                  About Us
                </Link>
                <Link to="/contact" className="text-sm font-medium">
                  Contact
                </Link>
                <div className="flex flex-col gap-2 pt-4">
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/sign-in">Login</Link>
                  </Button>
                  <Button asChild className="w-full justify-start">
                    <Link to="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 