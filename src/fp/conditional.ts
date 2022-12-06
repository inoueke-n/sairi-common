export function conditionalWhen<T1, T2>(when: T1): ConditionalItem<T1, T2> {
  return new ConditionalItem<T1, T2>(when);
}

interface Case<T1, T2> {
  key: T1;
  value: T2;
}

export class ConditionalItem<T1, T2> {
  private when: T1;
  private dict: Case<T1, T2>[];

  constructor(when: T1) {
    this.when = when;
    this.dict = [];
  }

  arm(c: T1, value: T2): ConditionalItem<T1, T2> {
    this.dict.push({ key: c, value });

    return this;
  }

  default(value: T2): T2 {
    const item = this.dict.find((x) => x.key === this.when);

    return (item && item.value) || value;
  }
}
