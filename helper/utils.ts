export function formatCurrency(currency: number): string {
  return currency.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
}

interface ILimitTextProps {
  text: string;
  limit: number;
}

export function limitText({ limit, text }: ILimitTextProps): string {
  if (text.length > limit) return text.substring(0, limit);
  return text;
}
