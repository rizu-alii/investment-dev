import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LineChart, Headphones } from "lucide-react";

const features = [
  {
    title: "Advanced Security",
    description: "Your investments and personal data are protected with state-of-the-art encryption and multi-factor authentication.",
    icon: Shield,
  },
  {
    title: "Personalized Insights",
    description: "Receive tailored investment advice and portfolio recommendations based on your unique goals and risk profile.",
    icon: LineChart,
  },
  {
    title: "24/7 Support",
    description: "Our dedicated support team is available around the clock to answer your questions and help you navigate your investment journey.",
    icon: Headphones,
  },
];

export function HomeFeatures() {
  return (
    <section className="container py-24 sm:py-32">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">Our Features</h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Discover why thousands of investors choose us for their financial journey.
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-16">
        {features.map((feature) => (
          <Card key={feature.title} className="border-2">
            <CardHeader>
              <feature.icon className="h-10 w-10 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
} 