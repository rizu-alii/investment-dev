import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvestmentDetail } from "./InvestmentDetail";

export function InvestedCards() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveInvestments = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        window.location.href = '/sign-in';
        return;
      }
      setApiMessage(null);
      try {
        const response = await fetch('http://localhost:8080/api/user/active-investments', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          window.location.href = '/sign-in';
          return;
        }
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setInvestments(data);
        } else {
          setApiMessage('Failed to fetch active investments.');
        }
      } catch (err) {
        setApiMessage('Network error. Please try again.');
      }
    };
    fetchActiveInvestments();
  }, []);

  if (selected) {
    return <InvestmentDetail investment={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="space-y-4">
      {apiMessage && (
        <div className="mb-4 p-3 rounded mx-auto max-w-2xl text-center bg-red-50 text-red-700">
          {apiMessage}
        </div>
      )}
      {investments.map((inv) => (
        <Card key={inv.id} className="flex flex-col md:flex-row items-center justify-between p-4">
          <CardContent className="flex-1 flex flex-col md:flex-row md:items-center md:space-x-8 p-0">
            <div className="flex-1">
              <div className="font-semibold text-lg mb-1">{inv.investmentName}</div>
              <div className="flex space-x-6 text-sm text-muted-foreground mb-1">
                <span>Type <span className="font-medium text-black dark:text-white">{inv.category}</span></span>
                <span>Status <span className="font-medium text-green-600">ACTIVE</span></span>
                <span>Total Profit <span className="font-medium text-green-600">{inv.currentProfit}</span></span>
                <span>Duration <span className="font-medium text-blue-600">{inv.durationInMonths} months</span></span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-4 md:mt-0">
              <Button variant="default" onClick={() => setSelected(inv)}>Details</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 