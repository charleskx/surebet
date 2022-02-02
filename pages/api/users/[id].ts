import { Users } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Users | null>
) {
  const id = Number(req.query.id);

  switch (req.method) {
    case 'GET':
      await prisma.users
        .findUnique({ where: { id } })
        .then((success) => res.status(200).json(success))
        .catch((error) => res.status(405).json(error));
      break;
    case 'PUT':
    case 'PATCH':
      await prisma.users
        .update({ where: { id }, data: { ...req.body } })
        .then((success) => res.status(200).json(success))
        .catch((error) => res.status(405).json(error));
      break;
    case 'DELETE':
      await prisma.users
        .delete({ where: { id } })
        .then(() => res.status(204).end('record removed from database.'))
        .catch((error) => res.status(405).json(error));
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
