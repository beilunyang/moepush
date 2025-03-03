import { BaseChannel, ChannelConfig, SendMessageOptions } from "./base"

interface DiscordMessage {
  content?: string
  embeds?: Array<{
    title?: string
    description?: string
    color?: number
    fields?: Array<{
      name: string
      value: string
      inline?: boolean
    }>
    author?: {
      name: string
      url?: string
      icon_url?: string
    }
    footer?: {
      text: string
      icon_url?: string
    }
    image?: {
      url: string
    }
    thumbnail?: {
      url: string
    }
    timestamp?: string
  }>
}

export class DiscordChannel extends BaseChannel {
  readonly config: ChannelConfig = {
    type: "discord",
    label: "Discord Webhook",
    templates: [
      {
        type: "text",
        name: "文本消息",
        description: "发送简单的文本消息",
        fields: [
          { key: "content", description: "消息内容", required: true, component: 'textarea' },
        ]
      },
      {
        type: "embed",
        name: "嵌入消息",
        description: "发送富文本嵌入消息",
        fields: [
          { key: "embeds[0].title", description: "标题", required: true },
          { key: "embeds[0].description", description: "描述内容", required: true, component: 'textarea' },
          { key: "embeds[0].color", description: "颜色代码 (十进制整数)", defaultValue: "3447003" },
          { key: "content", description: "附加文本内容", component: 'textarea' },
        ]
      }
    ]
  }

  async sendMessage(
    message: DiscordMessage,
    options: SendMessageOptions
  ): Promise<Response> {
    const { webhook } = options
    
    if (!webhook) {
      throw new Error("缺少 Discord Webhook 地址")
    }
    
    console.log('sendDiscordMessage message:', message)

    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Discord 消息推送失败: ${text}`)
    }

    return response
  }
} 