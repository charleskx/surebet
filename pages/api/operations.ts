import { Operations } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Operations | Operations[]>
) {
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
        .create({ data: req.body })
        .then((success) => res.status(201).json(success))
        .catch((error) => res.status(405).json(error));
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
