import { Operations } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { parseISO } from 'date-fns';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Operations | Operations[]>
) {
  const { userId, event, team, category, amount, operations } = req.body;
  const user = Number(req.query.user);

  switch (req.method) {
    case 'GET':
      await prisma.operations
        .findMany({
          where: { userId: user },
          include: {
            events: { include: { wallet: { include: { bookmaker: true } } } },
          },
        })
        .then((success) => res.status(200).json(success))
        .catch((error) => res.status(405).json(error));
      break;
    case 'POST':
      await prisma.operations
        .create({
          data: {
            userId,
            event: parseISO(event),
            team,
            category,
            amount,
            events: { create: operations },
          },
          include: {
            events: { include: { wallet: { include: { bookmaker: true } } } },
          },
        })
        .then((success) => {
          operations.forEach(async (operation: any) => {
            await prisma.wallets.update({
              where: { id: operation.walletId },
              data: {
                balance: { decrement: operation.input },
              },
            });
          });

          res.status(201).json(success);
        })
        .catch((error) => res.status(405).json(error));
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
