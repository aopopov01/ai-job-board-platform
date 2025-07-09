import React, { useEffect, useState, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { useAuthStore } from '@job-board/shared'
import { messageService } from '@job-board/database'

interface Message {
  id: string
  content: string
  sender_id: string
  recipient_id: string
  created_at: string
  is_read: boolean
  sender?: {
    first_name: string
    last_name: string
    profile_picture_url?: string
  }
  recipient?: {
    first_name: string
    last_name: string
    profile_picture_url?: string
  }
}

interface Conversation {
  user_id: string
  user_name: string
  profile_picture_url?: string
  last_message: string
  last_message_time: string
  unread_count: number
  job_title?: string
  application_id?: string
}

export default function MessagesScreen() {
  const { user, profile } = useAuthStore()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (!user) return

    const loadConversations = async () => {
      try {
        const { data, error } = await messageService.getConversations(user.id)
        if (error) throw error

        // Group messages by conversation
        const conversationMap = new Map<string, Conversation>()
        
        data?.forEach((message: any) => {
          const otherUserId = message.sender_id === user.id ? message.recipient_id : message.sender_id
          const otherUser = message.sender_id === user.id ? message.recipient : message.sender
          
          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, {
              user_id: otherUserId,
              user_name: `${otherUser.first_name} ${otherUser.last_name}`,
              profile_picture_url: otherUser.profile_picture_url,
              last_message: message.content,
              last_message_time: message.created_at,
              unread_count: 0,
              job_title: message.jobs?.title,
              application_id: message.applications?.id
            })
          }
          
          // Count unread messages
          if (message.recipient_id === user.id && !message.is_read) {
            conversationMap.get(otherUserId)!.unread_count++
          }
        })

        setConversations(Array.from(conversationMap.values()))
      } catch (error: any) {
        setError(error.message || 'Failed to load conversations')
      } finally {
        setLoading(false)
      }
    }

    loadConversations()

    // Subscribe to new messages
    const subscription = messageService.subscribeToMessages(user.id, (payload) => {
      loadConversations() // Refresh conversations when new message arrives
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const loadMessages = async (otherUserId: string) => {
    if (!user) return

    try {
      const { data, error } = await messageService.getConversation(user.id, otherUserId)
      if (error) throw error

      setMessages(data || [])
      
      // Mark messages as read
      await messageService.markConversationAsRead(user.id, otherUserId)
      
      // Update conversation unread count
      setConversations(prev => 
        prev.map(conv => 
          conv.user_id === otherUserId 
            ? { ...conv, unread_count: 0 }
            : conv
        )
      )

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    } catch (error: any) {
      setError(error.message || 'Failed to load messages')
    }
  }

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return

    setSending(true)
    try {
      const { data, error } = await messageService.create({
        sender_id: user.id,
        recipient_id: selectedConversation,
        content: newMessage.trim(),
        conversation_id: `${[user.id, selectedConversation].sort().join('-')}`,
        is_read: false
      })

      if (error) throw error

      setMessages(prev => [...prev, data])
      setNewMessage('')
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const selectedConversationData = conversations.find(conv => conv.user_id === selectedConversation)

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></View>
        <Text className="mt-4 text-gray-600">Loading messages...</Text>
      </View>
    )
  }

  if (selectedConversation && selectedConversationData) {
    return (
      <KeyboardAvoidingView 
        className="flex-1 bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className="bg-white px-4 py-4 shadow-sm border-b border-gray-200">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setSelectedConversation(null)}
              className="mr-3 p-2"
            >
              <Text className="text-blue-600 text-lg">← Back</Text>
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                {selectedConversationData.user_name}
              </Text>
              {selectedConversationData.job_title && (
                <Text className="text-sm text-gray-600">
                  Re: {selectedConversationData.job_title}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 ${message.sender_id === user?.id ? 'items-end' : 'items-start'}`}
            >
              <View
                className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                  message.sender_id === user?.id
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`}
              >
                <Text className={`text-sm ${
                  message.sender_id === user?.id ? 'text-white' : 'text-gray-900'
                }`}>
                  {message.content}
                </Text>
                <Text className={`text-xs mt-1 ${
                  message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Message Input */}
        <View className="px-4 py-4 border-t border-gray-200 bg-white">
          <View className="flex-row items-center space-x-3">
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              multiline
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 max-h-24"
              editable={!sending}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={sending || !newMessage.trim()}
              className={`px-4 py-3 rounded-lg ${
                sending || !newMessage.trim() ? 'bg-gray-300' : 'bg-blue-600'
              }`}
            >
              <Text className="text-white font-medium">
                {sending ? 'Sending...' : 'Send'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-6 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">Messages</Text>
        <Text className="text-gray-600 mt-1">
          Communicate with {profile?.user_type === 'company' ? 'candidates' : 'recruiters'}
        </Text>
      </View>

      {error && (
        <View className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <Text className="text-red-600">{error}</Text>
        </View>
      )}

      {/* Conversations List */}
      <ScrollView className="flex-1 px-4 py-4">
        {conversations.length === 0 ? (
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-6xl mb-4">💬</Text>
            <Text className="text-lg font-medium text-gray-900 mb-2">No conversations yet</Text>
            <Text className="text-gray-500 text-center">
              Messages will appear here when you start communicating with{' '}
              {profile?.user_type === 'company' ? 'candidates' : 'recruiters'}.
            </Text>
          </View>
        ) : (
          <View className="space-y-3">
            {conversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.user_id}
                onPress={() => {
                  setSelectedConversation(conversation.user_id)
                  loadMessages(conversation.user_id)
                }}
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-medium text-gray-900">
                        {conversation.user_name}
                      </Text>
                      {conversation.unread_count > 0 && (
                        <View className="bg-blue-600 rounded-full w-5 h-5 items-center justify-center">
                          <Text className="text-white text-xs font-bold">
                            {conversation.unread_count}
                          </Text>
                        </View>
                      )}
                    </View>
                    {conversation.job_title && (
                      <Text className="text-xs text-gray-500 mb-1">
                        Re: {conversation.job_title}
                      </Text>
                    )}
                    <Text className="text-gray-600 text-sm" numberOfLines={2}>
                      {conversation.last_message}
                    </Text>
                    <Text className="text-xs text-gray-400 mt-1">
                      {new Date(conversation.last_message_time).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}