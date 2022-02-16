import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case 'GET':
      await prisma.operations
        .findMany({
          where: {
            userId: Number(req.query.user),
            event: {
              gte: new Date(req.query.start.toString()),
              lte: new Date(req.query.end.toString() || new Date()),
            },
            finished: true,
          },
          include: { events: { where: { win: true } } },
        })
        .then((success) => res.status(200).json(success))
        .catch((error) => res.status(405).json(error));
      break;
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
