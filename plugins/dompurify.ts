import DOMPurify from 'dompurify';

export default defineNuxtPlugin((nuxtApp) => {
  const purifyConfig = {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code',
      'pre', 'span', 'div', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'src', 'alt', 'title', 'class', 'style'
    ],
    ALLOWED_URI_REGEXP: /^https?:\/\//i
  };

  const sanitize = (dirty: string | Node, options = {}) => {
    return DOMPurify.sanitize(dirty, { ...purifyConfig, ...options });
  };

  nuxtApp.provide('sanitize', sanitize);
});