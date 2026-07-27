import { formItems } from "@/lib/form"
import type { FormFieldId, FormState } from "@/lib/types"

import { QuestionField } from "./question-field"

type QuestionnaireProps = {
  formState: FormState
  onSingleSelect: (itemId: FormFieldId, value: string) => void
  onMultipleSelect: (
    itemId: FormFieldId,
    optionValue: string,
    checked: boolean,
  ) => void
  onNumberInput: (itemId: FormFieldId, value: string) => void
}

export function Questionnaire({
  formState,
  onSingleSelect,
  onMultipleSelect,
  onNumberInput,
}: QuestionnaireProps) {
  return (
    <form
      className="min-w-0 flex-1 space-y-6 py-4"
      onSubmit={(event) => event.preventDefault()}
    >
      {formItems.map((item) => (
        <QuestionField
          key={item.id}
          item={item}
          value={formState[item.id]}
          onSingleSelect={onSingleSelect}
          onMultipleSelect={onMultipleSelect}
          onNumberInput={onNumberInput}
        />
      ))}
    </form>
  )
}
