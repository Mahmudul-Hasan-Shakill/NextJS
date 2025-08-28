// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select } from "@/components/ui/selects";
// import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
// import { ReactNode } from "react";
// import { MultiSelect } from "../ui/multiSelect";

// type Option = { label: string; value: any };

// type SyntheticChangeEvent = {
//   target: {
//     id: string;
//     value: any;
//   };
// };

// type EditFieldProps = {
//   label: ReactNode;
//   type?: string;
//   value: any;
//   options?: Option[];
//   name: string;
//   onChange: (e: SyntheticChangeEvent | React.ChangeEvent<any>) => void;
//   className?: string;
//   checked?: boolean;
//   placeholder?: string;
//   required?: boolean;
// };

// export function EditField({
//   label,
//   type = "text",
//   value,
//   options = [],
//   name,
//   onChange,
//   className = "",
//   placeholder,
//   required,
// }: EditFieldProps) {
//   switch (type) {
//     case "select":
//       return (
//         <div className={className}>
//           <Label className={className}>{label}</Label>
//           <Select
//             name={name}
//             value={String(value)}
//             onChange={onChange}
//             options={options}
//             placeholder="-- Select an option --"
//             className={className}
//           />
//         </div>
//       );

//     case "multiselect":
//       return (
//         <div className={className}>
//           <Label className={className}>{label}</Label>
//           <MultiSelect
//             name={name}
//             values={Array.isArray(value) ? value : []}
//             onChange={onChange}
//             options={options}
//             placeholder="-- Select one or more options --"
//             className={className}
//           />
//         </div>
//       );

//     case "boolean":
//       return (
// <div className={`flex items-center justify-between ${className}`}>
//   <Label className={className}>{label}</Label>
//           <Switch
//             checked={!!value}
//             onCheckedChange={(checked) => {
//               onChange({
//                 target: {
//                   id: name,
//                   value: checked,
//                 },
//               });
//             }}
//           />
//         </div>
//       );

//     case "textarea":
//       return (
//         <div className={className}>
//           <Label className={className}>{label}</Label>
//           <Textarea
//             value={value ?? ""}
//             name={name}
//             onChange={(e) =>
//               onChange({
//                 target: {
//                   id: name,
//                   value: e.target.value,
//                 },
//               })
//             }
//             className={className}
//           />
//         </div>
//       );

//     case "radio":
//       return (
//         <div className={className}>
//           <Label className={className}>{label}</Label>
//           <div className="flex flex-col gap-1">
//             {options.map((opt) => (
//               <label key={opt.value} className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   name={name}
//                   value={opt.value}
//                   checked={value === opt.value}
//                   onChange={() =>
//                     onChange({
//                       target: {
//                         id: name,
//                         value: opt.value,
//                       },
//                     })
//                   }
//                 />
//                 {opt.label}
//               </label>
//             ))}
//           </div>
//         </div>
//       );

//     case "checkbox":
//       return (
//         <div className={className}>
//           <Label className={className}>{label}</Label>
//           <div className="flex flex-col gap-1">
//             {options.map((opt) => (
//               <label key={opt.value} className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   value={opt.value}
//                   checked={Array.isArray(value) && value.includes(opt.value)}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     const newValue = Array.isArray(value) ? [...value] : [];
//                     if (checked) {
//                       newValue.push(opt.value);
//                     } else {
//                       const index = newValue.indexOf(opt.value);
//                       if (index > -1) newValue.splice(index, 1);
//                     }
//                     onChange({
//                       target: {
//                         id: name,
//                         value: newValue,
//                       },
//                     });
//                   }}
//                 />
//                 {opt.label}
//               </label>
//             ))}
//           </div>
//         </div>
//       );

//     case "href":
//       return (
//         <div className={className}>
//           <Label className={className}>{label}</Label>
//           <a
//             href={value}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 underline break-all"
//           >
//             {value}
//           </a>
//         </div>
//       );

//     case "number":
//       return (
//         <div className={className}>
//           <Label className={className}>{label}</Label>
//           <Input
//             type="number"
//             value={value ?? ""}
//             name={name}
//             onChange={(e) => {
//               const inputValue =
//                 e.target.value === "" ? undefined : Number(e.target.value);
//               onChange({
//                 target: {
//                   id: name,
//                   value: inputValue,
//                 },
//               });
//             }}
//             className={className}
//             placeholder={placeholder}
//           />
//         </div>
//       );

//     case "date":
//       const formattedDate =
//         value instanceof Date
//           ? value.toISOString().split("T")[0]
//           : typeof value === "string"
//           ? value.split("T")[0]
//           : "";

//       return (
//         <div className={className}>
//           <Label className={className}>{label}</Label>
//           <Input
//             type="date"
//             value={formattedDate}
//             name={name}
//             onChange={(e) =>
//               onChange({
//                 target: {
//                   id: name,
//                   value: e.target.value,
//                 },
//               })
//             }
//             className={className}
//             placeholder={placeholder}
//           />
//         </div>
//       );

//     case "email":
//       return (
//         <div className={className}>
//           <Label className={className}>{label}</Label>
//           <Input
//             type="email"
//             value={value ?? ""}
//             name={name}
//             onChange={(e) =>
//               onChange({
//                 target: {
//                   id: name,
//                   value: e.target.value,
//                 },
//               })
//             }
//             className={className}
//             placeholder={placeholder}
//           />
//         </div>
//       );

//     case "text":
//       return (
//         <div className={className}>
//           <Label className={className}>{label}</Label>
//           <Input
//             type="text"
//             value={value ?? ""}
//             name={name}
//             onChange={(e) =>
//               onChange({
//                 target: {
//                   id: name,
//                   value: e.target.value,
//                 },
//               })
//             }
//             className={className}
//             placeholder={placeholder}
//             required={required}
//           />
//         </div>
//       );

//     default:
//       return (
//         <div className={className}>
//           <Label className={className}>{label}</Label>
//           <Input
//             type="text"
//             value={value ?? ""}
//             name={name}
//             onChange={(e) =>
//               onChange({
//                 target: {
//                   id: name,
//                   value: e.target.value,
//                 },
//               })
//             }
//             className={className}
//             placeholder={placeholder}
//           />
//         </div>
//       );
//   }
// }

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select } from "@/components/ui/selects";
// import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
// import { ReactNode } from "react";
// import { MultiSelect } from "../ui/multiSelect";

// type Option = { label: string; value: any };

// type SyntheticChangeEvent = {
//   target: {
//     id: string;
//     value: any;
//   };
// };

// type EditFieldProps = {
//   label: ReactNode;
//   type?: string;
//   value: any;
//   options?: Option[];
//   name: string;
//   onChange: (e: SyntheticChangeEvent | React.ChangeEvent<any>) => void;
//   className?: string;
//   placeholder?: string;
//   required?: boolean;
// };

// export function EditField({
//   label,
//   type = "text",
//   value,
//   options = [],
//   name,
//   onChange,
//   className = "",
//   placeholder,
//   required,
// }: EditFieldProps) {
//   const commonProps = {
//     name,
//     className,
//     placeholder,
//   };

//   const handleInputChange = (value: any) => {
//     onChange({ target: { id: name, value } });
//   };

//   const renderSelect = () => (
//     <Select
//       {...commonProps}
//       value={String(value)}
//       onChange={onChange}
//       options={options}
//       placeholder="-- Select an option --"
//     />
//   );

//   const renderMultiSelect = () => (
//     <MultiSelect
//       {...commonProps}
//       values={Array.isArray(value) ? value : []}
//       onChange={onChange}
//       options={options}
//       placeholder="-- Select one or more options --"
//     />
//   );

//   const renderBoolean = () => (
//     <div className={`flex items-center justify-between ${className}`}>
//       <Label className={className}>{label}</Label>
//       <Switch
//         checked={!!value}
//         onCheckedChange={(checked) => handleInputChange(checked)}
//       />
//     </div>
//   );

//   const renderTextarea = () => (
//     <Textarea
//       {...commonProps}
//       value={value ?? ""}
//       onChange={(e) => handleInputChange(e.target.value)}
//     />
//   );

//   const renderRadio = () => (
//     <div className="flex flex-col gap-1">
//       {options.map((opt) => (
//         <label key={opt.value} className="flex items-center gap-2">
//           <input
//             type="radio"
//             name={name}
//             value={opt.value}
//             checked={value === opt.value}
//             onChange={() => handleInputChange(opt.value)}
//           />
//           {opt.label}
//         </label>
//       ))}
//     </div>
//   );

//   const renderCheckbox = () => {
//     const currentValues = Array.isArray(value) ? [...value] : [];

//     return (
//       <div className="flex flex-col gap-1">
//         {options.map((opt) => (
//           <label key={opt.value} className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               value={opt.value}
//               checked={currentValues.includes(opt.value)}
//               onChange={(e) => {
//                 const newValue = e.target.checked
//                   ? [...currentValues, opt.value]
//                   : currentValues.filter((v) => v !== opt.value);
//                 handleInputChange(newValue);
//               }}
//             />
//             {opt.label}
//           </label>
//         ))}
//       </div>
//     );
//   };

//   const renderHref = () => (
//     <a
//       href={value}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="text-blue-600 underline break-all"
//     >
//       {value}
//     </a>
//   );

//   const renderNumber = () => (
//     <Input
//       {...commonProps}
//       type="number"
//       value={value ?? ""}
//       onChange={(e) =>
//         handleInputChange(
//           e.target.value === "" ? undefined : Number(e.target.value)
//         )
//       }
//     />
//   );

//   const renderDate = () => {
//     const formattedDate =
//       value instanceof Date
//         ? value.toISOString().split("T")[0]
//         : typeof value === "string"
//         ? value.split("T")[0]
//         : "";

//     return (
//       <Input
//         {...commonProps}
//         type="date"
//         value={formattedDate}
//         onChange={(e) => handleInputChange(e.target.value)}
//       />
//     );
//   };

//   const renderEmail = () => (
//     <Input
//       {...commonProps}
//       type="email"
//       value={value ?? ""}
//       onChange={(e) => handleInputChange(e.target.value)}
//     />
//   );

//   const renderText = () => (
//     <Input
//       {...commonProps}
//       type="text"
//       value={value ?? ""}
//       onChange={(e) => handleInputChange(e.target.value)}
//       required={required}
//     />
//   );

//   const renderDefault = () => renderText();

//   const fieldComponents = {
//     select: renderSelect,
//     multiselect: renderMultiSelect,
//     boolean: renderBoolean,
//     textarea: renderTextarea,
//     radio: renderRadio,
//     checkbox: renderCheckbox,
//     href: renderHref,
//     number: renderNumber,
//     date: renderDate,
//     email: renderEmail,
//     text: renderText,
//     default: renderDefault,
//   };

//   const renderField =
//     fieldComponents[type as keyof typeof fieldComponents] ||
//     fieldComponents.default;

//   return (
//     <div className={className}>
//       <Label className={className}>{label}</Label>
//       {renderField()}
//     </div>
//   );
// }

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select } from "@/components/ui/selects";
// import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
// import { ReactNode } from "react";
// import { MultiSelect } from "../ui/multiSelect";

// type Option = { label: string; value: any };

// type SyntheticChangeEvent = {
//   target: {
//     id: string;
//     value: any;
//   };
// };

// type EditFieldProps = {
//   label: ReactNode;
//   type?: string;
//   value: any;
//   options?: Option[];
//   name: string;
//   onChange: (e: SyntheticChangeEvent | React.ChangeEvent<any>) => void;
//   className?: string;
//   placeholder?: string;
//   required?: boolean;
// };

// export function EditField({
//   label,
//   type = "text",
//   value,
//   options = [],
//   name,
//   onChange,
//   className = "",
//   placeholder,
//   required,
// }: EditFieldProps) {
//   const commonProps = {
//     name,
//     className,
//     placeholder,
//   };

//   const handleInputChange = (value: any) => {
//     onChange({ target: { id: name, value } });
//   };

//   const renderSelect = () => (
//     <Select
//       {...commonProps}
//       value={String(value)}
//       onChange={onChange}
//       options={options}
//       placeholder="-- Select an option --"
//     />
//   );

//   const renderMultiSelect = () => (
//     <MultiSelect
//       {...commonProps}
//       values={Array.isArray(value) ? value : []}
//       onChange={onChange}
//       options={options}
//       placeholder="-- Select one or more options --"
//     />
//   );

//   // 🔧 Changed: only return the control, no Label or wrapper here
//   const renderBoolean = () => (
//     <Switch
//       checked={!!value}
//       onCheckedChange={(checked) => handleInputChange(checked)}
//     />
//   );

//   const renderTextarea = () => (
//     <Textarea
//       {...commonProps}
//       value={value ?? ""}
//       onChange={(e) => handleInputChange(e.target.value)}
//     />
//   );

//   const renderRadio = () => (
//     <div className="flex flex-col gap-1">
//       {options.map((opt) => (
//         <label key={opt.value} className="flex items-center gap-2">
//           <input
//             type="radio"
//             name={name}
//             value={opt.value}
//             checked={value === opt.value}
//             onChange={() => handleInputChange(opt.value)}
//           />
//           {opt.label}
//         </label>
//       ))}
//     </div>
//   );

//   const renderCheckbox = () => {
//     const currentValues = Array.isArray(value) ? [...value] : [];
//     return (
//       <div className="flex flex-col gap-1">
//         {options.map((opt) => (
//           <label key={opt.value} className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               value={opt.value}
//               checked={currentValues.includes(opt.value)}
//               onChange={(e) => {
//                 const newValue = e.target.checked
//                   ? [...currentValues, opt.value]
//                   : currentValues.filter((v) => v !== opt.value);
//                 handleInputChange(newValue);
//               }}
//             />
//             {opt.label}
//           </label>
//         ))}
//       </div>
//     );
//   };

//   const renderHref = () => (
//     <a
//       href={value}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="text-blue-600 underline break-all"
//     >
//       {value}
//     </a>
//   );

//   const renderNumber = () => (
//     <Input
//       {...commonProps}
//       type="number"
//       value={value ?? ""}
//       onChange={(e) =>
//         handleInputChange(
//           e.target.value === "" ? undefined : Number(e.target.value)
//         )
//       }
//     />
//   );

//   const renderDate = () => {
//     const formattedDate =
//       value instanceof Date
//         ? value.toISOString().split("T")[0]
//         : typeof value === "string"
//         ? value.split("T")[0]
//         : "";

//     return (
//       <Input
//         {...commonProps}
//         type="date"
//         value={formattedDate}
//         onChange={(e) => handleInputChange(e.target.value)}
//       />
//     );
//   };

//   const renderEmail = () => (
//     <Input
//       {...commonProps}
//       type="email"
//       value={value ?? ""}
//       onChange={(e) => handleInputChange(e.target.value)}
//     />
//   );

//   const renderText = () => (
//     <Input
//       {...commonProps}
//       type="text"
//       value={value ?? ""}
//       onChange={(e) => handleInputChange(e.target.value)}
//       required={required}
//     />
//   );

//   const fieldComponents = {
//     select: renderSelect,
//     multiselect: renderMultiSelect,
//     boolean: renderBoolean,
//     textarea: renderTextarea,
//     radio: renderRadio,
//     checkbox: renderCheckbox,
//     href: renderHref,
//     number: renderNumber,
//     date: renderDate,
//     email: renderEmail,
//     text: renderText,
//     default: renderText,
//   };

//   const renderField =
//     fieldComponents[type as keyof typeof fieldComponents] ||
//     fieldComponents.default;

//   // 🔧 Changed: wrapper applies boolean layout classes conditionally
//   const wrapperLayout =
//     type === "boolean" ? "flex items-center justify-between" : "";

//   return (
//     <div className={`${wrapperLayout} ${className}`}>
//       <Label className={className}>{label}</Label>
//       {renderField()}
//     </div>
//   );
// }

// // components/table/editFields.tsx
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select } from "@/components/ui/selects";
// import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
// import { ReactNode } from "react";
// import { MultiSelect } from "../ui/multiSelect";

// type Option = { label: string; value: any };

// type SyntheticChangeEvent = {
//   target: {
//     id: string;
//     value: any;
//   };
// };

// type EditFieldProps = {
//   label: ReactNode;
//   type?:
//     | "text"
//     | "select"
//     | "multiselect"
//     | "boolean"
//     | "number"
//     | "date"
//     | "time"
//     | "email"
//     | "textarea"
//     | "radio"
//     | "checkbox"
//     | "href";
//   value: any;
//   options?: Option[];
//   name: string;
//   onChange: (e: SyntheticChangeEvent | React.ChangeEvent<any>) => void;
//   className?: string;
//   placeholder?: string;
//   required?: boolean;
// };

// export function EditField({
//   label,
//   type = "text",
//   value,
//   options = [],
//   name,
//   onChange,
//   className = "",
//   placeholder,
//   required,
// }: EditFieldProps) {
//   const commonProps = {
//     name,
//     className,
//     placeholder,
//   };

//   const handleInputChange = (value: any) => {
//     onChange({ target: { id: name, value } });
//   };

//   const renderSelect = () => (
//     <Select
//       {...commonProps}
//       value={String(value)}
//       onChange={onChange}
//       options={options}
//       placeholder="-- Select an option --"
//     />
//   );

//   const renderMultiSelect = () => (
//     <MultiSelect
//       {...commonProps}
//       values={Array.isArray(value) ? value : []}
//       onChange={onChange}
//       options={options}
//       placeholder="-- Select one or more options --"
//     />
//   );

//   const renderBoolean = () => (
//     <Switch
//       checked={!!value}
//       onCheckedChange={(checked) => handleInputChange(checked)}
//     />
//   );

//   const renderTextarea = () => (
//     <Textarea
//       {...commonProps}
//       value={value ?? ""}
//       onChange={(e) => handleInputChange(e.target.value)}
//     />
//   );

//   const renderRadio = () => (
//     <div className="flex flex-col gap-1">
//       {options.map((opt) => (
//         <label key={opt.value} className="flex items-center gap-2">
//           <input
//             type="radio"
//             name={name}
//             value={opt.value}
//             checked={value === opt.value}
//             onChange={() => handleInputChange(opt.value)}
//           />
//           {opt.label}
//         </label>
//       ))}
//     </div>
//   );

//   const renderCheckbox = () => {
//     const currentValues = Array.isArray(value) ? [...value] : [];
//     return (
//       <div className="flex flex-col gap-1">
//         {options.map((opt) => (
//           <label key={opt.value} className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               value={opt.value}
//               checked={currentValues.includes(opt.value)}
//               onChange={(e) => {
//                 const newValue = e.target.checked
//                   ? [...currentValues, opt.value]
//                   : currentValues.filter((v) => v !== opt.value);
//                 handleInputChange(newValue);
//               }}
//             />
//             {opt.label}
//           </label>
//         ))}
//       </div>
//     );
//   };

//   const renderHref = () => (
//     <a
//       href={value}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="text-blue-600 underline break-all"
//     >
//       {value}
//     </a>
//   );

//   const renderNumber = () => (
//     <Input
//       {...commonProps}
//       type="number"
//       value={value ?? ""}
//       onChange={(e) =>
//         handleInputChange(
//           e.target.value === "" ? undefined : Number(e.target.value)
//         )
//       }
//     />
//   );

//   const renderDate = () => {
//     const formattedDate =
//       value instanceof Date
//         ? value.toISOString().split("T")[0]
//         : typeof value === "string"
//         ? value.split("T")[0]
//         : "";

//     return (
//       <Input
//         {...commonProps}
//         type="date"
//         value={formattedDate}
//         onChange={(e) => handleInputChange(e.target.value)}
//       />
//     );
//   };

//   // 👇 NEW: native time input, normalized to "HH:mm"
//   const renderTime = () => {
//     const pad = (n: number) => String(n).padStart(2, "0");

//     // Always normalize to "HH:mm:ss"
//     const toHHMMSS = (val: any): string => {
//       if (val instanceof Date) {
//         return `${pad(val.getHours())}:${pad(val.getMinutes())}:${pad(
//           val.getSeconds()
//         )}`;
//       }
//       if (typeof val === "string") {
//         // Accept "HH:mm" or "HH:mm:ss"
//         const m = val.match(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/);
//         if (m) return `${m[1]}:${m[2]}:${m[3] ?? "00"}`;
//         return "";
//       }
//       if (typeof val === "number" && Number.isFinite(val)) {
//         // Optional: support seconds-from-midnight
//         const sec = Math.floor(val % 60);
//         const minsTot = Math.floor((val - sec) / 60);
//         const min = minsTot % 60;
//         const hr = Math.floor(minsTot / 60) % 24;
//         return `${pad(hr)}:${pad(min)}:${pad(sec)}`;
//       }
//       return "";
//     };

//     const formatted = toHHMMSS(value);

//     return (
//       <Input
//         {...commonProps}
//         type="time"
//         step={1} // 👈 enables seconds
//         value={formatted}
//         onChange={(e) => {
//           // Browser may return "HH:mm" or "HH:mm:ss" → normalize
//           const normalized = toHHMMSS(e.target.value);
//           handleInputChange(normalized);
//         }}
//       />
//     );
//   };

//   const renderEmail = () => (
//     <Input
//       {...commonProps}
//       type="email"
//       value={value ?? ""}
//       onChange={(e) => handleInputChange(e.target.value)}
//     />
//   );

//   const renderText = () => (
//     <Input
//       {...commonProps}
//       type="text"
//       value={value ?? ""}
//       onChange={(e) => handleInputChange(e.target.value)}
//       required={required}
//     />
//   );

//   const fieldComponents = {
//     select: renderSelect,
//     multiselect: renderMultiSelect,
//     boolean: renderBoolean,
//     textarea: renderTextarea,
//     radio: renderRadio,
//     checkbox: renderCheckbox,
//     href: renderHref,
//     number: renderNumber,
//     date: renderDate,
//     time: renderTime, // 👈 NEW
//     email: renderEmail,
//     text: renderText,
//     default: renderText,
//   };

//   const renderField =
//     fieldComponents[type as keyof typeof fieldComponents] ||
//     fieldComponents.default;

//   const wrapperLayout =
//     type === "boolean" ? "flex items-center justify-between" : "";

//   return (
//     <div className={`${wrapperLayout} ${className}`}>
//       <Label className={className}>{label}</Label>
//       {renderField()}
//     </div>
//   );
// }

// components/table/editFields.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/selects";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { JSX, ReactNode } from "react";
import { MultiSelect } from "../ui/multiSelect";

type Option = { label: string; value: any };

type SyntheticChangeEvent = {
  target: {
    id: string;
    value: any;
  };
};

// Centralize the allowed types here
type EditFieldType =
  | "text"
  | "select"
  | "multiselect"
  | "boolean"
  | "number"
  | "date"
  | "time"
  | "email"
  | "textarea"
  | "radio"
  | "checkbox"
  | "href";

const ALLOWED_TYPES = new Set<EditFieldType>([
  "text",
  "select",
  "multiselect",
  "boolean",
  "number",
  "date",
  "time",
  "email",
  "textarea",
  "radio",
  "checkbox",
  "href",
]);

type EditFieldProps = {
  label: ReactNode;
  /**
   * Accept BOTH the strict union AND any string from callers.
   * We'll normalize unknown values safely to "text".
   */
  type?: EditFieldType | string;
  value: any;
  options?: Option[];
  name: string;
  onChange: (e: SyntheticChangeEvent | React.ChangeEvent<any>) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
};

export function EditField({
  label,
  type = "text",
  value,
  options = [],
  name,
  onChange,
  className = "",
  placeholder,
  required,
}: EditFieldProps) {
  const commonProps = {
    name,
    className,
    placeholder,
  };

  // ---- Normalization so callers can pass arbitrary strings safely
  const normalizeType = (t: string | undefined): EditFieldType => {
    const tLower = (t ?? "text").toLowerCase();

    // Map common synonyms to supported inputs
    if (tLower === "datetime" || tLower === "datetime-local") return "time";

    // If it's an allowed literal, use it; otherwise fallback to "text"
    return ALLOWED_TYPES.has(tLower as EditFieldType)
      ? (tLower as EditFieldType)
      : "text";
  };

  const resolvedType = normalizeType(type);

  const handleInputChange = (val: any) => {
    onChange({ target: { id: name, value: val } });
  };

  const renderSelect = () => (
    <Select
      {...commonProps}
      value={String(value)}
      onChange={onChange}
      options={options}
      placeholder="-- Select an option --"
    />
  );

  const renderMultiSelect = () => (
    <MultiSelect
      {...commonProps}
      values={Array.isArray(value) ? value : []}
      onChange={onChange}
      options={options}
      placeholder="-- Select one or more options --"
    />
  );

  const renderBoolean = () => (
    <Switch
      checked={!!value}
      onCheckedChange={(checked) => handleInputChange(checked)}
    />
  );

  const renderTextarea = () => (
    <Textarea
      {...commonProps}
      value={value ?? ""}
      onChange={(e) => handleInputChange(e.target.value)}
    />
  );

  const renderRadio = () => (
    <div className="flex flex-col gap-1">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => handleInputChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );

  const renderCheckbox = () => {
    const currentValues = Array.isArray(value) ? [...value] : [];
    return (
      <div className="flex flex-col gap-1">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2">
            <input
              type="checkbox"
              value={opt.value}
              checked={currentValues.includes(opt.value)}
              onChange={(e) => {
                const newValue = e.target.checked
                  ? [...currentValues, opt.value]
                  : currentValues.filter((v) => v !== opt.value);
                handleInputChange(newValue);
              }}
            />
            {opt.label}
          </label>
        ))}
      </div>
    );
  };

  const renderHref = () => (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline break-all"
    >
      {value}
    </a>
  );

  const renderNumber = () => (
    <Input
      {...commonProps}
      type="number"
      value={value ?? ""}
      onChange={(e) =>
        handleInputChange(
          e.target.value === "" ? undefined : Number(e.target.value)
        )
      }
    />
  );

  const renderDate = () => {
    const formattedDate =
      value instanceof Date
        ? value.toISOString().split("T")[0]
        : typeof value === "string"
        ? value.split("T")[0]
        : "";

    return (
      <Input
        {...commonProps}
        type="date"
        value={formattedDate}
        onChange={(e) => handleInputChange(e.target.value)}
      />
    );
  };

  // Native time input with seconds; normalized to "HH:mm:ss"
  const renderTime = () => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const toHHMMSS = (val: any): string => {
      if (val instanceof Date) {
        return `${pad(val.getHours())}:${pad(val.getMinutes())}:${pad(
          val.getSeconds()
        )}`;
      }
      if (typeof val === "string") {
        const m = val.match(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/);
        if (m) return `${m[1]}:${m[2]}:${m[3] ?? "00"}`;
        return "";
      }
      if (typeof val === "number" && Number.isFinite(val)) {
        const sec = Math.floor(val % 60);
        const minsTot = Math.floor((val - sec) / 60);
        const min = minsTot % 60;
        const hr = Math.floor(minsTot / 60) % 24;
        return `${pad(hr)}:${pad(min)}:${pad(sec)}`;
      }
      return "";
    };

    const formatted = toHHMMSS(value);

    return (
      <Input
        {...commonProps}
        type="time"
        step={1}
        value={formatted}
        onChange={(e) => handleInputChange(toHHMMSS(e.target.value))}
      />
    );
  };

  const renderEmail = () => (
    <Input
      {...commonProps}
      type="email"
      value={value ?? ""}
      onChange={(e) => handleInputChange(e.target.value)}
    />
  );

  const renderText = () => (
    <Input
      {...commonProps}
      type="text"
      value={value ?? ""}
      onChange={(e) => handleInputChange(e.target.value)}
      required={required}
    />
  );

  // Use a typed map; we already normalized to a valid key
  const fieldComponents: Record<EditFieldType, () => JSX.Element> = {
    select: renderSelect,
    multiselect: renderMultiSelect,
    boolean: renderBoolean,
    textarea: renderTextarea,
    radio: renderRadio,
    checkbox: renderCheckbox,
    href: renderHref,
    number: renderNumber,
    date: renderDate,
    time: renderTime,
    email: renderEmail,
    text: renderText,
  };

  const wrapperLayout =
    resolvedType === "boolean" ? "flex items-center justify-between" : "";

  return (
    <div className={`${wrapperLayout} ${className}`}>
      <Label className={className}>
        <span className="align-middle">{label}</span>
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {fieldComponents[resolvedType]()}
    </div>
  );
}
