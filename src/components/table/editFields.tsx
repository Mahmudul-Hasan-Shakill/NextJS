// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select } from "@/components/ui/selects";
// import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
// import { ReactNode } from "react";

// type Option = { label: string; value: any };

// type EditFieldProps = {
//   label: ReactNode;
//   type?: string;
//   value: any;
//   options?: Option[];
//   name: string;
//   onChange: (e: React.ChangeEvent<any>) => void;
//   className?: string;
// };

// export function EditField({
//   label,
//   type = "text",
//   value,
//   options = [],
//   name,
//   onChange,
//   className = "",
// }: EditFieldProps) {
//   switch (type) {
//     // case "select":
//     //   return (
//     //     <div className={className}>
//     //       <Label className={className}>{label}</Label>
//     //       <Select
//     //         value={String(value)}
//     //         onChange={(e) => onChange(e.target.value)}
//     //         className={className}
//     //       >
//     //         <option value="" disabled>
//     //           -- Select an option --
//     //         </option>
//     //         {options
//     //           .filter(
//     //             (opt) => opt.value !== undefined && opt.label !== undefined
//     //           )
//     //           .map((opt, index) => (
//     //             <option key={`${String(opt.value)}-${index}`} value={opt.value}>
//     //               {opt.label}
//     //             </option>
//     //           ))}
//     //       </Select>
//     //     </div>
//     //   );
//     case "select":
//       return (
//         <div className={className}>
//           <Label className={className}>{label}</Label>
//           <Select
//             name={name}
//             value={String(value)}
//             onChange={(e) => onChange(e)}
//             options={options}
//             placeholder="-- Select an option --"
//             className={className}
//           />
//         </div>
//       );

//     case "boolean":
//       return (
//         <div className={`flex items-center justify-between ${className}`}>
//           <Label className={className}>{label}</Label>
//           <Switch checked={!!value} onCheckedChange={onChange} />
//         </div>
//       );

//     case "textarea":
//       return (
//         <div className={className}>
//           <Label className={className}>{label}</Label>
//           <Textarea
//             value={value ?? ""}
//             onChange={(e) => onChange(e.target.value)}
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
//                   onChange={() => onChange(opt.value)}
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
//                     onChange(newValue);
//                   }}
//                 />
//                 {opt.label}
//               </label>
//             ))}
//           </div>
//         </div>
//       );

//     case "number":
//     case "date":
//     case "email":
//     case "text":
//     default:
//       return (
//         <div className={className}>
//           <Label className={className}>{label}</Label>
//           <Input
//             type={type}
//             value={value ?? ""}
//             onChange={(e) => onChange(e.target.value)}
//             className={className}
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
};

export function EditField({
  label,
  type = "text",
  value,
  options = [],
  name,
  onChange,
  className = "",
}: EditFieldProps) {
  switch (type) {
    case "select":
      return (
        <div className={className}>
          <Label className={className}>{label}</Label>
          <Select
            name={name}
            value={String(value)}
            onChange={onChange}
            options={options}
            placeholder="-- Select an option --"
            className={className}
          />
        </div>
      );

    case "boolean":
      return (
        <div className={`flex items-center justify-between ${className}`}>
          <Label className={className}>{label}</Label>
          <Switch
            checked={!!value}
            onCheckedChange={(checked) => {
              onChange({
                target: {
                  id: name,
                  value: checked,
                },
              });
            }}
          />
        </div>
      );

    case "textarea":
      return (
        <div className={className}>
          <Label className={className}>{label}</Label>
          <Textarea
            value={value ?? ""}
            name={name}
            onChange={(e) =>
              onChange({
                target: {
                  id: name,
                  value: e.target.value,
                },
              })
            }
            className={className}
          />
        </div>
      );

    case "radio":
      return (
        <div className={className}>
          <Label className={className}>{label}</Label>
          <div className="flex flex-col gap-1">
            {options.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() =>
                    onChange({
                      target: {
                        id: name,
                        value: opt.value,
                      },
                    })
                  }
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div className={className}>
          <Label className={className}>{label}</Label>
          <div className="flex flex-col gap-1">
            {options.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={Array.isArray(value) && value.includes(opt.value)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const newValue = Array.isArray(value) ? [...value] : [];
                    if (checked) {
                      newValue.push(opt.value);
                    } else {
                      const index = newValue.indexOf(opt.value);
                      if (index > -1) newValue.splice(index, 1);
                    }
                    onChange({
                      target: {
                        id: name,
                        value: newValue,
                      },
                    });
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      );

    case "number":
    case "date":
    case "email":
    case "text":
    default:
      return (
        <div className={className}>
          <Label className={className}>{label}</Label>
          <Input
            type={type}
            value={value ?? ""}
            name={name}
            onChange={(e) =>
              onChange({
                target: {
                  id: name,
                  value: e.target.value,
                },
              })
            }
            className={className}
          />
        </div>
      );
  }
}
