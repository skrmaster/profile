const prefix = import.meta.env.VITE_PROJECT_NAME;

interface StorageType {
  getValue(key: string, isLive?: boolean): void;
  setValue(key: string, value: unknown): void;
  setLiveValue(key: string, value: unknown, liveTime: number): void;
  removeValue(key: string): void;
  clearAll(): void;
}

type DataLiveType = {
  expressTime: number;
  data: string;
}

export class StorageSuger implements StorageType {
  prefix: string;
  timeUnit: number;
  storage: Window['localStorage'] | Window['sessionStorage'];
  constructor(type: StorageFrom) {
    this.prefix = prefix;
    this.timeUnit = 1000;
    type === 'localStorage'
    ? this.storage = window.localStorage
    : this.storage = window.sessionStorage;
  }

  private generateKey(key: string): string {
    return `${this.prefix}-${key}`;
  }

  getValue(key: string, isLive = false): string | [string, string] {
    const val = this.storage.getItem(this.generateKey(key));
    if (isLive) {
      const now = +new Date();
      if (val) {
        const value: DataLiveType = JSON.parse(val);
        const expressTime = value.expressTime;
        
        if (now >= expressTime) {
          return [value.data , 'express'];
        } else {
          return [value.data , 'no-express'];
        }
      }
    }
    return val || '';
  }

  setValue(key: string, value: unknown): void {
    this.storage.setItem(this.generateKey(key), JSON.stringify(value));
  }

  setLiveValue(key: string, value: unknown, liveTime: number): void {
    const time = +new Date();
    const setTime = liveTime * this.timeUnit;
    const val: DataLiveType = {
      expressTime: time + setTime,
      data: JSON.stringify(value)
    }

    this.storage.setItem(this.generateKey(key), JSON.stringify(val));
  }

  removeValue(key: string): void {
    this.storage.removeItem(this.generateKey(key));
  }

  clearAll(): void {
    this.storage.clear();
  }
}
