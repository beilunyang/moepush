import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import type { ChannelFormData } from "@/lib/db/schema/channels"

interface DiscordFieldsProps {
  form: UseFormReturn<ChannelFormData>
}

export function DiscordFields({ form }: DiscordFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="webhook"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Webhook URL
              <span className="text-red-500 ml-1">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="https://discord.com/api/webhooks/..." 
                className="font-mono"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
} 