"use client";

import React, { useMemo, useState } from "react";
import DataLoader from "../../loader/dataLoader";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { EditField } from "@/components/table/editFields";
import UniversalButton from "@/components/ui/universalButton";
import { Button } from "@/components/ui/button";
import { ScanSearch } from "lucide-react";
import Link from "next/link";
import { useClusterNames } from "@/hooks/core_systems/cluster/useClusterNames";
import type { PhysicalHostReg } from "@/types/physical-host";
import { usePhysicalHost } from "@/hooks/core_systems/physical_host/physicalHostHooks";

export function PhysicalHostRegister() {
  const { createPhysicalHost, loading } = usePhysicalHost();
  const userName = useUserDetails();
  const { clusterNames } = useClusterNames();

  // Required fields for Physical Host
  const requiredFields: (keyof PhysicalHostReg)[] = ["hostname", "physicalIp"];

  const initialState: PhysicalHostReg = {
    hostname: "",
    physicalIp: "",
    makeBy: userName || "",
    isActive: true,
  };

  const [formData, setFormData] = useState<PhysicalHostReg>(initialState);

  const numericKeys = useMemo(
    () => new Set(["cpuCoresTotal", "ramTotalGb", "storageTotalTb"]),
    []
  );

  const handleChange = (
    e: React.ChangeEvent<any> | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target;

    // Coerce numbers if field is numeric
    if (numericKeys.has(id)) {
      const parsed =
        value === "" || value === null || value === undefined
          ? undefined
          : Number(value);
      setFormData((prev) => ({
        ...prev,
        [id]: isNaN(parsed as number) ? undefined : parsed,
      }));
      return;
    }

    // Handle date fields
    if (id === "warrantyExpiry" && value) {
      setFormData((prev) => ({ ...prev, [id]: new Date(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const sanitizePayload = (payload: PhysicalHostReg): PhysicalHostReg => {
    // Remove empty-string fields and keep undefined as truly optional
    const cleaned: any = {};
    Object.entries(payload).forEach(([k, v]) => {
      if (v === "" || v === null) return; // drop empty strings and null
      cleaned[k] = v;
    });
    return cleaned as PhysicalHostReg;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.warning(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    const payload: PhysicalHostReg = sanitizePayload({
      ...formData,
      makeBy: userName, // ensure we set the creator
    });

    const success = await createPhysicalHost(payload);
    if (success) {
      setFormData(initialState);
    }
  };

  if (loading) return <DataLoader />;

  return (
    <div className="mx-auto w-full max-w-6xl bg-gray-100 p-6 rounded-lg shadow-md dark:bg-zinc-950 text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register Physical Host
      </h2>

      <div className="flex justify-end mb-4">
        <Link href="/core-systems/physical-host-update">
          <Button variant="default" size="sm" className="text-xs">
            <ScanSearch className="h-4 w-4 mr-2" /> View Physical Host List
          </Button>
        </Link>
      </div>

      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
      >
        {/* Required Fields Section */}
        <EditField
          name="hostname"
          label="Hostname"
          type="text"
          value={formData.hostname}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="host01.dc.example.com"
          required
        />

        <EditField
          name="physicalIp"
          label="Physical IP"
          type="text"
          value={formData.physicalIp}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="10.10.5.25"
          required
        />

        {/* Basic Information Section */}
        <EditField
          name="clusterName"
          label="Cluster Name"
          type="select"
          value={formData.clusterName}
          onChange={handleChange}
          className="text-[10px]"
          options={clusterNames.map((cluster) => ({
            value: cluster,
            label: cluster,
          }))}
          placeholder="-- Select an option --"
        />

        <EditField
          name="location"
          label="Location"
          type="text"
          value={formData.location || ""}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="DC1 / Rack R-12U"
        />

        {/* Hardware Information Section */}
        <EditField
          name="brand"
          label="Brand"
          type="text"
          value={formData.brand || ""}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="Dell / HPE / Lenovo"
        />

        <EditField
          name="model"
          label="Model"
          type="text"
          value={formData.model || ""}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="R740xd"
        />

        <EditField
          name="serialNumber"
          label="Serial Number"
          type="text"
          value={formData.serialNumber || ""}
          onChange={handleChange}
          className="text-[10px]"
        />

        <EditField
          name="assetTag"
          label="Asset Tag"
          type="text"
          value={formData.assetTag || ""}
          onChange={handleChange}
          className="text-[10px]"
        />

        {/* CPU/Memory/Storage Section */}
        <EditField
          name="cpuModel"
          label="CPU Model"
          type="text"
          value={formData.cpuModel || ""}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="Intel Xeon Gold 6338"
        />

        <EditField
          name="cpuCoresTotal"
          label="CPU Cores Total"
          type="number"
          value={formData.cpuCoresTotal || ""}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="48"
        />

        <EditField
          name="ramTotalGb"
          label="RAM Total (GB)"
          type="number"
          value={formData.ramTotalGb || ""}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="512"
        />

        <EditField
          name="storageTotalTb"
          label="Storage Total (TB)"
          type="number"
          value={formData.storageTotalTb || ""}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="28.5"
        />

        <EditField
          name="storageType"
          label="Storage Type"
          type="text"
          value={formData.storageType || ""}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="SSD / HDD / NVMe / Mixed"
        />

        {/* Network/OS Section */}
        <EditField
          name="powerSupply"
          label="Power Supply"
          type="text"
          value={formData.powerSupply || ""}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="Dual / Single"
        />

        <EditField
          name="networkPorts"
          label="Network Ports"
          type="text"
          value={formData.networkPorts || ""}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="4x10GbE + 2x1GbE"
        />

        <EditField
          name="osInstalled"
          label="OS Installed"
          type="text"
          value={formData.osInstalled || ""}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="ESXi / RHEL"
        />

        <EditField
          name="osVersion"
          label="OS Version"
          type="text"
          value={formData.osVersion || ""}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="8.6 / 7.0 U3"
        />

        {/* Virtualization Section */}
        <EditField
          name="hypervisorType"
          label="Hypervisor Type"
          type="text"
          value={formData.hypervisorType || ""}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="VMware / KVM / Hyper-V / Oracle VM"
        />

        <EditField
          name="hypervisorVersion"
          label="Hypervisor Version"
          type="text"
          value={formData.hypervisorVersion || ""}
          onChange={handleChange}
          className="text-[10px]"
        />

        {/* Status/Warranty Section */}
        <EditField
          name="status"
          label="Status"
          type="select"
          value={formData.status || ""}
          onChange={handleChange}
          className="text-[10px]"
          options={[
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
            { value: "Retired", label: "Retired" },
            { value: "Maintenance", label: "Maintenance" },
          ]}
        />

        <EditField
          name="warrantyExpiry"
          label="Warranty Expiry"
          type="date"
          value={formData.warrantyExpiry?.toString().split("T")[0] || ""}
          onChange={handleChange}
          className="text-[10px]"
        />

        <EditField
          name="assignedToTeam"
          label="Assigned To Team"
          type="text"
          value={formData.assignedToTeam || ""}
          onChange={handleChange}
          className="text-[10px]"
          placeholder="Core Systems"
        />

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2 mt-2">
          <UniversalButton type="submit">Submit &rarr;</UniversalButton>
        </div>
      </form>
    </div>
  );
}
