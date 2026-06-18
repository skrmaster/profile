import { useDayjs } from "#dayjs";

const imagePrefix = import.meta.env.VITE_PROJECT_IMAGE_PREFIX;

export function debounce(
  func: (arg: unknown) => unknown,
  time = 1000,
): (...arg: unknown[]) => void {
  let id: null | ReturnType<typeof setTimeout> = null;

  return function (...args: unknown[]) {
    if (id) {
      clearTimeout(id);
    }

    id = setTimeout(() => {
      func(args);
    }, time);
  };
}

export function throttle(fn: (arg: any) => void, delay = 2000) {
  let lastTime: number = 0;
  return function (...arg: unknown[]) {
    const now = Date.now();
    const time = now - lastTime;
    if (time >= delay) {
      fn(arg);
      lastTime = now;
    }
  };
}

export function resize(
  el: HTMLElement,
  cb: (arg: Resize) => unknown,
): ResizeObserver {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const obj: Resize = {
        w: entry.borderBoxSize[0].inlineSize,
        h: entry.borderBoxSize[0].blockSize,
      };
      cb(obj);
    }
  });
  if (el) {
    resizeObserver.observe(el);
  }

  return resizeObserver;
}

export function timeNullFormat(
  time?: string,
  formatString = "YYYY-MM-DD HH:mm:ss",
): string {
  const dayjs = useDayjs();
  return time ? dayjs(time).format(formatString) : "暂无";
}

export function splicingImageUrl(raw: string): string | undefined {
  if (!raw) {
    return;
  }

  const { app } = useRuntimeConfig();

  return `${app.baseURL}${raw}`.replace(/\/+/g, "/");
}

export function getImageUrl(item: Upload.FileInfo): string | undefined {
  if (!item) {
    return;
  }

  return splicingImageUrl(item.fullPath);
}

/**
 * @description 判断两个字符串是否有相同部分
 * @param str1
 * @param str2
 * @returns
 */
export function hasCommonPart(str1?: string, str2?: string): boolean {
  if (!str1 || !str2) {
    return false;
  }
  // 找到较短的字符串
  const [shorter, longer] =
    str1.length < str2.length ? [str1, str2] : [str2, str1];

  // 遍历较短字符串的所有子串
  for (let i = 0; i < shorter.length; i++) {
    for (let j = i + 1; j <= shorter.length; j++) {
      const substring = shorter.substring(i, j);
      if (longer.includes(substring)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * @description 获取滚动条宽度
 * @returns
 */
export function getScrollBarWidth(): number {
  const div = document.createElement("div");
  div.style.overflowY = "scroll";
  div.style.width = "50px";
  div.style.height = "50px";
  document.body.appendChild(div);
  const scrollbarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);
  return scrollbarWidth;
}

/**
 * @description 得到一个两数之间的随机整数，包括两个数在内
 * @param min
 * @param max
 * @returns
 */
export function getRandomIntInclusive(min: number, max: number): number {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

export function formatUploadUrl(url?: string): string | undefined {
  if (!url) {
    return url;
  }
  try {
    const newUrl = new URL(url);
    return newUrl.pathname.slice(1);
  } catch (e) {
    return url;
  }
}

export function isUrl(url?: string): boolean {
  if (!url) {
    return false;
  }
  try {
    const curUrl = new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function isMobile() {
  const userAgent = navigator.userAgent;
  const isMobileUserAgent =
    /android|webOS|iPhone|iPad|iPod|blackberry|iemobile|opera mini/i.test(
      userAgent,
    );

  return isMobileUserAgent;
}

export function getDomainNameFromUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (error) {
    console.log("Invalid URL:", error);
    return "";
  }
}

export function getImageHref(url: string | undefined): string {
  if (!url) {
    return "";
  }

  if (url.startsWith("http")) {
    return url;
  }

  return `/${url.replace(/^\/+/, "")}`;
}
