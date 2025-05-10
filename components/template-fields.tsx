"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, ChevronUp } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { MessageTemplate, TemplateField } from "@/lib/channels/base"
import { getNestedValue, setNestedValue } from "@/lib/utils"
import { FunctionSelector } from "@/components/function-selector"

interface TemplateFieldsProps {
  form: UseFormReturn<any>
  template: MessageTemplate
}

function FieldComponent({
  field,
  value,
  onChange
}: {
  field: TemplateField
  value: any
  onChange: (value: any) => void
}) {
  switch (field.component) {
    case 'textarea':
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || `请输入${field.description}`}
          className="resize-none"
        />
      )
    case 'checkbox':
      return (
        <Checkbox
          checked={value || false}
          onCheckedChange={onChange}
        />
      )
    case 'select':
      return (
        <Select
          value={value || field.options?.[0]?.value || ''}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || `请选择${field.description}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    case 'hidden':
      return null
    default:
      return (
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || `请输入${field.description}`}
        />
      )
  }
}

// 判断字段是否支持变量插入
function isVariableSupported(field: TemplateField) {
  // return field.component === 'input' || field.component === 'textarea' || !field.component
  return field.component === 'textarea' || !field.component
}

export function TemplateFields({ form, template }: TemplateFieldsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [prevType, setPrevType] = useState(template.type)
  const [fieldValues, setFieldValues] = useState<Record<string, any>>(() => {
    try {
      const rule = JSON.parse(form.getValues("rule") || "{}")
      const flattenedValues: Record<string, any> = {}
      template.fields.forEach(field => {
        if (field.component === 'hidden' && field.defaultValue !== undefined) {
          flattenedValues[field.key] = field.defaultValue
        } else {
          const value = getNestedValue(rule, field.key)
          if (value !== undefined) {
            flattenedValues[field.key] = value
          }
        }
      })
      return flattenedValues
    } catch {
      return {}
    }
  })

  const requiredFields = template.fields.filter(field => field.required)
  const optionalFields = template.fields.filter(field => !field.required && field.component !== 'hidden')

  useEffect(() => {
    if (prevType !== template.type) {
      const newFieldValues: Record<string, any> = {}
      template.fields.forEach(field => {
        if (fieldValues[field.key] !== undefined) {
          newFieldValues[field.key] = fieldValues[field.key]
        }
      })
      setFieldValues(newFieldValues)
      setPrevType(template.type)
    }
  }, [template.type, prevType, fieldValues, template.fields])

  useEffect(() => {
    const processedValues: Record<string, any> = {}
    Object.entries(fieldValues).forEach(([key, value]) => {
      if (key.includes('.')) {
        setNestedValue(processedValues, key, value)
      } else {
        processedValues[key] = value
      }
    })

    const jsonString = JSON.stringify(processedValues, null, 2)

    form.setValue("rule", jsonString)
  }, [fieldValues, form])

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        请填写以下字段：
      </div>

      <div className="space-y-4">
        {requiredFields.map((field) => (
          <FormItem key={field.key}>
            <FormLabel className="flex items-center justify-between">
              <div>
                <span className="[&_a]:text-blue-500 [&_a]:underline" dangerouslySetInnerHTML={{ __html: field.description || "" }} />
                <span className="text-red-500 ml-1">*</span>
              </div>
              {isVariableSupported(field) && (
                <FunctionSelector
                  onSelect={(value) => {
                    setFieldValues(prev => ({
                      ...prev,
                      [field.key]: (prev[field.key] || "") + value
                    }))
                  }}
                />
              )}
            </FormLabel>
            <FormControl>
              <FieldComponent
                field={field}
                value={fieldValues[field.key]}
                onChange={(value) => {
                  setFieldValues(prev => ({
                    ...prev,
                    [field.key]: value
                  }))
                }}
              />
            </FormControl>
          </FormItem>
        ))}
      </div>

      {optionalFields.length > 0 && (
        <div className="pt-2 border-t">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-between px-2 h-9 hover:bg-muted"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <span className="text-sm font-medium text-muted-foreground">
              高级设置
            </span>
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {showAdvanced && (
            <div className="space-y-4 mt-4">
              {optionalFields.map((field) => (
                <FormItem key={field.key} className={field.component === 'checkbox' ? 'flex items-center [&_button]:!mt-0 [&_button]:!ml-2' : ''}>
                  <FormLabel className="flex items-center justify-between">
                    <div>{field.description}</div>
                    {isVariableSupported(field) && (
                      <FunctionSelector
                        onSelect={(value) => {
                          setFieldValues(prev => ({
                            ...prev,
                            [field.key]: (prev[field.key] || "") + value
                          }))
                        }}
                      />
                    )}
                  </FormLabel>
                  <FormControl>
                    <FieldComponent
                      field={field}
                      value={fieldValues[field.key]}
                      onChange={(value) => {
                        setFieldValues(prev => ({
                          ...prev,
                          [field.key]: value
                        }))
                      }}
                    />
                  </FormControl>
                </FormItem>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 