import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeHeader } from "./components/HomeHeader";
import { HomeFooter } from "./components/HomeFooter";
import { Link, useNavigate } from 'react-router-dom';

// Mock blog data with new images
const blogPosts = [
  {
    id: 1,
    title: "Understanding Investment Risk",
    description: "Learn about different types of investment risks and how to manage them effectively.",
    image: "/images/pexels-fauxels-3184416.jpg",
  },
  {
    id: 2,  
    title: "The Power of Compound Interest",
    description: "Discover how compound interest can significantly impact your long-term investment returns.",
    image: "/images/pexels-leeloothefirst-7887814.jpg",             
  },
  {
    id: 3,
    title: "Investment Strategies for Beginners",                 
    description: "A comprehensive guide to getting started with investing, perfect for beginners.",
    image: "/images/Untitled (9).png",
  },
];

export function BlogPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />
      <main className="container py-12 md:py-16">
        <div className="mx-auto max-w-[58rem] text-center">
          <h1 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Insights, tips, and news about investing and financial growth.
          </p>
        </div>
        <div className="mx-auto mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <div key={post.id} onClick={() => navigate(`/blog/${post.id}`, { state: { blog: post } })} style={{ cursor: 'pointer' }}>
              <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2">{post.description}</CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}

export default BlogPage; 