import { Card, CardContent } from "@/components/ui/card";

export function HomeAbout() {
  return (
    <section className="container py-24 sm:py-32">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">About Us</h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Learn more about our mission and values
        </p>
      </div>
      <div className="mx-auto grid gap-8 md:grid-cols-2 md:gap-12 lg:max-w-[64rem] mt-16">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-4">Who We Are</h3>
            <p className="text-muted-foreground">
              We are a forward-thinking investment platform dedicated to democratizing access to financial growth. 
              Our team is composed of experienced professionals from the worlds of finance, technology, and customer service, 
              all united by a passion for empowering individuals and businesses to achieve their financial goals.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-muted-foreground">
              Our mission is to make investing simple, secure, and accessible for everyone. We strive to provide a seamless 
              digital experience, combining cutting-edge technology with expert guidance and personalized support. We are 
              committed to helping you grow your wealth responsibly.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 