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
//         <div className={`flex items-center justify-between ${className}`}>
//           <Label className={className}>{label}</Label>
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/selects";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ReactNode } from "react";
import { MultiSelect } from "../ui/multiSelect";

type Option = { label: string; value: any };

type SyntheticChangeEvent = {
  target: {
    id: string;
    value: any;
  };
};

type EditFieldProps = {
  label: ReactNode;
  type?: string;
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

  const handleInputChange = (value: any) => {
    onChange({ target: { id: name, value } });
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

  const renderDefault = () => renderText();

  const fieldComponents = {
    select: renderSelect,
    multiselect: renderMultiSelect,
    boolean: renderBoolean,
    textarea: renderTextarea,
    radio: renderRadio,
    checkbox: renderCheckbox,
    href: renderHref,
    number: renderNumber,
    date: renderDate,
    email: renderEmail,
    text: renderText,
    default: renderDefault,
  };

  const renderField =
    fieldComponents[type as keyof typeof fieldComponents] ||
    fieldComponents.default;

  return (
    <div className={className}>
      <Label className={className}>{label}</Label>
      {renderField()}
    </div>
  );
}
