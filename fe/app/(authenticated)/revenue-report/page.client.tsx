"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
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

import { useRevenueReports } from "@/hooks/reports/useRevenueReport";
import { RevenueType } from "@/types/revenue";

const revenueTypes: RevenueType[] = [
  "Weekly",
  "Monthly",
  "Quartertly",
  "Yearly",
];
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

function RevenueReportContent() {
  const [selectedType, setSelectedType] = useState<RevenueType>("Monthly");
  const { data, isLoading, isError } = useRevenueReports(selectedType);
  const reports = data?.data || [];

  const totalRevenue = reports.reduce(
    // eslint-disable-next-line
    (sum: number, r: any) => sum + r.revenueAmount,
    0
  );

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
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // eslint-disable-next-line
  const chartData = reports.map((r: any) => ({
    ...r,
    label: formatLabel(r.fromDate),
  }));

  return (
    <div className="mx-auto max-w-screen-xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-black">
          Revenue Report
        </h1>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as RevenueType)}
          className="ml-4 rounded-lg border px-4 py-2"
        >
          {revenueTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : isError ? (
        <div className="text-red-500">Error loading report.</div>
      ) : (
        <>
          <div className="mb-6 text-lg font-semibold dark:text-black">
            Total Revenue:{" "}
            {totalRevenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Bar Chart */}
            <div className="w-full min-w-0 rounded-xl bg-white p-4 shadow-md">
              <h2 className="mb-4 font-semibold">Revenue Bar Chart</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip
                    formatter={(v: number) =>
                      v.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })
                    }
                  />
                  <Bar dataKey="revenueAmount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="w-full min-w-0 rounded-xl bg-white p-4 shadow-md">
              <h2 className="mb-4 font-semibold">Revenue Line Chart</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip
                    formatter={(v: number) =>
                      v.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="revenueAmount"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="mt-8 w-full min-w-0 rounded-xl bg-white p-4 shadow-md">
            <h2 className="mb-4 font-semibold">Revenue Distribution</h2>
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
                    percent !== undefined
                      ? `${(percent * 100).toFixed(0)}%`
                      : ""
                  }
                >
                  {chartData.map(
                    (
                      entry: { label: string; revenueAmount: number },
                      index: number
                    ) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip
                  formatter={(v: number) =>
                    v.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
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

export default function RevenueReportPageClient() {
  return <RevenueReportContent />;
}
