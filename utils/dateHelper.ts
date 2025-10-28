export class DateHelper {
  static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  static getFutureDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  static getPastDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  static formatDate(date: string | Date, format: string = 'YYYY-MM-DD'): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return format.replace('YYYY', year.toString()).replace('MM', month).replace('DD', day);
  }

  static isDateInFuture(date: string | Date): boolean {
    return new Date(date) > new Date();
  }

  static isDateInPast(date: string | Date): boolean {
    return new Date(date) < new Date();
  }
}
