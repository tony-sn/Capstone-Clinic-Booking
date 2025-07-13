'use client';

import { useRevenueReports } from "@/hooks/reports/useRevenueReport";
import { useState } from "react";
import { RevenueType } from "@/types/revenue";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const revenueTypes: RevenueType[] = ["Weekly", "Monthly", "Quartertly", "Yearly"];
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

export default function RevenueReportPage() {
  const [selectedType, setSelectedType] = useState<RevenueType>("Monthly");
  const { data, isLoading, isError } = useRevenueReports(selectedType);
  const reports = data?.data || [];

  const totalRevenue = reports.reduce((sum: number, r: any) => sum + r.revenueAmount, 0);

  const formatLabel = (fromDate: string) => {
    const date = new Date(fromDate);
    switch (selectedType) {
      case "Weekly": {
        const week = getWeekNumber(date);
        return `Week ${week} - ${date.getFullYear()}`;
      }
      case "Monthly":
        return `Month ${date.getMonth() + 1} - ${date.getFullYear()}`;
      case "Quartertly": {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        return `Q${quarter} - ${date.getFullYear()}`;
      }
      case "Yearly":
        return `Year ${date.getFullYear()}`;
    }
  };

  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const chartData = reports.map((r: any) => ({
    ...r,
    label: formatLabel(r.fromDate),
  }));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Revenue Report</h1>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as RevenueType)}
          className="border rounded-lg px-4 py-2"
        >
          {revenueTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : isError ? (
        <div className="text-red-500">Error loading report.</div>
      ) : (
        <>
          <div className="mb-6 text-lg font-semibold">
            Total Revenue: {totalRevenue.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="font-semibold mb-4">Revenue Bar Chart</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD" })} />
                  <Bar dataKey="revenueAmount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="font-semibold mb-4">Revenue Line Chart</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD" })} />
                  <Line type="monotone" dataKey="revenueAmount" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="mt-8 bg-white p-4 rounded-xl shadow-md">
          <h2 className="font-semibold mb-4">Revenue Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="revenueAmount"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ percent }: { percent?: number }) =>
                  percent !== undefined ? `${(percent * 100).toFixed(0)}%` : ''
                }
              >
                {chartData.map((entry: { label: string; revenueAmount: number }, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) =>
                  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        </>
      )}
    </div>
  );
}
