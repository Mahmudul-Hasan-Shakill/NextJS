import { useState } from "react";
import { automationService } from "../../services/core_systems/automationService";
import { useUserDetails } from "../user/useUserDetails";

export function useAutomationFileParser() {
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const userName = useUserDetails(); 

  const parseFiles = async (files: FileList): Promise<any> => {
    setParsing(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    formData.append("makeBy", userName || "unknown");
    console.log("=========", userName);

    try {
      const data = await automationService.uploadParseAutomation(formData);
      setResult(data);
      console.log("-----------------", data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to parse automation files");
      return null;
    } finally {
      setParsing(false);
    }
  };

  return { parseFiles, parsing, result, error };
}
