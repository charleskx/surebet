import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const id = Number(req.query.user);

  switch (req.method) {
    case 'GET':
      await prisma.wallets
        .aggregate({
          where: { userId: id },
          _sum: {
            balance: true,
          },
        })
        .then((success) => res.status(200).json(success))
        .catch((error) => res.status(405).json(error));
      break;
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
