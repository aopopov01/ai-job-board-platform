import { NextRequest, NextResponse } from 'next/server'
import { messageService } from '@job-board/database'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const conversationId = searchParams.get('conversationId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (conversationId) {
      // Get messages for a specific conversation
      const { data, error } = await messageService.getByConversation(conversationId)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ messages: data || [] })
    } else {
      // Get all conversations for the user
      const { data, error } = await messageService.getConversations(userId)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ conversations: data || [] })
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      conversationId, 
      senderId, 
      recipientId, 
      content, 
      jobId, 
      applicationId,
      isAutomated 
    } = body
    
    if (!senderId || !recipientId || !content) {
      return NextResponse.json({ 
        error: 'Sender ID, recipient ID, and content are required' 
      }, { status: 400 })
    }

    const { data, error } = await messageService.create({
      conversation_id: conversationId,
      sender_id: senderId,
      recipient_id: recipientId,
      content,
      job_id: jobId || null,
      application_id: applicationId || null,
      is_automated: isAutomated || false,
      is_read: false
    })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: data }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageId, isRead } = body
    
    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    const { data, error } = await messageService.markAsRead(messageId, isRead)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}