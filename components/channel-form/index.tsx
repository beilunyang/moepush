import { DingtalkFields } from "./dingtalk-fields"
import { WecomAppFields } from "./wecom-app-fields"
import { TelegramFields } from "./telegram-fields"
import { WecomFields } from "./wecom-fields"
import { FeishuFields } from "./feishu-fields"
import { DiscordFields } from "./discord-fields"
import { CHANNEL_TYPES } from "@/lib/channels"
import { UseFormReturn } from "react-hook-form"
import type { ChannelFormData } from "@/lib/db/schema/channels"

interface ChannelFormFieldsProps {
    type: string
    form: UseFormReturn<ChannelFormData>
}

export function ChannelFormFields({ type, form }: ChannelFormFieldsProps) {
    // 根据渠道类型渲染不同的表单字段
    switch (type) {
        case CHANNEL_TYPES.DINGTALK:
            return <DingtalkFields form={form} />

        case CHANNEL_TYPES.WECOM:
            return <WecomFields form={form} />

        case CHANNEL_TYPES.WECOM_APP:
            return <WecomAppFields form={form} />

        case CHANNEL_TYPES.TELEGRAM:
            return <TelegramFields form={form} />
            
        case CHANNEL_TYPES.FEISHU:
            return <FeishuFields form={form} />
            
        case CHANNEL_TYPES.DISCORD:
            return <DiscordFields form={form} />

        default:
            return null
    }
} 
