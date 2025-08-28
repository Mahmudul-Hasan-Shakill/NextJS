"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useDynamicSchema,
  useReorderDynamicFields,
} from "@/hooks/dynamicHooks";
import { ReorderFieldsPayload } from "@/types/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Row = { fieldName: string; label: string; uiType: string };

type Props = {
  className?: string;
  onSaved?: () => void;
};

const IDENT_PATTERN = "^[a-zA-Z_][a-zA-Z0-9_]*$";

export default function ReorderFields({ className, onSaved }: Props) {
  const [tableName, setTableName] = useState("");
  const valid = useMemo(() => !!tableName.match(IDENT_PATTERN), [tableName]);

  const { data, loading, error, load } = useDynamicSchema();
  const { reorder, loading: saving } = useReorderDynamicFields();

  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (data?.fields) {
      setRows(
        data.fields.map((f) => ({
          fieldName: f.name,
          label: f.label,
          uiType: f.uiType,
        }))
      );
    } else {
      setRows([]);
    }
  }, [data]);

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const copy = [...rows];
    const [item] = copy.splice(index, 1);
    copy.splice(target, 0, item);
    setRows(copy);
  };

  const payload: ReorderFieldsPayload | null = useMemo(() => {
    if (!valid || rows.length === 0) return null;
    return {
      tableName,
      items: rows.map((r, idx) => ({
        fieldName: r.fieldName,
        sortOrder: (idx + 1) * 10,
      })),
    };
  }, [valid, tableName, rows]);

  const onLoad = async () => {
    if (!valid) return toast.error("Provide a valid table name");
    const d = await load(tableName);
    if (d) toast.success("Fields loaded");
  };

  const onSave = async () => {
    if (!payload) return toast.error("Nothing to save");
    try {
      const res = await reorder(payload);
      toast.success(res?.message || "Order updated");
      await load(tableName); // explicit refresh
      onSaved?.();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save order");
    }
  };

  return (
    <Card className={cn("w-full max-w-3xl", className)}>
      <CardHeader className="flex items-center justify-between gap-2">
        <CardTitle className="text-lg">Reorder Fields</CardTitle>
        <div className="flex gap-2">
          <Input
            className="w-60"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="table_name_here"
            pattern={IDENT_PATTERN}
            title="Only letters, numbers, underscores; must start with a letter/underscore"
          />
          <Button variant="secondary" onClick={onLoad} disabled={loading}>
            {loading ? "Loading…" : "Load"}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : rows.length > 0 ? (
          <>
            <ul className="space-y-2">
              {rows.map((r, idx) => (
                <li
                  key={r.fieldName}
                  className="flex items-center justify-between gap-3 border rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge
                      variant="secondary"
                      className="shrink-0 w-8 justify-center"
                    >
                      {idx + 1}
                    </Badge>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{r.label}</div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-mono">{r.fieldName}</span> ·{" "}
                        <span>{r.uiType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => move(idx, +1)}
                      disabled={idx === rows.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center gap-3">
              <Button onClick={onSave} disabled={saving}>
                {saving ? "Saving…" : "Save Order"}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter a table name and click{" "}
            <span className="font-medium">Load</span> to fetch fields.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
