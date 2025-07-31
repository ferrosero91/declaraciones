// Configuración para diferentes servicios de WhatsApp gratuitos

export interface WhatsAppConfig {
  service: "twilio" | "meta" | "ultramsg" | "whatsapp-web-js"
  credentials: {
    accountSid?: string
    authToken?: string
    accessToken?: string
    phoneNumberId?: string
    apiKey?: string
    instanceId?: string
  }
}

// Servicio 1: Twilio (Sandbox gratuito)
export class TwilioWhatsAppService {
  private accountSid: string
  private authToken: string
  private fromNumber: string

  constructor(accountSid: string, authToken: string) {
    this.accountSid = accountSid
    this.authToken = authToken
    this.fromNumber = "whatsapp:+14155238886" // Número sandbox de Twilio
  }

  async sendMessage(to: string, message: string) {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`

    const body = new URLSearchParams({
      From: this.fromNumber,
      To: `whatsapp:+57${to}`,
      Body: message,
    })

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    })

    return await response.json()
  }
}

// Servicio 2: Meta WhatsApp Cloud API (Gratuito hasta 1000 mensajes/mes)
export class MetaWhatsAppService {
  private accessToken: string
  private phoneNumberId: string

  constructor(accessToken: string, phoneNumberId: string) {
    this.accessToken = accessToken
    this.phoneNumberId = phoneNumberId
  }

  async sendMessage(to: string, message: string) {
    const url = `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: `57${to}`,
        type: "text",
        text: {
          body: message,
        },
      }),
    })

    return await response.json()
  }
}

// Servicio 3: UltraMsg (Plan gratuito disponible)
export class UltraMsgService {
  private token: string
  private instanceId: string

  constructor(token: string, instanceId: string) {
    this.token = token
    this.instanceId = instanceId
  }

  async sendMessage(to: string, message: string) {
    const url = `https://api.ultramsg.com/${this.instanceId}/messages/chat`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: this.token,
        to: `57${to}`,
        body: message,
      }),
    })

    return await response.json()
  }
}

// Servicio 4: CallMeBot (Completamente gratuito pero limitado)
export class CallMeBotService {
  async sendMessage(to: string, message: string, apikey: string) {
    const encodedMessage = encodeURIComponent(message)
    const url = `https://api.callmebot.com/whatsapp.php?phone=57${to}&text=${encodedMessage}&apikey=${apikey}`

    const response = await fetch(url, {
      method: "GET",
    })

    return await response.text()
  }
}
