import { HomeHeader } from "@/homemodule/components/HomeHeader";
import { HomeFooter } from "@/homemodule/components/HomeFooter";
import { useNavigate, useLocation, useParams } from "react-router-dom";

// Mock blog data (should be shared or imported in real app)
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

function BlogDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  let blog = location.state?.blog;

  if (!blog && id) {
    blog = blogPosts.find((b) => String(b.id) === String(id));
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl mb-4">No blog data found.</div>
        <button className="btn" onClick={() => navigate("/blog")}>Back to Blog</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />
      <main className="container py-12 md:py-16">
        <div className="mx-auto max-w-2xl">
          <img src={blog.image} alt={blog.title} className="w-full rounded-lg mb-8 object-cover aspect-video" />
          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{blog.description}</p>
          <div className="prose prose-lg max-w-none">
            <p>Investment risk refers to the possibility of losing some or all of the original investment or not achieving the expected return. Every investment carries some degree of risk, and understanding these risks is crucial for making informed financial decisions.</p>
            <p>There are several types of investment risks, including market risk, credit risk, liquidity risk, and inflation risk. Market risk arises from fluctuations in the overall market, while credit risk is the chance that a bond issuer or borrower will default. Liquidity risk refers to the difficulty of selling an asset quickly without affecting its price, and inflation risk is the danger that rising prices will erode purchasing power.</p>
            <p>Investment risk can be caused by various factors such as economic downturns, changes in interest rates, political instability, or company-specific events. For example, a sudden change in government policy or a natural disaster can impact the value of investments.</p>
            <p>One of the most effective ways to manage investment risk is through diversification. By spreading investments across different asset classes, industries, and geographic regions, investors can reduce the impact of a poor-performing investment on their overall portfolio.</p>
            <p>Understanding your own risk tolerance is also essential. Risk tolerance is the level of risk an investor is willing and able to take. It depends on factors like age, financial goals, investment horizon, and personal comfort with market fluctuations. Assessing your risk tolerance helps in choosing suitable investments that align with your financial objectives.</p>
            <p>To further manage risk, investors should regularly review their portfolios, stay informed about market trends, and avoid making emotional decisions during periods of market volatility. Consulting with a financial advisor can also provide valuable guidance tailored to individual needs and goals.</p>
            <p>In summary, while investment risk cannot be eliminated, it can be understood and managed. By learning about different types of risks, diversifying investments, and aligning choices with personal risk tolerance, investors can work towards achieving their financial goals more confidently.</p>
          </div>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}

export default BlogDetailPage; 