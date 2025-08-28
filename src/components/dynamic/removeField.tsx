"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRemoveDynamicField } from "@/hooks/dynamicHooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  initialTable?: string;
  className?: string;
  onRemoved?: () => void;
};

const IDENT_PATTERN = "^[a-zA-Z_][a-zA-Z0-9_]*$";

export default function RemoveField({
  initialTable = "",
  className,
  onRemoved,
}: Props) {
  const { removeField, loading } = useRemoveDynamicField();
  const [tableName, setTableName] = useState(initialTable);
  const [fieldName, setFieldName] = useState("");

  const canSubmit = useMemo(
    () => !!tableName.match(IDENT_PATTERN) && !!fieldName.match(IDENT_PATTERN),
    [tableName, fieldName]
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please fix validation errors");
      return;
    }
    try {
      const res = await removeField({ tableName, fieldName });
      toast.success(res?.message || "Field removed");
      setFieldName("");
      onRemoved?.();
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove field");
    }
  };

  return (
    <Card className={cn("w-full max-w-3xl", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-lg">Remove Dynamic Field</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
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
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="destructive"
              disabled={loading || !canSubmit}
            >
              {loading ? "Removing…" : "Remove Field"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
