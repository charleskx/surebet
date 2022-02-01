import { Operations } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Operations | null>
) {
  const id = Number(req.query.id);

  switch (req.method) {
    case 'GET':
      await prisma.operations
        .findUnique({
          where: { id },
          include: {
            events: { include: { wallet: { include: { bookmaker: true } } } },
          },
        })
        .then((success) => res.status(200).json(success))
        .catch((error) => res.status(405).json(error));
      break;
    case 'PUT':
    case 'PATCH':
      await prisma.operations
        .update({
          where: { id },
          data: { ...req.body },
          include: {
            events: { include: { wallet: { include: { bookmaker: true } } } },
          },
        })
        .then((success) => res.status(200).json(success))
        .catch((error) => res.status(405).json(error));
      break;
    case 'DELETE':
      await prisma.events
        .deleteMany({ where: { operationId: id } })
        .then(async () => {
          await prisma.operations
            .delete({ where: { id } })
            .then(() => res.status(204).end('record removed from database.'))
            .catch((error) => res.status(405).json(error));
        })
        .catch((error) => res.status(405).json(error));
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
