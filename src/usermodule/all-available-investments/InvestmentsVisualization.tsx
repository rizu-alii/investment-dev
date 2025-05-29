import { useState, useEffect } from "react";
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

export function InvestmentsVisualization() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<any | null>(null);
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");

  useEffect(() => {
    const fetchInvestments = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        window.location.href = '/sign-in';
        return;
      }
      setApiMessage(null);
      try {
        const response = await fetch('http://localhost:8080/api/admin/get-investments', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          window.location.href = '/sign-in';
          return;
        }
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          setInvestments(data.data);
        } else {
          const errorMessage = data.message || 'Failed to fetch investments.';
          setApiMessage(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err) {
        setApiMessage('Network error. Please try again.');
        toast.error('Network error. Please try again.');
      }
    };
    fetchInvestments();
  }, []);

  const handleInvestClick = (investment: any) => {
    setSelectedInvestment(investment);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInvestment(null);
    setAmount("");
    setMonths("");
  };

  const handleConfirm = async () => {
    if (!selectedInvestment || !amount || !months) return;
    
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      window.location.href = '/sign-in';
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          durationInMonths: parseInt(months),
          investmentId: selectedInvestment.id
        }),
      });

      const data = await response.json();
      
      if (response.status === 401) {
        window.location.href = '/sign-in';
        return;
      }
      
      if (response.ok) {
        toast.success(data.message || 'Investment created successfully');
        setApiMessage(data.message || 'Investment created successfully');
        handleClose();
      } else {
        toast.error(data.message || 'Failed to create investment');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
  };

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
              <div className="text-xs font-medium text-green-600 mb-1">{inv.category}</div>
              <div className="font-semibold text-lg mb-1">{inv.name}</div>
              <div className="flex space-x-6 text-sm text-muted-foreground">
                <span>Fund Size <span className="font-medium text-black dark:text-white">{inv.fundSize}</span></span>
                <span>Return(P.A.) <span className="font-medium text-green-600">{typeof inv.projectedReturn === 'number' ? `+${inv.projectedReturn}%` : inv.projectedReturn}</span></span>
                <span>Risk <span className="font-medium text-black dark:text-white">{inv.riskLevel || inv.risk}</span></span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-4 md:mt-0">
              <Button variant="default" onClick={() => handleInvestClick(inv)}>Invest Now</Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invest in {selectedInvestment?.name}</DialogTitle>
            <DialogDescription>
              Please enter the amount you want to invest and for how many months.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Amount</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Months</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter number of months"
                value={months}
                onChange={e => setMonths(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleConfirm} disabled={!amount || !months}>
              Confirm Investment
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