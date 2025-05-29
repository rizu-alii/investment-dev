import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HomeHeader } from "./components/HomeHeader";

export default function CalculatorSinglePage() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(6); // percent
  const [months, setMonths] = useState(12);
  const [result, setResult] = useState<number | null>(null);

  function calculate() {
    const principal = Number(amount);
    const estimated = principal * Math.pow(1 + rate / 100, months / 12);
    setResult(Number(estimated.toFixed(2)));
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="shadow-sm border-b bg-white" style={{ minHeight: 56 }}>
        <HomeHeader />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-2 py-8 sm:py-12 bg-background">
        <Card className="w-full max-w-md mx-auto shadow-lg rounded-lg border p-0 sm:p-0 mt-6 sm:mt-10">
          <CardHeader className="pb-2 pt-6 sm:pt-8">
            <CardTitle className="text-center text-xl sm:text-2xl">Investment Return Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-2 sm:px-6 pb-6">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min={100}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="rate">Return Rate</Label>
              <div className="flex items-center gap-4 mt-2">
                <input
                  id="rate"
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={rate}
                  onChange={e => setRate(Number(e.target.value))}
                  className="flex-1 accent-blue-600 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                />
                <span className="w-16 text-right">{rate}%</span>
              </div>
            </div>
            <div>
              <Label htmlFor="months">No. of Months</Label>
              <div className="flex items-center gap-4 mt-2">
                <input
                  id="months"
                  type="range"
                  min={0}
                  max={60}
                  step={1}
                  value={months}
                  onChange={e => setMonths(Number(e.target.value))}
                  className="flex-1 accent-green-600 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                />
                <span className="w-16 text-right">{months} mo</span>
              </div>
            </div>
            <Button className="w-full" onClick={calculate}>
              Calculate
            </Button>
            {result !== null && (
              <div className="text-center mt-4">
                <div className="text-lg font-semibold">Estimated Return:</div>
                <div className="text-2xl font-bold text-primary mt-1">${result}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 