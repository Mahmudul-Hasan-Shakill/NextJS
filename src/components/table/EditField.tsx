import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/selects";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type Option = { label: string; value: any };

type EditFieldProps = {
  label: string;
  type?: string;
  value: any;
  options?: Option[];
  name: string;
  onChange: (value: any) => void;
};

export function EditField({
  label,
  type = "text",
  value,
  options = [],
  name,
  onChange,
}: EditFieldProps) {
  switch (type) {
    case "select":
      return (
        <div>
          <Label>{label}</Label>
          <Select
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="" disabled>
              -- Select an option --
            </option>
            {options
              .filter(
                (opt) => opt.value !== undefined && opt.label !== undefined
              )
              .map((opt, index) => (
                <option key={`${String(opt.value)}-${index}`} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </Select>
        </div>
      );

    case "boolean":
      return (
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          <Switch checked={!!value} onCheckedChange={onChange} />
        </div>
      );

    case "textarea":
      return (
        <div>
          <Label>{label}</Label>
          <Textarea
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "radio":
      return (
        <div>
          <Label>{label}</Label>
          <div className="flex flex-col gap-1">
            {options.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => onChange(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div>
          <Label>{label}</Label>
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
                    onChange(newValue);
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
        <div>
          <Label>{label}</Label>
          <Input
            type={type}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
  }
}
