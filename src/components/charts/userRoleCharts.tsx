"use client";

import { useAllUsers } from "@/hooks/user/useAllUsers";
import { PieChartComponent } from "./pieChartComponent";
import { DonutChartComponent } from "./donutChartComponent";
import { BarChartComponent } from "./barChartComponent";
export const UserRoleCharts = () => {
  const { users } = useAllUsers();

  const roleCounts = users.reduce((acc: Record<string, number>, user) => {
    acc[user.userRole] = (acc[user.userRole] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(roleCounts).map(([role, count]) => ({
    name: role,
    value: count,
  }));

  //   return (
  //     <div>
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
  //         <div className="p-4 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white space-y-4 text-xs">
  //           <h2 className="text-xs font-semibold mb-2 text-center">
  //             User Roles - Pie Chart
  //           </h2>
  //           <PieChartComponent data={chartData} />
  //         </div>
  //         <div className="p-4 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white space-y-4 text-xs">
  //           <h2 className="text-xs font-semibold mb-2 text-center">
  //             User Roles - Donut Chart
  //           </h2>
  //           <DonutChartComponent data={chartData} />
  //         </div>
  //       </div>
  //       <div className="grid grid-cols-1 md:grid-cols-1">
  //         <div className="p-4 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white space-y-4 text-xs">
  //           <h2 className="text-xs font-semibold mb-2 text-center">
  //             User Roles - Bar Chart
  //           </h2>
  //           <BarChartComponent data={chartData} />
  //         </div>
  //       </div>
  //     </div>
  //   );
  return (
    <div className="space-y-8 p-12">
      {/* Pie & Donut Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg border border-muted bg-muted/30 dark:bg-muted/20 p-6 shadow-sm hover:shadow-md transition-all">
          <h2 className="text-base font-semibold text-center text-foreground mb-4">
            User Roles - Pie Chart
          </h2>
          <div className="flex justify-center items-center">
            <PieChartComponent data={chartData} />
          </div>
        </div>

        <div className="rounded-lg border border-muted bg-muted/30 dark:bg-muted/20 p-6 shadow-sm hover:shadow-md transition-all">
          <h2 className="text-base font-semibold text-center text-foreground mb-4">
            User Roles - Donut Chart
          </h2>
          <div className="flex justify-center items-center">
            <DonutChartComponent data={chartData} />
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="rounded-lg border border-muted bg-muted/30 dark:bg-muted/20 p-6 shadow-sm hover:shadow-md transition-all">
        <h2 className="text-base font-semibold text-center text-foreground mb-4">
          User Roles - Bar Chart
        </h2>
        <div className="flex justify-center items-center">
          <BarChartComponent data={chartData} />
        </div>
      </div>
    </div>
  );
};
