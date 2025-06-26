import MainLayout from "@/components/layout/main-layout";
import EditAdminList from "@/components/users/adminList";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import DataTable from "@/components/DataTable/DataTable";
import { dummyData } from "@/components/DataTable/dummyData";
import { ColumnConfig } from "@/components/DataTable/types";
import UsersPage from "@/components/table/test";

export const metadata = {
  title: "User-Settings",
  description: "Developed by Core Systems",
};

const columns: ColumnConfig<(typeof dummyData)[0]>[] = [
  { accessorKey: "id", header: "ID", sortable: true },
  { accessorKey: "name", header: "Name", sortable: true },
  { accessorKey: "age", header: "Age", sortable: true },
  { accessorKey: "email", header: "Email", sortable: true },
];

const UserSettings: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        {/* <EditAdminList /> */}
        {/* <DataTable data={dummyData} columns={columns} /> */}
        <UsersPage />
      </MainLayout>
    </>
  );
};

export default UserSettings;
