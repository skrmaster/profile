import textdata from 'assets/json/constellation.json';

type DayArr = Record<string, typeof constellation[0] & { val: [number, number] }>;

abstract class Day {
  abstract isLeapYear(): boolean;
  abstract yearDayCount(): number;
}

const constellation = textdata.day;

export class DayDate extends Day {
  dayArr: DayArr;
  time: number;
  yearCount: number;
  constructor(day?: Date) {
    super();
    this.time = day ? +new Date(day) : +new Date();
    this.yearCount = this.yearDayCount();
    this.dayArr = DayDate.generateConstellation(this.yearCount, constellation);
  }

  static monthMap(yearCount: number): Record<string, number> {
    const result: Record<string, number> = {
      '1': 31,
      '2': yearCount === 366 ? 29 : 28,
      '3': 31,
      '4': 30,
      '5': 31,
      '6': 30,
      '7': 31,
      '8': 31,
      '9': 30,
      '10': 31,
      '11': 30,
      '12': 31
    }
  
    return result;
  }

  static numberPointNumberOfMonth(val: string, map: Record<string, number>): number {
    const valArr = val.split('.');
    const month = parseInt(valArr[0]);
    const day = parseInt(valArr[1]);

    const dateCount = Array.from(Array.prototype.slice.call({length: month}), (v, i) => i + 1)
    .reduce((pre: number, cur: number): number => {
      return pre + map[cur]
    }, 0)

    return dateCount + day;
  }
 
  static generateConstellation(yearCount: number, arr: typeof constellation): DayArr {
    const res: DayArr = {};
    for (const key in arr) {
      res[key] = {
        ...arr[key],
        val: (arr[key].strValue as [string, string]).map((e: string): number => {
          return DayDate.numberPointNumberOfMonth(e, DayDate.monthMap(yearCount))
        }) as [number, number]
      }
    }

    return res;
  }

  isLeapYear(): boolean {
    const year = new Date(this.time).getFullYear();
    return year % 4 === 0 && year % 100 !== 0;
  }

  yearDayCount(): number {
    let result = 0;
    this.isLeapYear()
    ? result = 366
    : result = 365;

    return result;
  }
}
