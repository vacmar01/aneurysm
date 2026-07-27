import { Info } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FormItem } from "@/lib/form"
import type { FormFieldId, FormState } from "@/lib/types"

type QuestionFieldProps = {
  item: FormItem
  value: FormState[FormFieldId]
  onSingleSelect: (itemId: FormFieldId, value: string) => void
  onMultipleSelect: (
    itemId: FormFieldId,
    optionValue: string,
    checked: boolean,
  ) => void
  onNumberInput: (itemId: FormFieldId, value: string) => void
}

export function QuestionField({
  item,
  value,
  onSingleSelect,
  onMultipleSelect,
  onNumberInput,
}: QuestionFieldProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Label className="text-lg font-bold">{item.label}</Label>
        {item.tooltip && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={`More information about ${item.label}`}
                className="cursor-pointer rounded-full text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Info className="size-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="leading-relaxed">
              {item.tooltip}
            </PopoverContent>
          </Popover>
        )}
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{item.description}</p>

      {item.type === "single" ? (
        <Select
          onValueChange={(selectedValue) => onSingleSelect(item.id, selectedValue)}
          value={(value as string) || ""}
        >
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {item.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : item.type === "number" ? (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step={item.id === "age" ? "1" : "0.1"}
            min={item.id === "age" ? "18" : "0"}
            placeholder={`Enter ${item.label.toLowerCase()}`}
            onChange={(event) => onNumberInput(item.id, event.target.value)}
            value={(value as number) ?? ""}
            className="w-full sm:w-[180px]"
          />
          {item.id === "maximumDiameter" && (
            <span className="text-sm text-muted-foreground">mm</span>
          )}
        </div>
      ) : (
        item.options?.map((option) => (
          <div key={`${item.id}-${option.value}`} className="flex items-center gap-2">
            <Checkbox
              id={`${item.id}-${option.value}`}
              onCheckedChange={(checked) =>
                onMultipleSelect(item.id, option.value, checked === true)
              }
              checked={(value as string[] | undefined)?.includes(option.value) || false}
            />
            <label htmlFor={`${item.id}-${option.value}`}>{option.label}</label>
          </div>
        ))
      )}
    </div>
  )
}
