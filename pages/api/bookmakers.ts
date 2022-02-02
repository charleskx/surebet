import { Bookmakers } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Bookmakers | Bookmakers[]>
) {
  switch (req.method) {
    case 'GET':
      await prisma.bookmakers
        .findMany()
        .then((success) => res.status(200).json(success))
        .catch((error) => res.status(405).json(error));
      break;
    case 'POST':
      await prisma.bookmakers
        .create({ data: req.body })
        .then((success) => res.status(201).json(success))
        .catch((error) => res.status(405).json(error));
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
