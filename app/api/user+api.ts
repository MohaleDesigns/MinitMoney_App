import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '../../prisma/generated/client/edge'

export async function GET(request: Request) {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const users = await prisma.user.findMany()
  
  return new Response(JSON.stringify(users), { status: 200 })
}

export async function POST(request: Request) {
  const { email, fullName, password, balance } = await request.json()

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 })
  }
  if (!fullName) {
    return new Response(JSON.stringify({ error: 'Full name is required' }), { status: 400 })
  }
  if (!password) {
    return new Response(JSON.stringify({ error: 'Password is required' }), { status: 400 })
  }
  
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const user = await prisma.user.create({
    data: { 
        email,
        fullName,
        passwordHash: password,
        balance: balance || 0,
    },
  })

  return new Response(JSON.stringify(user), { status: 200 })
}