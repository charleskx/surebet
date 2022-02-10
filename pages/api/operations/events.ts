import { Events } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Events | null>
) {
  const { events, operationId } = req.body;

  switch (req.method) {
    case 'POST':
      try {
        const data = events.map((event: Events) => ({
          ...event,
          operationId: Number(operationId),
        }));

        await events.forEach(async (event: Events) => {
          await prisma.wallets.update({
            where: { id: event.walletId },
            data: {
              balance: { decrement: event.input },
            },
          });
        });

        await prisma.events.createMany({ data });

        res.status(201).end();
      } catch (error: any) {
        res.status(405).json(error);
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
