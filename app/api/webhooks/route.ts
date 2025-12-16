import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const payload = await req.text()
  const headerList = await headers()

  const svix_id = headerList.get('svix-id')
  const svix_timestamp = headerList.get('svix-timestamp')
  const svix_signature = headerList.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET!)

  let event: any
  try {
    event = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    return new Response('Invalid signature', { status: 400 })
  }

  // 👇 Handle user.created
  if (event.type === 'user.created') {
    const user = event.data
    try { 
        await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.email_addresses[0].email_address,
        firstName: user.first_name ?? null,
        lastName: user.last_name ?? null,
        telephone: user.phone_numbers?.[0]?.phone_number ?? null,
      },
    })
        
    } catch (error) {
        console.error('Erorr:filed to store event in the database',error)
        return new Response('Erorr:filed to store event in the database', { status: 500 })
    }
   
  }

  return new Response('OK', { status: 200 })
}
