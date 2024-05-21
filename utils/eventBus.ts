interface Bus {
  on: (eventName: string, fn: () => void) => void;
  off: (eventName: string, fn: () => void) => void;
  emit: (eventName: string, data?: any) => void;
}

export default class EventBus implements Bus {
  events: Record<string, Array<() => any>>;
  constructor() {
    this.events = {};
  }
  emit(eventName: string, data?: any) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function(fn: (data: any) => void) {
        fn(data);
      });
    }
  }
  on(eventName: string, fn: () => void) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }
  off(eventName: string, fn: () => void) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }
}
