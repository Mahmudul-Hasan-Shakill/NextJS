"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useDynamicSchema } from "@/hooks/dynamicHooks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const IDENT_PATTERN = "^[a-zA-Z_][a-zA-Z0-9_]*$";

export default function SchemaViewer({ className }: Props) {
  const [tableName, setTableName] = useState("");
  const valid = useMemo(() => !!tableName.match(IDENT_PATTERN), [tableName]);
  const { data, loading, error, load } = useDynamicSchema();

  const triggerLoad = async () => {
    if (!valid) return toast.error("Provide a valid table name");
    const d = await load(tableName);
    if (d) toast.success("Schema loaded");
    else if (error) toast.error(error);
  };

  return (
    <Card className={cn("w-full max-w-3xl", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-lg">Dynamic Schema</CardTitle>
        <div className="flex gap-2">
          <Input
            className="w-60"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="table_name_here"
            pattern={IDENT_PATTERN}
            title="Only letters, numbers, underscores; must start with a letter/underscore"
          />
          <Button variant="secondary" onClick={triggerLoad} disabled={loading}>
            {loading ? "Loading…" : "Load"}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : data ? (
          <>
            <div className="mb-3 text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-medium">Table:</span>
              <span>{data.table}</span>
              <Badge variant="secondary">{data.fields.length} fields</Badge>
            </div>

            <ScrollArea className="h-80 rounded border">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b bg-muted/30">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Field</th>
                    <th className="py-2 px-3">Label</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Required</th>
                    <th className="py-2 px-3">Default</th>
                    <th className="py-2 px-3">Help</th>
                  </tr>
                </thead>
                <tbody>
                  {data.fields.map((f, idx) => (
                    <tr key={f.name} className="border-b last:border-0">
                      <td className="py-2 px-3 align-top">{idx + 1}</td>
                      <td className="py-2 px-3 align-top font-mono">
                        {f.name}
                      </td>
                      <td className="py-2 px-3 align-top">{f.label}</td>
                      <td className="py-2 px-3 align-top">
                        <Badge variant="outline">{f.uiType}</Badge>
                      </td>
                      <td className="py-2 px-3 align-top">
                        {f.required ? (
                          <Badge>required</Badge>
                        ) : (
                          <Badge variant="secondary">optional</Badge>
                        )}
                      </td>
                      <td className="py-2 px-3 align-top">
                        {f.defaultValue ?? (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-2 px-3 align-top max-w-[320px]">
                        <span className="line-clamp-2 text-muted-foreground">
                          {f.helpText || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {data.fields.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-6 text-center text-muted-foreground"
                      >
                        No active fields. Use “Add Dynamic Field” to create
                        some.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter a table name and click{" "}
            <span className="font-medium">Load</span>.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
