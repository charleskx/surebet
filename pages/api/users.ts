import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export interface IData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IData | IData[]>
) {
  switch (req.method) {
    case 'GET':
      await prisma.users
        .findMany()
        .then((success) => res.status(200).json(success))
        .catch((error) => res.status(405).json(error));
      break;
    case 'POST':
      await prisma.users
        .create({ data: req.body })
        .then((success) => res.status(201).json(success))
        .catch((error) => res.status(405).json(error));
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
