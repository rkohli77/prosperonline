// components/ui/form-utils.ts
import * as React from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

type FormFieldContextValue = {
  name: string;
};

export const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

type FormItemContextValue = {
  id: string;
};

export const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

type UseFormFieldReturn = {
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
};

export function useFormField(): UseFormFieldReturn {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);

  if (!fieldContext) {
    throw new Error("useFormField must be used within a <FormField />");
  }

  const { name } = fieldContext;
  const { id } = itemContext;

  return {
    error: undefined, // will be set by react-hook-form's state later
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-description`,
    formMessageId: `${id}-form-message`,
  };
}