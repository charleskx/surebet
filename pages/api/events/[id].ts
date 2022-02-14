import { Events } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Events | null>
) {
  const id = Number(req.query.id);
  const { operationId, canceled, double } = req.body;

  switch (req.method) {
    case 'PUT':
    case 'PATCH':
      await prisma.operations
        .update({
          where: { id: operationId },
          data: { canceled, double, finished: true },
          include: { events: true },
        })
        .then((data) => {
          data.events.forEach(async (event) => {
            const win = event.id === id || double;

            await prisma.events.update({
              where: { id: event.id },
              data: { win },
            });

            if (win) {
              await prisma.wallets.update({
                where: { id: event.walletId },
                data: {
                  balance: {
                    increment: data.amount + event.profit,
                  },
                },
              });
            }
          });
        })
        .then(() => res.status(200).end('Updated!'))
        .catch((error) => res.status(405).json(error));
      break;
    default:
      res.setHeader('Allow', ['PUT', 'PATCH']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
