import dayjs from 'dayjs';
import { isFunction, isObject } from './typeof';

export interface Random {
  id: (length: number) => string
  number: (min: number, max: number) => number
  numberList: (min: number, max: number, length: number) => number[]
  floatNumber: (min: number, max: number) => number
  color: () => string
  colorInDarkTheme: () => string
  from: (source: any[], count?: number, allowRepeat?: boolean) => any
  person: () => string
  time: (template?: string) => string
  timeList: (from: any, to: any, step: number, unit: string, format?: string) => string[]
  phone: () => string
  repeat: (times: number, generator: () => any) => any[]
}

const random = {
  id(length: number) {
    let returnStr = '';
    const charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      let index = Math.round(Math.random() * (charStr.length - 1));
      if (i === 0) {
        index = Math.round(Math.random() * (charStr.length - 11));
      }
      returnStr += charStr.substring(index, index + 1);
    }
    return returnStr;
  },
  repeat(times, generator: any) {
    const returnArr: any = [];
    for (let i = 0; i < times; i++) {
      returnArr.push(generator());
    }
    return returnArr;
  },
  number(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  numberList(min, max, length) {
    const result: number[] = [];
    for (let i = 0; i < length; i++) {
      result.push(random.number(min, max));
    }
    return result;
  },
  floatNumber(min, max) {
    return Math.random() * (max - min) + min;
  },
  color() {
    const r = Math.floor(random.number(0, 255));
    const g = Math.floor(random.number(0, 255));
    const b = Math.floor(random.number(0, 255));
    return `rgb(${r},${g},${b})`;
  },
  colorInDarkTheme() {
    const r = Math.floor(random.number(100, 255));
    const g = Math.floor(random.number(100, 255));
    const b = Math.floor(random.number(100, 255));
    return `rgb(${r},${g},${b})`;
  },
  from(sourceArray, count = 1, canRepeat = false) {
    if (!sourceArray.length) {
      throw new Error('LengthError: random.form\'s sourceArray length should be least than 1');
    }
    if (!canRepeat) {
      const deDuplication = [...new Set(sourceArray)];
      if (deDuplication.length < count) {
        throw new Error('LengthError: random.form\'s sourceArray length should be longer than count.');
      } else if (deDuplication.length === count) {
        return deDuplication;
      } else {
        const indexSet = new Set();
        if (count < sourceArray.length / 2) {
          while ([...indexSet].length < count) {
            const index = random.number(0, deDuplication.length - 1);
            indexSet.add(index);
          }
          let result = [...indexSet].map(index => deDuplication[index as string]);
          result = result.length === 1 ? result[0] : result;
          return result;
        }
        while ([...indexSet].length < sourceArray.length - count) {
          const index = random.number(0, deDuplication.length - 1);
          indexSet.add(index);
        }
        let result = deDuplication.filter((item, index) => !indexSet.has(index));
        result = result.length === 1 ? result[0] : result;
        return result;
      }
    } else {
      const index: any = [];
      const length = sourceArray.length;
      for (let i = 0; i < count; i++) {
        while (index.length < count) {
          index.push(random.number(0, length - 1));
        }
      }
      let result = index.map(i => sourceArray[i]);
      result = result.length === 1 ? result[0] : result;
      return result;
    }
  },
  person() {
    const sample = [
      '王文俊',
      '黄勇',
      '冯斌',
      '曾杰',
      '刘厚文',
      '张金海',
      '杨贤俊',
      '杨建成',
      '刘晓林',
      '刘勇',
      '杜国明',
      '贾秀敏',
      '王华明',
      '李茂华',
      '谢鹏',
      '赵龙刚',
    ];
    return random.from(sample);
  },
  phone() {
    return `1${random.from(['30', '50', '52', '87', '37'])}${random.number(10000000, 99999999)}`;
  },
  time(template = 'YYYY-MM-DD HH:mm:ss') {
    // 只接受 YYYY-MM-DD HH:mm:ss | YYYY-MM-DD | HH:mm:ss
    // 简易的随机时间获取器, 限定在 近 2 年内的任意时间点
    const now = new Date();
    const year = random.from([now.getFullYear() - 1, now.getFullYear()]).toString();
    const month
      = now.getFullYear().toString() === year
        ? random
          .number(1, now.getMonth() + 1)
          .toString()
          .padStart(2, '0')
        : random.number(1, 12).toString().padStart(2, '0');
    const day = random.number(1, 28).toString().padStart(2, '0');
    const hour = random.number(0, 23).toString().padStart(2, '0');
    const minute = random.number(0, 59).toString().padStart(2, '0');
    const second = random.number(0, 59).toString().padStart(2, '0');
    template = String(template);
    // 填充 Y
    const pad = (arr, index, symbol, source) => {
      while (arr[index].includes(symbol)) {
        const temp = arr[index].split('');
        const mark = temp.findIndex(which => which === symbol);
        temp[mark] = source.at(mark);
        arr[index] = temp.join('');
      }
    };
    let date;
    let mode;
    let time;
    if (template.includes(' ')) {
      [date, time] = template.split(' ');
      mode = 0;
    } else if (template.includes(':')) {
      time = template;
      mode = 1;
    } else if (template.includes('-')) {
      date = template;
      mode = 2;
    }
    if (mode < 2) {
      const timeTemp = time.split(':');
      const range = [
        {
          key: 'H',
          value: hour,
        },
        {
          key: 'm',
          value: minute,
        },
        {
          key: 's',
          value: second,
        },
      ];
      range.forEach(item => {
        for (let i = 0; i < timeTemp.length; i++) {
          pad(timeTemp, i, item.key, item.value);
        }
      });
      if (timeTemp[0] > 24) {
        timeTemp[1] = random.number(20, 23);
      }
      time = timeTemp.join(':');
    }
    if (mode === 2 || !mode) {
      const dateTemp = date.split('-');
      const range = [
        {
          key: 'Y',
          value: year,
        },
        {
          key: 'M',
          value: month,
        },
        {
          key: 'D',
          value: day,
        },
      ];
      range.forEach(item => {
        for (let i = 0; i < dateTemp.length; i++) {
          pad(dateTemp, i, item.key, item.value);
        }
      });
      // 处理月份大于 12 的问题
      if (dateTemp.length === 3) {
        if (dateTemp[1] > 12 || Number(dateTemp[1]) === 0) {
          dateTemp[1] = random.from([11, 12]);
        }
      } else if (dateTemp.length === 2) {
        if (dateTemp[0] > 1000) {
          if (dateTemp[1] > 12 || Number(dateTemp[1]) === 0) {
            dateTemp[1] = random.from([11, 12]);
          }
        }
        if (dateTemp[0] < 1000) {
          if (dateTemp[0] > 12 || Number(dateTemp[0]) === 0) {
            dateTemp[0] = random.from([11, 12]);
          }
        }
      }
      // 处理日期大于 28 的问题
      if (dateTemp.length === 3 && dateTemp[2] > 28) {
        dateTemp[2] = random.number(20, 28);
      } else if (dateTemp.length === 2) {
        if (dateTemp[0] < 1000 && dateTemp[1] > 28) {
          dateTemp[1] = random.number(20, 28);
        }
      }
      date = dateTemp.join('-');
    }
    switch (mode) {
      case 0:
        return `${date} ${time}`;
      case 1:
        return time;
      case 2:
        return date;
      default:
        return template;
    }
  },
  timeList(from, to, step, unit, format) {
    let start = dayjs(from);
    const end = dayjs(to);
    const result: any = [];
    while (start.isBefore(end)) {
      result.push(start.format(format));
      start = start.add(step, unit as any);
    }
    if (!start.isSame(end)) {
      result.push(end.format(format));
    }
    return result;
  },
} as Random;

function repeat(source, length) {
  const result: any = [];
  for (let i = 0; i < length; i++) {
    if (isFunction(source)) {
      result.push(source());
    } else if (isObject(source)) {
      result.push(JSON.parse(JSON.stringify(source)));
    } else {
      result.push(source);
    }
  }
  result.useId = (key = 'id') => {
    return result.map(t => {
      t[key] = random.id(5);
      return t;
    });
  };
  return result;
}
export { random, repeat };
export * from './typeof';
