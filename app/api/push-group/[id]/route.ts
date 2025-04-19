import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { fetchWithTimeout } from '@/lib/utils'
import { endpointGroups, endpointToGroup } from '@/lib/db/schema/endpoint-groups'
import { eq } from 'drizzle-orm'

export const runtime = 'edge'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  try {
    const db = await getDb()

    const group = await db.query.endpointGroups.findFirst({
      where: eq(endpointGroups.id, id),
    })

    if (!group) {
      return NextResponse.json(
        { error: '接口组不存在' },
        { status: 404 }
      )
    }

    if (group.status === "inactive") {
      return NextResponse.json(
        { error: '接口组已禁用' },
        { status: 403 }
      )
    }

    const relations = await db.query.endpointToGroup.findMany({
      where: eq(endpointToGroup.groupId, id),
      with: {
        endpoint: true
      }
    })

    const groupEndpoints = relations.map((r: any) => r.endpoint)

    if (groupEndpoints.length === 0) {
      return NextResponse.json(
        { error: '接口组不包含任何接口' },
        { status: 400 }
      )
    }

    const results = await Promise.allSettled(
      groupEndpoints.map(async (endpoint: any) => {
        const origin = new URL(request.url).origin
        const url = `${origin}/api/push/${endpoint.id}`

        const response = await fetchWithTimeout(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          timeout: 10000 // 10秒超时
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`接口 ${endpoint.name} 返回错误: ${errorText}`)
        }

        return {
          endpointId: endpoint.id,
          name: endpoint.name,
          success: true
        }
      })
    )

    const successCount = results.filter((r: any) => r.status === 'fulfilled').length
    const failedCount = results.filter((r: any) => r.status === 'rejected').length

    return NextResponse.json({
      status: 'success',
      message: `接口组 ${group.name} 处理完成`,
      total: groupEndpoints.length,
      successCount: successCount,
      failedCount: failedCount,
      details: results.map((r: any, i: number) => ({
        endpoint: groupEndpoints[i].name,
        status: r.status === 'fulfilled' ? 'success' : 'failed',
        error: r.status === 'rejected' ? r.reason.message : undefined
      }))
    })

  } catch (error) {
    console.error('接口组处理错误:', error)
    return NextResponse.json(
      { error: '处理接口组请求时出错' },
      { status: 500 }
    )
  }
} 