import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const demoInvestments = [
  {
    id: 1,
    category: "Equity | Consumption",
    name: "Prudential FMCG Fund - Growth",
    fundSize: "1,189.60cr",
    return: "+3.29%",
    risk: "High",
    returnColor: "text-green-600",
    type: "Equity",
  },
  {
    id: 2,
    category: "Equity | Consumption",
    name: "Index Sensex Direct Plan-Growth",
    fundSize: "2,555.96cr",
    return: "+23.37%",
    risk: "High",
    returnColor: "text-green-600",
    type: "Equity",
  },
  {
    id: 3,
    category: "Equity | Consumption",
    name: "Index Sensex Direct",
    fundSize: "94.29cr",
    return: "+18.70%",
    risk: "Very High",
    returnColor: "text-green-600",
    type: "Equity",
  },
  {
    id: 4,
    category: "Debt | Consumption",
    name: "Market Fund Direct-Growth",
    fundSize: "1,400.00cr",
    return: "+7.10%",
    risk: "Low",
    returnColor: "text-green-600",
    type: "Debt",
  },
  {
    id: 5,
    category: "Debt | Consumption",
    name: "Liquid Fund Direct-Growth",
    fundSize: "2,000.00cr",
    return: "+5.50%",
    risk: "Moderate",
    returnColor: "text-green-600",
    type: "Debt",
  },
];

export function InvestmentsVisualization() {
  return (
    <div className="space-y-4">
      {demoInvestments.map((inv) => (
        <Card key={inv.id} className="flex flex-col md:flex-row items-center justify-between p-4">
          <CardContent className="flex-1 flex flex-col md:flex-row md:items-center md:space-x-8 p-0">
            <div className="flex-1">
              <div className="text-xs font-medium text-green-600 mb-1">{inv.category}</div>
              <div className="font-semibold text-lg mb-1">{inv.name}</div>
              <div className="flex space-x-6 text-sm text-muted-foreground">
                <span>Fund Size <span className="font-medium text-black dark:text-white">{inv.fundSize}</span></span>
                <span>Return(P.A.) <span className={`font-medium ${inv.returnColor}`}>{inv.return}</span></span>
                <span>Risk <span className="font-medium text-black dark:text-white">{inv.risk}</span></span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-4 md:mt-0">
              <Button variant="outline" className="mb-2 md:mb-0 md:mr-2">Add To Cart</Button>
              <Button variant="default">Invest Now</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 