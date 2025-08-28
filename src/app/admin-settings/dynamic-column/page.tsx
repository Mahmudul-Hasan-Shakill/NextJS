import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import AddField from "@/components/dynamic/addField";
import RemoveField from "@/components/dynamic/removeField";
import { Button } from "@/components/ui/button";
import { ScanSearch } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dynamic-Columns",
  description: "Developed by Core Systems",
};

const DynamicColumn: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <div className="mx-auto w-full bg-white p-6 rounded-lg shadow-md dark:bg-black text-[10px]">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
              Add or Remove Dynamic Columns
            </h2>
            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

            <div className="flex justify-end mb-4">
              <Link href="/admin-settings/dynamic-view">
                <Button variant="default" size="sm" className="text-xs">
                  <ScanSearch className="h-4 w-4 mr-2" /> View Dynamic Columns
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <AddField />
              <RemoveField />
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default DynamicColumn;
