import { Wallets } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Wallets | Wallets[]>
) {
  const userId = Number(req.query.user);

  switch (req.method) {
    case 'GET':
      await prisma.wallets
        .findMany({ where: { userId }, include: { bookmaker: true } })
        .then((success) => res.status(200).json(success))
        .catch((error) => res.status(405).json(error));
      break;
    case 'POST':
      await prisma.wallets
        .create({ data: req.body, include: { bookmaker: true } })
        .then((success) => res.status(201).json(success))
        .catch((error) => res.status(405).json(error));
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
