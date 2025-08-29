import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '../../prisma/generated/client/edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate())

  if (userId) {
    // Fetch transactions where user is either sender or receiver
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return new Response(JSON.stringify(transactions), { status: 200 });
  }

  // If no userId provided, return all transactions (for admin purposes)
  const transactions = await prisma.transaction.findMany({
    include: {
      sender: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      },
      receiver: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return new Response(JSON.stringify(transactions), { status: 200 });
}

export async function POST(request: Request) {
  const { amount, currency, type, status, description, fee, senderId, receiverId } = await request.json()

  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const transaction = await prisma.transaction.create({
    data: { 
        amount,
        currency,
        type,
        status,
        description,
        fee,
        senderId,
        receiverId,
    },
  })

  return new Response(JSON.stringify(transaction), { status: 200 })
}