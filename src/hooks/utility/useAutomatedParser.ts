// hooks/useAutomationFileParser.ts
import { useState } from "react";
import { automationService } from "../../services/core_systems/automationService";

export function useAutomationFileParser() {
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const parseFiles = async (files: FileList): Promise<boolean> => {
    setParsing(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const data = await automationService.uploadParseAutomation(formData);
      setResult(data);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to parse automation files");
      return false;
    } finally {
      setParsing(false);
    }
  };

  return { parseFiles, parsing, result, error };
}
