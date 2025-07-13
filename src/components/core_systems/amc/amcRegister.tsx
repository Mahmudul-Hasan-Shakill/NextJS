"use client";

import React, { useState } from "react";
import DataLoader from "../../loader/dataLoader";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useCreateAmc } from "@/hooks/core_systems/amc/useCreateAmc";
import { AmcReg } from "@/types/amc";
import { EditField } from "@/components/table/editFields";
import UniversalButton from "@/components/ui/universalButton";

export function AmcRegister() {
  const { createAmc, loading } = useCreateAmc();
  const userName = useUserDetails();

  const requiredFields: (keyof AmcReg)[] = [
    "item",
    "productName",
    "quantity",
    "eolOrEosl",
    "declaredEolOrEosl",
    "underAmc",
    "supportType",
    "amcStart",
    "amcEnd",
    "vendorName",
    "oem",
    "makeBy",
  ];

  const initialState: AmcReg = {
    item: "",
    productName: "",
    quantity: 0,
    eolOrEosl: false,
    declaredEolOrEosl: new Date(),
    underAmc: false,
    supportType: "",
    amcStart: new Date(),
    amcEnd: new Date(),
    warrantyStart: new Date(),
    warrantyEnd: new Date(),
    vendorName: "",
    oem: "",
    remarks: "",
    isActive: true,
    makeBy: userName,
    makeDate: undefined,
    editBy: "",
    editDate: undefined,
  };

  const [formData, setFormData] = useState<AmcReg>(initialState);

  const handleChange = (
    e: React.ChangeEvent<any> | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const missingFields = requiredFields.filter(
      (field) => formData[field] === undefined || formData[field] === ""
    );

    if (missingFields.length > 0) {
      toast.warning(
        `Please fill in all required fields: ${missingFields
          .map((f) => formatLabel(f))
          .join(", ")}`
      );
      return;
    }

    const payload: AmcReg = {
      ...formData,
      makeBy: userName,
      makeDate: new Date(),
    };

    console.log("AMC Payload:", payload);

    const success = await createAmc(payload);

    if (success) {
      setFormData(initialState);
    }
  };

  if (loading) return <DataLoader />;

  return (
    <div className="mx-auto w-full max-w-5xl bg-white p-6 rounded-lg shadow-md dark:bg-black text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register AMC
      </h2>
      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
      >
        {[
          { name: "item", label: "Item", type: "text" },
          { name: "productName", label: "Product Name", type: "text" },
          { name: "quantity", label: "Quantity", type: "number" },
          { name: "eolOrEosl", label: "EOL or EOSL", type: "boolean" },
          {
            name: "declaredEolOrEosl",
            label: "Declared EOL/EOSL",
            type: "date",
          },
          { name: "underAmc", label: "Under AMC", type: "boolean" },
          { name: "supportType", label: "Support Type", type: "text" },
          { name: "amcStart", label: "AMC Start Date", type: "date" },
          { name: "amcEnd", label: "AMC End Date", type: "date" },
          { name: "warrantyStart", label: "Warranty Start Date", type: "date" },
          { name: "warrantyEnd", label: "Warranty End Date", type: "date" },
          { name: "vendorName", label: "Vendor Name", type: "text" },
          { name: "oem", label: "OEM", type: "text" },
          { name: "remarks", label: "Remarks", type: "textarea" },
          { name: "isActive", label: "Is Active", type: "boolean" },
        ].map(({ name, label, type }) => (
          <EditField
            key={name}
            name={name}
            label={
              requiredFields.includes(name as keyof AmcReg) ? (
                <>
                  {label} <span className="text-red-500">*</span>
                </>
              ) : (
                label
              )
            }
            type={type}
            value={formData[name as keyof AmcReg]}
            onChange={handleChange}
            className="text-[10px]"
          />
        ))}
        <div className="col-span-1 md:col-span-2">
          <UniversalButton type="submit">Submit &rarr;</UniversalButton>
        </div>
      </form>
    </div>
  );
}

function formatLabel(field: string): string {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}
