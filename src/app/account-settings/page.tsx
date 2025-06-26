import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { AccountSettings } from "@/components/settings/account-settings";

export const metadata = {
  title: "Account-Settings",
  description: "Developed by Core Systems",
};

const AccountSettingsPage: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <AccountSettings />
      </MainLayout>
    </>
  );
};

export default AccountSettingsPage;
