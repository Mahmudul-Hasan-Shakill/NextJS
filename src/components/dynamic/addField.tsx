"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { UiType } from "@/types/dynamic";
import { useAddDynamicField } from "@/hooks/dynamicHooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/selects";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  initialTable?: string; // optional starting value
  className?: string;
  onSaved?: () => void;
};

const UI_TYPES: UiType[] = [
  "text",
  "number",
  "checkbox",
  "textarea",
  "datetime",
  "select",
];
const IDENT_PATTERN = "^[a-zA-Z_][a-zA-Z0-9_]*$";

export default function AddField({
  initialTable = "",
  className,
  onSaved,
}: Props) {
  const { addField, loading } = useAddDynamicField();

  const [tableName, setTableName] = useState(initialTable);
  const [fieldName, setFieldName] = useState("");
  const [label, setLabel] = useState("");
  const [helpText, setHelpText] = useState("");
  const [uiType, setUiType] = React.useState<string>("");
  const [required, setRequired] = useState(false);
  const [sortOrder, setSortOrder] = useState<number>(100);
  const [defaultValue, setDefaultValue] = useState<string>("");

  // select options
  const [optionLabel, setOptionLabel] = useState("");
  const [optionValue, setOptionValue] = useState("");
  const [options, setOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const canSubmit = useMemo(
    () => !!tableName.match(IDENT_PATTERN) && !!fieldName.match(IDENT_PATTERN),
    [tableName, fieldName]
  );

  const addOption = () => {
    if (!optionLabel || !optionValue) {
      toast.error("Provide both option label and value");
      return;
    }
    if (options.some((o) => o.value === optionValue)) {
      toast.error("Option value already exists");
      return;
    }
    setOptions((prev) => [...prev, { label: optionLabel, value: optionValue }]);
    setOptionLabel("");
    setOptionValue("");
  };

  const removeOption = (value: string) => {
    setOptions((prev) => prev.filter((o) => o.value !== value));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please fix validation errors");
      return;
    }
    try {
      const payload: any = {
        tableName,
        fieldName,
        uiType,
        label: label || fieldName,
        helpText,
        required,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 100,
      };
      if (defaultValue) payload.defaultValue = defaultValue;
      if (uiType === "select") payload.options = options;

      const res = await addField(payload);
      toast.success(res?.message || "Field saved");

      // reset field values, keep table name
      setFieldName("");
      setLabel("");
      setHelpText("");
      setRequired(false);
      setSortOrder(100);
      setDefaultValue("");
      setOptions([]);

      onSaved?.();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save field");
    }
  };

  useEffect(() => {
    // reset select options if uiType changes away from select
    if (uiType !== "select" && options.length) setOptions([]);
  }, [uiType]);

  return (
    <Card className={cn("w-full max-w-3xl", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-lg">Add Dynamic Field</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Table Name</Label>
              <Input
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="e.g. database_entity"
                pattern={IDENT_PATTERN}
                title="Only letters, numbers, underscores; must start with a letter/underscore"
                required
              />
            </div>

            <div>
              <Label>Field Name</Label>
              <Input
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="e.g. test"
                pattern={IDENT_PATTERN}
                title="Only letters, numbers, underscores; must start with a letter/underscore"
                required
              />
            </div>

            <div>
              <Label>Label</Label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Human label (defaults to field name)"
              />
            </div>

            <div>
              <Label>UI Type</Label>
              {/* <Select
                value={uiType}
                onValueChange={(v: UiType) => setUiType(v)}
              >
                <SelectTrigger className="w-full py-5">
                  <SelectValue placeholder="Choose type" />
                </SelectTrigger>
                <SelectContent>
                  {UI_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
              <Select
                value={uiType}
                onChange={(e) => setUiType(e.target.value)}
                options={UI_TYPES.map((t) => ({ label: t, value: t }))}
                placeholder="Choose type"
                name="uiType"
                className="py-5"
              />
            </div>

            <div>
              <Label>Sort Order</Label>
              <Input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Switch checked={required} onCheckedChange={setRequired} />
              <Label>Required</Label>
            </div>
          </div>

          <div>
            <Label>Help Text</Label>
            <Textarea
              value={helpText}
              onChange={(e) => setHelpText(e.target.value)}
              placeholder="Describe this field for users"
              rows={3}
            />
          </div>

          <div>
            <Label>Default Value</Label>
            <Input
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              placeholder="(optional)"
            />
          </div>

          {uiType === "select" && (
            <div className="space-y-3">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label>Option Label</Label>
                  <Input
                    value={optionLabel}
                    onChange={(e) => setOptionLabel(e.target.value)}
                    placeholder="staging"
                  />
                </div>
                <div className="flex-1">
                  <Label>Option Value</Label>
                  <Input
                    value={optionValue}
                    onChange={(e) => setOptionValue(e.target.value)}
                    placeholder="staging"
                  />
                </div>
                <Button type="button" variant="secondary" onClick={addOption}>
                  Add
                </Button>
              </div>
              {options.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {options.map((o) => (
                    <Badge key={o.value} variant="secondary" className="gap-2">
                      {o.label} ({o.value})
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => removeOption(o.value)}
                        aria-label="remove option"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading || !canSubmit}>
              {loading ? "Saving…" : "Save Field"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
