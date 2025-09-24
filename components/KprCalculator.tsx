"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider"; // Pastikan Anda sudah install komponen Slider dari Shadcn
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator } from "lucide-react";

// Props untuk menerima harga awal dari halaman detail
interface KprCalculatorProps {
  initialPrice: number;
}

export default function KprCalculator({ initialPrice }: KprCalculatorProps) {
  // State untuk setiap input
  const [propertyPrice, setPropertyPrice] = useState(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.17);
  const [loanTerm, setLoanTerm] = useState(30);

  // State untuk hasil kalkulasi
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Kalkulasi otomatis setiap kali ada input yang berubah
  useEffect(() => {
    const principal =
      propertyPrice - propertyPrice * (downPaymentPercent / 100);
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (principal <= 0 || monthlyInterestRate <= 0 || numberOfPayments <= 0) {
      setMonthlyPayment(0);
      return;
    }

    // Rumus Anuitas KPR
    const payment =
      (principal *
        (monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    setMonthlyPayment(payment);
  }, [propertyPrice, downPaymentPercent, interestRate, loanTerm]);

  // Menghitung nilai uang muka dan pinjaman
  const downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
  const loanAmount = propertyPrice - downPaymentAmount;

  // Fungsi format
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="w-5 h-5 mr-3" />
          Simulasi Cicilan KPR
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Hasil Estimasi */}
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 text-center">
          <p className="text-2xl font-bold">
            {formatCurrency(monthlyPayment)} /bulan
          </p>
          <p className="text-xs mt-1">
            Tenor {loanTerm} tahun, Bunga {interestRate}%, Pinjaman{" "}
            {formatCurrency(loanAmount)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Input Harga Properti */}
          <div className="md:col-span-3 space-y-2">
            <Label htmlFor="hargaProperti">Harga Properti</Label>
            <Input
              id="hargaProperti"
              type="text"
              value={formatCurrency(propertyPrice)}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
            />
          </div>

          {/* Slider Uang Muka */}
          <div className="space-y-2">
            <Label>Uang Muka ({downPaymentPercent}%)</Label>
            <p className="font-semibold text-lg">
              {formatCurrency(downPaymentAmount)}
            </p>
            <Slider
              value={[downPaymentPercent]}
              onValueChange={(value) => setDownPaymentPercent(value[0])}
              max={80}
              step={5}
              className="mt-2"
            />
          </div>

          {/* Input Bunga & Tenor */}
          <div className="space-y-2">
            <Label htmlFor="bunga">Bunga (% per tahun)</Label>
            <Input
              id="bunga"
              type="number"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Tenor</Label>
            <Select
              value={String(loanTerm)}
              onValueChange={(value) => setLoanTerm(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 20, 25, 30].map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year} Tahun
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          * Kalkulator ini adalah alat simulasi, angka sebenarnya dapat
          bervariasi. Hubungi bank untuk informasi lebih lanjut.
        </p>
      </CardContent>
    </Card>
  );
}
