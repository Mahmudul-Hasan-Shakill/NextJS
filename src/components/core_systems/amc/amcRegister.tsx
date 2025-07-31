"use client";

import React, { useState } from "react";
import DataLoader from "@/components/loader/dataLoader";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useCreateAmc } from "@/hooks/core_systems/amc/useAmc";
import { useDocumentUploader } from "@/hooks/utility/useDocument";
import { AmcCreatePayload } from "@/types/amc";
import { EditField } from "@/components/table/editFields";
import UniversalButton from "@/components/ui/universalButton";
import FileAttachment from "@/components/utility/fileAttachment";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScanSearch } from "lucide-react";

export function AmcRegister() {
  const { createAmc, loading: createLoading } = useCreateAmc();
  const { uploadDocument } = useDocumentUploader();
  const userName = useUserDetails();

  const requiredFields: (keyof AmcCreatePayload)[] = [
    "productName",
    "quantity",
    "status",
  ];

  const initialState: AmcCreatePayload = {
    productName: "",
    quantity: 1,
    status: "Active",
    isEolOrEosl: false,
    underAmc: false,
    makeBy: "",
  };

  const [formData, setFormData] = useState<AmcCreatePayload>(initialState);
  const [amcFiles, setAmcFiles] = useState<File[]>([]);

  const handleChange = (
    e:
      | React.ChangeEvent<any>
      | { target: { id: string; value: any; type?: string } }
  ) => {
    const { id, value, type } = e.target;
    const processedValue =
      type === "checkbox" || type === "boolean" ? Boolean(value) : value;
    setFormData((prev) => ({ ...prev, [id]: processedValue }));
  };

  const handleFilesSelected = (files: File[]) => {
    setAmcFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const missingFields = requiredFields.filter(
      (field) =>
        formData[field] === undefined ||
        formData[field] === "" ||
        formData[field] === null
    );

    if (missingFields.length > 0) {
      toast.warning(
        `Please fill in all required fields: ${missingFields.join(", ")}.`
      );
      return;
    }

    const payload: AmcCreatePayload = {
      ...formData,
      makeBy: userName,
    };

    const response = await createAmc(payload);

    if (response?.id && amcFiles.length > 0) {
      // for (const file of amcFiles) {
      //   await uploadDocument("amc", response.id, file);
      // }
      for (const file of amcFiles) {
        await uploadDocument("amc", response.id, file, {
          uploadedBy: userName,
          description: `${userName} uploaded the file.`,
        });
      }
    }

    if (response?.id) {
      toast.success("AMC and documents submitted successfully.");
      setFormData(initialState);
      setAmcFiles([]);
    }
  };

  if (createLoading) return <DataLoader />;

  return (
    <div className="mx-auto w-full max-w-5xl bg-white p-6 rounded-lg shadow-md dark:bg-black text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register AMC Record
      </h2>

      <div className="flex justify-end mb-4">
        <Link href="/core-systems/amc-update">
          <Button variant="default" size="sm" className="text-xs">
            <ScanSearch className="h-4 w-4 mr-2" /> View AMC List
          </Button>
        </Link>
      </div>

      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
      >
        <EditField
          name="productName"
          label="Product Name *"
          type="text"
          value={formData.productName}
          onChange={handleChange}
          className="text-[10px]"
        />
        <EditField
          name="quantity"
          label="Quantity *"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          className="text-[10px]"
        />
        <EditField
          name="serialNumber"
          label="Serial Number"
          type="text"
          value={formData.serialNumber}
          onChange={handleChange}
          className="text-[10px]"
        />
        <EditField
          name="assetTag"
          label="Asset Tag"
          type="text"
          value={formData.assetTag}
          onChange={handleChange}
          className="text-[10px]"
        />
        <EditField
          name="isEolOrEosl"
          label="Is EOL/EOSL?"
          type="boolean"
          value={formData.isEolOrEosl}
          onChange={handleChange}
          className="text-[10px]"
        />
        {formData.isEolOrEosl && (
          <EditField
            name="declaredEolOrEosl"
            label="Declared EOL/EOSL Date"
            type="date"
            value={formData.declaredEolOrEosl}
            onChange={handleChange}
            className="text-[10px]"
          />
        )}
        <EditField
          name="underAmc"
          label="Under AMC?"
          type="boolean"
          value={formData.underAmc}
          onChange={handleChange}
          className="text-[10px]"
        />
        {formData.underAmc && (
          <>
            <EditField
              name="supportType"
              label="Support Type"
              type="text"
              value={formData.supportType}
              onChange={handleChange}
              className="text-[10px]"
            />
            <EditField
              name="amcStart"
              label="AMC Start Date"
              type="date"
              value={formData.amcStart}
              onChange={handleChange}
              className="text-[10px]"
            />
            <EditField
              name="amcEnd"
              label="AMC End Date"
              type="date"
              value={formData.amcEnd}
              onChange={handleChange}
              className="text-[10px]"
            />
          </>
        )}
        <EditField
          name="warrantyStart"
          label="Warranty Start Date"
          type="date"
          value={formData.warrantyStart}
          onChange={handleChange}
          className="text-[10px]"
        />
        <EditField
          name="warrantyEnd"
          label="Warranty End Date"
          type="date"
          value={formData.warrantyEnd}
          onChange={handleChange}
          className="text-[10px]"
        />
        <EditField
          name="vendorName"
          label="Vendor Name"
          type="text"
          value={formData.vendorName}
          onChange={handleChange}
          className="text-[10px]"
        />
        <EditField
          name="oem"
          label="OEM"
          type="text"
          value={formData.oem}
          onChange={handleChange}
          className="text-[10px]"
        />
        <EditField
          name="purchaseDate"
          label="Purchase Date"
          type="date"
          value={formData.purchaseDate}
          onChange={handleChange}
          className="text-[10px]"
        />
        <EditField
          name="purchaseOrderNumber"
          label="Purchase Order Number"
          type="text"
          value={formData.purchaseOrderNumber}
          onChange={handleChange}
          className="text-[10px]"
        />
        <EditField
          name="location"
          label="Location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          className="text-[10px]"
        />
        <EditField
          name="status"
          label="Status *"
          type="text"
          value={formData.status}
          onChange={handleChange}
          className="text-[10px]"
        />
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

        <div className="col-span-1 md:col-span-2 text-[10px]">
          <FileAttachment onFilesSelected={handleFilesSelected} />
        </div>

        <div className="col-span-1 md:col-span-2">
          <UniversalButton type="submit">Create AMC Record →</UniversalButton>
        </div>
      </form>
    </div>
  );
}
