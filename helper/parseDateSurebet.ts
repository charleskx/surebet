import { parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function parseDate(date: string): Date {
  const [_, day, month, year, time] = date
    .split(' ')
    .map((i: string) => i.toLowerCase())
    .filter((i: string) => i !== 'de');

  const dateTime = `${day}-${month}-${year} ${time}`;

  return parse(dateTime, 'd-MMMM-yyyy HH:mm', new Date(), {
    locale: ptBR,
  });
}
