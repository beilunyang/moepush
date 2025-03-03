import { BaseChannel } from "./base"
import { Channel as DBInferChannel } from "@/lib/db/schema/channels"
import { DingTalkChannel } from "./dingtalk"
import { WecomChannel } from "./wecom"
import { WecomAppChannel } from "./wecom-app"
import { TelegramChannel } from "./telegram"
import { FeishuChannel } from "./feishu"
import { DiscordChannel } from "./discord"

// 渠道类型常量
export const CHANNEL_TYPES = {
  DINGTALK: "dingtalk",
  WECOM: "wecom",
  WECOM_APP: "wecom_app",
  TELEGRAM: "telegram",
  FEISHU: "feishu",
  DISCORD: "discord",
} as const

export type ChannelType = typeof CHANNEL_TYPES[keyof typeof CHANNEL_TYPES]

// 注册所有渠道
const channels: Record<ChannelType, BaseChannel> = {
  [CHANNEL_TYPES.DINGTALK]: new DingTalkChannel(),
  [CHANNEL_TYPES.WECOM]: new WecomChannel(),
  [CHANNEL_TYPES.WECOM_APP]: new WecomAppChannel(),
  [CHANNEL_TYPES.TELEGRAM]: new TelegramChannel(),
  [CHANNEL_TYPES.FEISHU]: new FeishuChannel(),
  [CHANNEL_TYPES.DISCORD]: new DiscordChannel(),
}

// 获取所有渠道标签
export const CHANNEL_LABELS: Record<ChannelType, string> = Object.entries(channels).reduce(
  (acc, [type, channel]) => ({
    ...acc,
    [type]: channel.getLabel(),
  }),
  {} as Record<ChannelType, string>
)

// 获取所有渠道模板
export const CHANNEL_TEMPLATES = Object.entries(channels).reduce(
  (acc, [type, channel]) => ({
    ...acc,
    [type]: channel.getTemplates(),
  }),
  {} as Record<ChannelType, any[]>
)

// 获取指定渠道
export function getChannel(type: ChannelType): BaseChannel {
  return channels[type]
}

// 发送消息
export async function sendChannelMessage(
  type: ChannelType, 
  message: any, 
  options: any
): Promise<Response> {
  const channel = getChannel(type)
  return channel.sendMessage(message, options)
}

// 导出渠道接口
export type Channel = DBInferChannel & { type: ChannelType }