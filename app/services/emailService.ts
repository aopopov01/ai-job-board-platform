import axios from 'axios'

interface ApplicationData {
  fullName: string
  email: string
  phone: string
  cv: File | null
  jobTitle: string
  companyName: string
}

interface EmailResponse {
  success: boolean
  message: string
}

interface ZapierMCPRequest {
  method: string
  params: {
    action: string
    data: Record<string, any>
  }
}

export class EmailService {
  private static readonly ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'aopopov01@gmail.com'
  private static readonly ZAPIER_MCP_URL = process.env.ZAPIER_MCP_API_URL || 'https://mcp.zapier.com/api/mcp/mcp'
  private static readonly AUTH_TOKEN = process.env.ZAPIER_MCP_AUTH_TOKEN

  // Test function to check API connectivity
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing Zapier MCP connection...')
      console.log('URL:', this.ZAPIER_MCP_URL)
      console.log('Has Token:', !!this.AUTH_TOKEN)
      console.log('Token Length:', this.AUTH_TOKEN?.length)
      
      // Try a simple tools/list request first to test authentication
      const testRequest = {
        method: 'tools/list',
        params: {
          action: 'test',
          data: {}
        }
      }
      
      const response = await this.callZapierMCP(testRequest)
      console.log('✅ Connection test successful:', response)
      return true
    } catch (error) {
      console.error('❌ Connection test failed:', error)
      return false
    }
  }
  
  private static async callZapierMCP(request: ZapierMCPRequest): Promise<any> {
    try {
      console.log('🔍 Zapier MCP Request:', {
        url: this.ZAPIER_MCP_URL,
        hasToken: !!this.AUTH_TOKEN,
        request: JSON.stringify(request, null, 2)
      })

      const response = await axios.post(this.ZAPIER_MCP_URL, request, {
        headers: {
          'Authorization': `Bearer ${this.AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      })
      
      console.log('✅ Zapier MCP Response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Zapier MCP API call failed:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      })
      throw error
    }
  }
  
  static async sendApplicationEmail(applicationData: ApplicationData): Promise<EmailResponse> {
    try {
      const emailContent = `
New Job Application Received

Position: ${applicationData.jobTitle}
Company: ${applicationData.companyName}

Applicant Details:
- Name: ${applicationData.fullName}
- Email: ${applicationData.email}
- Phone: ${applicationData.phone}
- CV: ${applicationData.cv?.name || 'No CV attached'}

Application submitted through TalentAIze platform.

Please review the application and contact the candidate if suitable.

Best regards,
TalentAIze Hiring System
      `.trim()

      // Try different request formats for Zapier MCP
      const mcpRequest: ZapierMCPRequest = {
        method: 'tools/call',
        params: {
          action: 'Gmail_Send_Email',
          data: {
            to: this.ADMIN_EMAIL,
            subject: `New Job Application: ${applicationData.jobTitle} at ${applicationData.companyName}`,
            body: emailContent
          }
        }
      }
      
      await this.callZapierMCP(mcpRequest)
      
      return {
        success: true,
        message: 'Application details sent to hiring team successfully'
      }
    } catch (error) {
      console.error('Failed to send application email:', error)
      return {
        success: false,
        message: 'Failed to send application details'
      }
    }
  }
  
  static async sendConfirmationEmail(applicationData: ApplicationData): Promise<EmailResponse> {
    try {
      const emailContent = `
Dear ${applicationData.fullName},

Thank you for applying for the ${applicationData.jobTitle} position at ${applicationData.companyName}!

We have successfully received your application and our hiring team will review it carefully. Here's what happens next:

✅ Application Received: Your application is now in our system
🔍 Review Process: Our team will evaluate your qualifications
📞 Next Steps: We'll contact you within 5-7 business days if your profile matches our requirements

Application Details:
- Position: ${applicationData.jobTitle}
- Company: ${applicationData.companyName}
- Submitted: ${new Date().toLocaleDateString()}

If you have any questions about your application or the role, please don't hesitate to reach out.

Best regards,
The ${applicationData.companyName} Hiring Team
Via TalentAIze Platform

---
This is an automated confirmation email. Please do not reply to this message.
      `.trim()

      const mcpRequest: ZapierMCPRequest = {
        method: 'tools/call',
        params: {
          action: 'Gmail_Send_Email',
          data: {
            to: applicationData.email,
            subject: `Application Confirmation: ${applicationData.jobTitle} at ${applicationData.companyName}`,
            body: emailContent
          }
        }
      }
      
      await this.callZapierMCP(mcpRequest)
      
      return {
        success: true,
        message: 'Confirmation email sent to applicant successfully'
      }
    } catch (error) {
      console.error('Failed to send confirmation email:', error)
      return {
        success: false,
        message: 'Failed to send confirmation email'
      }
    }
  }
  
  static async processApplication(applicationData: ApplicationData): Promise<{
    adminEmail: EmailResponse
    confirmationEmail: EmailResponse
  }> {
    // Test connection first
    console.log('🚀 Starting email processing...')
    const connectionTest = await this.testConnection()
    
    if (!connectionTest) {
      console.error('❌ Connection test failed, proceeding anyway...')
    }
    
    // Send both emails concurrently
    const [adminEmail, confirmationEmail] = await Promise.all([
      this.sendApplicationEmail(applicationData),
      this.sendConfirmationEmail(applicationData)
    ])
    
    return {
      adminEmail,
      confirmationEmail
    }
  }
}