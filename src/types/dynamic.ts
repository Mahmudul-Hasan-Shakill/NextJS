// types/dynamic.ts

export type UiType =
  | "text"
  | "number"
  | "checkbox"
  | "textarea"
  | "datetime"
  | "select";

export interface DynamicField {
  id: number;
  tableName: string;
  fieldName: string;
  uiType: UiType;
  fieldType: string; // kept for future use; backend stores hint like "varchar"
  isActive: boolean;
  label: string;
  helpText: string;
  required: boolean;
  defaultValue?: string | null;
  sortOrder: number;
  options: Array<{ label: string; value: string }>;
  validators: Record<string, any>;
}

export interface UpsertFieldPayload {
  tableName: string; // e.g. "database_entity"
  fieldName: string; // e.g. "test"
  uiType?: UiType; // default "text"
  fieldType?: string; // default "varchar"
  isActive?: boolean; // default true
  label?: string; // default humanized fieldName
  helpText?: string;
  required?: boolean;
  defaultValue?: string;
  sortOrder?: number;
  options?: Array<{ label: string; value: string }>;
  validators?: Record<string, any>;
}

export interface RemoveFieldPayload {
  tableName: string;
  fieldName: string;
}

export interface ReorderItem {
  fieldName: string;
  sortOrder: number;
}
export interface ReorderFieldsPayload {
  tableName: string;
  items: ReorderItem[];
}

export interface UiSchemaField {
  name: string; // fieldName
  label: string;
  uiType: UiType;
  required: boolean;
  defaultValue: string | null;
  helpText: string;
  options: Array<{ label: string; value: string }>;
  validators: Record<string, any>;
}

export interface UiSchemaResponse {
  table: string;
  fields: UiSchemaField[];
}

export interface ApiSuccess<T = any> {
  isSuccessful: true;
  message: string;
  data: T;
}

export interface ApiError {
  isSuccessful: false;
  statusCode: number;
  message: string;
  errorType?: string;
  errors?: string[];
}
