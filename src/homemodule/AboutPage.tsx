import { Card, CardContent } from "@/components/ui/card";
import { HomeHeader } from "./components/HomeHeader";
import { HomeFooter } from "./components/HomeFooter";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />
      <main className="container py-12 md:py-16">
        <div className="mx-auto max-w-[58rem] text-center">
          <h1 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">About Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Learn more about our mission, values, and the team behind our success.
          </p>
        </div>

        <div className="mx-auto mt-12 grid gap-8 md:grid-cols-2 lg:max-w-[64rem]">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground">
                Founded in 2020, we set out to revolutionize the investment landscape by making it more accessible 
                and transparent for everyone. Our journey began with a simple idea: everyone deserves the opportunity 
                to grow their wealth through smart investments.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                We're committed to democratizing access to investment opportunities while providing the tools, 
                education, and support needed for success. Our mission is to empower individuals to take control 
                of their financial future.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mt-12 max-w-[58rem]">
          <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Transparency</h3>
                <p className="text-muted-foreground">
                  We believe in complete transparency in all our operations and communications.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously innovate to provide the best investment solutions for our clients.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Integrity</h3>
                <p className="text-muted-foreground">
                  We operate with the highest standards of integrity and ethical conduct.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}

export default AboutPage; 