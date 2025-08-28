"use client";

import React, { useState } from "react";
import DataLoader from "../../loader/dataLoader";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useCreateCluster } from "@/hooks/core_systems/cluster/useCreateCluster";
import { ClusterReg } from "@/types/cluster";
import { EditField } from "@/components/table/editFields";
import UniversalButton from "@/components/ui/universalButton";
import { Button } from "@/components/ui/button";
import { Plus, ScanSearch, Trash2 } from "lucide-react";
import Link from "next/link";

export function ClusterRegister() {
  const { createCluster, loading } = useCreateCluster();
  const userName = useUserDetails();

  const requiredFields: (keyof ClusterReg)[] = ["clusterName"];
  const initialState: ClusterReg = {
    clusterName: "",
    vmIpList: [""],
    remarks: "",
    isActive: true,
    makeBy: "",
  };

  const [formData, setFormData] = useState<ClusterReg>(initialState);

  const handleChange = (
    e: React.ChangeEvent<any> | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleVmIpChange = (index: number, value: string) => {
    const updatedVmIps = [...formData.vmIpList];
    updatedVmIps[index] = value;
    setFormData((prev) => ({ ...prev, vmIpList: updatedVmIps }));
  };

  const addVmIpField = () => {
    const lastIp = formData.vmIpList[formData.vmIpList.length - 1];
    if (!lastIp || lastIp.trim() === "") {
      toast.warning("Please fill in the last VM IP before adding a new one.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      vmIpList: [...prev.vmIpList, ""],
    }));
  };

  const removeVmIpField = (index: number) => {
    const updatedVmIps = formData.vmIpList.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, vmIpList: updatedVmIps }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const missingFields = requiredFields.filter(
      (field) =>
        formData[field] === undefined ||
        formData[field] === "" ||
        formData[field] === null
    );

    if (
      missingFields.length > 0 ||
      formData.vmIpList.some((ip) => ip.trim() === "")
    ) {
      toast.warning("Please fill in all required fields including VM IPs.");
      return;
    }

    const payload: ClusterReg = {
      ...formData,
      makeBy: userName,
    };

    const success = await createCluster(payload);

    if (success) {
      setFormData(initialState);
    }
  };

  if (loading) return <DataLoader />;

  return (
    <div className="mx-auto w-full max-w-6xl bg-gray-100 p-6 rounded-lg shadow-md dark:bg-zinc-950 text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register Cluster
      </h2>

      <div className="flex justify-end mb-4">
        <Link href="/core-systems/cluster-update">
          <Button variant="default" size="sm" className="text-xs">
            <ScanSearch className="h-4 w-4 mr-2" /> View Cluster List
          </Button>
        </Link>
      </div>

      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
      >
        {/* First Row */}
        <EditField
          name="clusterName"
          label={
            <>
              Cluster Name <span className="text-red-500">*</span>
            </>
          }
          type="text"
          value={formData.clusterName}
          onChange={handleChange}
          className="text-[10px]"
        />

        <EditField
          name="isActive"
          label="Is Active"
          type="boolean"
          value={formData.isActive}
          onChange={handleChange}
          className="text-[10px]"
        />

        {/* Second Row: VM IPs */}
        <div className="col-span-1 md:col-span-2">
          {formData.vmIpList.map((ip, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <EditField
                name={`vmIp-${index}`}
                label={`VM IP ${index + 1}`}
                type="text"
                value={ip}
                onChange={(e) => handleVmIpChange(index, e.target.value)}
                className="w-full text-[10px]"
              />
              {formData.vmIpList.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeVmIpField(index)}
                  className="mt-3 text-xs"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addVmIpField}
            className="mt-2 text-xs"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Third Row */}
        <div className="col-span-1 md:col-span-2">
          <EditField
            name="remarks"
            label="Remarks"
            type="textarea"
            value={formData.remarks}
            onChange={handleChange}
            className="text-[10px]"
          />
        </div>

        {/* Submit */}
        <div className="col-span-1 md:col-span-2">
          <UniversalButton type="submit">Submit →</UniversalButton>
        </div>
      </form>
    </div>
  );
}
