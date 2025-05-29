import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

export function InvestmentDetail({ investment, onBack }: { investment: any, onBack: () => void }) {
  const [openDialog, setOpenDialog] = useState<null | "deposit" | "withdraw">(null);
  const [amount, setAmount] = useState("");

  if (!investment) return null;

  const handleOpen = (type: "deposit" | "withdraw") => {
    setAmount("");
    setOpenDialog(type);
  };

  const handleConfirm = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    if (!openDialog) return;
    if (openDialog === 'withdraw') {
      // Withdraw logic
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        window.location.href = '/sign-in';
        return;
      }
      try {
        const response = await fetch(`http://localhost:8080/api/user/withdraw/${investment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: Number(amount) }),
        });
        const data = await response.json();
        if (response.status === 401) {
          window.location.href = '/sign-in';
          return;
        }
        if (response.ok) {
          toast.success(data.message || 'Withdrawal request submitted.');
          window.location.reload();
        } else {
          toast.error(data.message || 'Withdrawal failed.');
        }
      } catch (err) {
        toast.error('Network error. Please try again.');
      }
    } else if (openDialog === 'deposit') {
      // Deposit logic
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        window.location.href = '/sign-in';
        return;
      }
      try {
        const response = await fetch('http://localhost:8080/api/user/investments/deposit', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            activeInvestmentId: investment.id,
            amount: Number(amount)
          }),
        });
        const data = await response.json();
        if (response.status === 401) {
          window.location.href = '/sign-in';
          return;
        }
        if (response.ok) {
          toast.success(data.message || 'Deposit successful.');
          window.location.reload();
        } else {
          toast.error(data.message || 'Deposit failed.');
        }
      } catch (err) {
        toast.error('Network error. Please try again.');
      }
    }
    setOpenDialog(null);
    setAmount("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-blue-600 hover:underline">&larr; Back to Investments</button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleOpen("withdraw")}>Withdraw</Button>
          <Button variant="default" onClick={() => handleOpen("deposit")}>Deposit</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-2">{investment.investmentName}</h2>
          <div className="mb-4">
            <span className="font-semibold">Category:</span> {investment.category}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Fund Size:</span> {investment.fundSize}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Risk Level:</span> {investment.riskLevel}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Projected Return:</span> {investment.projectedReturn ? `${(investment.projectedReturn * 100).toFixed(2)}%` : 'N/A'}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Status:</span> <span className="text-green-600">ACTIVE</span>
          </div>
          <div className="mb-4">
            <span className="font-semibold">Amount Invested:</span> {investment.amount}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Current Profit:</span> {investment.currentProfit}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Start Date:</span> {investment.startDate ? new Date(investment.startDate).toLocaleString() : 'N/A'}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Duration (months):</span> {investment.durationInMonths}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Transaction History:</span>
            <table className="min-w-full mt-2 border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left font-semibold">Date</th>
                  <th className="px-3 py-2 text-left font-semibold">Type</th>
                  <th className="px-3 py-2 text-left font-semibold">Amount</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {(investment.transactions || []).map((item: any, idx: number) => (
                  <tr key={idx} className="border-t">
                    <td className="px-3 py-2">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</td>
                    <td className="px-3 py-2">{item.type}</td>
                    <td className="px-3 py-2">{item.amount}</td>
                    <td className="px-3 py-2">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={!!openDialog} onOpenChange={val => !val && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{openDialog === "deposit" ? "Deposit Amount" : "Withdraw Amount"}</DialogTitle>
            <DialogDescription>
              {openDialog === "deposit"
                ? "Enter the amount you want to deposit."
                : "Enter the amount you want to withdraw."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleConfirm} disabled={!amount}>
              Confirm
            </Button>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 