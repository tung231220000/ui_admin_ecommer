import hljs from 'highlight.js';

declare global {
    interface Window {
        hljs: typeof hljs;
    }
}

export {}; // Đảm bảo file này là module