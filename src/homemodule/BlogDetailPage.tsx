import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { HomeHeader } from "./components/HomeHeader";

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

export function BlogDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  let blog = location.state?.blog;
  if (!blog && id) {
    blog = blogPosts.find((b) => String(b.id) === String(id));
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center">
        <HomeHeader />
        <h1 className="text-3xl font-bold mb-4 mt-8">Blog Not Found</h1>
        <p className="text-muted-foreground">The blog post you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <HomeHeader />
      <div className="w-full flex flex-col items-center mt-8">
        <img src={blog.image} alt={blog.title} className="w-full max-w-xl rounded mb-6" />
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl text-center">{blog.description}</p>
      </div>
    </div>
  );
}

export default BlogDetailPage; 