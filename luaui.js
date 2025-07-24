/**
 * LuaUI - Advanced Frontend UI Programming Language
 * Version 2.0.0 - Complete Edition
 * 
 * A complete Lua-inspired UI framework with built-in LuaCSS styling,
 * reactive state management, component system, advanced animations,
 * Node.js support, HTML integration, and advanced security features.
 * 
 * Copyright (c) 2025 Bluezly Technologies
 * License: MIT (Server-side attribution required)
 * 
 * ================================================================================
 * ADVANCED FEATURES:
 * - Complete Lua-like syntax with modern JavaScript integration
 * - Advanced Virtual DOM with fiber-like reconciliation
 * - Reactive state management with proxy-based reactivity
 * - Component system with lifecycle hooks and slots
 * - Advanced animation engine with timeline support
 * - LuaCSS processor with variables, mixins, and scoping
 * - Node.js server-side rendering support
 * - HTML template integration
 * - Advanced security and code obfuscation
 * - Hot module replacement
 * - Development tools and debugging
 * - Performance optimization and caching
 * - Plugin system and extensibility
 * ================================================================================
 */

(function(global, factory) {
    'use strict';
    
    // Universal Module Definition (UMD) pattern for maximum compatibility
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        // Node.js/CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD (RequireJS)
        define(factory);
    } else {
        // Browser globals
        global = typeof globalThis !== 'undefined' ? globalThis : global || self;
        global.LuaUI = factory();
    }
}(this, function() {
    'use strict';

    /* ============================================================================
     * CORE CONSTANTS AND CONFIGURATION
     * ============================================================================ */
    
    const LUAUI_VERSION = '2.0.0';
    const LUAUI_COPYRIGHT = 'Copyright (c) 2025 Bluezly Technologies';
    const LUAUI_BUILD = Date.now();
    const LUAUI_ENV = typeof process !== 'undefined' ? 'node' : 'browser';
    
    // Debug configuration
    const DEBUG_CONFIG = {
        enabled: typeof process !== 'undefined' ? process.env.NODE_ENV !== 'production' : false,
        verbose: false,
        performance: true,
        security: true,
        devTools: true
    };
    
    // Security configuration
    const SECURITY_CONFIG = {
        obfuscation: true,
        encryption: true,
        antiDebug: true,
        sourceProtection: true,
        runtimeProtection: true
    };
    
    // Performance configuration
    const PERFORMANCE_CONFIG = {
        batchUpdates: true,
        asyncRendering: true,
        virtualScrolling: true,
        memoryOptimization: true,
        cacheOptimization: true
    };
    
    /* ============================================================================
     * ADVANCED UTILITY SYSTEM
     * ============================================================================ */
    
    /**
     * Advanced Utility Collection
     * Provides comprehensive utility functions for the entire framework
     */
    class AdvancedUtils {
        constructor() {
            this.cache = new Map();
            this.performance = new Map();
            this.security = new SecurityManager();
        }
        
        // Type checking utilities
        static isArray = Array.isArray;
        static isObject(value) {
            return value !== null && typeof value === 'object' && !Array.isArray(value);
        }
        static isFunction(value) { return typeof value === 'function'; }
        static isString(value) { return typeof value === 'string'; }
        static isNumber(value) { return typeof value === 'number' && !isNaN(value); }
        static isBoolean(value) { return typeof value === 'boolean'; }
        static isSymbol(value) { return typeof value === 'symbol'; }
        static isUndefined(value) { return typeof value === 'undefined'; }
        static isNull(value) { return value === null; }
        static isNil(value) { return value == null; }
        static isPrimitive(value) {
            return value == null || (typeof value !== 'object' && typeof value !== 'function');
        }
        static isPlainObject(value) {
            if (!AdvancedUtils.isObject(value)) return false;
            const proto = Object.getPrototypeOf(value);
            return proto === null || proto === Object.prototype;
        }
        static isPromise(value) {
            return value && typeof value.then === 'function';
        }
        static isRegExp(value) { return value instanceof RegExp; }
        static isDate(value) { return value instanceof Date; }
        static isError(value) { return value instanceof Error; }
        static isElement(value) {
            return typeof HTMLElement !== 'undefined' ? value instanceof HTMLElement : false;
        }
        
        // Advanced object manipulation
        static deepClone(obj, visited = new WeakMap()) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (visited.has(obj)) return visited.get(obj);
            
            if (obj instanceof Date) return new Date(obj.getTime());
            if (obj instanceof RegExp) return new RegExp(obj);
            if (obj instanceof Map) {
                const cloned = new Map();
                visited.set(obj, cloned);
                obj.forEach((value, key) => {
                    cloned.set(key, AdvancedUtils.deepClone(value, visited));
                });
                return cloned;
            }
            if (obj instanceof Set) {
                const cloned = new Set();
                visited.set(obj, cloned);
                obj.forEach(value => {
                    cloned.add(AdvancedUtils.deepClone(value, visited));
                });
                return cloned;
            }
            if (Array.isArray(obj)) {
                const cloned = [];
                visited.set(obj, cloned);
                obj.forEach((item, index) => {
                    cloned[index] = AdvancedUtils.deepClone(item, visited);
                });
                return cloned;
            }
            
            const cloned = {};
            visited.set(obj, cloned);
            Object.keys(obj).forEach(key => {
                cloned[key] = AdvancedUtils.deepClone(obj[key], visited);
            });
            
            return cloned;
        }
        
        static deepMerge(target, ...sources) {
            if (!sources.length) return target;
            const source = sources.shift();
            
            if (AdvancedUtils.isObject(target) && AdvancedUtils.isObject(source)) {
                for (const key in source) {
                    if (AdvancedUtils.isObject(source[key])) {
                        if (!target[key]) Object.assign(target, { [key]: {} });
                        AdvancedUtils.deepMerge(target[key], source[key]);
                    } else {
                        Object.assign(target, { [key]: source[key] });
                    }
                }
            }
            
            return AdvancedUtils.deepMerge(target, ...sources);
        }
        
        static deepEqual(a, b, visited = new WeakSet()) {
            if (a === b) return true;
            if (a == null || b == null) return a === b;
            if (typeof a !== typeof b) return false;
            
            if (visited.has(a) || visited.has(b)) return true;
            visited.add(a);
            visited.add(b);
            
            if (Array.isArray(a) && Array.isArray(b)) {
                if (a.length !== b.length) return false;
                return a.every((item, index) => AdvancedUtils.deepEqual(item, b[index], visited));
            }
            
            if (AdvancedUtils.isObject(a) && AdvancedUtils.isObject(b)) {
                const keysA = Object.keys(a);
                const keysB = Object.keys(b);
                if (keysA.length !== keysB.length) return false;
                return keysA.every(key => AdvancedUtils.deepEqual(a[key], b[key], visited));
            }
            
            return false;
        }
        
        // Performance utilities
        static memoize(fn, resolver) {
            const cache = new Map();
            const memoized = function(...args) {
                const key = resolver ? resolver(...args) : JSON.stringify(args);
                if (cache.has(key)) {
                    return cache.get(key);
                }
                const result = fn.apply(this, args);
                cache.set(key, result);
                return result;
            };
            memoized.cache = cache;
            return memoized;
        }
        
        static throttle(func, limit, options = {}) {
            let inThrottle;
            let lastFunc;
            let lastRan;
            const { leading = true, trailing = true } = options;
            
            return function(...args) {
                if (!inThrottle) {
                    if (leading) func.apply(this, args);
                    lastRan = Date.now();
                    inThrottle = true;
                } else {
                    clearTimeout(lastFunc);
                    lastFunc = setTimeout(() => {
                        if (Date.now() - lastRan >= limit) {
                            if (trailing) func.apply(this, args);
                            lastRan = Date.now();
                        }
                    }, limit - (Date.now() - lastRan));
                }
            };
        }
        
        static debounce(func, wait, immediate = false) {
            let timeout;
            return function(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(this, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(this, args);
            };
        }
        
        // String utilities
        static camelCase(str) {
            return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        }
        
        static kebabCase(str) {
            return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        }
        
        static pascalCase(str) {
            return str.replace(/(?:^|-)([a-z])/g, (g) => g.slice(-1).toUpperCase());
        }
        
        static snakeCase(str) {
            return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
        }
        
        // ID generation
        static generateId(prefix = 'luaui') {
            return `${prefix}_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`;
        }
        
        static generateSecureId() {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                return crypto.randomUUID();
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        
        // Array utilities
        static chunk(array, size) {
            const chunks = [];
            for (let i = 0; i < array.length; i += size) {
                chunks.push(array.slice(i, i + size));
            }
            return chunks;
        }
        
        static flatten(array, depth = Infinity) {
            return depth > 0 ? array.reduce((acc, val) => 
                acc.concat(Array.isArray(val) ? AdvancedUtils.flatten(val, depth - 1) : val), []) : array.slice();
        }
        
        static unique(array, key) {
            if (key) {
                const seen = new Set();
                return array.filter(item => {
                    const k = typeof key === 'function' ? key(item) : item[key];
                    if (seen.has(k)) return false;
                    seen.add(k);
                    return true;
                });
            }
            return [...new Set(array)];
        }
        
        // Event system
        static createEventEmitter() {
            const events = new Map();
            
            return {
                on(event, callback) {
                    if (!events.has(event)) events.set(event, []);
                    events.get(event).push(callback);
                    return () => this.off(event, callback);
                },
                
                off(event, callback) {
                    if (events.has(event)) {
                        const callbacks = events.get(event);
                        const index = callbacks.indexOf(callback);
                        if (index > -1) callbacks.splice(index, 1);
                    }
                },
                
                emit(event, ...args) {
                    if (events.has(event)) {
                        events.get(event).forEach(callback => callback(...args));
                    }
                },
                
                once(event, callback) {
                    const onceCallback = (...args) => {
                        callback(...args);
                        this.off(event, onceCallback);
                    };
                    this.on(event, onceCallback);
                },
                
                clear(event) {
                    if (event) {
                        events.delete(event);
                    } else {
                        events.clear();
                    }
                }
            };
        }
        
        // Logging system
        static createLogger(namespace = 'LuaUI') {
            const colors = {
                reset: '\x1b[0m',
                bright: '\x1b[1m',
                red: '\x1b[31m',
                green: '\x1b[32m',
                yellow: '\x1b[33m',
                blue: '\x1b[34m',
                magenta: '\x1b[35m',
                cyan: '\x1b[36m'
            };
            
            const formatMessage = (level, ...args) => {
                const timestamp = new Date().toISOString();
                const color = colors[level] || colors.reset;
                const prefix = `${color}[${namespace}:${level.toUpperCase()}]${colors.reset}`;
                return [prefix, timestamp, ...args];
            };
            
            return {
                debug: DEBUG_CONFIG.enabled ? (...args) => console.debug(...formatMessage('blue', ...args)) : () => {},
                info: (...args) => console.info(...formatMessage('cyan', ...args)),
                warn: (...args) => console.warn(...formatMessage('yellow', ...args)),
                error: (...args) => console.error(...formatMessage('red', ...args)),
                success: (...args) => console.log(...formatMessage('green', ...args))
            };
        }
        
        // Performance measurement
        static createPerformanceMonitor() {
            const metrics = new Map();
            
            return {
                start(name) {
                    metrics.set(name, { start: performance.now() });
                },
                
                end(name) {
                    const metric = metrics.get(name);
                    if (metric) {
                        metric.end = performance.now();
                        metric.duration = metric.end - metric.start;
                        return metric.duration;
                    }
                    return 0;
                },
                
                measure(name, fn) {
                    this.start(name);
                    const result = fn();
                    const duration = this.end(name);
                    return { result, duration };
                },
                
                getMetrics() {
                    return Object.fromEntries(metrics);
                },
                
                clear() {
                    metrics.clear();
                }
            };
        }
    }
    
    /* ============================================================================
     * SECURITY MANAGER
     * ============================================================================ */
    
    /**
     * Advanced Security Manager
     * Handles code obfuscation, encryption, and runtime protection
     */
    class SecurityManager {
        constructor() {
            this.keys = new Map();
            this.obfuscationMap = new Map();
            this.antiDebugActive = false;
            this.sourceHidden = false;
            
            if (SECURITY_CONFIG.antiDebug) {
                this.enableAntiDebug();
            }
            
            if (SECURITY_CONFIG.sourceProtection) {
                this.enableSourceProtection();
            }
        }
        
        // Generate encryption key
        generateKey() {
            const key = new Uint8Array(32);
            if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
                crypto.getRandomValues(key);
            } else {
                for (let i = 0; i < key.length; i++) {
                    key[i] = Math.floor(Math.random() * 256);
                }
            }
            return key;
        }
        
        // Simple XOR encryption for client-side protection
        encrypt(data, key) {
            if (typeof data === 'string') {
                data = new TextEncoder().encode(data);
            }
            const encrypted = new Uint8Array(data.length);
            for (let i = 0; i < data.length; i++) {
                encrypted[i] = data[i] ^ key[i % key.length];
            }
            return btoa(String.fromCharCode(...encrypted));
        }
        
        decrypt(encryptedData, key) {
            const data = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
            const decrypted = new Uint8Array(data.length);
            for (let i = 0; i < data.length; i++) {
                decrypted[i] = data[i] ^ key[i % key.length];
            }
            return new TextDecoder().decode(decrypted);
        }
        
        // Code obfuscation
        obfuscateCode(code) {
            const obfuscated = code
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
                .replace(/\/\/.*$/gm, '') // Remove line comments
                .replace(/\s+/g, ' ') // Compress whitespace
                .replace(/([{}();,])\s*/g, '$1') // Remove spaces after punctuation
                .replace(/\s*([{}();,])/g, '$1'); // Remove spaces before punctuation
            
            return this.renameIdentifiers(obfuscated);
        }
        
        renameIdentifiers(code) {
            const identifiers = new Set();
            const identifierRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
            let match;
            
            while ((match = identifierRegex.exec(code)) !== null) {
                const identifier = match[0];
                if (!this.isReservedWord(identifier)) {
                    identifiers.add(identifier);
                }
            }
            
            let counter = 0;
            identifiers.forEach(identifier => {
                const obfuscated = this.generateObfuscatedName(counter++);
                this.obfuscationMap.set(identifier, obfuscated);
                code = code.replace(new RegExp(`\\b${identifier}\\b`, 'g'), obfuscated);
            });
            
            return code;
        }
        
        generateObfuscatedName(index) {
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
            let name = '';
            let num = index;
            
            do {
                name = chars[num % chars.length] + name;
                num = Math.floor(num / chars.length);
            } while (num > 0);
            
            return '_' + name;
        }
        
        isReservedWord(word) {
            const reserved = [
                'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
                'default', 'delete', 'do', 'else', 'export', 'extends', 'finally',
                'for', 'function', 'if', 'import', 'in', 'instanceof', 'new',
                'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof',
                'var', 'void', 'while', 'with', 'yield', 'let', 'static',
                'enum', 'implements', 'interface', 'package', 'private',
                'protected', 'public', 'abstract', 'boolean', 'byte', 'char',
                'double', 'final', 'float', 'goto', 'int', 'long', 'native',
                'short', 'synchronized', 'throws', 'transient', 'volatile'
            ];
            return reserved.includes(word);
        }
        
        // Anti-debugging measures
        enableAntiDebug() {
            if (typeof window === 'undefined') return;
            
            this.antiDebugActive = true;
            
            // Detect dev tools
            const detectDevTools = () => {
                const widthThreshold = window.outerWidth - window.innerWidth > 160;
                const heightThreshold = window.outerHeight - window.innerHeight > 160;
                
                if (widthThreshold || heightThreshold) {
                    this.handleDebugDetection();
                }
            };
            
            setInterval(detectDevTools, 1000);
            
            // Detect debugging
            let devtools = false;
            setInterval(() => {
                if (devtools) return;
                const before = new Date();
                debugger; // This will pause if dev tools are open
                const after = new Date();
                if (after - before > 100) {
                    devtools = true;
                    this.handleDebugDetection();
                }
            }, 1000);
            
            // Console protection
            if (typeof console !== 'undefined') {
                const originalLog = console.log;
                console.log = () => {};
                console.warn = () => {};
                console.error = () => {};
                console.info = () => {};
                console.debug = () => {};
            }
        }
        
        handleDebugDetection() {
            if (typeof window !== 'undefined') {
                // Redirect or show warning
                document.body.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: #000;
                        color: #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-family: monospace;
                        font-size: 24px;
                        z-index: 999999;
                    ">
                        Access Denied - Developer Tools Detected
                    </div>
                `;
            }
        }
        
        // Source protection
        enableSourceProtection() {
            if (typeof window === 'undefined') return;
            
            this.sourceHidden = true;
            
            // Disable right-click
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });
            
            // Disable key combinations
            document.addEventListener('keydown', (e) => {
                // F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+U
                if (e.keyCode === 123 || 
                    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 67)) ||
                    (e.ctrlKey && e.keyCode === 85)) {
                    e.preventDefault();
                    return false;
                }
            });
            
            // Disable text selection
            document.addEventListener('selectstart', (e) => {
                e.preventDefault();
                return false;
            });
            
            // Disable drag
            document.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });
        }
        
        // Runtime protection
        protectRuntime(obj, protectedKeys = []) {
            return new Proxy(obj, {
                get(target, prop) {
                    if (protectedKeys.includes(prop)) {
                        throw new Error('Access denied');
                    }
                    return target[prop];
                },
                
                set(target, prop, value) {
                    if (protectedKeys.includes(prop)) {
                        throw new Error('Modification denied');
                    }
                    target[prop] = value;
                    return true;
                },
                
                deleteProperty(target, prop) {
                    if (protectedKeys.includes(prop)) {
                        throw new Error('Deletion denied');
                    }
                    delete target[prop];
                    return true;
                }
            });
        }
    }
    
    /* ============================================================================
     * ADVANCED LEXER IMPLEMENTATION
     * ============================================================================ */
    
    /**
     * Enhanced Token Types for comprehensive language support
     */
    const TokenType = {
        // Literals
        STRING: 'STRING',
        NUMBER: 'NUMBER',
        BOOLEAN: 'BOOLEAN',
        NIL: 'NIL',
        TEMPLATE_LITERAL: 'TEMPLATE_LITERAL',
        REGEX: 'REGEX',
        
        // Identifiers and keywords
        IDENTIFIER: 'IDENTIFIER',
        COMPONENT: 'COMPONENT',
        FUNCTION: 'FUNCTION',
        LOCAL: 'LOCAL',
        CONST: 'CONST',
        LET: 'LET',
        VAR: 'VAR',
        IF: 'IF',
        THEN: 'THEN',
        ELSE: 'ELSE',
        ELSEIF: 'ELSEIF',
        END: 'END',
        FOR: 'FOR',
        WHILE: 'WHILE',
        DO: 'DO',
        REPEAT: 'REPEAT',
        UNTIL: 'UNTIL',
        RETURN: 'RETURN',
        BREAK: 'BREAK',
        CONTINUE: 'CONTINUE',
        AND: 'AND',
        OR: 'OR',
        NOT: 'NOT',
        IN: 'IN',
        OF: 'OF',
        TRY: 'TRY',
        CATCH: 'CATCH',
        FINALLY: 'FINALLY',
        THROW: 'THROW',
        ASYNC: 'ASYNC',
        AWAIT: 'AWAIT',
        YIELD: 'YIELD',
        CLASS: 'CLASS',
        EXTENDS: 'EXTENDS',
        SUPER: 'SUPER',
        STATIC: 'STATIC',
        IMPORT: 'IMPORT',
        EXPORT: 'EXPORT',
        FROM: 'FROM',
        DEFAULT: 'DEFAULT',
        
        // Operators
        PLUS: 'PLUS',
        MINUS: 'MINUS',
        MULTIPLY: 'MULTIPLY',
        DIVIDE: 'DIVIDE',
        MODULO: 'MODULO',
        POWER: 'POWER',
        CONCAT: 'CONCAT',
        ASSIGN: 'ASSIGN',
        PLUS_ASSIGN: 'PLUS_ASSIGN',
        MINUS_ASSIGN: 'MINUS_ASSIGN',
        MULTIPLY_ASSIGN: 'MULTIPLY_ASSIGN',
        DIVIDE_ASSIGN: 'DIVIDE_ASSIGN',
        MODULO_ASSIGN: 'MODULO_ASSIGN',
        POWER_ASSIGN: 'POWER_ASSIGN',
        INCREMENT: 'INCREMENT',
        DECREMENT: 'DECREMENT',
        EQUAL: 'EQUAL',
        NOT_EQUAL: 'NOT_EQUAL',
        STRICT_EQUAL: 'STRICT_EQUAL',
        STRICT_NOT_EQUAL: 'STRICT_NOT_EQUAL',
        LESS_THAN: 'LESS_THAN',
        LESS_EQUAL: 'LESS_EQUAL',
        GREATER_THAN: 'GREATER_THAN',
        GREATER_EQUAL: 'GREATER_EQUAL',
        LOGICAL_AND: 'LOGICAL_AND',
        LOGICAL_OR: 'LOGICAL_OR',
        BITWISE_AND: 'BITWISE_AND',
        BITWISE_OR: 'BITWISE_OR',
        BITWISE_XOR: 'BITWISE_XOR',
        BITWISE_NOT: 'BITWISE_NOT',
        LEFT_SHIFT: 'LEFT_SHIFT',
        RIGHT_SHIFT: 'RIGHT_SHIFT',
        UNSIGNED_RIGHT_SHIFT: 'UNSIGNED_RIGHT_SHIFT',
        QUESTION: 'QUESTION',
        NULLISH_COALESCING: 'NULLISH_COALESCING',
        OPTIONAL_CHAINING: 'OPTIONAL_CHAINING',
        
        // Delimiters
        LEFT_PAREN: 'LEFT_PAREN',
        RIGHT_PAREN: 'RIGHT_PAREN',
        LEFT_BRACE: 'LEFT_BRACE',
        RIGHT_BRACE: 'RIGHT_BRACE',
        LEFT_BRACKET: 'LEFT_BRACKET',
        RIGHT_BRACKET: 'RIGHT_BRACKET',
        COMMA: 'COMMA',
        SEMICOLON: 'SEMICOLON',
        DOT: 'DOT',
        COLON: 'COLON',
        ARROW: 'ARROW',
        SPREAD: 'SPREAD',
        
        // Special
        NEWLINE: 'NEWLINE',
        EOF: 'EOF',
        COMMENT: 'COMMENT',
        MULTILINE_COMMENT: 'MULTILINE_COMMENT',
        
        // CSS-specific
        CSS_SELECTOR: 'CSS_SELECTOR',
        CSS_PROPERTY: 'CSS_PROPERTY',
        CSS_VALUE: 'CSS_VALUE',
        CSS_AT_RULE: 'CSS_AT_RULE',
        
        // HTML-specific
        HTML_TAG_OPEN: 'HTML_TAG_OPEN',
        HTML_TAG_CLOSE: 'HTML_TAG_CLOSE',
        HTML_TAG_SELF_CLOSE: 'HTML_TAG_SELF_CLOSE',
        HTML_ATTRIBUTE: 'HTML_ATTRIBUTE',
        HTML_TEXT: 'HTML_TEXT'
    };
    
    /**
     * Advanced Lexer with comprehensive language support
     */
    class AdvancedLexer {
        constructor(source, options = {}) {
            this.source = source;
            this.position = 0;
            this.line = 1;
            this.column = 1;
            this.tokens = [];
            this.options = {
                preserveComments: false,
                preserveWhitespace: false,
                allowRegex: true,
                allowTemplates: true,
                allowJSX: false,
                strict: false,
                ...options
            };
            
            // Enhanced keyword set
            this.keywords = new Set([
                'component', 'function', 'local', 'const', 'let', 'var',
                'if', 'then', 'else', 'elseif', 'end', 'for', 'while', 'do',
                'repeat', 'until', 'return', 'break', 'continue', 'and', 'or',
                'not', 'in', 'of', 'try', 'catch', 'finally', 'throw',
                'async', 'await', 'yield', 'class', 'extends', 'super',
                'static', 'import', 'export', 'from', 'default',
                'true', 'false', 'nil', 'null', 'undefined', 'this',
                'new', 'delete', 'typeof', 'instanceof', 'void'
            ]);
        }
        
        // Enhanced character navigation
        peek(offset = 0) {
            const pos = this.position + offset;
            return pos < this.source.length ? this.source[pos] : '\0';
        }
        
        advance() {
            if (this.position >= this.source.length) return '\0';
            
            const char = this.source[this.position];
            this.position++;
            
            if (char === '\n') {
                this.line++;
                this.column = 1;
            } else {
                this.column++;
            }
            
            return char;
        }
        
        // Enhanced whitespace handling
        skipWhitespace() {
            while (this.peek() && /[\s\t\r]/.test(this.peek()) && this.peek() !== '\n') {
                this.advance();
            }
        }
        
        // Enhanced comment handling
        skipComment() {
            if (this.peek() === '/' && this.peek(1) === '/') {
                const start = this.position;
                this.advance(); // /
                this.advance(); // /
                
                let content = '';
                while (this.peek() && this.peek() !== '\n') {
                    content += this.advance();
                }
                
                if (this.options.preserveComments) {
                    this.tokens.push(this.createToken(TokenType.COMMENT, content));
                }
                return true;
            }
            
            if (this.peek() === '/' && this.peek(1) === '*') {
                const start = this.position;
                this.advance(); // /
                this.advance(); // *
                
                let content = '';
                while (this.peek()) {
                    if (this.peek() === '*' && this.peek(1) === '/') {
                        this.advance(); // *
                        this.advance(); // /
                        break;
                    }
                    content += this.advance();
                }
                
                if (this.options.preserveComments) {
                    this.tokens.push(this.createToken(TokenType.MULTILINE_COMMENT, content));
                }
                return true;
            }
            
            // Lua-style comments
            if (this.peek() === '-' && this.peek(1) === '-') {
                this.advance(); // -
                this.advance(); // -
                
                let content = '';
                if (this.peek() === '[' && this.peek(1) === '[') {
                    // Multi-line comment
                    this.advance(); // [
                    this.advance(); // [
                    
                    while (this.peek()) {
                        if (this.peek() === ']' && this.peek(1) === ']') {
                            this.advance(); // ]
                            this.advance(); // ]
                            break;
                        }
                        content += this.advance();
                    }
                } else {
                    // Single-line comment
                    while (this.peek() && this.peek() !== '\n') {
                        content += this.advance();
                    }
                }
                
                if (this.options.preserveComments) {
                    this.tokens.push(this.createToken(TokenType.COMMENT, content));
                }
                return true;
            }
            
            return false;
        }
        
        // Enhanced string literal parsing
        readString() {
            const quote = this.advance(); // ' or "
            let value = '';
            let isTemplate = false;
            
            while (this.peek() && this.peek() !== quote) {
                if (this.peek() === '\\') {
                    this.advance(); // \
                    const escaped = this.advance();
                    switch (escaped) {
                        case 'n': value += '\n'; break;
                        case 't': value += '\t'; break;
                        case 'r': value += '\r'; break;
                        case 'b': value += '\b'; break;
                        case 'f': value += '\f'; break;
                        case 'v': value += '\v'; break;
                        case '0': value += '\0'; break;
                        case '\\': value += '\\'; break;
                        case '\'': value += '\''; break;
                        case '"': value += '"'; break;
                        case '/': value += '/'; break;
                        case 'u': {
                            // Unicode escape
                            let unicode = '';
                            for (let i = 0; i < 4; i++) {
                                if (/[0-9a-fA-F]/.test(this.peek())) {
                                    unicode += this.advance();
                                }
                            }
                            value += String.fromCharCode(parseInt(unicode, 16));
                            break;
                        }
                        case 'x': {
                            // Hex escape
                            let hex = '';
                            for (let i = 0; i < 2; i++) {
                                if (/[0-9a-fA-F]/.test(this.peek())) {
                                    hex += this.advance();
                                }
                            }
                            value += String.fromCharCode(parseInt(hex, 16));
                            break;
                        }
                        default:
                            value += escaped;
                            break;
                    }
                } else if (this.peek() === '$' && this.peek(1) === '{' && quote === '`') {
                    // Template literal interpolation
                    isTemplate = true;
                    value += '${';
                    this.advance(); // $
                    this.advance(); // {
                    
                    let braceCount = 1;
                    while (this.peek() && braceCount > 0) {
                        const char = this.advance();
                        if (char === '{') braceCount++;
                        else if (char === '}') braceCount--;
                        value += char;
                    }
                } else {
                    value += this.advance();
                }
            }
            
            if (this.peek() === quote) {
                this.advance(); // closing quote
            } else {
                throw new Error(`Unterminated string at line ${this.line}, column ${this.column}`);
            }
            
            return this.createToken(
                isTemplate ? TokenType.TEMPLATE_LITERAL : TokenType.STRING,
                value
            );
        }
        
        // Enhanced number parsing
        readNumber() {
            let value = '';
            let hasDecimal = false;
            let hasExponent = false;
            let isHex = false;
            let isBinary = false;
            let isOctal = false;
            
            // Check for different number bases
            if (this.peek() === '0') {
                value += this.advance();
                
                if (this.peek() === 'x' || this.peek() === 'X') {
                    isHex = true;
                    value += this.advance();
                } else if (this.peek() === 'b' || this.peek() === 'B') {
                    isBinary = true;
                    value += this.advance();
                } else if (this.peek() === 'o' || this.peek() === 'O') {
                    isOctal = true;
                    value += this.advance();
                }
            }
            
            // Read digits based on base
            const digitTest = isHex ? /[0-9a-fA-F]/ : 
                              isBinary ? /[01]/ :
                              isOctal ? /[0-7]/ : /\d/;
            
            while (this.peek() && digitTest.test(this.peek())) {
                value += this.advance();
            }
            
            // Handle decimal point (only for decimal numbers)
            if (!isHex && !isBinary && !isOctal && this.peek() === '.' && /\d/.test(this.peek(1))) {
                hasDecimal = true;
                value += this.advance(); // .
                
                while (this.peek() && /\d/.test(this.peek())) {
                    value += this.advance();
                }
            }
            
            // Handle scientific notation (only for decimal numbers)
            if (!isHex && !isBinary && !isOctal && (this.peek() === 'e' || this.peek() === 'E')) {
                hasExponent = true;
                value += this.advance(); // e or E
                
                if (this.peek() === '+' || this.peek() === '-') {
                    value += this.advance();
                }
                
                while (this.peek() && /\d/.test(this.peek())) {
                    value += this.advance();
                }
            }
            
            // Parse the final number value
            let numValue;
            if (isHex) {
                numValue = parseInt(value, 16);
            } else if (isBinary) {
                numValue = parseInt(value.slice(2), 2);
            } else if (isOctal) {
                numValue = parseInt(value.slice(2), 8);
            } else {
                numValue = parseFloat(value);
            }
            
            return this.createToken(TokenType.NUMBER, numValue);
        }
        
        // Enhanced identifier parsing
        readIdentifier() {
            let value = '';
            
            // First character can be letter, underscore, or $
            if (/[a-zA-Z_$]/.test(this.peek())) {
                value += this.advance();
            }
            
            // Subsequent characters can be letters, digits, underscores, or $
            while (this.peek() && /[a-zA-Z0-9_$]/.test(this.peek())) {
                value += this.advance();
            }
            
            // Check if it's a keyword
            if (this.keywords.has(value)) {
                return this.createToken(this.getKeywordTokenType(value), value);
            }
            
            return this.createToken(TokenType.IDENTIFIER, value);
        }
        
        // Map keywords to token types
        getKeywordTokenType(keyword) {
            const keywordMap = {
                'component': TokenType.COMPONENT,
                'function': TokenType.FUNCTION,
                'local': TokenType.LOCAL,
                'const': TokenType.CONST,
                'let': TokenType.LET,
                'var': TokenType.VAR,
                'if': TokenType.IF,
                'then': TokenType.THEN,
                'else': TokenType.ELSE,
                'elseif': TokenType.ELSEIF,
                'end': TokenType.END,
                'for': TokenType.FOR,
                'while': TokenType.WHILE,
                'do': TokenType.DO,
                'repeat': TokenType.REPEAT,
                'until': TokenType.UNTIL,
                'return': TokenType.RETURN,
                'break': TokenType.BREAK,
                'continue': TokenType.CONTINUE,
                'and': TokenType.AND,
                'or': TokenType.OR,
                'not': TokenType.NOT,
                'in': TokenType.IN,
                'of': TokenType.OF,
                'try': TokenType.TRY,
                'catch': TokenType.CATCH,
                'finally': TokenType.FINALLY,
                'throw': TokenType.THROW,
                'async': TokenType.ASYNC,
                'await': TokenType.AWAIT,
                'yield': TokenType.YIELD,
                'class': TokenType.CLASS,
                'extends': TokenType.EXTENDS,
                'super': TokenType.SUPER,
                'static': TokenType.STATIC,
                'import': TokenType.IMPORT,
                'export': TokenType.EXPORT,
                'from': TokenType.FROM,
                'default': TokenType.DEFAULT,
                'true': TokenType.BOOLEAN,
                'false': TokenType.BOOLEAN,
                'nil': TokenType.NIL,
                'null': TokenType.NIL,
                'undefined': TokenType.NIL
            };
            
            return keywordMap[keyword] || TokenType.IDENTIFIER;
        }
        
        // Regular expression parsing
        readRegex() {
            if (!this.options.allowRegex) {
                throw new Error('Regular expressions not allowed in strict mode');
            }
            
            this.advance(); // /
            let pattern = '';
            let flags = '';
            
            while (this.peek() && this.peek() !== '/') {
                if (this.peek() === '\\') {
                    pattern += this.advance(); // \
                    pattern += this.advance(); // escaped character
                } else if (this.peek() === '\n') {
                    throw new Error('Unterminated regular expression');
                } else {
                    pattern += this.advance();
                }
            }
            
            if (this.peek() === '/') {
                this.advance(); // closing /
                
                // Read flags
                while (this.peek() && /[gimuy]/.test(this.peek())) {
                    flags += this.advance();
                }
            } else {
                throw new Error('Unterminated regular expression');
            }
            
            return this.createToken(TokenType.REGEX, { pattern, flags });
        }
        
        // Create token object
        createToken(type, value, line = this.line, column = this.column) {
            return {
                type,
                value,
                line,
                column,
                start: this.position - (typeof value === 'string' ? value.length : 1),
                end: this.position
            };
        }
        
        // Main tokenization method
        tokenize() {
            while (this.position < this.source.length) {
                // Skip whitespace
                if (/\s/.test(this.peek()) && this.peek() !== '\n') {
                    if (this.options.preserveWhitespace) {
                        let whitespace = '';
                        while (/\s/.test(this.peek()) && this.peek() !== '\n') {
                            whitespace += this.advance();
                        }
                        // Could add whitespace token if needed
                    } else {
                        this.skipWhitespace();
                    }
                    continue;
                }
                
                // Skip comments
                if (this.skipComment()) continue;
                
                const char = this.peek();
                const line = this.line;
                const column = this.column;
                
                // Newlines
                if (char === '\n') {
                    this.advance();
                    this.tokens.push(this.createToken(TokenType.NEWLINE, char, line, column));
                    continue;
                }
                
                // String literals
                if (char === '"' || char === "'" || char === '`') {
                    this.tokens.push(this.readString());
                    continue;
                }
                
                // Long string literals [[...]]
                if (char === '[' && this.peek(1) === '[') {
                    this.advance(); // [
                    this.advance(); // [
                    let value = '';
                    
                    while (this.peek()) {
                        if (this.peek() === ']' && this.peek(1) === ']') {
                            this.advance(); // ]
                            this.advance(); // ]
                            break;
                        }
                        value += this.advance();
                    }
                    
                    this.tokens.push(this.createToken(TokenType.STRING, value, line, column));
                    continue;
                }
                
                // Numbers
                if (/\d/.test(char) || (char === '.' && /\d/.test(this.peek(1)))) {
                    this.tokens.push(this.readNumber());
                    continue;
                }
                
                // Identifiers and keywords
                if (/[a-zA-Z_$]/.test(char)) {
                    this.tokens.push(this.readIdentifier());
                    continue;
                }
                
                // Regular expressions
                if (char === '/' && this.options.allowRegex) {
                    // Check if it's a regex or division operator
                    const prevToken = this.tokens[this.tokens.length - 1];
                    const isRegex = !prevToken || 
                        [TokenType.LEFT_PAREN, TokenType.LEFT_BRACKET, TokenType.LEFT_BRACE,
                         TokenType.COMMA, TokenType.SEMICOLON, TokenType.COLON,
                         TokenType.RETURN, TokenType.ASSIGN].includes(prevToken.type);
                    
                    if (isRegex && this.peek(1) !== '/' && this.peek(1) !== '*') {
                        this.tokens.push(this.readRegex());
                        continue;
                    }
                }
                
                // Multi-character operators
                const twoChar = char + this.peek(1);
                const threeChar = twoChar + this.peek(2);
                
                // Three-character operators
                switch (threeChar) {
                    case '===':
                        this.advance(); this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.STRICT_EQUAL, threeChar, line, column));
                        continue;
                    case '!==':
                        this.advance(); this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.STRICT_NOT_EQUAL, threeChar, line, column));
                        continue;
                    case '>>>':
                        this.advance(); this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.UNSIGNED_RIGHT_SHIFT, threeChar, line, column));
                        continue;
                    case '...':
                        this.advance(); this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.SPREAD, threeChar, line, column));
                        continue;
                }
                
                // Two-character operators
                switch (twoChar) {
                    case '==':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.EQUAL, twoChar, line, column));
                        continue;
                    case '!=':
                    case '~=':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.NOT_EQUAL, twoChar, line, column));
                        continue;
                    case '<=':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.LESS_EQUAL, twoChar, line, column));
                        continue;
                    case '>=':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.GREATER_EQUAL, twoChar, line, column));
                        continue;
                    case '&&':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.LOGICAL_AND, twoChar, line, column));
                        continue;
                    case '||':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.LOGICAL_OR, twoChar, line, column));
                        continue;
                    case '..':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.CONCAT, twoChar, line, column));
                        continue;
                    case '++':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.INCREMENT, twoChar, line, column));
                        continue;
                    case '--':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.DECREMENT, twoChar, line, column));
                        continue;
                    case '+=':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.PLUS_ASSIGN, twoChar, line, column));
                        continue;
                    case '-=':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.MINUS_ASSIGN, twoChar, line, column));
                        continue;
                    case '*=':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.MULTIPLY_ASSIGN, twoChar, line, column));
                        continue;
                    case '/=':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.DIVIDE_ASSIGN, twoChar, line, column));
                        continue;
                    case '%=':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.MODULO_ASSIGN, twoChar, line, column));
                        continue;
                    case '^=':
                    case '**=':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.POWER_ASSIGN, twoChar, line, column));
                        continue;
                    case '<<':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.LEFT_SHIFT, twoChar, line, column));
                        continue;
                    case '>>':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.RIGHT_SHIFT, twoChar, line, column));
                        continue;
                    case '=>':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.ARROW, twoChar, line, column));
                        continue;
                    case '?.':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.OPTIONAL_CHAINING, twoChar, line, column));
                        continue;
                    case '??':
                        this.advance(); this.advance();
                        this.tokens.push(this.createToken(TokenType.NULLISH_COALESCING, twoChar, line, column));
                        continue;
                }
                
                // Single-character tokens
                switch (char) {
                    case '+':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.PLUS, char, line, column));
                        break;
                    case '-':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.MINUS, char, line, column));
                        break;
                    case '*':
                        if (this.peek(1) === '*') {
                            this.advance(); this.advance();
                            this.tokens.push(this.createToken(TokenType.POWER, '**', line, column));
                        } else {
                            this.advance();
                            this.tokens.push(this.createToken(TokenType.MULTIPLY, char, line, column));
                        }
                        break;
                    case '/':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.DIVIDE, char, line, column));
                        break;
                    case '%':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.MODULO, char, line, column));
                        break;
                    case '^':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.POWER, char, line, column));
                        break;
                    case '=':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.ASSIGN, char, line, column));
                        break;
                    case '<':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.LESS_THAN, char, line, column));
                        break;
                    case '>':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.GREATER_THAN, char, line, column));
                        break;
                    case '&':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.BITWISE_AND, char, line, column));
                        break;
                    case '|':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.BITWISE_OR, char, line, column));
                        break;
                    case '~':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.BITWISE_NOT, char, line, column));
                        break;
                    case '!':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.NOT, char, line, column));
                        break;
                    case '?':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.QUESTION, char, line, column));
                        break;
                    case '(':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.LEFT_PAREN, char, line, column));
                        break;
                    case ')':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.RIGHT_PAREN, char, line, column));
                        break;
                    case '{':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.LEFT_BRACE, char, line, column));
                        break;
                    case '}':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.RIGHT_BRACE, char, line, column));
                        break;
                    case '[':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.LEFT_BRACKET, char, line, column));
                        break;
                    case ']':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.RIGHT_BRACKET, char, line, column));
                        break;
                    case ',':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.COMMA, char, line, column));
                        break;
                    case ';':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.SEMICOLON, char, line, column));
                        break;
                    case '.':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.DOT, char, line, column));
                        break;
                    case ':':
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.COLON, char, line, column));
                        break;
                    default:
                        throw new Error(`Unexpected character '${char}' at line ${this.line}, column ${this.column}`);
                }
            }
            
            this.tokens.push(this.createToken(TokenType.EOF, null));
            return this.tokens;
        }
    }
    
    /* ============================================================================
     * ADVANCED PARSER IMPLEMENTATION
     * ============================================================================ */
    
    /**
     * Enhanced AST Node Types
     */
    const ASTNodeType = {
        // Program structure
        PROGRAM: 'Program',
        MODULE: 'Module',
        
        // Declarations
        COMPONENT_DECLARATION: 'ComponentDeclaration',
        FUNCTION_DECLARATION: 'FunctionDeclaration',
        VARIABLE_DECLARATION: 'VariableDeclaration',
        CLASS_DECLARATION: 'ClassDeclaration',
        IMPORT_DECLARATION: 'ImportDeclaration',
        EXPORT_DECLARATION: 'ExportDeclaration',
        
        // Statements
        EXPRESSION_STATEMENT: 'ExpressionStatement',
        BLOCK_STATEMENT: 'BlockStatement',
        IF_STATEMENT: 'IfStatement',
        WHILE_STATEMENT: 'WhileStatement',
        FOR_STATEMENT: 'ForStatement',
        FOR_IN_STATEMENT: 'ForInStatement',
        FOR_OF_STATEMENT: 'ForOfStatement',
        DO_WHILE_STATEMENT: 'DoWhileStatement',
        REPEAT_STATEMENT: 'RepeatStatement',
        SWITCH_STATEMENT: 'SwitchStatement',
        TRY_STATEMENT: 'TryStatement',
        THROW_STATEMENT: 'ThrowStatement',
        RETURN_STATEMENT: 'ReturnStatement',
        BREAK_STATEMENT: 'BreakStatement',
        CONTINUE_STATEMENT: 'ContinueStatement',
        
        // Expressions
        IDENTIFIER: 'Identifier',
        LITERAL: 'Literal',
        ARRAY_EXPRESSION: 'ArrayExpression',
        OBJECT_EXPRESSION: 'ObjectExpression',
        FUNCTION_EXPRESSION: 'FunctionExpression',
        ARROW_FUNCTION_EXPRESSION: 'ArrowFunctionExpression',
        CLASS_EXPRESSION: 'ClassExpression',
        MEMBER_EXPRESSION: 'MemberExpression',
        COMPUTED_MEMBER_EXPRESSION: 'ComputedMemberExpression',
        CALL_EXPRESSION: 'CallExpression',
        NEW_EXPRESSION: 'NewExpression',
        UPDATE_EXPRESSION: 'UpdateExpression',
        UNARY_EXPRESSION: 'UnaryExpression',
        BINARY_EXPRESSION: 'BinaryExpression',
        LOGICAL_EXPRESSION: 'LogicalExpression',
        ASSIGNMENT_EXPRESSION: 'AssignmentExpression',
        CONDITIONAL_EXPRESSION: 'ConditionalExpression',
        SEQUENCE_EXPRESSION: 'SequenceExpression',
        SPREAD_ELEMENT: 'SpreadElement',
        REST_ELEMENT: 'RestElement',
        TEMPLATE_LITERAL: 'TemplateLiteral',
        TAGGED_TEMPLATE_EXPRESSION: 'TaggedTemplateExpression',
        AWAIT_EXPRESSION: 'AwaitExpression',
        YIELD_EXPRESSION: 'YieldExpression',
        
        // Patterns
        ARRAY_PATTERN: 'ArrayPattern',
        OBJECT_PATTERN: 'ObjectPattern',
        ASSIGNMENT_PATTERN: 'AssignmentPattern',
        
        // Miscellaneous
        PROPERTY: 'Property',
        METHOD_DEFINITION: 'MethodDefinition',
        SWITCH_CASE: 'SwitchCase',
        CATCH_CLAUSE: 'CatchClause',
        TEMPLATE_ELEMENT: 'TemplateElement',
        SUPER: 'Super',
        META_PROPERTY: 'MetaProperty'
    };
    
    /**
     * Advanced Parser with full language support
     */
    class AdvancedParser {
        constructor(tokens, options = {}) {
            this.tokens = tokens;
            this.current = 0;
            this.options = {
                allowReturnOutsideFunction: false,
                allowImportExportEverywhere: false,
                allowAwaitOutsideFunction: false,
                allowHashBang: false,
                strictMode: false,
                sourceType: 'script', // 'script' or 'module'
                ...options
            };
            
            this.scope = {
                type: 'global',
                inFunction: false,
                inClass: false,
                inLoop: false,
                inSwitch: false,
                inTry: false,
                async: false,
                generator: false
            };
            
            this.labels = new Set();
            this.errors = [];
        }
        
        // Enhanced navigation methods
        isAtEnd() {
            return this.peek().type === TokenType.EOF;
        }
        
        peek(offset = 0) {
            const index = this.current + offset;
            return index < this.tokens.length ? this.tokens[index] : this.tokens[this.tokens.length - 1];
        }
        
        previous() {
            return this.tokens[this.current - 1];
        }
        
        advance() {
            if (!this.isAtEnd()) this.current++;
            return this.previous();
        }
        
        check(type) {
            if (this.isAtEnd()) return false;
            return this.peek().type === type;
        }
        
        match(...types) {
            for (const type of types) {
                if (this.check(type)) {
                    this.advance();
                    return true;
                }
            }
            return false;
        }
        
        consume(type, message) {
            if (this.check(type)) return this.advance();
            
            const current = this.peek();
            const error = new Error(`${message}. Got ${current.type} at line ${current.line}, column ${current.column}`);
            this.errors.push(error);
            throw error;
        }
        
        // Enhanced error handling
        synchronize() {
            this.advance();
            
            while (!this.isAtEnd()) {
                if (this.previous().type === TokenType.SEMICOLON) return;
                if (this.previous().type === TokenType.NEWLINE) return;
                
                switch (this.peek().type) {
                    case TokenType.CLASS:
                    case TokenType.FUNCTION:
                    case TokenType.COMPONENT:
                    case TokenType.VAR:
                    case TokenType.LET:
                    case TokenType.CONST:
                    case TokenType.FOR:
                    case TokenType.IF:
                    case TokenType.WHILE:
                    case TokenType.RETURN:
                    case TokenType.TRY:
                    case TokenType.THROW:
                        return;
                }
                
                this.advance();
            }
        }
        
        // Skip newlines utility
        skipNewlines() {
            while (this.match(TokenType.NEWLINE)) {
                // Skip
            }
        }
        
        // Scope management
        enterScope(type, options = {}) {
            const parentScope = { ...this.scope };
            this.scope = {
                ...this.scope,
                type,
                parent: parentScope,
                ...options
            };
        }
        
        exitScope() {
            if (this.scope.parent) {
                this.scope = this.scope.parent;
            }
        }
        
        // Main parsing method
        parse() {
            const statements = [];
            this.skipNewlines();
            
            // Handle hashbang
            if (this.options.allowHashBang && this.peek().value && this.peek().value.startsWith('#!')) {
                this.advance();
            }
            
            while (!this.isAtEnd()) {
                if (this.match(TokenType.NEWLINE)) continue;
                
                try {
                    const stmt = this.statement();
                    if (stmt) statements.push(stmt);
                } catch (error) {
                    this.errors.push(error);
                    this.synchronize();
                }
                
                this.skipNewlines();
            }
            
            return {
                type: this.options.sourceType === 'module' ? ASTNodeType.MODULE : ASTNodeType.PROGRAM,
                body: statements,
                sourceType: this.options.sourceType,
                errors: this.errors
            };
        }
        
        // Statement parsing
        statement() {
            // Import/Export statements (only in modules)
            if (this.options.sourceType === 'module' || this.options.allowImportExportEverywhere) {
                if (this.match(TokenType.IMPORT)) return this.importDeclaration();
                if (this.match(TokenType.EXPORT)) return this.exportDeclaration();
            }
            
            // Declaration statements
            if (this.match(TokenType.COMPONENT)) return this.componentDeclaration();
            if (this.match(TokenType.FUNCTION)) return this.functionDeclaration();
            if (this.match(TokenType.CLASS)) return this.classDeclaration();
            if (this.match(TokenType.VAR, TokenType.LET, TokenType.CONST, TokenType.LOCAL)) {
                return this.variableDeclaration();
            }
            
            // Control flow statements
            if (this.match(TokenType.IF)) return this.ifStatement();
            if (this.match(TokenType.WHILE)) return this.whileStatement();
            if (this.match(TokenType.FOR)) return this.forStatement();
            if (this.match(TokenType.DO)) return this.doWhileStatement();
            if (this.match(TokenType.REPEAT)) return this.repeatStatement();
            if (this.match(TokenType.SWITCH)) return this.switchStatement();
            if (this.match(TokenType.TRY)) return this.tryStatement();
            
            // Jump statements
            if (this.match(TokenType.RETURN)) return this.returnStatement();
            if (this.match(TokenType.BREAK)) return this.breakStatement();
            if (this.match(TokenType.CONTINUE)) return this.continueStatement();
            if (this.match(TokenType.THROW)) return this.throwStatement();
            
            // Block statement
            if (this.check(TokenType.LEFT_BRACE)) return this.blockStatement();
            
            // Expression statement
            return this.expressionStatement();
        }
        
        // Component declaration
        componentDeclaration() {
            const name = this.consume(TokenType.IDENTIFIER, "Expected component name").value;
            
            let superClass = null;
            if (this.match(TokenType.EXTENDS)) {
                superClass = this.consume(TokenType.IDENTIFIER, "Expected superclass name").value;
            }
            
            this.consume(TokenType.LEFT_BRACE, "Expected '{' after component name");
            this.skipNewlines();
            
            const properties = {};
            const methods = {};
            
            while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                if (this.match(TokenType.NEWLINE)) continue;
                
                const key = this.consume(TokenType.IDENTIFIER, "Expected property or method name").value;
                
                if (this.match(TokenType.COLON) || this.match(TokenType.ASSIGN)) {
                    // Property
                    const value = this.expression();
                    properties[key] = value;
                } else if (this.check(TokenType.LEFT_PAREN)) {
                    // Method
                    const method = this.functionExpression();
                    methods[key] = method;
                } else {
                    throw new Error("Expected ':' or '(' after property/method name");
                }
                
                this.skipNewlines();
                
                if (!this.check(TokenType.RIGHT_BRACE)) {
                    this.match(TokenType.COMMA, TokenType.SEMICOLON);
                    this.skipNewlines();
                }
            }
            
            this.consume(TokenType.RIGHT_BRACE, "Expected '}' after component body");
            
            return {
                type: ASTNodeType.COMPONENT_DECLARATION,
                name,
                superClass,
                properties,
                methods
            };
        }
        
        // Function declaration
        functionDeclaration() {
            const isAsync = this.previous().type === TokenType.ASYNC;
            const isGenerator = this.match(TokenType.MULTIPLY);
            
            const name = this.consume(TokenType.IDENTIFIER, "Expected function name").value;
            
            this.consume(TokenType.LEFT_PAREN, "Expected '(' after function name");
            
            const params = [];
            if (!this.check(TokenType.RIGHT_PAREN)) {
                do {
                    if (this.match(TokenType.SPREAD)) {
                        const param = this.consume(TokenType.IDENTIFIER, "Expected parameter name after '...'").value;
                        params.push({
                            type: ASTNodeType.REST_ELEMENT,
                            argument: { type: ASTNodeType.IDENTIFIER, name: param }
                        });
                        break; // Rest parameter must be last
                    } else {
                        const param = this.consume(TokenType.IDENTIFIER, "Expected parameter name").value;
                        let defaultValue = null;
                        
                        if (this.match(TokenType.ASSIGN)) {
                            defaultValue = this.assignmentExpression();
                        }
                        
                        params.push(defaultValue ? {
                            type: ASTNodeType.ASSIGNMENT_PATTERN,
                            left: { type: ASTNodeType.IDENTIFIER, name: param },
                            right: defaultValue
                        } : { type: ASTNodeType.IDENTIFIER, name: param });
                    }
                } while (this.match(TokenType.COMMA));
            }
            
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after parameters");
            
            this.enterScope('function', { inFunction: true, async: isAsync, generator: isGenerator });
            
            let body;
            if (this.check(TokenType.LEFT_BRACE)) {
                body = this.blockStatement();
            } else {
                // Lua-style function body
                this.skipNewlines();
                const statements = [];
                while (!this.check(TokenType.END) && !this.isAtEnd()) {
                    if (this.match(TokenType.NEWLINE)) continue;
                    statements.push(this.statement());
                    this.skipNewlines();
                }
                this.consume(TokenType.END, "Expected 'end' after function body");
                body = {
                    type: ASTNodeType.BLOCK_STATEMENT,
                    body: statements
                };
            }
            
            this.exitScope();
            
            return {
                type: ASTNodeType.FUNCTION_DECLARATION,
                id: { type: ASTNodeType.IDENTIFIER, name },
                params,
                body,
                async: isAsync,
                generator: isGenerator
            };
        }
        
        // Class declaration
        classDeclaration() {
            const name = this.consume(TokenType.IDENTIFIER, "Expected class name").value;
            
            let superClass = null;
            if (this.match(TokenType.EXTENDS)) {
                superClass = this.primaryExpression();
            }
            
            this.consume(TokenType.LEFT_BRACE, "Expected '{' after class name");
            this.skipNewlines();
            
            const body = [];
            
            this.enterScope('class', { inClass: true });
            
            while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                if (this.match(TokenType.NEWLINE)) continue;
                
                const isStatic = this.match(TokenType.STATIC);
                const isAsync = this.match(TokenType.ASYNC);
                const isGenerator = this.match(TokenType.MULTIPLY);
                
                if (this.check(TokenType.IDENTIFIER)) {
                    const key = this.advance().value;
                    
                    if (this.check(TokenType.LEFT_PAREN)) {
                        // Method
                        const method = this.functionExpression();
                        body.push({
                            type: ASTNodeType.METHOD_DEFINITION,
                            key: { type: ASTNodeType.IDENTIFIER, name: key },
                            value: method,
                            kind: key === 'constructor' ? 'constructor' : 'method',
                            static: isStatic,
                            async: isAsync,
                            generator: isGenerator
                        });
                    } else if (this.match(TokenType.ASSIGN)) {
                        // Property
                        const value = this.assignmentExpression();
                        body.push({
                            type: ASTNodeType.PROPERTY,
                            key: { type: ASTNodeType.IDENTIFIER, name: key },
                            value,
                            static: isStatic
                        });
                    }
                }
                
                this.skipNewlines();
            }
            
            this.exitScope();
            
            this.consume(TokenType.RIGHT_BRACE, "Expected '}' after class body");
            
            return {
                type: ASTNodeType.CLASS_DECLARATION,
                id: { type: ASTNodeType.IDENTIFIER, name },
                superClass,
                body: {
                    type: 'ClassBody',
                    body
                }
            };
        }
        
        // Variable declaration
        variableDeclaration() {
            const kind = this.previous().value;
            const declarations = [];
            
            do {
                const name = this.consume(TokenType.IDENTIFIER, "Expected variable name").value;
                let init = null;
                
                if (this.match(TokenType.ASSIGN)) {
                    init = this.assignmentExpression();
                }
                
                declarations.push({
                    type: 'VariableDeclarator',
                    id: { type: ASTNodeType.IDENTIFIER, name },
                    init
                });
            } while (this.match(TokenType.COMMA));
            
            return {
                type: ASTNodeType.VARIABLE_DECLARATION,
                declarations,
                kind: kind === 'local' ? 'let' : kind
            };
        }
        
        // Import declaration
        importDeclaration() {
            const specifiers = [];
            
            if (this.check(TokenType.IDENTIFIER)) {
                // Default import
                const name = this.advance().value;
                specifiers.push({
                    type: 'ImportDefaultSpecifier',
                    local: { type: ASTNodeType.IDENTIFIER, name }
                });
                
                if (this.match(TokenType.COMMA)) {
                    // Named imports after default
                    if (this.match(TokenType.LEFT_BRACE)) {
                        this.parseNamedImports(specifiers);
                        this.consume(TokenType.RIGHT_BRACE, "Expected '}' after import specifiers");
                    }
                }
            } else if (this.match(TokenType.LEFT_BRACE)) {
                // Named imports only
                this.parseNamedImports(specifiers);
                this.consume(TokenType.RIGHT_BRACE, "Expected '}' after import specifiers");
            } else if (this.match(TokenType.MULTIPLY)) {
                // Namespace import
                this.consume(TokenType.AS, "Expected 'as' after '*'");
                const name = this.consume(TokenType.IDENTIFIER, "Expected identifier after 'as'").value;
                specifiers.push({
                    type: 'ImportNamespaceSpecifier',
                    local: { type: ASTNodeType.IDENTIFIER, name }
                });
            }
            
            this.consume(TokenType.FROM, "Expected 'from' after import specifiers");
            const source = this.consume(TokenType.STRING, "Expected string after 'from'");
            
            return {
                type: ASTNodeType.IMPORT_DECLARATION,
                specifiers,
                source: { type: ASTNodeType.LITERAL, value: source.value }
            };
        }
        
        parseNamedImports(specifiers) {
            do {
                const imported = this.consume(TokenType.IDENTIFIER, "Expected import name").value;
                let local = imported;
                
                if (this.match(TokenType.AS)) {
                    local = this.consume(TokenType.IDENTIFIER, "Expected local name after 'as'").value;
                }
                
                specifiers.push({
                    type: 'ImportSpecifier',
                    imported: { type: ASTNodeType.IDENTIFIER, name: imported },
                    local: { type: ASTNodeType.IDENTIFIER, name: local }
                });
            } while (this.match(TokenType.COMMA));
        }
        
        // Export declaration
        exportDeclaration() {
            if (this.match(TokenType.DEFAULT)) {
                // Default export
                let declaration;
                
                if (this.check(TokenType.FUNCTION)) {
                    declaration = this.functionDeclaration();
                } else if (this.check(TokenType.CLASS)) {
                    declaration = this.classDeclaration();
                } else {
                    declaration = this.assignmentExpression();
                }
                
                return {
                    type: ASTNodeType.EXPORT_DECLARATION,
                    default: true,
                    declaration
                };
            } else if (this.match(TokenType.LEFT_BRACE)) {
                // Named exports
                const specifiers = [];
                
                do {
                    const local = this.consume(TokenType.IDENTIFIER, "Expected export name").value;
                    let exported = local;
                    
                    if (this.match(TokenType.AS)) {
                        exported = this.consume(TokenType.IDENTIFIER, "Expected exported name after 'as'").value;
                    }
                    
                    specifiers.push({
                        type: 'ExportSpecifier',
                        local: { type: ASTNodeType.IDENTIFIER, name: local },
                        exported: { type: ASTNodeType.IDENTIFIER, name: exported }
                    });
                } while (this.match(TokenType.COMMA));
                
                this.consume(TokenType.RIGHT_BRACE, "Expected '}' after export specifiers");
                
                let source = null;
                if (this.match(TokenType.FROM)) {
                    source = this.consume(TokenType.STRING, "Expected string after 'from'");
                    source = { type: ASTNodeType.LITERAL, value: source.value };
                }
                
                return {
                    type: ASTNodeType.EXPORT_DECLARATION,
                    specifiers,
                    source
                };
            } else {
                // Export declaration
                const declaration = this.statement();
                
                return {
                    type: ASTNodeType.EXPORT_DECLARATION,
                    declaration
                };
            }
        }
        
        // Control flow statements
        ifStatement() {
            const test = this.expression();
            this.consume(TokenType.THEN, "Expected 'then' after if condition");
            this.skipNewlines();
            
            const consequent = this.blockStatement();
            
            const alternate = [];
            while (this.match(TokenType.ELSEIF)) {
                const elseIfTest = this.expression();
                this.consume(TokenType.THEN, "Expected 'then' after elseif condition");
                this.skipNewlines();
                
                const elseIfConsequent = this.blockStatement();
                
                alternate.push({
                    type: ASTNodeType.IF_STATEMENT,
                    test: elseIfTest,
                    consequent: elseIfConsequent,
                    alternate: null
                });
            }
            
            let finalAlternate = null;
            if (this.match(TokenType.ELSE)) {
                this.skipNewlines();
                finalAlternate = this.blockStatement();
            }
            
            // Chain elseif statements
            if (alternate.length > 0) {
                for (let i = alternate.length - 1; i >= 0; i--) {
                    if (i === alternate.length - 1) {
                        alternate[i].alternate = finalAlternate;
                    } else {
                        alternate[i].alternate = alternate[i + 1];
                    }
                }
                finalAlternate = alternate[0];
            }
            
            this.consume(TokenType.END, "Expected 'end' after if statement");
            
            return {
                type: ASTNodeType.IF_STATEMENT,
                test,
                consequent,
                alternate: finalAlternate
            };
        }
        
        whileStatement() {
            const test = this.expression();
            this.consume(TokenType.DO, "Expected 'do' after while condition");
            this.skipNewlines();
            
            this.enterScope('loop', { inLoop: true });
            const body = this.blockStatement();
            this.exitScope();
            
            this.consume(TokenType.END, "Expected 'end' after while body");
            
            return {
                type: ASTNodeType.WHILE_STATEMENT,
                test,
                body
            };
        }
        
        forStatement() {
            const variable = this.consume(TokenType.IDENTIFIER, "Expected variable name").value;
            
            if (this.match(TokenType.ASSIGN)) {
                // Numeric for loop: for i = 1, 10, 1 do
                const start = this.expression();
                this.consume(TokenType.COMMA, "Expected ',' after for start");
                const end = this.expression();
                
                let step = null;
                if (this.match(TokenType.COMMA)) {
                    step = this.expression();
                }
                
                this.consume(TokenType.DO, "Expected 'do' after for range");
                this.skipNewlines();
                
                this.enterScope('loop', { inLoop: true });
                const body = this.blockStatement();
                this.exitScope();
                
                this.consume(TokenType.END, "Expected 'end' after for body");
                
                return {
                    type: ASTNodeType.FOR_STATEMENT,
                    init: {
                        type: ASTNodeType.VARIABLE_DECLARATION,
                        declarations: [{
                            type: 'VariableDeclarator',
                            id: { type: ASTNodeType.IDENTIFIER, name: variable },
                            init: start
                        }],
                        kind: 'let'
                    },
                    test: {
                        type: ASTNodeType.BINARY_EXPRESSION,
                        left: { type: ASTNodeType.IDENTIFIER, name: variable },
                        operator: '<=',
                        right: end
                    },
                    update: {
                        type: ASTNodeType.ASSIGNMENT_EXPRESSION,
                        operator: '+=',
                        left: { type: ASTNodeType.IDENTIFIER, name: variable },
                        right: step || { type: ASTNodeType.LITERAL, value: 1 }
                    },
                    body
                };
            } else if (this.match(TokenType.IN)) {
                // Generic for loop: for key in pairs(table) do
                const right = this.expression();
                this.consume(TokenType.DO, "Expected 'do' after for iterable");
                this.skipNewlines();
                
                this.enterScope('loop', { inLoop: true });
                const body = this.blockStatement();
                this.exitScope();
                
                this.consume(TokenType.END, "Expected 'end' after for body");
                
                return {
                    type: ASTNodeType.FOR_IN_STATEMENT,
                    left: { type: ASTNodeType.IDENTIFIER, name: variable },
                    right,
                    body
                };
            } else if (this.match(TokenType.OF)) {
                // For-of loop: for value of array do
                const right = this.expression();
                this.consume(TokenType.DO, "Expected 'do' after for iterable");
                this.skipNewlines();
                
                this.enterScope('loop', { inLoop: true });
                const body = this.blockStatement();
                this.exitScope();
                
                this.consume(TokenType.END, "Expected 'end' after for body");
                
                return {
                    type: ASTNodeType.FOR_OF_STATEMENT,
                    left: { type: ASTNodeType.IDENTIFIER, name: variable },
                    right,
                    body
                };
            } else {
                throw new Error("Expected '=', 'in', or 'of' after for variable");
            }
        }
        
        doWhileStatement() {
            this.skipNewlines();
            
            this.enterScope('loop', { inLoop: true });
            const body = this.blockStatement();
            this.exitScope();
            
            this.consume(TokenType.WHILE, "Expected 'while' after do body");
            const test = this.expression();
            
            return {
                type: ASTNodeType.DO_WHILE_STATEMENT,
                body,
                test
            };
        }
        
        repeatStatement() {
            this.skipNewlines();
            
            this.enterScope('loop', { inLoop: true });
            const body = [];
            while (!this.check(TokenType.UNTIL) && !this.isAtEnd()) {
                if (this.match(TokenType.NEWLINE)) continue;
                body.push(this.statement());
                this.skipNewlines();
            }
            this.exitScope();
            
            this.consume(TokenType.UNTIL, "Expected 'until' after repeat body");
            const test = this.expression();
            
            return {
                type: ASTNodeType.REPEAT_STATEMENT,
                body: {
                    type: ASTNodeType.BLOCK_STATEMENT,
                    body
                },
                test: {
                    type: ASTNodeType.UNARY_EXPRESSION,
                    operator: '!',
                    argument: test
                }
            };
        }
        
        switchStatement() {
            const discriminant = this.expression();
            this.consume(TokenType.LEFT_BRACE, "Expected '{' after switch expression");
            this.skipNewlines();
            
            const cases = [];
            
            this.enterScope('switch', { inSwitch: true });
            
            while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                if (this.match(TokenType.NEWLINE)) continue;
                
                if (this.match(TokenType.CASE)) {
                    const test = this.expression();
                    this.consume(TokenType.COLON, "Expected ':' after case value");
                    this.skipNewlines();
                    
                    const consequent = [];
                    while (!this.check(TokenType.CASE) && !this.check(TokenType.DEFAULT) && 
                           !this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                        if (this.match(TokenType.NEWLINE)) continue;
                        consequent.push(this.statement());
                        this.skipNewlines();
                    }
                    
                    cases.push({
                        type: ASTNodeType.SWITCH_CASE,
                        test,
                        consequent
                    });
                } else if (this.match(TokenType.DEFAULT)) {
                    this.consume(TokenType.COLON, "Expected ':' after default");
                    this.skipNewlines();
                    
                    const consequent = [];
                    while (!this.check(TokenType.CASE) && !this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                        if (this.match(TokenType.NEWLINE)) continue;
                        consequent.push(this.statement());
                        this.skipNewlines();
                    }
                    
                    cases.push({
                        type: ASTNodeType.SWITCH_CASE,
                        test: null,
                        consequent
                    });
                } else {
                    break;
                }
            }
            
            this.exitScope();
            
            this.consume(TokenType.RIGHT_BRACE, "Expected '}' after switch body");
            
            return {
                type: ASTNodeType.SWITCH_STATEMENT,
                discriminant,
                cases
            };
        }
        
        tryStatement() {
            const block = this.blockStatement();
            
            let handler = null;
            if (this.match(TokenType.CATCH)) {
                let param = null;
                if (this.match(TokenType.LEFT_PAREN)) {
                    param = this.consume(TokenType.IDENTIFIER, "Expected catch parameter").value;
                    param = { type: ASTNodeType.IDENTIFIER, name: param };
                    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after catch parameter");
                }
                
                const body = this.blockStatement();
                
                handler = {
                    type: ASTNodeType.CATCH_CLAUSE,
                    param,
                    body
                };
            }
            
            let finalizer = null;
            if (this.match(TokenType.FINALLY)) {
                finalizer = this.blockStatement();
            }
            
            if (!handler && !finalizer) {
                throw new Error("Missing catch or finally after try");
            }
            
            return {
                type: ASTNodeType.TRY_STATEMENT,
                block,
                handler,
                finalizer
            };
        }
        
        // Jump statements
        returnStatement() {
            if (!this.scope.inFunction && !this.options.allowReturnOutsideFunction) {
                throw new Error("Return statement outside function");
            }
            
            let argument = null;
            if (!this.check(TokenType.NEWLINE) && !this.check(TokenType.EOF) && 
                !this.check(TokenType.SEMICOLON) && !this.check(TokenType.END)) {
                argument = this.expression();
            }
            
            return {
                type: ASTNodeType.RETURN_STATEMENT,
                argument
            };
        }
        
        breakStatement() {
            if (!this.scope.inLoop && !this.scope.inSwitch) {
                throw new Error("Break statement outside loop or switch");
            }
            
            let label = null;
            if (this.check(TokenType.IDENTIFIER)) {
                label = this.advance().value;
                if (!this.labels.has(label)) {
                    throw new Error(`Undefined label '${label}'`);
                }
                label = { type: ASTNodeType.IDENTIFIER, name: label };
            }
            
            return {
                type: ASTNodeType.BREAK_STATEMENT,
                label
            };
        }
        
        continueStatement() {
            if (!this.scope.inLoop) {
                throw new Error("Continue statement outside loop");
            }
            
            let label = null;
            if (this.check(TokenType.IDENTIFIER)) {
                label = this.advance().value;
                if (!this.labels.has(label)) {
                    throw new Error(`Undefined label '${label}'`);
                }
                label = { type: ASTNodeType.IDENTIFIER, name: label };
            }
            
            return {
                type: ASTNodeType.CONTINUE_STATEMENT,
                label
            };
        }
        
        throwStatement() {
            const argument = this.expression();
            
            return {
                type: ASTNodeType.THROW_STATEMENT,
                argument
            };
        }
        
        // Block and expression statements
        blockStatement() {
            const body = [];
            
            if (this.match(TokenType.LEFT_BRACE)) {
                this.skipNewlines();
                
                while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                    if (this.match(TokenType.NEWLINE)) continue;
                    
                    const stmt = this.statement();
                    if (stmt) body.push(stmt);
                    
                    this.skipNewlines();
                }
                
                this.consume(TokenType.RIGHT_BRACE, "Expected '}' after block");
            } else {
                // Lua-style block without braces
                while (!this.check(TokenType.END) && !this.check(TokenType.ELSE) && 
                       !this.check(TokenType.ELSEIF) && !this.check(TokenType.UNTIL) &&
                       !this.isAtEnd()) {
                    if (this.match(TokenType.NEWLINE)) continue;
                    
                    const stmt = this.statement();
                    if (stmt) body.push(stmt);
                    
                    this.skipNewlines();
                }
            }
            
            return {
                type: ASTNodeType.BLOCK_STATEMENT,
                body
            };
        }
        
        expressionStatement() {
            const expression = this.expression();
            
            return {
                type: ASTNodeType.EXPRESSION_STATEMENT,
                expression
            };
        }
        
        // Expression parsing (using precedence climbing)
        expression() {
            return this.assignmentExpression();
        }
        
        assignmentExpression() {
            const expr = this.conditionalExpression();
            
            if (this.match(TokenType.ASSIGN, TokenType.PLUS_ASSIGN, TokenType.MINUS_ASSIGN,
                          TokenType.MULTIPLY_ASSIGN, TokenType.DIVIDE_ASSIGN, TokenType.MODULO_ASSIGN,
                          TokenType.POWER_ASSIGN)) {
                const operator = this.previous().value;
                const right = this.assignmentExpression();
                
                return {
                    type: ASTNodeType.ASSIGNMENT_EXPRESSION,
                    operator,
                    left: expr,
                    right
                };
            }
            
            return expr;
        }
        
        conditionalExpression() {
            const expr = this.logicalOrExpression();
            
            if (this.match(TokenType.QUESTION)) {
                const consequent = this.assignmentExpression();
                this.consume(TokenType.COLON, "Expected ':' after '?' in ternary expression");
                const alternate = this.conditionalExpression();
                
                return {
                    type: ASTNodeType.CONDITIONAL_EXPRESSION,
                    test: expr,
                    consequent,
                    alternate
                };
            }
            
            return expr;
        }
        
        logicalOrExpression() {
            let expr = this.logicalAndExpression();
            
            while (this.match(TokenType.LOGICAL_OR, TokenType.OR)) {
                const operator = this.previous().value === 'or' ? '||' : this.previous().value;
                const right = this.logicalAndExpression();
                expr = {
                    type: ASTNodeType.LOGICAL_EXPRESSION,
                    operator,
                    left: expr,
                    right
                };
            }
            
            return expr;
        }
        
        logicalAndExpression() {
            let expr = this.bitwiseOrExpression();
            
            while (this.match(TokenType.LOGICAL_AND, TokenType.AND)) {
                const operator = this.previous().value === 'and' ? '&&' : this.previous().value;
                const right = this.bitwiseOrExpression();
                expr = {
                    type: ASTNodeType.LOGICAL_EXPRESSION,
                    operator,
                    left: expr,
                    right
                };
            }
            
            return expr;
        }
        
        bitwiseOrExpression() {
            let expr = this.bitwiseXorExpression();
            
            while (this.match(TokenType.BITWISE_OR)) {
                const operator = this.previous().value;
                const right = this.bitwiseXorExpression();
                expr = {
                    type: ASTNodeType.BINARY_EXPRESSION,
                    operator,
                    left: expr,
                    right
                };
            }
            
            return expr;
        }
        
        bitwiseXorExpression() {
            let expr = this.bitwiseAndExpression();
            
            while (this.match(TokenType.BITWISE_XOR)) {
                const operator = this.previous().value;
                const right = this.bitwiseAndExpression();
                expr = {
                    type: ASTNodeType.BINARY_EXPRESSION,
                    operator,
                    left: expr,
                    right
                };
            }
            
            return expr;
        }
        
        bitwiseAndExpression() {
            let expr = this.equalityExpression();
            
            while (this.match(TokenType.BITWISE_AND)) {
                const operator = this.previous().value;
                const right = this.equalityExpression();
                expr = {
                    type: ASTNodeType.BINARY_EXPRESSION,
                    operator,
                    left: expr,
                    right
                };
            }
            
            return expr;
        }
        
        equalityExpression() {
            let expr = this.relationalExpression();
            
            while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL, 
                              TokenType.STRICT_EQUAL, TokenType.STRICT_NOT_EQUAL)) {
                let operator = this.previous().value;
                if (operator === '~=') operator = '!=';
                const right = this.relationalExpression();
                expr = {
                    type: ASTNodeType.BINARY_EXPRESSION,
                    operator,
                    left: expr,
                    right
                };
            }
            
            return expr;
        }
        
        relationalExpression() {
            let expr = this.shiftExpression();
            
            while (this.match(TokenType.LESS_THAN, TokenType.LESS_EQUAL,
                              TokenType.GREATER_THAN, TokenType.GREATER_EQUAL)) {
                const operator = this.previous().value;
                const right = this.shiftExpression();
                expr = {
                    type: ASTNodeType.BINARY_EXPRESSION,
                    operator,
                    left: expr,
                    right
                };
            }
            
            return expr;
        }
        
        shiftExpression() {
            let expr = this.additiveExpression();
            
            while (this.match(TokenType.LEFT_SHIFT, TokenType.RIGHT_SHIFT, TokenType.UNSIGNED_RIGHT_SHIFT)) {
                const operator = this.previous().value;
                const right = this.additiveExpression();
                expr = {
                    type: ASTNodeType.BINARY_EXPRESSION,
                    operator,
                    left: expr,
                    right
                };
            }
            
            return expr;
        }
        
        additiveExpression() {
            let expr = this.multiplicativeExpression();
            
            while (this.match(TokenType.PLUS, TokenType.MINUS)) {
                const operator = this.previous().value;
                const right = this.multiplicativeExpression();
                expr = {
                    type: ASTNodeType.BINARY_EXPRESSION,
                    operator,
                    left: expr,
                    right
                };
            }
            
            return expr;
        }
        
        multiplicativeExpression() {
            let expr = this.exponentiationExpression();
            
            while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO)) {
                const operator = this.previous().value;
                const right = this.exponentiationExpression();
                expr = {
                    type: ASTNodeType.BINARY_EXPRESSION,
                    operator,
                    left: expr,
                    right
                };
            }
            
            return expr;
        }
        
        exponentiationExpression() {
            let expr = this.unaryExpression();
            
            if (this.match(TokenType.POWER)) {
                const operator = this.previous().value === '^' ? '**' : this.previous().value;
                const right = this.exponentiationExpression(); // Right associative
                expr = {
                    type: ASTNodeType.BINARY_EXPRESSION,
                    operator,
                    left: expr,
                    right
                };
            }
            
            return expr;
        }
        
        unaryExpression() {
            if (this.match(TokenType.NOT, TokenType.MINUS, TokenType.PLUS, 
                          TokenType.BITWISE_NOT, TokenType.INCREMENT, TokenType.DECREMENT)) {
                let operator = this.previous().value;
                if (operator === 'not') operator = '!';
                const argument = this.unaryExpression();
                
                if (operator === '++' || operator === '--') {
                    return {
                        type: ASTNodeType.UPDATE_EXPRESSION,
                        operator,
                        argument,
                        prefix: true
                    };
                }
                
                return {
                    type: ASTNodeType.UNARY_EXPRESSION,
                    operator,
                    argument
                };
            }
            
            if (this.match(TokenType.AWAIT)) {
                if (!this.scope.async && !this.options.allowAwaitOutsideFunction) {
                    throw new Error("Await expression outside async function");
                }
                
                const argument = this.unaryExpression();
                return {
                    type: ASTNodeType.AWAIT_EXPRESSION,
                    argument
                };
            }
            
            return this.postfixExpression();
        }
        
        postfixExpression() {
            let expr = this.callExpression();
            
            if (this.match(TokenType.INCREMENT, TokenType.DECREMENT)) {
                const operator = this.previous().value;
                return {
                    type: ASTNodeType.UPDATE_EXPRESSION,
                    operator,
                    argument: expr,
                    prefix: false
                };
            }
            
            return expr;
        }
        
        callExpression() {
            let expr = this.memberExpression();
            
            while (true) {
                if (this.match(TokenType.LEFT_PAREN)) {
                    expr = this.finishCall(expr);
                } else if (this.match(TokenType.LEFT_BRACKET)) {
                    const property = this.expression();
                    this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after computed property");
                    expr = {
                        type: ASTNodeType.MEMBER_EXPRESSION,
                        object: expr,
                        property,
                        computed: true
                    };
                } else if (this.match(TokenType.DOT)) {
                    const property = this.consume(TokenType.IDENTIFIER, "Expected property name after '.'");
                    expr = {
                        type: ASTNodeType.MEMBER_EXPRESSION,
                        object: expr,
                        property: { type: ASTNodeType.IDENTIFIER, name: property.value },
                        computed: false
                    };
                } else if (this.match(TokenType.OPTIONAL_CHAINING)) {
                    if (this.check(TokenType.LEFT_BRACKET)) {
                        this.advance();
                        const property = this.expression();
                        this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after computed property");
                        expr = {
                            type: ASTNodeType.MEMBER_EXPRESSION,
                            object: expr,
                            property,
                            computed: true,
                            optional: true
                        };
                    } else if (this.check(TokenType.IDENTIFIER)) {
                        const property = this.advance();
                        expr = {
                            type: ASTNodeType.MEMBER_EXPRESSION,
                            object: expr,
                            property: { type: ASTNodeType.IDENTIFIER, name: property.value },
                            computed: false,
                            optional: true
                        };
                    } else if (this.check(TokenType.LEFT_PAREN)) {
                        expr = this.finishCall(expr, true);
                    }
                } else {
                    break;
                }
            }
            
            return expr;
        }
        
        finishCall(callee, optional = false) {
            const args = [];
            
            if (!this.check(TokenType.RIGHT_PAREN)) {
                do {
                    if (this.match(TokenType.SPREAD)) {
                        const argument = this.assignmentExpression();
                        args.push({
                            type: ASTNodeType.SPREAD_ELEMENT,
                            argument
                        });
                    } else {
                        args.push(this.assignmentExpression());
                    }
                } while (this.match(TokenType.COMMA));
            }
            
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments");
            
            return {
                type: ASTNodeType.CALL_EXPRESSION,
                callee,
                arguments: args,
                optional
            };
        }
        
        memberExpression() {
            if (this.match(TokenType.NEW)) {
                const callee = this.memberExpression();
                
                let args = [];
                if (this.check(TokenType.LEFT_PAREN)) {
                    this.advance();
                    if (!this.check(TokenType.RIGHT_PAREN)) {
                        do {
                            args.push(this.assignmentExpression());
                        } while (this.match(TokenType.COMMA));
                    }
                    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments");
                }
                
                return {
                    type: ASTNodeType.NEW_EXPRESSION,
                    callee,
                    arguments: args
                };
            }
            
            return this.primaryExpression();
        }
        
        primaryExpression() {
            // Literals
            if (this.match(TokenType.BOOLEAN, TokenType.NIL, TokenType.NUMBER, TokenType.STRING)) {
                return {
                    type: ASTNodeType.LITERAL,
                    value: this.previous().value,
                    raw: this.previous().value
                };
            }
            
            // Template literals
            if (this.match(TokenType.TEMPLATE_LITERAL)) {
                return this.templateLiteral();
            }
            
            // Regular expressions
            if (this.match(TokenType.REGEX)) {
                const { pattern, flags } = this.previous().value;
                return {
                    type: ASTNodeType.LITERAL,
                    value: new RegExp(pattern, flags),
                    raw: `/${pattern}/${flags}`,
                    regex: { pattern, flags }
                };
            }
            
            // Identifiers
            if (this.match(TokenType.IDENTIFIER)) {
                return {
                    type: ASTNodeType.IDENTIFIER,
                    name: this.previous().value
                };
            }
            
            // Super
            if (this.match(TokenType.SUPER)) {
                if (!this.scope.inClass) {
                    throw new Error("'super' outside class");
                }
                return { type: ASTNodeType.SUPER };
            }
            
            // This
            if (this.match(TokenType.THIS)) {
                return { type: ASTNodeType.IDENTIFIER, name: 'this' };
            }
            
            // Parenthesized expressions
            if (this.match(TokenType.LEFT_PAREN)) {
                const expr = this.expression();
                this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression");
                return expr;
            }
            
            // Array literals
            if (this.match(TokenType.LEFT_BRACKET)) {
                return this.arrayExpression();
            }
            
            // Object literals
            if (this.match(TokenType.LEFT_BRACE)) {
                return this.objectExpression();
            }
            
            // Function expressions
            if (this.match(TokenType.FUNCTION)) {
                return this.functionExpression();
            }
            
            // Arrow functions
            if (this.check(TokenType.IDENTIFIER) && this.peek(1).type === TokenType.ARROW) {
                return this.arrowFunctionExpression();
            }
            
            // Class expressions
            if (this.match(TokenType.CLASS)) {
                return this.classExpression();
            }
            
            throw new Error(`Unexpected token ${this.peek().type} at line ${this.peek().line}`);
        }
        
        templateLiteral() {
            const value = this.previous().value;
            const quasis = [];
            const expressions = [];
            
            // Parse template literal with interpolations
            let current = '';
            let i = 0;
            
            while (i < value.length) {
                if (value.substr(i, 2) === '${') {
                    // Add current quasi
                    quasis.push({
                        type: ASTNodeType.TEMPLATE_ELEMENT,
                        value: { raw: current, cooked: current },
                        tail: false
                    });
                    
                    current = '';
                    i += 2;
                    
                    // Find matching closing brace
                    let braceCount = 1;
                    let exprStart = i;
                    while (i < value.length && braceCount > 0) {
                        if (value[i] === '{') braceCount++;
                        else if (value[i] === '}') braceCount--;
                        i++;
                    }
                    
                    // Parse expression
                    const exprSource = value.substring(exprStart, i - 1);
                    const exprLexer = new AdvancedLexer(exprSource);
                    const exprTokens = exprLexer.tokenize();
                    const exprParser = new AdvancedParser(exprTokens);
                    const expr = exprParser.expression();
                    expressions.push(expr);
                } else {
                    current += value[i];
                    i++;
                }
            }
            
            // Add final quasi
            quasis.push({
                type: ASTNodeType.TEMPLATE_ELEMENT,
                value: { raw: current, cooked: current },
                tail: true
            });
            
            return {
                type: ASTNodeType.TEMPLATE_LITERAL,
                quasis,
                expressions
            };
        }
        
        arrayExpression() {
            const elements = [];
            
            if (!this.check(TokenType.RIGHT_BRACKET)) {
                do {
                    if (this.match(TokenType.COMMA)) {
                        // Hole in sparse array
                        elements.push(null);
                    } else if (this.match(TokenType.SPREAD)) {
                        const argument = this.assignmentExpression();
                        elements.push({
                            type: ASTNodeType.SPREAD_ELEMENT,
                            argument
                        });
                    } else {
                        elements.push(this.assignmentExpression());
                    }
                } while (this.match(TokenType.COMMA) && !this.check(TokenType.RIGHT_BRACKET));
            }
            
            this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after array elements");
            
            return {
                type: ASTNodeType.ARRAY_EXPRESSION,
                elements
            };
        }
        
        objectExpression() {
            const properties = [];
            this.skipNewlines();
            
            while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                if (this.match(TokenType.NEWLINE)) continue;
                
                if (this.match(TokenType.SPREAD)) {
                    const argument = this.assignmentExpression();
                    properties.push({
                        type: ASTNodeType.SPREAD_ELEMENT,
                        argument
                    });
                } else {
                    let key;
                    let computed = false;
                    
                    if (this.match(TokenType.LEFT_BRACKET)) {
                        key = this.expression();
                        computed = true;
                        this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after computed key");
                    } else if (this.check(TokenType.STRING) || this.check(TokenType.NUMBER)) {
                        key = {
                            type: ASTNodeType.LITERAL,
                            value: this.advance().value
                        };
                    } else {
                        const name = this.consume(TokenType.IDENTIFIER, "Expected property name").value;
                        key = {
                            type: ASTNodeType.IDENTIFIER,
                            name
                        };
                    }
                    
                    if (this.match(TokenType.COLON) || this.match(TokenType.ASSIGN)) {
                        const value = this.assignmentExpression();
                        properties.push({
                            type: ASTNodeType.PROPERTY,
                            key,
                            value,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            computed
                        });
                    } else if (this.check(TokenType.LEFT_PAREN)) {
                        // Method
                        const value = this.functionExpression();
                        properties.push({
                            type: ASTNodeType.PROPERTY,
                            key,
                            value,
                            kind: 'init',
                            method: true,
                            shorthand: false,
                            computed
                        });
                    } else {
                        // Shorthand property
                        properties.push({
                            type: ASTNodeType.PROPERTY,
                            key,
                            value: key,
                            kind: 'init',
                            method: false,
                            shorthand: true,
                            computed: false
                        });
                    }
                }
                
                this.skipNewlines();
                
                if (!this.check(TokenType.RIGHT_BRACE)) {
                    this.match(TokenType.COMMA, TokenType.SEMICOLON);
                    this.skipNewlines();
                }
            }
            
            this.consume(TokenType.RIGHT_BRACE, "Expected '}' after object properties");
            
            return {
                type: ASTNodeType.OBJECT_EXPRESSION,
                properties
            };
        }
        
        functionExpression() {
            const isAsync = this.previous()?.type === TokenType.ASYNC;
            const isGenerator = this.match(TokenType.MULTIPLY);
            
            let id = null;
            if (this.check(TokenType.IDENTIFIER)) {
                id = {
                    type: ASTNodeType.IDENTIFIER,
                    name: this.advance().value
                };
            }
            
            this.consume(TokenType.LEFT_PAREN, "Expected '(' after 'function'");
            
            const params = [];
            if (!this.check(TokenType.RIGHT_PAREN)) {
                do {
                    if (this.match(TokenType.SPREAD)) {
                        const param = this.consume(TokenType.IDENTIFIER, "Expected parameter name after '...'").value;
                        params.push({
                            type: ASTNodeType.REST_ELEMENT,
                            argument: { type: ASTNodeType.IDENTIFIER, name: param }
                        });
                        break;
                    } else {
                        const param = this.consume(TokenType.IDENTIFIER, "Expected parameter name").value;
                        let defaultValue = null;
                        
                        if (this.match(TokenType.ASSIGN)) {
                            defaultValue = this.assignmentExpression();
                        }
                        
                        params.push(defaultValue ? {
                            type: ASTNodeType.ASSIGNMENT_PATTERN,
                            left: { type: ASTNodeType.IDENTIFIER, name: param },
                            right: defaultValue
                        } : { type: ASTNodeType.IDENTIFIER, name: param });
                    }
                } while (this.match(TokenType.COMMA));
            }
            
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after parameters");
            
            this.enterScope('function', { inFunction: true, async: isAsync, generator: isGenerator });
            const body = this.blockStatement();
            this.exitScope();
            
            return {
                type: ASTNodeType.FUNCTION_EXPRESSION,
                id,
                params,
                body,
                async: isAsync,
                generator: isGenerator
            };
        }
        
        arrowFunctionExpression() {
            const params = [];
            
            if (this.check(TokenType.LEFT_PAREN)) {
                this.advance();
                if (!this.check(TokenType.RIGHT_PAREN)) {
                    do {
                        params.push({
                            type: ASTNodeType.IDENTIFIER,
                            name: this.consume(TokenType.IDENTIFIER, "Expected parameter name").value
                        });
                    } while (this.match(TokenType.COMMA));
                }
                this.consume(TokenType.RIGHT_PAREN, "Expected ')' after parameters");
            } else {
                params.push({
                    type: ASTNodeType.IDENTIFIER,
                    name: this.consume(TokenType.IDENTIFIER, "Expected parameter name").value
                });
            }
            
            this.consume(TokenType.ARROW, "Expected '=>' after parameters");
            
            this.enterScope('function', { inFunction: true });
            
            let body;
            if (this.check(TokenType.LEFT_BRACE)) {
                body = this.blockStatement();
            } else {
                const expr = this.assignmentExpression();
                body = {
                    type: ASTNodeType.BLOCK_STATEMENT,
                    body: [{
                        type: ASTNodeType.RETURN_STATEMENT,
                        argument: expr
                    }]
                };
            }
            
            this.exitScope();
            
            return {
                type: ASTNodeType.ARROW_FUNCTION_EXPRESSION,
                params,
                body,
                async: false,
                generator: false
            };
        }
        
        classExpression() {
            let id = null;
            if (this.check(TokenType.IDENTIFIER)) {
                id = {
                    type: ASTNodeType.IDENTIFIER,
                    name: this.advance().value
                };
            }
            
            let superClass = null;
            if (this.match(TokenType.EXTENDS)) {
                superClass = this.primaryExpression();
            }
            
            this.consume(TokenType.LEFT_BRACE, "Expected '{' after class");
            this.skipNewlines();
            
            const body = [];
            
            this.enterScope('class', { inClass: true });
            
            while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                if (this.match(TokenType.NEWLINE)) continue;
                
                const isStatic = this.match(TokenType.STATIC);
                const isAsync = this.match(TokenType.ASYNC);
                const isGenerator = this.match(TokenType.MULTIPLY);
                
                const key = this.consume(TokenType.IDENTIFIER, "Expected method name").value;
                const value = this.functionExpression();
                
                body.push({
                    type: ASTNodeType.METHOD_DEFINITION,
                    key: { type: ASTNodeType.IDENTIFIER, name: key },
                    value,
                    kind: key === 'constructor' ? 'constructor' : 'method',
                    static: isStatic,
                    async: isAsync,
                    generator: isGenerator
                });
                
                this.skipNewlines();
            }
            
            this.exitScope();
            
            this.consume(TokenType.RIGHT_BRACE, "Expected '}' after class body");
            
            return {
                type: ASTNodeType.CLASS_EXPRESSION,
                id,
                superClass,
                body: {
                    type: 'ClassBody',
                    body
                }
            };
        }
    }
    
    /* ============================================================================
     * VIRTUAL DOM SYSTEM
     * ============================================================================ */
    
    // Virtual DOM Node Types
    const VNodeType = {
        ELEMENT: 'ELEMENT',
        TEXT: 'TEXT',
        COMMENT: 'COMMENT',
        COMPONENT: 'COMPONENT',
        FRAGMENT: 'FRAGMENT',
        PORTAL: 'PORTAL',
        SUSPENSE: 'SUSPENSE'
    };
    
    /**
     * Enhanced Virtual Node with fiber-like capabilities
     */
    class VNode {
        constructor(type, props = {}, children = []) {
            this.type = type;
            this.props = props || {};
            this.children = Array.isArray(children) ? children : [children];
            this.key = props.key || null;
            this.ref = props.ref || null;
            
            // DOM references
            this.element = null;
            this.component = null;
            
            // Fiber-like properties
            this.alternate = null; // Previous version for comparison
            this.parent = null;
            this.sibling = null;
            this.child = null;
            this.index = 0;
            this.effectTag = null; // PLACEMENT, UPDATE, DELETION
            this.hooks = null; // Component hooks
            this.memoizedProps = null;
            this.memoizedState = null;
            
            // Performance tracking
            this.actualDuration = 0;
            this.actualStartTime = 0;
            this.selfBaseDuration = 0;
            this.treeBaseDuration = 0;
        }
        
        // Type checking methods
        isText() { return this.type === VNodeType.TEXT; }
        isElement() { return this.type === VNodeType.ELEMENT; }
        isComponent() { return this.type === VNodeType.COMPONENT; }
        isFragment() { return this.type === VNodeType.FRAGMENT; }
        isPortal() { return this.type === VNodeType.PORTAL; }
        
        // Clone with modifications
        clone(props = {}, children = null) {
            const cloned = new VNode(
                this.type,
                { ...this.props, ...props },
                children !== null ? children : this.children.map(child => 
                    child instanceof VNode ? child.clone() : child
                )
            );
            cloned.key = props.key !== undefined ? props.key : this.key;
            return cloned;
        }
        
        // Serialize for debugging
        serialize() {
            return {
                type: this.type,
                props: this.props,
                children: this.children.map(child => 
                    child instanceof VNode ? child.serialize() : child
                ),
                key: this.key
            };
        }
    }
    
    // Virtual DOM creation helpers
    const createElement = (type, props, ...children) => {
        const flatChildren = children.flat().filter(child => child != null);
        return new VNode(type, props, flatChildren);
    };
    
    const createTextNode = (content) => {
        return new VNode(VNodeType.TEXT, {}, [String(content)]);
    };
    
    const createComponent = (type, props, children) => {
        return new VNode(VNodeType.COMPONENT, { ...props, componentType: type }, children);
    };
    
    const createFragment = (children) => {
        return new VNode(VNodeType.FRAGMENT, {}, children);
    };
    
    const createPortal = (children, container) => {
        return new VNode(VNodeType.PORTAL, { container }, children);
    };
    
    // JSX-like shorthand
    const h = createElement;
    const text = createTextNode;
    const component = createComponent;
    const fragment = createFragment;
    const portal = createPortal;
    
    /* ============================================================================
     * FIBER-LIKE RECONCILER
     * ============================================================================ */
    
    /**
     * Advanced Reconciler with Fiber-like architecture
     */
    class FiberReconciler {
        constructor() {
            this.currentRoot = null;
            this.workInProgressRoot = null;
            this.nextUnitOfWork = null;
            this.deletions = [];
            this.currentHookIndex = 0;
            this.wipFiber = null;
            this.isRendering = false;
            this.shouldYield = false;
            this.startTime = 0;
            
            // Performance configuration
            this.timeSlice = 5; // milliseconds
            this.idleCallback = typeof requestIdleCallback !== 'undefined' ? 
                requestIdleCallback : setTimeout;
            
            // Hook state
            this.hookState = new Map();
            
            this.startWorkLoop();
        }
        
        // Schedule work
        scheduleWork(fiber) {
            if (!this.workInProgressRoot) {
                this.workInProgressRoot = {
                    ...fiber,
                    alternate: this.currentRoot
                };
                this.nextUnitOfWork = this.workInProgressRoot;
            }
        }
        
        // Work loop
        startWorkLoop() {
            const workLoop = (deadline) => {
                this.shouldYield = deadline && deadline.timeRemaining() < 1;
                
                while (this.nextUnitOfWork && !this.shouldYield) {
                    this.nextUnitOfWork = this.performUnitOfWork(this.nextUnitOfWork);
                }
                
                if (!this.nextUnitOfWork && this.workInProgressRoot) {
                    this.commitRoot();
                }
                
                this.idleCallback(workLoop);
            };
            
            this.idleCallback(workLoop);
        }
        
        // Perform unit of work
        performUnitOfWork(fiber) {
            const isFunctionComponent = typeof fiber.type === 'function';
            
            if (isFunctionComponent) {
                this.updateFunctionComponent(fiber);
            } else {
                this.updateHostComponent(fiber);
            }
            
            // Return next unit of work
            if (fiber.child) {
                return fiber.child;
            }
            
            let nextFiber = fiber;
            while (nextFiber) {
                if (nextFiber.sibling) {
                    return nextFiber.sibling;
                }
                nextFiber = nextFiber.parent;
            }
            
            return null;
        }
        
        // Update function component
        updateFunctionComponent(fiber) {
            this.wipFiber = fiber;
            this.currentHookIndex = 0;
            this.wipFiber.hooks = [];
            
            const children = [fiber.type(fiber.props)];
            this.reconcileChildren(fiber, children);
        }
        
        // Update host component
        updateHostComponent(fiber) {
            if (!fiber.dom) {
                fiber.dom = this.createDom(fiber);
            }
            
            this.reconcileChildren(fiber, fiber.props.children);
        }
        
        // Reconcile children
        reconcileChildren(wipFiber, elements) {
            let index = 0;
            let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
            let prevSibling = null;
            
            while (index < elements.length || oldFiber != null) {
                const element = elements[index];
                let newFiber = null;
                
                const sameType = oldFiber && element && element.type === oldFiber.type;
                
                if (sameType) {
                    // Update
                    newFiber = {
                        type: oldFiber.type,
                        props: element.props,
                        dom: oldFiber.dom,
                        parent: wipFiber,
                        alternate: oldFiber,
                        effectTag: 'UPDATE'
                    };
                } else if (element && !sameType) {
                    // Placement
                    newFiber = {
                        type: element.type,
                        props: element.props,
                        dom: null,
                        parent: wipFiber,
                        alternate: null,
                        effectTag: 'PLACEMENT'
                    };
                }
                
                if (oldFiber && !sameType) {
                    // Deletion
                    oldFiber.effectTag = 'DELETION';
                    this.deletions.push(oldFiber);
                }
                
                if (oldFiber) {
                    oldFiber = oldFiber.sibling;
                }
                
                if (index === 0) {
                    wipFiber.child = newFiber;
                } else if (element) {
                    prevSibling.sibling = newFiber;
                }
                
                prevSibling = newFiber;
                index++;
            }
        }
        
        // Create DOM element
        createDom(fiber) {
            const dom = fiber.type === VNodeType.TEXT ? 
                document.createTextNode("") :
                document.createElement(fiber.type);
            
            this.updateDom(dom, {}, fiber.props);
            
            return dom;
        }
        
        // Update DOM properties
        updateDom(dom, prevProps, nextProps) {
            const isEvent = key => key.startsWith("on");
            const isProperty = key => key !== "children" && !isEvent(key);
            const isNew = (prev, next) => key => prev[key] !== next[key];
            const isGone = (prev, next) => key => !(key in next);
            
            // Remove old or changed event listeners
            Object.keys(prevProps)
                .filter(isEvent)
                .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
                .forEach(name => {
                    const eventType = name.toLowerCase().substring(2);
                    dom.removeEventListener(eventType, prevProps[name]);
                });
            
            // Remove old properties
            Object.keys(prevProps)
                .filter(isProperty)
                .filter(isGone(prevProps, nextProps))
                .forEach(name => {
                    dom[name] = "";
                });
            
            // Set new or changed properties
            Object.keys(nextProps)
                .filter(isProperty)
                .filter(isNew(prevProps, nextProps))
                .forEach(name => {
                    if (name === 'style' && typeof nextProps[name] === 'object') {
                        Object.assign(dom.style, nextProps[name]);
                    } else {
                        dom[name] = nextProps[name];
                    }
                });
            
            // Add event listeners
            Object.keys(nextProps)
                .filter(isEvent)
                .filter(isNew(prevProps, nextProps))
                .forEach(name => {
                    const eventType = name.toLowerCase().substring(2);
                    dom.addEventListener(eventType, nextProps[name]);
                });
        }
        
        // Commit root
        commitRoot() {
            this.deletions.forEach(this.commitWork.bind(this));
            this.commitWork(this.workInProgressRoot.child);
            this.currentRoot = this.workInProgressRoot;
            this.workInProgressRoot = null;
            this.deletions = [];
        }
        
        // Commit work
        commitWork(fiber) {
            if (!fiber) return;
            
            let domParentFiber = fiber.parent;
            while (!domParentFiber.dom) {
                domParentFiber = domParentFiber.parent;
            }
            const domParent = domParentFiber.dom;
            
            if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
                domParent.appendChild(fiber.dom);
            } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
                this.updateDom(fiber.dom, fiber.alternate.props, fiber.props);
            } else if (fiber.effectTag === "DELETION") {
                this.commitDeletion(fiber, domParent);
            }
            
            this.commitWork(fiber.child);
            this.commitWork(fiber.sibling);
        }
        
        // Commit deletion
        commitDeletion(fiber, domParent) {
            if (fiber.dom) {
                domParent.removeChild(fiber.dom);
            } else {
                this.commitDeletion(fiber.child, domParent);
            }
        }
        
        // Hook implementations
        useState(initial) {
            const oldHook = this.wipFiber.alternate &&
                this.wipFiber.alternate.hooks &&
                this.wipFiber.alternate.hooks[this.currentHookIndex];
            
            const hook = {
                state: oldHook ? oldHook.state : initial,
                queue: []
            };
            
            const actions = oldHook ? oldHook.queue : [];
            actions.forEach(action => {
                hook.state = typeof action === 'function' ? action(hook.state) : action;
            });
            
            const setState = (action) => {
                hook.queue.push(action);
                this.scheduleWork({
                    dom: this.currentRoot.dom,
                    props: this.currentRoot.props,
                    alternate: this.currentRoot
                });
            };
            
            this.wipFiber.hooks.push(hook);
            this.currentHookIndex++;
            
            return [hook.state, setState];
        }
        
        useEffect(effect, deps) {
            const oldHook = this.wipFiber.alternate &&
                this.wipFiber.alternate.hooks &&
                this.wipFiber.alternate.hooks[this.currentHookIndex];
            
            const hasChanged = oldHook ?
                !deps || deps.some((dep, i) => dep !== oldHook.deps[i]) :
                true;
            
            const hook = {
                effect,
                deps,
                cleanup: oldHook ? oldHook.cleanup : null
            };
            
            if (hasChanged) {
                if (hook.cleanup) {
                    hook.cleanup();
                }
                hook.cleanup = effect();
            }
            
            this.wipFiber.hooks.push(hook);
            this.currentHookIndex++;
        }
        
        useMemo(factory, deps) {
            const oldHook = this.wipFiber.alternate &&
                this.wipFiber.alternate.hooks &&
                this.wipFiber.alternate.hooks[this.currentHookIndex];
            
            const hasChanged = oldHook ?
                !deps || deps.some((dep, i) => dep !== oldHook.deps[i]) :
                true;
            
            const hook = {
                memoizedValue: hasChanged ? factory() : oldHook.memoizedValue,
                deps
            };
            
            this.wipFiber.hooks.push(hook);
            this.currentHookIndex++;
            
            return hook.memoizedValue;
        }
        
        useCallback(callback, deps) {
            return this.useMemo(() => callback, deps);
        }
    }
    
    /* ============================================================================
     * REACTIVE SYSTEM IMPLEMENTATION
     * ============================================================================ */
    
    /**
     * Advanced Reactive System with Proxy-based reactivity
     */
    class AdvancedReactiveSystem {
        constructor() {
            this.currentEffect = null;
            this.effectStack = [];
            this.targetMap = new WeakMap();
            this.reactiveMap = new WeakMap();
            this.readonlyMap = new WeakMap();
            this.shallowReactiveMap = new WeakMap();
            
            // Effect scheduler
            this.queue = new Set();
            this.isFlushPending = false;
            this.flushIndex = 0;
            this.pendingPreFlushCbs = [];
            this.pendingPostFlushCbs = [];
        }
        
        // Create reactive proxy
        reactive(target) {
            if (typeof target !== 'object' || target === null) return target;
            if (this.reactiveMap.has(target)) return this.reactiveMap.get(target);
            
            const proxy = new Proxy(target, {
                get: (target, key, receiver) => {
                    if (key === '__v_isReactive') return true;
                    if (key === '__v_raw') return target;
                    
                    const result = Reflect.get(target, key, receiver);
                    
                    this.track(target, 'get', key);
                    
                    if (typeof result === 'object' && result !== null) {
                        return this.reactive(result);
                    }
                    
                    return result;
                },
                
                set: (target, key, value, receiver) => {
                    const oldValue = target[key];
                    const result = Reflect.set(target, key, value, receiver);
                    
                    if (oldValue !== value || (typeof value === 'object' && value !== null)) {
                        this.trigger(target, 'set', key, value, oldValue);
                    }
                    
                    return result;
                },
                
                deleteProperty: (target, key) => {
                    const hadKey = Object.prototype.hasOwnProperty.call(target, key);
                    const oldValue = target[key];
                    const result = Reflect.deleteProperty(target, key);
                    
                    if (result && hadKey) {
                        this.trigger(target, 'delete', key, undefined, oldValue);
                    }
                    
                    return result;
                },
                
                has: (target, key) => {
                    const result = Reflect.has(target, key);
                    this.track(target, 'has', key);
                    return result;
                },
                
                ownKeys: (target) => {
                    this.track(target, 'iterate', Array.isArray(target) ? 'length' : Symbol.iterator);
                    return Reflect.ownKeys(target);
                }
            });
            
            this.reactiveMap.set(target, proxy);
            return proxy;
        }
        
        // Create readonly proxy
        readonly(target) {
            if (typeof target !== 'object' || target === null) return target;
            if (this.readonlyMap.has(target)) return this.readonlyMap.get(target);
            
            const proxy = new Proxy(target, {
                get: (target, key, receiver) => {
                    if (key === '__v_isReadonly') return true;
                    if (key === '__v_raw') return target;
                    
                    const result = Reflect.get(target, key, receiver);
                    
                    this.track(target, 'get', key);
                    
                    if (typeof result === 'object' && result !== null) {
                        return this.readonly(result);
                    }
                    
                    return result;
                },
                
                set: () => {
                    console.warn('Set operation on readonly object');
                    return false;
                },
                
                deleteProperty: () => {
                    console.warn('Delete operation on readonly object');
                    return false;
                }
            });
            
            this.readonlyMap.set(target, proxy);
            return proxy;
        }
        
        // Create shallow reactive proxy
        shallowReactive(target) {
            if (typeof target !== 'object' || target === null) return target;
            if (this.shallowReactiveMap.has(target)) return this.shallowReactiveMap.get(target);
            
            const proxy = new Proxy(target, {
                get: (target, key, receiver) => {
                    if (key === '__v_isReactive') return true;
                    if (key === '__v_raw') return target;
                    
                    const result = Reflect.get(target, key, receiver);
                    this.track(target, 'get', key);
                    return result;
                },
                
                set: (target, key, value, receiver) => {
                    const oldValue = target[key];
                    const result = Reflect.set(target, key, value, receiver);
                    
                    if (oldValue !== value) {
                        this.trigger(target, 'set', key, value, oldValue);
                    }
                    
                    return result;
                }
            });
            
            this.shallowReactiveMap.set(target, proxy);
            return proxy;
        }
        
        // Track dependencies
        track(target, type, key) {
            if (!this.currentEffect) return;
            
            let depsMap = this.targetMap.get(target);
            if (!depsMap) {
                this.targetMap.set(target, (depsMap = new Map()));
            }
            
            let dep = depsMap.get(key);
            if (!dep) {
                depsMap.set(key, (dep = new Set()));
            }
            
            if (!dep.has(this.currentEffect)) {
                dep.add(this.currentEffect);
                this.currentEffect.deps.push(dep);
            }
        }
        
        // Trigger effects
        trigger(target, type, key, newValue, oldValue) {
            const depsMap = this.targetMap.get(target);
            if (!depsMap) return;
            
            const effects = new Set();
            const computedRunners = new Set();
            
            const add = (effectsToAdd) => {
                if (effectsToAdd) {
                    effectsToAdd.forEach(effect => {
                        if (effect !== this.currentEffect) {
                            if (effect.computed) {
                                computedRunners.add(effect);
                            } else {
                                effects.add(effect);
                            }
                        }
                    });
                }
            };
            
            // Key-specific effects
            add(depsMap.get(key));
            
            // Array length changes
            if (type === 'set' && Array.isArray(target) && key === 'length') {
                depsMap.forEach((dep, key) => {
                    if (key === 'length' || key >= newValue) {
                        add(dep);
                    }
                });
            } else if (type === 'add' && Array.isArray(target)) {
                add(depsMap.get('length'));
            }
            
            // Run computed effects first
            computedRunners.forEach(effect => {
                if (effect.scheduler) {
                    effect.scheduler();
                } else {
                    effect();
                }
            });
            
            // Run regular effects
            effects.forEach(effect => {
                if (effect.scheduler) {
                    effect.scheduler();
                } else {
                    effect();
                }
            });
        }
        
        // Create effect
        effect(fn, options = {}) {
            const effect = (...args) => {
                if (effect.active) {
                    this.cleanup(effect);
                    this.currentEffect = effect;
                    this.effectStack.push(effect);
                    
                    try {
                        return fn(...args);
                    } finally {
                        this.effectStack.pop();
                        this.currentEffect = this.effectStack[this.effectStack.length - 1];
                    }
                }
            };
            
            effect.id = ++this.uid;
            effect.active = true;
            effect.deps = [];
            effect.computed = options.computed;
            effect.scheduler = options.scheduler;
            effect.onTrack = options.onTrack;
            effect.onTrigger = options.onTrigger;
            effect.onStop = options.onStop;
            
            if (!options.lazy) {
                effect();
            }
            
            return effect;
        }
        
        // Stop effect
        stop(effect) {
            if (effect.active) {
                this.cleanup(effect);
                if (effect.onStop) {
                    effect.onStop();
                }
                effect.active = false;
            }
        }
        
        // Cleanup effect dependencies
        cleanup(effect) {
            const { deps } = effect;
            if (deps.length) {
                for (let i = 0; i < deps.length; i++) {
                    deps[i].delete(effect);
                }
                deps.length = 0;
            }
        }
        
        // Create computed property
        computed(getterOrOptions) {
            let getter, setter;
            
            if (typeof getterOrOptions === 'function') {
                getter = getterOrOptions;
                setter = () => console.warn('Computed property is readonly');
            } else {
                getter = getterOrOptions.get;
                setter = getterOrOptions.set || (() => console.warn('Computed property is readonly'));
            }
            
            let dirty = true;
            let value;
            
            const runner = this.effect(getter, {
                lazy: true,
                computed: true,
                scheduler: () => {
                    if (!dirty) {
                        dirty = true;
                        this.trigger(computed, 'set', 'value');
                    }
                }
            });
            
            const computed = {
                get value() {
                    if (dirty) {
                        value = runner();
                        dirty = false;
                    }
                    this.track(computed, 'get', 'value');
                    return value;
                },
                
                set value(newValue) {
                    setter(newValue);
                }
            };
            
            return computed;
        }
        
        // Create ref
        ref(value) {
            return {
                get value() {
                    this.track(this, 'get', 'value');
                    return value;
                },
                
                set value(newValue) {
                    if (newValue !== value) {
                        value = newValue;
                        this.trigger(this, 'set', 'value');
                    }
                }
            };
        }
        
        // Watch for changes
        watch(source, callback, options = {}) {
            let getter;
            
            if (typeof source === 'function') {
                getter = source;
            } else {
                getter = () => source.value;
            }
            
            let oldValue;
            let deep = options.deep;
            let immediate = options.immediate;
            
            const job = () => {
                const newValue = runner();
                if (deep || newValue !== oldValue) {
                    callback(newValue, oldValue);
                    oldValue = newValue;
                }
            };
            
            const runner = this.effect(getter, {
                lazy: true,
                scheduler: job
            });
            
            if (immediate) {
                job();
            } else {
                oldValue = runner();
            }
            
            return () => this.stop(runner);
        }
        
        // Batch updates
        nextTick(fn) {
            return Promise.resolve().then(fn);
        }
        
        // Queue job
        queueJob(job) {
            if (!this.queue.has(job)) {
                this.queue.add(job);
                this.queueFlush();
            }
        }
        
        // Queue flush
        queueFlush() {
            if (!this.isFlushPending) {
                this.isFlushPending = true;
                this.nextTick(() => this.flushJobs());
            }
        }
        
        // Flush jobs
        flushJobs() {
            this.isFlushPending = false;
            
            // Pre-flush callbacks
            this.flushPreFlushCbs();
            
            // Main queue
            const queue = [...this.queue].sort((a, b) => a.id - b.id);
            this.queue.clear();
            
            for (this.flushIndex = 0; this.flushIndex < queue.length; this.flushIndex++) {
                const job = queue[this.flushIndex];
                if (job.active !== false) {
                    job();
                }
            }
            
            this.flushIndex = 0;
            
            // Post-flush callbacks
            this.flushPostFlushCbs();
        }
        
        // Flush pre-flush callbacks
        flushPreFlushCbs() {
            if (this.pendingPreFlushCbs.length) {
                const activePreFlushCbs = [...new Set(this.pendingPreFlushCbs)];
                this.pendingPreFlushCbs.length = 0;
                
                for (let i = 0; i < activePreFlushCbs.length; i++) {
                    activePreFlushCbs[i]();
                }
            }
        }
        
        // Flush post-flush callbacks
        flushPostFlushCbs() {
            if (this.pendingPostFlushCbs.length) {
                const activePostFlushCbs = [...new Set(this.pendingPostFlushCbs)];
                this.pendingPostFlushCbs.length = 0;
                
                for (let i = 0; i < activePostFlushCbs.length; i++) {
                    activePostFlushCbs[i]();
                }
            }
        }
    }
    
    /* ============================================================================
     * COMPONENT SYSTEM IMPLEMENTATION
     * ============================================================================ */
    
    /**
     * Advanced Component Base Class
     */
    class AdvancedComponent {
        constructor(props = {}) {
            this.props = props;
            this.state = {};
            this.refs = {};
            this.context = {};
            
            // Lifecycle flags
            this.isMounted = false;
            this.isUpdating = false;
            this.isUnmounting = false;
            
            // Performance tracking
            this.renderCount = 0;
            this.updateCount = 0;
            this.lastRenderTime = 0;
            
            // Error boundary
            this.hasError = false;
            this.error = null;
            this.errorInfo = null;
            
            // Reactive system integration
            this.reactive = new AdvancedReactiveSystem();
            this.effects = [];
            this.watchers = [];
            
            // Initialize reactive state
            if (this.data && typeof this.data === 'function') {
                this.state = this.reactive.reactive(this.data());
            }
            
            // Bind methods
            this.setState = this.setState.bind(this);
            this.forceUpdate = this.forceUpdate.bind(this);
            this.nextTick = this.nextTick.bind(this);
        }
        
        // State management
        setState(updater, callback) {
            let newState;
            
            if (typeof updater === 'function') {
                newState = updater(this.state, this.props);
            } else {
                newState = updater;
            }
            
            // Merge state
            Object.assign(this.state, newState);
            
            // Schedule update
            this.scheduleUpdate();
            
            // Execute callback after update
            if (callback) {
                this.nextTick(callback);
            }
        }
        
        // Force update
        forceUpdate(callback) {
            this.scheduleUpdate();
            if (callback) {
                this.nextTick(callback);
            }
        }
        
        // Schedule update
        scheduleUpdate() {
            if (!this.isUpdating) {
                this.isUpdating = true;
                this.nextTick(() => {
                    this.performUpdate();
                    this.isUpdating = false;
                });
            }
        }
        
        // Perform update
        performUpdate() {
            if (this.isUnmounting) return;
            
            const startTime = performance.now();
            
            try {
                // Call lifecycle hooks
                if (this.componentWillUpdate) {
                    this.componentWillUpdate(this.props, this.state);
                }
                
                // Re-render
                const newVNode = this.render();
                
                // Update DOM
                if (this.vnode && this.element) {
                    // Diff and patch
                    const patches = this.diff(this.vnode, newVNode);
                    this.patch(this.element, patches);
                }
                
                this.vnode = newVNode;
                this.updateCount++;
                this.lastRenderTime = performance.now() - startTime;
                
                // Call lifecycle hooks
                if (this.componentDidUpdate) {
                    this.componentDidUpdate(this.props, this.state);
                }
                
            } catch (error) {
                this.handleError(error);
            }
        }
        
        // Error handling
        handleError(error, errorInfo) {
            this.hasError = true;
            this.error = error;
            this.errorInfo = errorInfo;
            
            if (this.componentDidCatch) {
                this.componentDidCatch(error, errorInfo);
            } else {
                console.error('Component Error:', error);
                if (errorInfo) {
                    console.error('Error Info:', errorInfo);
                }
            }
        }
        
        // Async operations
        nextTick(callback) {
            return this.reactive.nextTick(callback);
        }
        
        // Reactive helpers
        computed(fn) {
            const computed = this.reactive.computed(fn);
            return computed;
        }
        
        watch(source, callback, options) {
            const unwatch = this.reactive.watch(source, callback, options);
            this.watchers.push(unwatch);
            return unwatch;
        }
        
        // Effect management
        effect(fn, options) {
            const effect = this.reactive.effect(fn, options);
            this.effects.push(effect);
            return effect;
        }
        
        // Ref system
        ref(name) {
            return (element) => {
                this.refs[name] = element;
            };
        }
        
        // Simple diff algorithm
        diff(oldVNode, newVNode) {
            const patches = [];
            
            if (!oldVNode || !newVNode) {
                return [{ type: 'REPLACE', vnode: newVNode }];
            }
            
            if (oldVNode.type !== newVNode.type) {
                return [{ type: 'REPLACE', vnode: newVNode }];
            }
            
            if (oldVNode.isText() && newVNode.isText()) {
                if (oldVNode.children[0] !== newVNode.children[0]) {
                    patches.push({ type: 'TEXT', text: newVNode.children[0] });
                }
                return patches;
            }
            
            // Props diff
            const propPatches = this.diffProps(oldVNode.props, newVNode.props);
            if (propPatches.length > 0) {
                patches.push({ type: 'PROPS', props: propPatches });
            }
            
            // Children diff
            const childPatches = this.diffChildren(oldVNode.children, newVNode.children);
            if (childPatches.length > 0) {
                patches.push({ type: 'CHILDREN', children: childPatches });
            }
            
            return patches;
        }
        
        // Diff props
        diffProps(oldProps, newProps) {
            const patches = {};
            
            // Check for changed/removed props
            for (const key in oldProps) {
                if (oldProps[key] !== newProps[key]) {
                    patches[key] = newProps[key];
                }
            }
            
            // Check for new props
            for (const key in newProps) {
                if (!(key in oldProps)) {
                    patches[key] = newProps[key];
                }
            }
            
            return Object.keys(patches).length > 0 ? patches : [];
        }
        
        // Diff children
        diffChildren(oldChildren, newChildren) {
            const patches = [];
            const maxLength = Math.max(oldChildren.length, newChildren.length);
            
            for (let i = 0; i < maxLength; i++) {
                const oldChild = oldChildren[i];
                const newChild = newChildren[i];
                
                if (!oldChild && newChild) {
                    patches.push({ type: 'INSERT', index: i, vnode: newChild });
                } else if (oldChild && !newChild) {
                    patches.push({ type: 'REMOVE', index: i });
                } else if (oldChild && newChild) {
                    const childPatches = this.diff(oldChild, newChild);
                    if (childPatches.length > 0) {
                        patches.push({ type: 'UPDATE', index: i, patches: childPatches });
                    }
                }
            }
            
            return patches;
        }
        
        // Apply patches
        patch(element, patches) {
            patches.forEach(patch => {
                switch (patch.type) {
                    case 'REPLACE':
                        const newElement = this.createElement(patch.vnode);
                        element.parentNode.replaceChild(newElement, element);
                        break;
                        
                    case 'TEXT':
                        element.textContent = patch.text;
                        break;
                        
                    case 'PROPS':
                        this.updateProps(element, patch.props);
                        break;
                        
                    case 'CHILDREN':
                        this.patchChildren(element, patch.children);
                        break;
                }
            });
        }
        
        // Update props
        updateProps(element, props) {
            for (const key in props) {
                if (key.startsWith('on')) {
                    const eventName = key.slice(2).toLowerCase();
                    element.addEventListener(eventName, props[key]);
                } else if (key === 'style' && typeof props[key] === 'object') {
                    Object.assign(element.style, props[key]);
                } else {
                    element[key] = props[key];
                }
            }
        }
        
        // Patch children
        patchChildren(element, patches) {
            patches.forEach(patch => {
                switch (patch.type) {
                    case 'INSERT':
                        const newChild = this.createElement(patch.vnode);
                        if (patch.index >= element.children.length) {
                            element.appendChild(newChild);
                        } else {
                            element.insertBefore(newChild, element.children[patch.index]);
                        }
                        break;
                        
                    case 'REMOVE':
                        if (element.children[patch.index]) {
                            element.removeChild(element.children[patch.index]);
                        }
                        break;
                        
                    case 'UPDATE':
                        if (element.children[patch.index]) {
                            this.patch(element.children[patch.index], patch.patches);
                        }
                        break;
                }
            });
        }
        
        // Create DOM element from VNode
        createElement(vnode) {
            if (vnode.isText()) {
                return document.createTextNode(vnode.children[0]);
            }
            
            const element = document.createElement(vnode.type);
            
            // Set props
            this.updateProps(element, vnode.props);
            
            // Add children
            vnode.children.forEach(child => {
                if (child instanceof VNode) {
                    element.appendChild(this.createElement(child));
                } else {
                    element.appendChild(document.createTextNode(String(child)));
                }
            });
            
            return element;
        }
        
        // Lifecycle methods (to be overridden)
        componentWillMount() {}
        componentDidMount() {}
        componentWillUpdate(nextProps, nextState) {}
        componentDidUpdate(prevProps, prevState) {}
        componentWillUnmount() {}
        componentDidCatch(error, errorInfo) {}
        
        // Error boundary
        getDerivedStateFromError(error) {
            return { hasError: true };
        }
        
        // Cleanup
        cleanup() {
            // Stop watchers
            this.watchers.forEach(unwatch => unwatch());
            this.watchers = [];
            
            // Stop effects
            this.effects.forEach(effect => this.reactive.stop(effect));
            this.effects = [];
            
            // Call unmount lifecycle
            if (this.componentWillUnmount) {
                this.componentWillUnmount();
            }
            
            this.isUnmounting = true;
        }
        
        // Abstract render method
        render() {
            throw new Error('Component must implement render() method');
        }
        
        // Static methods
        static getDerivedStateFromProps(props, state) {
            return null;
        }
        
        static getDerivedStateFromError(error) {
            return null;
        }
    }
    
    /* ============================================================================
     * CSS ENGINE IMPLEMENTATION  
     * ============================================================================ */
    
    /**
     * Advanced CSS Engine with comprehensive preprocessing
     */
    class AdvancedCSSEngine {
        constructor() {
            this.variables = new Map();
            this.mixins = new Map();
            this.functions = new Map();
            this.keyframes = new Map();
            this.mediaQueries = new Map();
            this.scopedStyles = new Map();
            this.globalStyles = [];
            this.styleSheets = new Map();
            this.cache = new Map();
            
            // CSS custom properties support
            this.customProperties = new Map();
            
            // Performance monitoring
            this.parseTime = 0;
            this.compileTime = 0;
            this.injectTime = 0;
            
            this.initializeBuiltins();
        }
        
        // Initialize built-in functions and mixins
        initializeBuiltins() {
            // Built-in functions
            this.functions.set('darken', (color, amount) => {
                return this.darkenColor(color, amount);
            });
            
            this.functions.set('lighten', (color, amount) => {
                return this.lightenColor(color, amount);
            });
            
            this.functions.set('rgba', (r, g, b, a) => {
                return `rgba(${r}, ${g}, ${b}, ${a})`;
            });
            
            this.functions.set('rem', (px, base = 16) => {
                return `${parseFloat(px) / base}rem`;
            });
            
            // Built-in mixins
            this.mixins.set('flex-center', () => {
                return `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
            });
            
            this.mixins.set('absolute-center', () => {
                return `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                `;
            });
            
            this.mixins.set('clearfix', () => {
                return `
                    &::after {
                        content: "";
                        display: table;
                        clear: both;
                    }
                `;
            });
            
            this.mixins.set('transition', (property = 'all', duration = '0.3s', easing = 'ease') => {
                return `
                    transition: ${property} ${duration} ${easing};
                `;
            });
        }
        
        // Parse CSS string
        parse(css, options = {}) {
            const startTime = performance.now();
            
            try {
                const tokens = this.tokenize(css);
                const ast = this.parseTokens(tokens);
                const processed = this.processAST(ast, options);
                
                this.parseTime = performance.now() - startTime;
                return processed;
            } catch (error) {
                throw new Error(`CSS Parse Error: ${error.message}`);
            }
        }
        
        // Tokenize CSS
        tokenize(css) {
            const tokens = [];
            let current = 0;
            
            while (current < css.length) {
                let char = css[current];
                
                // Skip whitespace
                if (/\s/.test(char)) {
                    current++;
                    continue;
                }
                
                // Comments
                if (char === '/' && css[current + 1] === '*') {
                    current += 2;
                    let comment = '';
                    while (current < css.length - 1) {
                        if (css[current] === '*' && css[current + 1] === '/') {
                            current += 2;
                            break;
                        }
                        comment += css[current];
                        current++;
                    }
                    tokens.push({ type: 'comment', value: comment });
                    continue;
                }
                
                // Strings
                if (char === '"' || char === "'") {
                    const quote = char;
                    current++;
                    let value = '';
                    
                    while (current < css.length && css[current] !== quote) {
                        if (css[current] === '\\') {
                            current++;
                            value += css[current] || '';
                        } else {
                            value += css[current];
                        }
                        current++;
                    }
                    
                    current++; // Skip closing quote
                    tokens.push({ type: 'string', value });
                    continue;
                }
                
                // Numbers
                if (/\d/.test(char) || (char === '.' && /\d/.test(css[current + 1]))) {
                    let value = '';
                    
                    while (current < css.length && /[\d.]/.test(css[current])) {
                        value += css[current];
                        current++;
                    }
                    
                    // Units
                    let unit = '';
                    while (current < css.length && /[a-zA-Z%]/.test(css[current])) {
                        unit += css[current];
                        current++;
                    }
                    
                    tokens.push({
                        type: 'number',
                        value: parseFloat(value),
                        unit: unit || null
                    });
                    continue;
                }
                
                // Colors (hex)
                if (char === '#') {
                    current++;
                    let value = '#';
                    
                    while (current < css.length && /[0-9a-fA-F]/.test(css[current])) {
                        value += css[current];
                        current++;
                    }
                    
                    tokens.push({ type: 'color', value });
                    continue;
                }
                
                // Identifiers and keywords
                if (/[a-zA-Z_-]/.test(char)) {
                    let value = '';
                    
                    while (current < css.length && /[a-zA-Z0-9_-]/.test(css[current])) {
                        value += css[current];
                        current++;
                    }
                    
                    // Check for function calls
                    if (css[current] === '(') {
                        tokens.push({ type: 'function', value });
                    } else {
                        tokens.push({ type: 'identifier', value });
                    }
                    continue;
                }
                
                // At-rules
                if (char === '@') {
                    current++;
                    let value = '';
                    
                    while (current < css.length && /[a-zA-Z-]/.test(css[current])) {
                        value += css[current];
                        current++;
                    }
                    
                    tokens.push({ type: 'at-rule', value });
                    continue;
                }
                
                // Variables
                if (char === '$') {
                    current++;
                    let value = '';
                    
                    while (current < css.length && /[a-zA-Z0-9_-]/.test(css[current])) {
                        value += css[current];
                        current++;
                    }
                    
                    tokens.push({ type: 'variable', value });
                    continue;
                }
                
                // Single character tokens
                const singleChars = {
                    '{': 'lbrace',
                    '}': 'rbrace',
                    '(': 'lparen',
                    ')': 'rparen',
                    '[': 'lbracket',
                    ']': 'rbracket',
                    ':': 'colon',
                    ';': 'semicolon',
                    ',': 'comma',
                    '.': 'dot',
                    '>': 'gt',
                    '+': 'plus',
                    '~': 'tilde',
                    '*': 'asterisk',
                    '=': 'equals',
                    '!': 'exclamation'
                };
                
                if (singleChars[char]) {
                    tokens.push({ type: singleChars[char], value: char });
                    current++;
                    continue;
                }
                
                // Unknown character
                current++;
            }
            
            return tokens;
        }
        
        // Parse tokens into AST
        parseTokens(tokens) {
            const ast = {
                type: 'stylesheet',
                rules: []
            };
            
            let current = 0;
            
            while (current < tokens.length) {
                const rule = this.parseRule(tokens, current);
                if (rule.node) {
                    ast.rules.push(rule.node);
                }
                current = rule.index;
            }
            
            return ast;
        }
        
        // Parse individual rule
        parseRule(tokens, startIndex) {
            let current = startIndex;
            
            // Skip comments
            while (current < tokens.length && tokens[current].type === 'comment') {
                current++;
            }
            
            if (current >= tokens.length) {
                return { node: null, index: current };
            }
            
            const token = tokens[current];
            
            // At-rules
            if (token.type === 'at-rule') {
                return this.parseAtRule(tokens, current);
            }
            
            // Regular rules
            return this.parseStyleRule(tokens, current);
        }
        
        // Parse at-rule
        parseAtRule(tokens, startIndex) {
            let current = startIndex;
            const atRule = tokens[current];
            current++;
            
            let prelude = '';
            
            // Parse prelude
            while (current < tokens.length && tokens[current].type !== 'lbrace' && tokens[current].type !== 'semicolon') {
                if (tokens[current].type === 'identifier' || tokens[current].type === 'string') {
                    prelude += tokens[current].value + ' ';
                } else {
                    prelude += tokens[current].value;
                }
                current++;
            }
            
            prelude = prelude.trim();
            
            let block = null;
            
            if (current < tokens.length && tokens[current].type === 'lbrace') {
                const blockResult = this.parseBlock(tokens, current);
                block = blockResult.node;
                current = blockResult.index;
            } else if (current < tokens.length && tokens[current].type === 'semicolon') {
                current++;
            }
            
            return {
                node: {
                    type: 'at-rule',
                    name: atRule.value,
                    prelude,
                    block
                },
                index: current
            };
        }
        
        // Parse style rule
        parseStyleRule(tokens, startIndex) {
            let current = startIndex;
            let selector = '';
            
            // Parse selector
            while (current < tokens.length && tokens[current].type !== 'lbrace') {
                if (tokens[current].type === 'identifier' || 
                    tokens[current].type === 'dot' || 
                    tokens[current].type === 'gt' ||
                    tokens[current].type === 'plus' ||
                    tokens[current].type === 'tilde' ||
                    tokens[current].type === 'asterisk') {
                    selector += tokens[current].value;
                } else if (tokens[current].type === 'string') {
                    selector += `"${tokens[current].value}"`;
                } else {
                    selector += tokens[current].value;
                }
                current++;
            }
            
            selector = selector.trim();
            
            // Parse declarations block
            let declarations = [];
            if (current < tokens.length && tokens[current].type === 'lbrace') {
                const blockResult = this.parseDeclarationsBlock(tokens, current);
                declarations = blockResult.declarations;
                current = blockResult.index;
            }
            
            return {
                node: {
                    type: 'style-rule',
                    selector,
                    declarations
                },
                index: current
            };
        }
        
        // Parse block
        parseBlock(tokens, startIndex) {
            let current = startIndex;
            current++; // Skip opening brace
            
            const rules = [];
            
            while (current < tokens.length && tokens[current].type !== 'rbrace') {
                const rule = this.parseRule(tokens, current);
                if (rule.node) {
                    rules.push(rule.node);
                }
                current = rule.index;
            }
            
            if (current < tokens.length && tokens[current].type === 'rbrace') {
                current++;
            }
            
            return {
                node: {
                    type: 'block',
                    rules
                },
                index: current
            };
        }
        
        // Parse declarations block
        parseDeclarationsBlock(tokens, startIndex) {
            let current = startIndex;
            current++; // Skip opening brace
            
            const declarations = [];
            
            while (current < tokens.length && tokens[current].type !== 'rbrace') {
                // Skip comments
                if (tokens[current].type === 'comment') {
                    current++;
                    continue;
                }
                
                const declaration = this.parseDeclaration(tokens, current);
                if (declaration.node) {
                    declarations.push(declaration.node);
                }
                current = declaration.index;
            }
            
            if (current < tokens.length && tokens[current].type === 'rbrace') {
                current++;
            }
            
            return {
                declarations,
                index: current
            };
        }
        
        // Parse declaration
        parseDeclaration(tokens, startIndex) {
            let current = startIndex;
            
            // Property name
            if (current >= tokens.length || tokens[current].type !== 'identifier') {
                return { node: null, index: current + 1 };
            }
            
            const property = tokens[current].value;
            current++;
            
            // Colon
            if (current >= tokens.length || tokens[current].type !== 'colon') {
                return { node: null, index: current };
            }
            current++;
            
            // Value
            let value = '';
            let important = false;
            
            while (current < tokens.length && 
                   tokens[current].type !== 'semicolon' && 
                   tokens[current].type !== 'rbrace') {
                
                if (tokens[current].type === 'exclamation' && 
                    current + 1 < tokens.length && 
                    tokens[current + 1].type === 'identifier' && 
                    tokens[current + 1].value === 'important') {
                    important = true;
                    current += 2;
                    break;
                }
                
                if (tokens[current].type === 'string') {
                    value += `"${tokens[current].value}"`;
                } else if (tokens[current].type === 'number') {
                    value += tokens[current].value + (tokens[current].unit || '');
                } else {
                    value += tokens[current].value;
                }
                
                current++;
            }
            
            // Skip semicolon
            if (current < tokens.length && tokens[current].type === 'semicolon') {
                current++;
            }
            
            return {
                node: {
                    type: 'declaration',
                    property: property.trim(),
                    value: value.trim(),
                    important
                },
                index: current
            };
        }
        
        // Process AST
        processAST(ast, options = {}) {
            const processed = {
                type: 'stylesheet',
                rules: []
            };
            
            for (const rule of ast.rules) {
                const processedRule = this.processRule(rule, options);
                if (processedRule) {
                    if (Array.isArray(processedRule)) {
                        processed.rules.push(...processedRule);
                    } else {
                        processed.rules.push(processedRule);
                    }
                }
            }
            
            return processed;
        }
        
        // Process individual rule
        processRule(rule, options) {
            switch (rule.type) {
                case 'style-rule':
                    return this.processStyleRule(rule, options);
                case 'at-rule':
                    return this.processAtRule(rule, options);
                default:
                    return rule;
            }
        }
        
        // Process style rule
        processStyleRule(rule, options) {
            const processedRule = {
                type: 'style-rule',
                selector: this.processSelector(rule.selector, options),
                declarations: []
            };
            
            for (const declaration of rule.declarations) {
                const processed = this.processDeclaration(declaration, options);
                if (Array.isArray(processed)) {
                    processedRule.declarations.push(...processed);
                } else if (processed) {
                    processedRule.declarations.push(processed);
                }
            }
            
            return processedRule;
        }
        
        // Process selector
        processSelector(selector, options) {
            let processed = selector;
            
            // Scope selector if needed
            if (options.scope) {
                processed = this.scopeSelector(processed, options.scope);
            }
            
            // Process nested selectors
            processed = this.processNestedSelector(processed);
            
            return processed;
        }
        
        // Scope selector
        scopeSelector(selector, scope) {
            // Simple scoping - prepend scope class
            return selector.split(',').map(sel => {
                const trimmed = sel.trim();
                if (trimmed.startsWith('@')) return trimmed;
                return `.${scope} ${trimmed}`;
            }).join(', ');
        }
        
        // Process nested selectors
        processNestedSelector(selector) {
            // Handle & parent selector
            return selector.replace(/&/g, '');
        }
        
        // Process declaration
        processDeclaration(declaration, options) {
            const processed = {
                type: 'declaration',
                property: declaration.property,
                value: this.processValue(declaration.value, options),
                important: declaration.important
            };
            
            // Handle vendor prefixes
            if (options.autoprefixer !== false) {
                return this.addVendorPrefixes(processed);
            }
            
            return processed;
        }
        
        // Process value
        processValue(value, options) {
            let processed = value;
            
            // Process variables
            processed = this.processVariables(processed);
            
            // Process functions
            processed = this.processFunctions(processed);
            
            // Process calculations
            processed = this.processCalculations(processed);
            
            return processed;
        }
        
        // Process variables
        processVariables(value) {
            return value.replace(/\$([a-zA-Z0-9_-]+)/g, (match, varName) => {
                return this.variables.get(varName) || match;
            });
        }
        
        // Process functions
        processFunctions(value) {
            const functionRegex = /([a-zA-Z-]+)\(([^)]*)\)/g;
            
            return value.replace(functionRegex, (match, funcName, args) => {
                const func = this.functions.get(funcName);
                if (func) {
                    const argList = args.split(',').map(arg => arg.trim());
                    try {
                        return func(...argList);
                    } catch (error) {
                        console.warn(`Error executing CSS function ${funcName}:`, error);
                        return match;
                    }
                }
                return match;
            });
        }
        
        // Process calculations
        processCalculations(value) {
            return value.replace(/calc\(([^)]+)\)/g, (match, expression) => {
                try {
                    // Simple calculation evaluation
                    const sanitized = expression.replace(/px|em|rem|%|vh|vw/g, '');
                    const result = eval(sanitized);
                    return isNaN(result) ? match : result + 'px';
                } catch (error) {
                    return match;
                }
            });
        }
        
        // Process at-rule
        processAtRule(rule, options) {
            switch (rule.name) {
                case 'import':
                    return this.processImport(rule, options);
                case 'media':
                    return this.processMedia(rule, options);
                case 'keyframes':
                    return this.processKeyframes(rule, options);
                case 'mixin':
                    return this.processMixin(rule, options);
                case 'include':
                    return this.processInclude(rule, options);
                default:
                    return rule;
            }
        }
        
        // Process import
        processImport(rule, options) {
            // TODO: Implement import processing
            return rule;
        }
        
        // Process media query
        processMedia(rule, options) {
            if (rule.block) {
                const processedBlock = {
                    type: 'block',
                    rules: rule.block.rules.map(r => this.processRule(r, options))
                };
                
                return {
                    ...rule,
                    block: processedBlock
                };
            }
            
            return rule;
        }
        
        // Process keyframes
        processKeyframes(rule, options) {
            const name = rule.prelude.trim();
            this.keyframes.set(name, rule);
            return rule;
        }
        
        // Process mixin definition
        processMixin(rule, options) {
            const name = rule.prelude.trim();
            this.mixins.set(name, rule.block);
            return null; // Don't output mixin definitions
        }
        
        // Process mixin include
        processInclude(rule, options) {
            const name = rule.prelude.trim();
            const mixin = this.mixins.get(name);
            
            if (mixin) {
                return mixin.rules.map(r => this.processRule(r, options));
            }
            
            return null;
        }
        
        // Add vendor prefixes
        addVendorPrefixes(declaration) {
            const prefixes = {
                'transform': ['-webkit-transform', '-moz-transform', '-ms-transform'],
                'transition': ['-webkit-transition', '-moz-transition', '-ms-transition'],
                'animation': ['-webkit-animation', '-moz-animation'],
                'border-radius': ['-webkit-border-radius', '-moz-border-radius'],
                'box-shadow': ['-webkit-box-shadow', '-moz-box-shadow'],
                'user-select': ['-webkit-user-select', '-moz-user-select', '-ms-user-select'],
                'appearance': ['-webkit-appearance', '-moz-appearance']
            };
            
            const property = declaration.property;
            const vendorPrefixes = prefixes[property];
            
            if (vendorPrefixes) {
                const declarations = vendorPrefixes.map(prefix => ({
                    type: 'declaration',
                    property: prefix,
                    value: declaration.value,
                    important: declaration.important
                }));
                
                declarations.push(declaration);
                return declarations;
            }
            
            return declaration;
        }
        
        // Compile AST to CSS string
        compile(ast) {
            const startTime = performance.now();
            
            const css = this.compileStylesheet(ast);
            
            this.compileTime = performance.now() - startTime;
            return css;
        }
        
        // Compile stylesheet
        compileStylesheet(ast) {
            return ast.rules.map(rule => this.compileRule(rule)).join('\n\n');
        }
        
        // Compile rule
        compileRule(rule) {
            switch (rule.type) {
                case 'style-rule':
                    return this.compileStyleRule(rule);
                case 'at-rule':
                    return this.compileAtRule(rule);
                default:
                    return '';
            }
        }
        
        // Compile style rule
        compileStyleRule(rule) {
            const declarations = rule.declarations
                .map(decl => this.compileDeclaration(decl))
                .join('\n  ');
            
            return `${rule.selector} {\n  ${declarations}\n}`;
        }
        
        // Compile at-rule
        compileAtRule(rule) {
            let compiled = `@${rule.name}`;
            
            if (rule.prelude) {
                compiled += ` ${rule.prelude}`;
            }
            
            if (rule.block) {
                compiled += ` {\n${this.compileBlock(rule.block)}\n}`;
            } else {
                compiled += ';';
            }
            
            return compiled;
        }
        
        // Compile block
        compileBlock(block) {
            return block.rules.map(rule => 
                this.compileRule(rule).split('\n').map(line => '  ' + line).join('\n')
            ).join('\n\n');
        }
        
        // Compile declaration
        compileDeclaration(declaration) {
            let compiled = `${declaration.property}: ${declaration.value}`;
            
            if (declaration.important) {
                compiled += ' !important';
            }
            
            compiled += ';';
            
            return compiled;
        }
        
        // Color manipulation functions
        darkenColor(color, amount) {
            // Simple darken implementation
            const rgb = this.hexToRgb(color);
            if (!rgb) return color;
            
            const factor = 1 - (parseFloat(amount) / 100);
            const r = Math.max(0, Math.round(rgb.r * factor));
            const g = Math.max(0, Math.round(rgb.g * factor));
            const b = Math.max(0, Math.round(rgb.b * factor));
            
            return this.rgbToHex(r, g, b);
        }
        
        lightenColor(color, amount) {
            // Simple lighten implementation
            const rgb = this.hexToRgb(color);
            if (!rgb) return color;
            
            const factor = 1 + (parseFloat(amount) / 100);
            const r = Math.min(255, Math.round(rgb.r * factor));
            const g = Math.min(255, Math.round(rgb.g * factor));
            const b = Math.min(255, Math.round(rgb.b * factor));
            
            return this.rgbToHex(r, g, b);
        }
        
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        
        rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
        
        // High-level API methods
        addVariable(name, value) {
            this.variables.set(name, value);
        }
        
        addMixin(name, css) {
            this.mixins.set(name, css);
        }
        
        addFunction(name, fn) {
            this.functions.set(name, fn);
        }
        
        // Process and inject styles
        processAndInject(css, options = {}) {
            const startTime = performance.now();
            
            try {
                const ast = this.parse(css, options);
                const compiled = this.compile(ast);
                this.inject(compiled, options);
                
                this.injectTime = performance.now() - startTime;
                
                return compiled;
            } catch (error) {
                console.error('CSS processing error:', error);
                throw error;
            }
        }
        
        // Inject styles into document
        inject(css, options = {}) {
            const { id = 'luaui-styles', target = document.head } = options;
            
            let styleElement = this.styleSheets.get(id);
            
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.setAttribute('data-luaui-id', id);
                target.appendChild(styleElement);
                this.styleSheets.set(id, styleElement);
            }
            
            styleElement.textContent = css;
        }
        
        // Remove styles
        remove(id) {
            const styleElement = this.styleSheets.get(id);
            if (styleElement && styleElement.parentNode) {
                styleElement.parentNode.removeChild(styleElement);
                this.styleSheets.delete(id);
            }
        }
        
        // Performance metrics
        getMetrics() {
            return {
                parseTime: this.parseTime,
                compileTime: this.compileTime,
                injectTime: this.injectTime,
                totalTime: this.parseTime + this.compileTime + this.injectTime,
                cacheSize: this.cache.size,
                stylesheetsCount: this.styleSheets.size
            };
        }
    }
    
    /* ============================================================================
     * ANIMATION ENGINE IMPLEMENTATION
     * ============================================================================ */
    
    /**
     * Advanced Animation Engine with timeline support
     */
    class AdvancedAnimationEngine {
        constructor() {
            this.animations = new Map();
            this.timelines = new Map();
            this.tweens = new Map();
            this.rafId = null;
            this.isRunning = false;
            this.currentTime = 0;
            this.timeScale = 1;
            this.paused = false;
            
            // Performance settings
            this.maxFPS = 60;
            this.frameInterval = 1000 / this.maxFPS;
            this.lastFrameTime = 0;
            
            // Easing functions
            this.easingFunctions = {
                linear: t => t,
                easeIn: t => t * t,
                easeOut: t => t * (2 - t),
                easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
                easeInCubic: t => t * t * t,
                easeOutCubic: t => (--t) * t * t + 1,
                easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
                easeInQuart: t => t * t * t * t,
                easeOutQuart: t => 1 - (--t) * t * t * t,
                easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
                easeInQuint: t => t * t * t * t * t,
                easeOutQuint: t => 1 + (--t) * t * t * t * t,
                easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
                easeInSine: t => 1 - Math.cos(t * Math.PI / 2),
                easeOutSine: t => Math.sin(t * Math.PI / 2),
                easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
                easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
                easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
                easeInOutExpo: t => {
                    if (t === 0) return 0;
                    if (t === 1) return 1;
                    return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
                },
                easeInCirc: t => 1 - Math.sqrt(1 - t * t),
                easeOutCirc: t => Math.sqrt(1 - (--t) * t),
                easeInOutCirc: t => t < 0.5 ? (1 - Math.sqrt(1 - 4 * t * t)) / 2 : (Math.sqrt(1 - (-2 * t + 2) ** 2) + 1) / 2,
                easeInBack: t => 2.70158 * t * t * t - 1.70158 * t * t,
                easeOutBack: t => 1 + 2.70158 * (--t) * t * t + 1.70158 * t * t,
                easeInOutBack: t => {
                    const c1 = 1.70158;
                    const c2 = c1 * 1.525;
                    return t < 0.5
                        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
                        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
                },
                easeInElastic: t => {
                    const c4 = (2 * Math.PI) / 3;
                    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
                },
                easeOutElastic: t => {
                    const c4 = (2 * Math.PI) / 3;
                    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
                },
                easeInOutElastic: t => {
                    const c5 = (2 * Math.PI) / 4.5;
                    return t === 0 ? 0 : t === 1 ? 1 : t < 0.5
                        ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
                        : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
                },
                easeInBounce: t => 1 - this.easingFunctions.easeOutBounce(1 - t),
                easeOutBounce: t => {
                    const n1 = 7.5625;
                    const d1 = 2.75;
                    
                    if (t < 1 / d1) {
                        return n1 * t * t;
                    } else if (t < 2 / d1) {
                        return n1 * (t -= 1.5 / d1) * t + 0.75;
                    } else if (t < 2.5 / d1) {
                        return n1 * (t -= 2.25 / d1) * t + 0.9375;
                    } else {
                        return n1 * (t -= 2.625 / d1) * t + 0.984375;
                    }
                },
                easeInOutBounce: t => t < 0.5
                    ? (1 - this.easingFunctions.easeOutBounce(1 - 2 * t)) / 2
                    : (1 + this.easingFunctions.easeOutBounce(2 * t - 1)) / 2
            };
        }
        
        // Start animation loop
        start() {
            if (this.isRunning) return;
            
            this.isRunning = true;
            this.lastFrameTime = performance.now();
            this.tick();
        }
        
        // Stop animation loop
        stop() {
            this.isRunning = false;
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
        }
        
        // Pause/resume
        pause() {
            this.paused = true;
        }
        
        resume() {
            this.paused = false;
        }
        
        // Set time scale
        setTimeScale(scale) {
            this.timeScale = Math.max(0, scale);
        }
        
        // Animation loop
        tick() {
            if (!this.isRunning) return;
            
            const now = performance.now();
            const deltaTime = (now - this.lastFrameTime) * this.timeScale;
            
            if (deltaTime >= this.frameInterval && !this.paused) {
                this.currentTime = now;
                this.update(deltaTime);
                this.lastFrameTime = now;
            }
            
            this.rafId = requestAnimationFrame(() => this.tick());
        }
        
        // Update all animations
        update(deltaTime) {
            // Update animations
            this.animations.forEach((animation, id) => {
                this.updateAnimation(animation, deltaTime);
                if (animation.completed) {
                    this.animations.delete(id);
                }
            });
            
            // Update timelines
            this.timelines.forEach((timeline, id) => {
                this.updateTimeline(timeline, deltaTime);
                if (timeline.completed) {
                    this.timelines.delete(id);
                }
            });
            
            // Update tweens
            this.tweens.forEach((tween, id) => {
                this.updateTween(tween, deltaTime);
                if (tween.completed) {
                    this.tweens.delete(id);
                }
            });
        }
        
        // Create animation
        animate(element, properties, options = {}) {
            const {
                duration = 1000,
                easing = 'easeOut',
                delay = 0,
                repeat = 0,
                yoyo = false,
                autoplay = true,
                onStart = null,
                onUpdate = null,
                onComplete = null,
                onRepeat = null
            } = options;
            
            const id = AdvancedUtils.generateId('animation');
            
            // Get initial values
            const fromValues = {};
            const toValues = {};
            
            for (const prop in properties) {
                const currentValue = this.getStyleValue(element, prop);
                fromValues[prop] = currentValue;
                toValues[prop] = properties[prop];
            }
            
            const animation = {
                id,
                element,
                fromValues,
                toValues,
                duration,
                easing: typeof easing === 'string' ? this.easingFunctions[easing] || this.easingFunctions.linear : easing,
                delay,
                repeat,
                yoyo,
                currentRepeat: 0,
                elapsed: 0,
                progress: 0,
                direction: 1, // 1 for forward, -1 for reverse
                completed: false,
                started: false,
                paused: false,
                onStart,
                onUpdate,
                onComplete,
                onRepeat
            };
            
            this.animations.set(id, animation);
            
            if (autoplay && !this.isRunning) {
                this.start();
            }
            
            return {
                id,
                play: () => this.playAnimation(id),
                pause: () => this.pauseAnimation(id),
                stop: () => this.stopAnimation(id),
                reverse: () => this.reverseAnimation(id),
                seek: (time) => this.seekAnimation(id, time),
                setSpeed: (speed) => this.setAnimationSpeed(id, speed)
            };
        }
        
        // Update animation
        updateAnimation(animation, deltaTime) {
            if (animation.paused || animation.completed) return;
            
            // Handle delay
            if (animation.delay > 0) {
                animation.delay -= deltaTime;
                return;
            }
            
            // Start animation
            if (!animation.started) {
                animation.started = true;
                if (animation.onStart) {
                    animation.onStart(animation);
                }
            }
            
            // Update elapsed time
            animation.elapsed += deltaTime * animation.direction;
            
            // Calculate progress
            let progress = Math.max(0, Math.min(1, animation.elapsed / animation.duration));
            
            if (animation.direction === -1) {
                progress = 1 - progress;
            }
            
            // Apply easing
            const easedProgress = animation.easing(progress);
            animation.progress = easedProgress;
            
            // Interpolate values
            this.interpolateValues(animation, easedProgress);
            
            // Call update callback
            if (animation.onUpdate) {
                animation.onUpdate(animation);
            }
            
            // Check completion
            if ((animation.direction === 1 && animation.elapsed >= animation.duration) ||
                (animation.direction === -1 && animation.elapsed <= 0)) {
                
                // Handle repeat
                if (animation.currentRepeat < animation.repeat) {
                    animation.currentRepeat++;
                    
                    if (animation.yoyo) {
                        animation.direction *= -1;
                    } else {
                        animation.elapsed = 0;
                        animation.direction = 1;
                    }
                    
                    if (animation.onRepeat) {
                        animation.onRepeat(animation);
                    }
                } else {
                    // Animation completed
                    animation.completed = true;
                    animation.progress = animation.direction === 1 ? 1 : 0;
                    
                    // Ensure final values are set
                    const finalProgress = animation.direction === 1 ? 1 : 0;
                    this.interpolateValues(animation, finalProgress);
                    
                    if (animation.onComplete) {
                        animation.onComplete(animation);
                    }
                }
            }
        }
        
        // Interpolate animation values
        interpolateValues(animation, progress) {
            const { element, fromValues, toValues } = animation;
            
            for (const prop in toValues) {
                const fromValue = fromValues[prop];
                const toValue = toValues[prop];
                
                const interpolatedValue = this.interpolateValue(fromValue, toValue, progress);
                this.setStyleValue(element, prop, interpolatedValue);
            }
        }
        
        // Interpolate single value
        interpolateValue(from, to, progress) {
            if (typeof from === 'number' && typeof to === 'number') {
                return from + (to - from) * progress;
            }
            
            // Handle color interpolation
            if (this.isColor(from) && this.isColor(to)) {
                return this.interpolateColor(from, to, progress);
            }
            
            // Handle unit values (px, em, %, etc.)
            const fromMatch = String(from).match(/([-\d.]+)(.*)$/);
            const toMatch = String(to).match(/([-\d.]+)(.*)$/);
            
            if (fromMatch && toMatch && fromMatch[2] === toMatch[2]) {
                const fromNum = parseFloat(fromMatch[1]);
                const toNum = parseFloat(toMatch[1]);
                const unit = fromMatch[2];
                
                return (fromNum + (toNum - fromNum) * progress) + unit;
            }
            
            // Fallback: discrete transition at 50%
            return progress < 0.5 ? from : to;
        }
        
        // Check if value is a color
        isColor(value) {
            return /^#[0-9a-f]{3,8}$/i.test(value) ||
                   /^rgb\(/i.test(value) ||
                   /^rgba\(/i.test(value) ||
                   /^hsl\(/i.test(value) ||
                   /^hsla\(/i.test(value);
        }
        
        // Interpolate colors
        interpolateColor(from, to, progress) {
            const fromRgb = this.parseColor(from);
            const toRgb = this.parseColor(to);
            
            if (!fromRgb || !toRgb) return progress < 0.5 ? from : to;
            
            const r = Math.round(fromRgb.r + (toRgb.r - fromRgb.r) * progress);
            const g = Math.round(fromRgb.g + (toRgb.g - fromRgb.g) * progress);
            const b = Math.round(fromRgb.b + (toRgb.b - fromRgb.b) * progress);
            const a = fromRgb.a + (toRgb.a - fromRgb.a) * progress;
            
            return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
        }
        
        // Parse color to RGB
        parseColor(color) {
            // Simple color parsing - could be expanded
            const hex = color.match(/#([0-9a-f]{6}|[0-9a-f]{3})/i);
            if (hex) {
                const hexColor = hex[1];
                if (hexColor.length === 3) {
                    return {
                        r: parseInt(hexColor[0] + hexColor[0], 16),
                        g: parseInt(hexColor[1] + hexColor[1], 16),
                        b: parseInt(hexColor[2] + hexColor[2], 16),
                        a: 1
                    };
                } else {
                    return {
                        r: parseInt(hexColor.substr(0, 2), 16),
                        g: parseInt(hexColor.substr(2, 2), 16),
                        b: parseInt(hexColor.substr(4, 2), 16),
                        a: 1
                    };
                }
            }
            
            const rgb = color.match(/rgba?\(([^)]+)\)/);
            if (rgb) {
                const values = rgb[1].split(',').map(v => parseFloat(v.trim()));
                return {
                    r: values[0] || 0,
                    g: values[1] || 0,
                    b: values[2] || 0,
                    a: values[3] !== undefined ? values[3] : 1
                };
            }
            
            return null;
        }
        
        // Get computed style value
        getStyleValue(element, property) {
            const computed = window.getComputedStyle(element);
            return computed.getPropertyValue(property) || element.style[property] || 0;
        }
        
        // Set style value
        setStyleValue(element, property, value) {
            if (property === 'transform') {
                element.style.transform = value;
            } else if (property.includes('transform')) {
                // Handle individual transform properties
                const currentTransform = element.style.transform || '';
                const newTransform = this.updateTransform(currentTransform, property, value);
                element.style.transform = newTransform;
            } else {
                element.style[property] = value;
            }
        }
        
        // Update transform string
        updateTransform(currentTransform, property, value) {
            const transforms = this.parseTransform(currentTransform);
            transforms[property] = value;
            
            return Object.keys(transforms)
                .map(key => `${key}(${transforms[key]})`)
                .join(' ');
        }
        
        // Parse transform string
        parseTransform(transform) {
            const transforms = {};
            const regex = /(\w+)\(([^)]+)\)/g;
            let match;
            
            while ((match = regex.exec(transform)) !== null) {
                transforms[match[1]] = match[2];
            }
            
            return transforms;
        }
        
        // Create timeline
        timeline(options = {}) {
            const {
                repeat = 0,
                yoyo = false,
                onStart = null,
                onUpdate = null,
                onComplete = null,
                onRepeat = null
            } = options;
            
            const id = AdvancedUtils.generateId('timeline');
            
            const timeline = {
                id,
                animations: [],
                duration: 0,
                elapsed: 0,
                progress: 0,
                repeat,
                yoyo,
                currentRepeat: 0,
                direction: 1,
                completed: false,
                started: false,
                paused: false,
                onStart,
                onUpdate,
                onComplete,
                onRepeat
            };
            
            const api = {
                id,
                
                // Add animation to timeline
                to(element, properties, options = {}) {
                    const duration = options.duration || 1000;
                    const delay = options.delay || 0;
                    const startTime = timeline.duration + delay;
                    
                    timeline.animations.push({
                        element,
                        properties,
                        duration,
                        startTime,
                        endTime: startTime + duration,
                        easing: options.easing || 'easeOut',
                        fromValues: null, // Will be calculated when timeline starts
                        progress: 0,
                        completed: false
                    });
                    
                    timeline.duration = Math.max(timeline.duration, startTime + duration);
                    
                    return api;
                },
                
                // Add gap
                gap(duration) {
                    timeline.duration += duration;
                    return api;
                },
                
                // Set timeline at specific time
                set(element, properties, time = null) {
                    const setTime = time !== null ? time : timeline.duration;
                    
                    timeline.animations.push({
                        element,
                        properties,
                        duration: 0,
                        startTime: setTime,
                        endTime: setTime,
                        easing: 'linear',
                        fromValues: null,
                        progress: 1,
                        completed: false,
                        isSet: true
                    });
                    
                    return api;
                },
                
                // Play timeline
                play() {
                    this.playTimeline(id);
                    return api;
                },
                
                // Pause timeline
                pause() {
                    this.pauseTimeline(id);
                    return api;
                },
                
                // Stop timeline
                stop() {
                    this.stopTimeline(id);
                    return api;
                },
                
                // Seek to specific time
                seek(time) {
                    this.seekTimeline(id, time);
                    return api;
                },
                
                // Reverse timeline
                reverse() {
                    this.reverseTimeline(id);
                    return api;
                }
            };
            
            this.timelines.set(id, timeline);
            
            return api;
        }
        
        // Update timeline
        updateTimeline(timeline, deltaTime) {
            if (timeline.paused || timeline.completed) return;
            
            // Start timeline
            if (!timeline.started) {
                timeline.started = true;
                
                // Calculate initial values for all animations
                timeline.animations.forEach(animation => {
                    if (!animation.isSet) {
                        animation.fromValues = {};
                        for (const prop in animation.properties) {
                            animation.fromValues[prop] = this.getStyleValue(animation.element, prop);
                        }
                    }
                });
                
                if (timeline.onStart) {
                    timeline.onStart(timeline);
                }
            }
            
            // Update elapsed time
            timeline.elapsed += deltaTime * timeline.direction;
            timeline.progress = Math.max(0, Math.min(1, timeline.elapsed / timeline.duration));
            
            // Update animations
            timeline.animations.forEach(animation => {
                if (animation.completed) return;
                
                const animationProgress = this.calculateAnimationProgress(
                    timeline.elapsed,
                    animation.startTime,
                    animation.endTime,
                    animation.duration
                );
                
                if (animationProgress >= 0) {
                    if (animation.isSet) {
                        // Set properties immediately
                        for (const prop in animation.properties) {
                            this.setStyleValue(animation.element, prop, animation.properties[prop]);
                        }
                        animation.completed = true;
                    } else {
                        // Animate properties
                        const easingFunction = typeof animation.easing === 'string' ?
                            this.easingFunctions[animation.easing] || this.easingFunctions.linear :
                            animation.easing;
                        
                        const easedProgress = easingFunction(Math.min(1, animationProgress));
                        
                        for (const prop in animation.properties) {
                            const fromValue = animation.fromValues[prop];
                            const toValue = animation.properties[prop];
                            const interpolatedValue = this.interpolateValue(fromValue, toValue, easedProgress);
                            this.setStyleValue(animation.element, prop, interpolatedValue);
                        }
                        
                        animation.progress = easedProgress;
                        
                        if (animationProgress >= 1) {
                            animation.completed = true;
                        }
                    }
                }
            });
            
            // Call update callback
            if (timeline.onUpdate) {
                timeline.onUpdate(timeline);
            }
            
            // Check completion
            if ((timeline.direction === 1 && timeline.elapsed >= timeline.duration) ||
                (timeline.direction === -1 && timeline.elapsed <= 0)) {
                
                // Handle repeat
                if (timeline.currentRepeat < timeline.repeat) {
                    timeline.currentRepeat++;
                    
                    if (timeline.yoyo) {
                        timeline.direction *= -1;
                    } else {
                        timeline.elapsed = 0;
                        timeline.direction = 1;
                        // Reset animation states
                        timeline.animations.forEach(animation => {
                            animation.completed = false;
                            animation.progress = 0;
                        });
                    }
                    
                    if (timeline.onRepeat) {
                        timeline.onRepeat(timeline);
                    }
                } else {
                    // Timeline completed
                    timeline.completed = true;
                    timeline.progress = timeline.direction === 1 ? 1 : 0;
                    
                    if (timeline.onComplete) {
                        timeline.onComplete(timeline);
                    }
                }
            }
        }
        
        // Calculate animation progress within timeline
        calculateAnimationProgress(timelineTime, startTime, endTime, duration) {
            if (timelineTime < startTime) return -1;
            if (duration === 0) return 1;
            return Math.min(1, (timelineTime - startTime) / duration);
        }
        
        // Create tween
        tween(from, to, options = {}) {
            const {
                duration = 1000,
                easing = 'easeOut',
                delay = 0,
                onUpdate = null,
                onComplete = null
            } = options;
            
            const id = AdvancedUtils.generateId('tween');
            
            const tween = {
                id,
                from: { ...from },
                to: { ...to },
                current: { ...from },
                duration,
                easing: typeof easing === 'string' ? this.easingFunctions[easing] || this.easingFunctions.linear : easing,
                delay,
                elapsed: 0,
                progress: 0,
                completed: false,
                started: false,
                paused: false,
                onUpdate,
                onComplete
            };
            
            this.tweens.set(id, tween);
            
            if (!this.isRunning) {
                this.start();
            }
            
            return {
                id,
                pause: () => this.pauseTween(id),
                resume: () => this.resumeTween(id),
                stop: () => this.stopTween(id)
            };
        }
        
        // Update tween
        updateTween(tween, deltaTime) {
            if (tween.paused || tween.completed) return;
            
            // Handle delay
            if (tween.delay > 0) {
                tween.delay -= deltaTime;
                return;
            }
            
            // Start tween
            if (!tween.started) {
                tween.started = true;
            }
            
            // Update elapsed time
            tween.elapsed += deltaTime;
            tween.progress = Math.min(1, tween.elapsed / tween.duration);
            
            // Apply easing
            const easedProgress = tween.easing(tween.progress);
            
            // Interpolate values
            for (const key in tween.to) {
                tween.current[key] = this.interpolateValue(tween.from[key], tween.to[key], easedProgress);
            }
            
            // Call update callback
            if (tween.onUpdate) {
                tween.onUpdate(tween.current, tween);
            }
            
            // Check completion
            if (tween.progress >= 1) {
                tween.completed = true;
                
                if (tween.onComplete) {
                    tween.onComplete(tween.current, tween);
                }
            }
        }
        
        // Animation control methods
        playAnimation(id) {
            const animation = this.animations.get(id);
            if (animation) {
                animation.paused = false;
                if (!this.isRunning) this.start();
            }
        }
        
        pauseAnimation(id) {
            const animation = this.animations.get(id);
            if (animation) {
                animation.paused = true;
            }
        }
        
        stopAnimation(id) {
            this.animations.delete(id);
        }
        
        reverseAnimation(id) {
            const animation = this.animations.get(id);
            if (animation) {
                animation.direction *= -1;
            }
        }
        
        seekAnimation(id, time) {
            const animation = this.animations.get(id);
            if (animation) {
                animation.elapsed = Math.max(0, Math.min(animation.duration, time));
                const progress = animation.elapsed / animation.duration;
                const easedProgress = animation.easing(progress);
                this.interpolateValues(animation, easedProgress);
            }
        }
        
        setAnimationSpeed(id, speed) {
            const animation = this.animations.get(id);
            if (animation) {
                animation.timeScale = speed;
            }
        }
        
        // Timeline control methods
        playTimeline(id) {
            const timeline = this.timelines.get(id);
            if (timeline) {
                timeline.paused = false;
                if (!this.isRunning) this.start();
            }
        }
        
        pauseTimeline(id) {
            const timeline = this.timelines.get(id);
            if (timeline) {
                timeline.paused = true;
            }
        }
        
        stopTimeline(id) {
            this.timelines.delete(id);
        }
        
        reverseTimeline(id) {
            const timeline = this.timelines.get(id);
            if (timeline) {
                timeline.direction *= -1;
            }
        }
        
        seekTimeline(id, time) {
            const timeline = this.timelines.get(id);
            if (timeline) {
                timeline.elapsed = Math.max(0, Math.min(timeline.duration, time));
                // Force update to reflect new time
                this.updateTimeline(timeline, 0);
            }
        }
        
        // Tween control methods
        pauseTween(id) {
            const tween = this.tweens.get(id);
            if (tween) {
                tween.paused = true;
            }
        }
        
        resumeTween(id) {
            const tween = this.tweens.get(id);
            if (tween) {
                tween.paused = false;
                if (!this.isRunning) this.start();
            }
        }
        
        stopTween(id) {
            this.tweens.delete(id);
        }
        
        // Utility methods
        killAll() {
            this.animations.clear();
            this.timelines.clear();
            this.tweens.clear();
        }
        
        killAllAnimations() {
            this.animations.clear();
        }
        
        killAllTimelines() {
            this.timelines.clear();
        }
        
        killAllTweens() {
            this.tweens.clear();
        }
        
        // Get performance info
        getPerformanceInfo() {
            return {
                animationsCount: this.animations.size,
                timelinesCount: this.timelines.size,
                tweensCount: this.tweens.size,
                isRunning: this.isRunning,
                currentTime: this.currentTime,
                timeScale: this.timeScale,
                fps: Math.round(1000 / this.frameInterval)
            };
        }
    }
    
    /* ============================================================================
     * ADVANCED COMPILER IMPLEMENTATION
     * ============================================================================ */
    
    /**
     * Advanced Compiler with optimization and code generation
     */
    class AdvancedCompiler {
        constructor() {
            this.context = new Map();
            this.globals = new Set();
            this.optimizations = {
                deadCodeElimination: true,
                constantFolding: true,
                inlineSmallFunctions: true,
                minimizeCode: false
            };
            
            // Built-in globals
            this.globals.add('console');
            this.globals.add('window');
            this.globals.add('document');
            this.globals.add('LuaUI');
            this.globals.add('h');
            this.globals.add('text');
            this.globals.add('component');
            this.globals.add('fragment');
        }
        
        // Compile AST to JavaScript
        compile(ast, options = {}) {
            this.options = { ...this.optimizations, ...options };
            
            try {
                const code = this.compileProgram(ast);
                const optimized = this.optimize(code);
                
                return new Function('LuaUI', 'h', 'text', 'component', 'fragment', optimized);
            } catch (error) {
                throw new Error(`Compilation Error: ${error.message}`);
            }
        }
        
        // Compile program
        compileProgram(node) {
            const statements = node.body.map(stmt => this.compileStatement(stmt)).filter(Boolean);
            return statements.join('\n');
        }
        
        // Compile statement
        compileStatement(node) {
            switch (node.type) {
                case ASTNodeType.COMPONENT_DECLARATION:
                    return this.compileComponentDeclaration(node);
                case ASTNodeType.FUNCTION_DECLARATION:
                    return this.compileFunctionDeclaration(node);
                case ASTNodeType.VARIABLE_DECLARATION:
                    return this.compileVariableDeclaration(node);
                case ASTNodeType.CLASS_DECLARATION:
                    return this.compileClassDeclaration(node);
                case ASTNodeType.IF_STATEMENT:
                    return this.compileIfStatement(node);
                case ASTNodeType.FOR_STATEMENT:
                case ASTNodeType.FOR_IN_STATEMENT:
                case ASTNodeType.FOR_OF_STATEMENT:
                    return this.compileForStatement(node);
                case ASTNodeType.WHILE_STATEMENT:
                    return this.compileWhileStatement(node);
                case ASTNodeType.DO_WHILE_STATEMENT:
                    return this.compileDoWhileStatement(node);
                case ASTNodeType.SWITCH_STATEMENT:
                    return this.compileSwitchStatement(node);
                case ASTNodeType.TRY_STATEMENT:
                    return this.compileTryStatement(node);
                case ASTNodeType.RETURN_STATEMENT:
                    return this.compileReturnStatement(node);
                case ASTNodeType.BREAK_STATEMENT:
                    return 'break;';
                case ASTNodeType.CONTINUE_STATEMENT:
                    return 'continue;';
                case ASTNodeType.THROW_STATEMENT:
                    return this.compileThrowStatement(node);
                case ASTNodeType.BLOCK_STATEMENT:
                    return this.compileBlockStatement(node);
                case ASTNodeType.EXPRESSION_STATEMENT:
                    return this.compileExpression(node.expression) + ';';
                case ASTNodeType.IMPORT_DECLARATION:
                    return this.compileImportDeclaration(node);
                case ASTNodeType.EXPORT_DECLARATION:
                    return this.compileExportDeclaration(node);
                default:
                    throw new Error(`Unknown statement type: ${node.type}`);
            }
        }
        
        // Compile component declaration
        compileComponentDeclaration(node) {
            const componentName = node.name;
            const { properties, methods } = node;
            
            let componentCode = `
class ${componentName} extends LuaUI.Component {
    constructor(props) {
        super(props);
        this.componentName = '${componentName}';
`;
            
            // Process component properties
            if (properties.data) {
                componentCode += `
        this.data = () => (${this.compileExpression(properties.data)});
`;
            }
            
            if (properties.props) {
                componentCode += `
        this.defaultProps = ${this.compileExpression(properties.props)};
`;
            }
            
            if (properties.computed) {
                componentCode += `
        this.computedProps = ${this.compileExpression(properties.computed)};
`;
            }
            
            if (properties.watch) {
                componentCode += `
        this.watchers = ${this.compileExpression(properties.watch)};
`;
            }
            
            componentCode += `
    }
`;
            
            // Compile lifecycle methods
            const lifecycleMethods = [
                'componentWillMount', 'componentDidMount', 'componentWillUpdate',
                'componentDidUpdate', 'componentWillUnmount', 'componentDidCatch'
            ];
            
            lifecycleMethods.forEach(method => {
                if (properties[method]) {
                    const methodBody = this.compileExpression(properties[method]);
                    componentCode += `
    ${method}(...args) {
        return (${methodBody}).call(this, ...args);
    }
`;
                }
            });
            
            // Compile render method
            if (properties.render) {
                const renderBody = this.compileExpression(properties.render);
                componentCode += `
    render() {
        return (${renderBody}).call(this);
    }
`;
            } else {
                componentCode += `
    render() {
        return h('div', { className: 'component-${componentName.toLowerCase()}' }, [
            'Component: ${componentName}'
        ]);
    }
`;
            }
            
            // Compile custom methods
            Object.keys(methods).forEach(methodName => {
                const method = methods[methodName];
                const params = method.params ? method.params.map(p => p.name).join(', ') : '';
                const body = this.compileBlockStatement(method.body);
                
                componentCode += `
    ${methodName}(${params}) {
        ${body}
    }
`;
            });
            
            // Compile computed properties
            if (properties.computed) {
                const computed = properties.computed;
                if (computed.type === ASTNodeType.OBJECT_EXPRESSION) {
                    computed.properties.forEach(prop => {
                        const key = prop.key.name || prop.key.value;
                        const value = this.compileExpression(prop.value);
                        
                        componentCode += `
    get ${key}() {
        return (${value}).call(this);
    }
`;
                    });
                }
            }
            
            componentCode += `
}
`;
            
            // Register component
            componentCode += `
LuaUI.registerComponent('${componentName}', ${componentName});
`;
            
            // Handle styles
            if (properties.styles) {
                const styles = this.compileExpression(properties.styles);
                componentCode += `
LuaUI.css.processAndInject(${styles}, { scope: '${componentName.toLowerCase()}' });
`;
            }
            
            return componentCode;
        }
        
        // Compile function declaration
        compileFunctionDeclaration(node) {
            const name = node.id.name;
            const params = node.params.map(param => this.compileParameter(param)).join(', ');
            const body = this.compileBlockStatement(node.body);
            const asyncKeyword = node.async ? 'async ' : '';
            const generatorStar = node.generator ? '*' : '';
            
            return `${asyncKeyword}function${generatorStar} ${name}(${params}) {
    ${body}
}`;
        }
        
        // Compile parameter
        compileParameter(param) {
            switch (param.type) {
                case ASTNodeType.IDENTIFIER:
                    return param.name;
                case ASTNodeType.ASSIGNMENT_PATTERN:
                    return `${this.compileExpression(param.left)} = ${this.compileExpression(param.right)}`;
                case ASTNodeType.REST_ELEMENT:
                    return `...${this.compileExpression(param.argument)}`;
                default:
                    return this.compileExpression(param);
            }
        }
        
        // Compile variable declaration
        compileVariableDeclaration(node) {
            const kind = node.kind;
            const declarations = node.declarations.map(decl => {
                const id = this.compileExpression(decl.id);
                const init = decl.init ? ` = ${this.compileExpression(decl.init)}` : '';
                return `${id}${init}`;
            }).join(', ');
            
            return `${kind} ${declarations};`;
        }
        
        // Compile class declaration
        compileClassDeclaration(node) {
            const name = node.id.name;
            const superClass = node.superClass ? ` extends ${this.compileExpression(node.superClass)}` : '';
            const body = node.body.body.map(method => this.compileMethodDefinition(method)).join('\n\n');
            
            return `class ${name}${superClass} {
${this.indent(body)}
}`;
        }
        
        // Compile method definition
        compileMethodDefinition(node) {
            const key = this.compileExpression(node.key);
            const value = node.value;
            const params = value.params.map(param => this.compileParameter(param)).join(', ');
            const body = this.compileBlockStatement(value.body);
            
            const staticKeyword = node.static ? 'static ' : '';
            const asyncKeyword = value.async ? 'async ' : '';
            const generatorStar = value.generator ? '*' : '';
            
            if (node.kind === 'constructor') {
                return `constructor(${params}) {
    ${body}
}`;
            } else if (node.kind === 'get') {
                return `${staticKeyword}get ${key}() {
    ${body}
}`;
            } else if (node.kind === 'set') {
                return `${staticKeyword}set ${key}(${params}) {
    ${body}
}`;
            } else {
                return `${staticKeyword}${asyncKeyword}${generatorStar}${key}(${params}) {
    ${body}
}`;
            }
        }
        
        // Compile control flow statements
        compileIfStatement(node) {
            const test = this.compileExpression(node.test);
            const consequent = this.compileStatement(node.consequent);
            const alternate = node.alternate ? ` else ${this.compileStatement(node.alternate)}` : '';
            
            return `if (${test}) ${consequent}${alternate}`;
        }
        
        compileForStatement(node) {
            switch (node.type) {
                case ASTNodeType.FOR_STATEMENT:
                    const init = node.init ? this.compileStatement(node.init).replace(/;$/, '') : '';
                    const test = node.test ? this.compileExpression(node.test) : '';
                    const update = node.update ? this.compileExpression(node.update) : '';
                    const body = this.compileStatement(node.body);
                    
                    return `for (${init}; ${test}; ${update}) ${body}`;
                    
                case ASTNodeType.FOR_IN_STATEMENT:
                    const leftIn = this.compileExpression(node.left);
                    const rightIn = this.compileExpression(node.right);
                    const bodyIn = this.compileStatement(node.body);
                    
                    return `for (${leftIn} in ${rightIn}) ${bodyIn}`;
                    
                case ASTNodeType.FOR_OF_STATEMENT:
                    const leftOf = this.compileExpression(node.left);
                    const rightOf = this.compileExpression(node.right);
                    const bodyOf = this.compileStatement(node.body);
                    
                    return `for (${leftOf} of ${rightOf}) ${bodyOf}`;
            }
        }
        
        compileWhileStatement(node) {
            const test = this.compileExpression(node.test);
            const body = this.compileStatement(node.body);
            
            return `while (${test}) ${body}`;
        }
        
        compileDoWhileStatement(node) {
            const body = this.compileStatement(node.body);
            const test = this.compileExpression(node.test);
            
            return `do ${body} while (${test});`;
        }
        
        compileSwitchStatement(node) {
            const discriminant = this.compileExpression(node.discriminant);
            const cases = node.cases.map(caseNode => this.compileSwitchCase(caseNode)).join('\n');
            
            return `switch (${discriminant}) {
${this.indent(cases)}
}`;
        }
        
        compileSwitchCase(node) {
            const test = node.test ? `case ${this.compileExpression(node.test)}:` : 'default:';
            const consequent = node.consequent.map(stmt => this.compileStatement(stmt)).join('\n');
            
            return `${test}
${this.indent(consequent)}`;
        }
        
        compileTryStatement(node) {
            const block = this.compileBlockStatement(node.block);
            const handler = node.handler ? this.compileCatchClause(node.handler) : '';
            const finalizer = node.finalizer ? ` finally ${this.compileBlockStatement(node.finalizer)}` : '';
            
            return `try ${block}${handler}${finalizer}`;
        }
        
        compileCatchClause(node) {
            const param = node.param ? this.compileExpression(node.param) : '';
            const body = this.compileBlockStatement(node.body);
            
            return ` catch (${param}) ${body}`;
        }
        
        compileReturnStatement(node) {
            const argument = node.argument ? ` ${this.compileExpression(node.argument)}` : '';
            return `return${argument};`;
        }
        
        compileThrowStatement(node) {
            const argument = this.compileExpression(node.argument);
            return `throw ${argument};`;
        }
        
        compileBlockStatement(node) {
            const statements = node.body.map(stmt => this.compileStatement(stmt)).filter(Boolean);
            return `{\n${this.indent(statements.join('\n'))}\n}`;
        }
        
        // Compile expressions
        compileExpression(node) {
            switch (node.type) {
                case ASTNodeType.IDENTIFIER:
                    return this.compileIdentifier(node);
                case ASTNodeType.LITERAL:
                    return this.compileLiteral(node);
                case ASTNodeType.ARRAY_EXPRESSION:
                    return this.compileArrayExpression(node);
                case ASTNodeType.OBJECT_EXPRESSION:
                    return this.compileObjectExpression(node);
                case ASTNodeType.FUNCTION_EXPRESSION:
                    return this.compileFunctionExpression(node);
                case ASTNodeType.ARROW_FUNCTION_EXPRESSION:
                    return this.compileArrowFunctionExpression(node);
                case ASTNodeType.CLASS_EXPRESSION:
                    return this.compileClassExpression(node);
                case ASTNodeType.MEMBER_EXPRESSION:
                    return this.compileMemberExpression(node);
                case ASTNodeType.CALL_EXPRESSION:
                    return this.compileCallExpression(node);
                case ASTNodeType.NEW_EXPRESSION:
                    return this.compileNewExpression(node);
                case ASTNodeType.UPDATE_EXPRESSION:
                    return this.compileUpdateExpression(node);
                case ASTNodeType.UNARY_EXPRESSION:
                    return this.compileUnaryExpression(node);
                case ASTNodeType.BINARY_EXPRESSION:
                    return this.compileBinaryExpression(node);
                case ASTNodeType.LOGICAL_EXPRESSION:
                    return this.compileLogicalExpression(node);
                case ASTNodeType.ASSIGNMENT_EXPRESSION:
                    return this.compileAssignmentExpression(node);
                case ASTNodeType.CONDITIONAL_EXPRESSION:
                    return this.compileConditionalExpression(node);
                case ASTNodeType.SEQUENCE_EXPRESSION:
                    return this.compileSequenceExpression(node);
                case ASTNodeType.TEMPLATE_LITERAL:
                    return this.compileTemplateLiteral(node);
                case ASTNodeType.AWAIT_EXPRESSION:
                    return this.compileAwaitExpression(node);
                case ASTNodeType.YIELD_EXPRESSION:
                    return this.compileYieldExpression(node);
                case ASTNodeType.SPREAD_ELEMENT:
                    return this.compileSpreadElement(node);
                default:
                    throw new Error(`Unknown expression type: ${node.type}`);
            }
        }
        
        compileIdentifier(node) {
            // Handle special identifiers for LuaUI
            const specialIdentifiers = {
                'div': '(function(props, ...children) { return h("div", props || {}, children.flat()); })',
                'span': '(function(props, ...children) { return h("span", props || {}, children.flat()); })',
                'p': '(function(props, ...children) { return h("p", props || {}, children.flat()); })',
                'h1': '(function(props, ...children) { return h("h1", props || {}, children.flat()); })',
                'h2': '(function(props, ...children) { return h("h2", props || {}, children.flat()); })',
                'h3': '(function(props, ...children) { return h("h3", props || {}, children.flat()); })',
                'h4': '(function(props, ...children) { return h("h4", props || {}, children.flat()); })',
                'h5': '(function(props, ...children) { return h("h5", props || {}, children.flat()); })',
                'h6': '(function(props, ...children) { return h("h6", props || {}, children.flat()); })',
                'button': '(function(props, ...children) { return h("button", props || {}, children.flat()); })',
                'input': '(function(props, ...children) { return h("input", props || {}, children.flat()); })',
                'textarea': '(function(props, ...children) { return h("textarea", props || {}, children.flat()); })',
                'select': '(function(props, ...children) { return h("select", props || {}, children.flat()); })',
                'option': '(function(props, ...children) { return h("option", props || {}, children.flat()); })',
                'img': '(function(props, ...children) { return h("img", props || {}, children.flat()); })',
                'a': '(function(props, ...children) { return h("a", props || {}, children.flat()); })',
                'ul': '(function(props, ...children) { return h("ul", props || {}, children.flat()); })',
                'ol': '(function(props, ...children) { return h("ol", props || {}, children.flat()); })',
                'li': '(function(props, ...children) { return h("li", props || {}, children.flat()); })',
                'table': '(function(props, ...children) { return h("table", props || {}, children.flat()); })',
                'tr': '(function(props, ...children) { return h("tr", props || {}, children.flat()); })',
                'td': '(function(props, ...children) { return h("td", props || {}, children.flat()); })',
                'th': '(function(props, ...children) { return h("th", props || {}, children.flat()); })',
                'thead': '(function(props, ...children) { return h("thead", props || {}, children.flat()); })',
                'tbody': '(function(props, ...children) { return h("tbody", props || {}, children.flat()); })',
                'form': '(function(props, ...children) { return h("form", props || {}, children.flat()); })',
                'label': '(function(props, ...children) { return h("label", props || {}, children.flat()); })',
                'br': '(function(props) { return h("br", props || {}); })',
                'hr': '(function(props) { return h("hr", props || {}); })',
                'canvas': '(function(props, ...children) { return h("canvas", props || {}, children.flat()); })',
                'svg': '(function(props, ...children) { return h("svg", props || {}, children.flat()); })',
                'audio': '(function(props, ...children) { return h("audio", props || {}, children.flat()); })',
                'video': '(function(props, ...children) { return h("video", props || {}, children.flat()); })'
            };
            
            return specialIdentifiers[node.name] || node.name;
        }
        
        compileLiteral(node) {
            if (node.value === null) return 'null';
            if (typeof node.value === 'string') {
                return JSON.stringify(node.value);
            }
            if (node.regex) {
                return `/${node.regex.pattern}/${node.regex.flags}`;
            }
            return String(node.value);
        }
        
        compileArrayExpression(node) {
            const elements = node.elements.map(element => {
                if (element === null) return '';
                if (element.type === ASTNodeType.SPREAD_ELEMENT) {
                    return `...${this.compileExpression(element.argument)}`;
                }
                return this.compileExpression(element);
            });
            
            return `[${elements.join(', ')}]`;
        }
        
        compileObjectExpression(node) {
            const properties = node.properties.map(prop => {
                if (prop.type === ASTNodeType.SPREAD_ELEMENT) {
                    return `...${this.compileExpression(prop.argument)}`;
                }
                
                const key = prop.computed ? 
                    `[${this.compileExpression(prop.key)}]` : 
                    (prop.key.type === ASTNodeType.IDENTIFIER ? prop.key.name : this.compileExpression(prop.key));
                
                if (prop.shorthand) {
                    return key;
                }
                
                if (prop.method) {
                    const value = prop.value;
                    const params = value.params.map(param => this.compileParameter(param)).join(', ');
                    const body = this.compileBlockStatement(value.body);
                    const asyncKeyword = value.async ? 'async ' : '';
                    const generatorStar = value.generator ? '*' : '';
                    
                    return `${asyncKeyword}${generatorStar}${key}(${params}) ${body}`;
                }
                
                const value = this.compileExpression(prop.value);
                return `${key}: ${value}`;
            });
            
            return `{${properties.join(', ')}}`;
        }
        
        compileFunctionExpression(node) {
            const name = node.id ? node.id.name : '';
            const params = node.params.map(param => this.compileParameter(param)).join(', ');
            const body = this.compileBlockStatement(node.body);
            const asyncKeyword = node.async ? 'async ' : '';
            const generatorStar = node.generator ? '*' : '';
            
            return `${asyncKeyword}function${generatorStar} ${name}(${params}) ${body}`;
        }
        
        compileArrowFunctionExpression(node) {
            const params = node.params.length === 1 && node.params[0].type === ASTNodeType.IDENTIFIER ?
                node.params[0].name :
                `(${node.params.map(param => this.compileParameter(param)).join(', ')})`;
            
            const body = node.body.type === ASTNodeType.BLOCK_STATEMENT ?
                this.compileBlockStatement(node.body) :
                this.compileExpression(node.body);
            
            const asyncKeyword = node.async ? 'async ' : '';
            
            return `${asyncKeyword}${params} => ${body}`;
        }
        
        compileClassExpression(node) {
            const name = node.id ? node.id.name : '';
            const superClass = node.superClass ? ` extends ${this.compileExpression(node.superClass)}` : '';
            const body = node.body.body.map(method => this.compileMethodDefinition(method)).join('\n\n');
            
            return `class ${name}${superClass} {
${this.indent(body)}
}`;
        }
        
        compileMemberExpression(node) {
            const object = this.compileExpression(node.object);
            const property = node.computed ? 
                `[${this.compileExpression(node.property)}]` : 
                `.${node.property.name}`;
            
            const optional = node.optional ? '?' : '';
            
            return `${object}${optional}${property}`;
        }
        
        compileCallExpression(node) {
            const callee = this.compileExpression(node.callee);
            const args = node.arguments.map(arg => {
                if (arg.type === ASTNodeType.SPREAD_ELEMENT) {
                    return `...${this.compileExpression(arg.argument)}`;
                }
                return this.compileExpression(arg);
            }).join(', ');
            
            const optional = node.optional ? '?.' : '';
            
            return `${callee}${optional}(${args})`;
        }
        
        compileNewExpression(node) {
            const callee = this.compileExpression(node.callee);
            const args = node.arguments.map(arg => this.compileExpression(arg)).join(', ');
            
            return `new ${callee}(${args})`;
        }
        
        compileUpdateExpression(node) {
            const operator = node.operator;
            const argument = this.compileExpression(node.argument);
            
            return node.prefix ? `${operator}${argument}` : `${argument}${operator}`;
        }
        
        compileUnaryExpression(node) {
            const operator = node.operator === 'not' ? '!' : node.operator;
            const argument = this.compileExpression(node.argument);
            
            return `${operator}${argument}`;
        }
        
        compileBinaryExpression(node) {
            const left = this.compileExpression(node.left);
            const right = this.compileExpression(node.right);
            let operator = node.operator;
            
            // Handle Lua-specific operators
            if (operator === '..') operator = '+';
            if (operator === '~=') operator = '!==';
            if (operator === '^') operator = '**';
            
            return `(${left} ${operator} ${right})`;
        }
        
        compileLogicalExpression(node) {
            const left = this.compileExpression(node.left);
            const right = this.compileExpression(node.right);
            let operator = node.operator;
            
            // Handle Lua-specific operators
            if (operator === 'and') operator = '&&';
            if (operator === 'or') operator = '||';
            
            return `(${left} ${operator} ${right})`;
        }
        
        compileAssignmentExpression(node) {
            const left = this.compileExpression(node.left);
            const right = this.compileExpression(node.right);
            const operator = node.operator;
            
            return `${left} ${operator} ${right}`;
        }
        
        compileConditionalExpression(node) {
            const test = this.compileExpression(node.test);
            const consequent = this.compileExpression(node.consequent);
            const alternate = this.compileExpression(node.alternate);
            
            return `${test} ? ${consequent} : ${alternate}`;
        }
        
        compileSequenceExpression(node) {
            const expressions = node.expressions.map(expr => this.compileExpression(expr));
            return `(${expressions.join(', ')})`;
        }
        
        compileTemplateLiteral(node) {
            let result = '`';
            
            for (let i = 0; i < node.quasis.length; i++) {
                result += node.quasis[i].value.raw;
                
                if (i < node.expressions.length) {
                    result += '${' + this.compileExpression(node.expressions[i]) + '}';
                }
            }
            
            result += '`';
            return result;
        }
        
        compileAwaitExpression(node) {
            const argument = this.compileExpression(node.argument);
            return `await ${argument}`;
        }
        
        compileYieldExpression(node) {
            const argument = node.argument ? ` ${this.compileExpression(node.argument)}` : '';
            const delegate = node.delegate ? '*' : '';
            return `yield${delegate}${argument}`;
        }
        
        compileSpreadElement(node) {
            const argument = this.compileExpression(node.argument);
            return `...${argument}`;
        }
        
        // Import/Export compilation
        compileImportDeclaration(node) {
            const specifiers = node.specifiers.map(spec => {
                switch (spec.type) {
                    case 'ImportDefaultSpecifier':
                        return spec.local.name;
                    case 'ImportNamespaceSpecifier':
                        return `* as ${spec.local.name}`;
                    case 'ImportSpecifier':
                        return spec.imported.name === spec.local.name ?
                            spec.local.name :
                            `${spec.imported.name} as ${spec.local.name}`;
                    default:
                        return '';
                }
            }).filter(Boolean).join(', ');
            
            const source = this.compileExpression(node.source);
            
            return `import ${specifiers} from ${source};`;
        }
        
        compileExportDeclaration(node) {
            if (node.default) {
                const declaration = this.compileStatement(node.declaration);
                return `export default ${declaration}`;
            }
            
            if (node.declaration) {
                const declaration = this.compileStatement(node.declaration);
                return `export ${declaration}`;
            }
            
            if (node.specifiers) {
                const specifiers = node.specifiers.map(spec => {
                    return spec.exported.name === spec.local.name ?
                        spec.local.name :
                        `${spec.local.name} as ${spec.exported.name}`;
                }).join(', ');
                
                const source = node.source ? ` from ${this.compileExpression(node.source)}` : '';
                
                return `export {${specifiers}}${source};`;
            }
            
            return '';
        }
        
        // Optimization methods
        optimize(code) {
            let optimized = code;
            
            if (this.options.deadCodeElimination) {
                optimized = this.eliminateDeadCode(optimized);
            }
            
            if (this.options.constantFolding) {
                optimized = this.foldConstants(optimized);
            }
            
            if (this.options.inlineSmallFunctions) {
                optimized = this.inlineSmallFunctions(optimized);
            }
            
            if (this.options.minimizeCode) {
                optimized = this.minimizeCode(optimized);
            }
            
            return optimized;
        }
        
        eliminateDeadCode(code) {
            // Simple dead code elimination
            return code.replace(/if\s*\(\s*false\s*\)\s*\{[^}]*\}/g, '');
        }
        
        foldConstants(code) {
            // Simple constant folding
            return code
                .replace(/\btrue\s*&&\s*/g, '')
                .replace(/\s*&&\s*true\b/g, '')
                .replace(/\bfalse\s*\|\|\s*/g, '')
                .replace(/\s*\|\|\s*false\b/g, '');
        }
        
        inlineSmallFunctions(code) {
            // TODO: Implement function inlining
            return code;
        }
        
        minimizeCode(code) {
            // Simple code minimization
            return code
                .replace(/\s+/g, ' ')
                .replace(/;\s*}/g, '}')
                .replace(/{\s*/g, '{')
                .replace(/\s*}/g, '}')
                .replace(/,\s*/g, ',')
                .trim();
        }
        
        // Utility methods
        indent(code, level = 1) {
            const indentation = '    '.repeat(level);
            return code.split('\n').map(line => line.trim() ? indentation + line : line).join('\n');
        }
    }
    
    /* ============================================================================
     * MAIN LUAUI RUNTIME
     * ============================================================================ */
    
    /**
     * Main LuaUI Runtime - Orchestrates all subsystems
     */
    class LuaUIRuntime {
        constructor() {
            this.version = LUAUI_VERSION;
            this.build = LUAUI_BUILD;
            this.environment = LUAUI_ENV;
            
            // Component registry
            this.components = new Map();
            this.instances = new Map();
            this.mountedApps = new Map();
            
            // Subsystems
            this.utils = AdvancedUtils;
            this.security = new SecurityManager();
            this.reactive = new AdvancedReactiveSystem();
            this.reconciler = new FiberReconciler();
            this.css = new AdvancedCSSEngine();
            this.animation = new AdvancedAnimationEngine();
            this.compiler = new AdvancedCompiler();
            
            // Performance monitoring
            this.performance = AdvancedUtils.createPerformanceMonitor();
            this.logger = AdvancedUtils.createLogger('LuaUI');
            
            // Component base class
            this.Component = AdvancedComponent;
            
            // Development tools
            this.devTools = null;
            
            // Plugin system
            this.plugins = new Map();
            this.hooks = AdvancedUtils.createEventEmitter();
            
            // Hot module replacement
            this.hmr = {
                enabled: false,
                modules: new Map(),
                callbacks: new Set()
            };
            
            // Initialize
            this.init();
        }
        
        // Initialize LuaUI
        init() {
            this.logger.info(`Initializing LuaUI v${this.version} (${this.environment})`);
            
            // Setup environment-specific features
            if (this.environment === 'browser') {
                this.setupBrowserEnvironment();
            } else if (this.environment === 'node') {
                this.setupNodeEnvironment();
            }
            
            // Initialize development tools
            if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.devTools) {
                this.initializeDevTools();
            }
            
            // Setup performance monitoring
            if (DEBUG_CONFIG.performance) {
                this.setupPerformanceMonitoring();
            }
            
            // Emit initialization event
            this.hooks.emit('init', this);
            
            this.logger.success('LuaUI initialized successfully');
        }
        
        // Setup browser environment
        setupBrowserEnvironment() {
            // Process existing <luaui> tags
            if (typeof document !== 'undefined') {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => {
                        this.processLuaUITags();
                    });
                } else {
                    this.processLuaUITags();
                }
                
                // Watch for new <luaui> tags
                this.setupMutationObserver();
                
                // Setup hot module replacement
                if (DEBUG_CONFIG.enabled) {
                    this.setupHMR();
                }
            }
        }
        
        // Setup Node.js environment
        setupNodeEnvironment() {
            // Server-side rendering support
            this.ssr = {
                renderToString: (component, props) => {
                    return this.renderComponentToString(component, props);
                },
                renderToStaticMarkup: (component, props) => {
                    return this.renderComponentToString(component, props, { static: true });
                }
            };
            
            this.logger.info('Server-side rendering enabled');
        }
        
        // Setup mutation observer for dynamic <luaui> tags
        setupMutationObserver() {
            if (typeof MutationObserver !== 'undefined') {
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.tagName === 'LUAUI') {
                                    this.processLuaUIElement(node);
                                } else {
                                    const luauiElements = node.querySelectorAll && node.querySelectorAll('luaui');
                                    if (luauiElements) {
                                        luauiElements.forEach(el => this.processLuaUIElement(el));
                                    }
                                }
                            }
                        });
                    });
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }
        
        // Setup hot module replacement
        setupHMR() {
            this.hmr.enabled = true;
            
            // Listen for file changes (in development)
            if (typeof WebSocket !== 'undefined') {
                try {
                    const ws = new WebSocket('ws://localhost:3001/hmr');
                    
                    ws.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        if (data.type === 'update') {
                            this.handleHMRUpdate(data);
                        }
                    };
                    
                    ws.onerror = () => {
                        // HMR server not available, disable HMR
                        this.hmr.enabled = false;
                    };
                } catch (error) {
                    this.hmr.enabled = false;
                }
            }
        }
        
        // Handle HMR update
        handleHMRUpdate(data) {
            const { file, content } = data;
            
            try {
                // Recompile and update component
                const compiled = this.compile(content);
                compiled(this, h, text, component, fragment);
                
                // Trigger re-render of affected components
                this.hmr.callbacks.forEach(callback => callback(file));
                
                this.logger.info(`Hot reloaded: ${file}`);
            } catch (error) {
                this.logger.error(`HMR Error: ${error.message}`);
            }
        }
        
        // Initialize development tools
        initializeDevTools() {
            this.devTools = {
                inspect: (element) => {
                    return this.inspectElement(element);
                },
                
                getComponentTree: () => {
                    return this.getComponentTree();
                },
                
                getPerformanceMetrics: () => {
                    return this.getPerformanceMetrics();
                },
                
                highlightComponent: (component) => {
                    this.highlightComponent(component);
                },
                
                logStateChanges: (enabled) => {
                    this.logStateChanges = enabled;
                }
            };
            
            // Expose to global scope for browser dev tools
            if (typeof window !== 'undefined') {
                window.__LUAUI_DEVTOOLS__ = this.devTools;
            }
        }
        
        // Setup performance monitoring
        setupPerformanceMonitoring() {
            // Monitor render performance
            this.hooks.on('render:start', (component) => {
                this.performance.start(`render:${component.constructor.name}`);
            });
            
            this.hooks.on('render:end', (component) => {
                const duration = this.performance.end(`render:${component.constructor.name}`);
                if (duration > 16) { // Longer than one frame
                    this.logger.warn(`Slow render detected: ${component.constructor.name} (${duration.toFixed(2)}ms)`);
                }
            });
            
            // Monitor compilation performance
            this.hooks.on('compile:start', () => {
                this.performance.start('compile');
            });
            
            this.hooks.on('compile:end', () => {
                const duration = this.performance.end('compile');
                this.logger.debug(`Compilation completed in ${duration.toFixed(2)}ms`);
            });
        }
        
        // Process all <luaui> tags
        processLuaUITags() {
            const luauiElements = document.querySelectorAll('luaui');
            luauiElements.forEach(element => this.processLuaUIElement(element));
        }
        
        // Process individual <luaui> element
        processLuaUIElement(element) {
            try {
                const source = element.textContent || element.innerHTML;
                const src = element.getAttribute('src');
                const type = element.getAttribute('type') || 'luaui';
                
                if (src) {
                    this.loadExternalFile(src, element, type);
                } else if (source.trim()) {
                    this.compileAndMount(source, element, type);
                }
            } catch (error) {
                this.logger.error('Error processing LuaUI element:', error);
                this.displayError(element, error);
            }
        }
        
        // Load external file
        async loadExternalFile(src, element, type) {
            try {
                const response = await fetch(src);
                const source = await response.text();
                this.compileAndMount(source, element, type);
            } catch (error) {
                this.logger.error('Error loading external file:', error);
                throw error;
            }
        }
        
        // Compile LuaUI source code
        compile(source, options = {}) {
            this.hooks.emit('compile:start');
            this.performance.start('compile');
            
            try {
                // Tokenize
                const lexer = new AdvancedLexer(source, options.lexer);
                const tokens = lexer.tokenize();
                
                this.logger.debug('Tokenization completed', { tokens: tokens.length });
                
                // Parse
                const parser = new AdvancedParser(tokens, options.parser);
                const ast = parser.parse();
                
                this.logger.debug('Parsing completed', { statements: ast.body.length });
                
                // Compile
                const compiledFunction = this.compiler.compile(ast, options.compiler);
                
                const duration = this.performance.end('compile');
                this.hooks.emit('compile:end', { duration, ast });
                
                return compiledFunction;
            } catch (error) {
                this.performance.end('compile');
                this.hooks.emit('compile:error', error);
                this.logger.error('Compilation error:', error);
                throw error;
            }
        }
        
        // Compile and mount
        compileAndMount(source, container, type = 'luaui') {
            const options = this.getCompileOptions(type);
            const compiledFunction = this.compile(source, options);
            
            // Execute compiled code
            compiledFunction(this, h, text, component, fragment);
            
            // Auto-mount if there's a default component
            const appComponent = this.getComponent('App') || 
                                  Array.from(this.components.values())[0];
            
            if (appComponent) {
                this.mount(appComponent, {}, container);
            }
        }
        
        // Get compile options based on type
        getCompileOptions(type) {
            const baseOptions = {
                lexer: {
                    preserveComments: DEBUG_CONFIG.enabled,
                    allowRegex: true,
                    allowTemplates: true
                },
                parser: {
                    allowReturnOutsideFunction: false,
                    strictMode: false,
                    sourceType: 'script'
                },
                compiler: {
                    deadCodeElimination: !DEBUG_CONFIG.enabled,
                    constantFolding: true,
                    minimizeCode: !DEBUG_CONFIG.enabled
                }
            };
            
            switch (type) {
                case 'html':
                    return {
                        ...baseOptions,
                        lexer: {
                            ...baseOptions.lexer,
                            allowJSX: true
                        }
                    };
                case 'module':
                    return {
                        ...baseOptions,
                        parser: {
                            ...baseOptions.parser,
                            sourceType: 'module',
                            allowImportExportEverywhere: true
                        }
                    };
                default:
                    return baseOptions;
            }
        }
        
        // Mount component to DOM
        mount(componentClass, props = {}, container = null) {
            if (typeof componentClass === 'string') {
                componentClass = this.getComponent(componentClass);
            }
            
            if (!componentClass) {
                throw new Error('Component not found');
            }
            
            if (!container) {
                container = document.body;
            }
            
            this.performance.start('mount');
            
            try {
                // Create component instance
                const instance = new componentClass(props);
                instance.isMounted = true;
                
                // Render initial virtual DOM
                this.hooks.emit('render:start', instance);
                const vnode = instance.render();
                this.hooks.emit('render:end', instance);
                
                // Create actual DOM elements
                const element = this.createElement(vnode);
                
                // Mount to container
                if (container.tagName === 'LUAUI') {
                    container.innerHTML = '';
                    container.appendChild(element);
                } else {
                    container.appendChild(element);
                }
                
                // Store references
                instance.element = element;
                instance.vnode = vnode;
                
                const appId = AdvancedUtils.generateId('app');
                this.instances.set(appId, instance);
                this.mountedApps.set(container, appId);
                
                // Call lifecycle method
                if (instance.componentDidMount) {
                    instance.componentDidMount();
                }
                
                const duration = this.performance.end('mount');
                this.logger.debug(`Component mounted: ${componentClass.name} (${duration.toFixed(2)}ms)`);
                
                return {
                    appId,
                    instance,
                    unmount: () => this.unmount(container)
                };
            } catch (error) {
                this.performance.end('mount');
                this.logger.error('Mount error:', error);
                throw error;
            }
        }
        
        // Unmount component
        unmount(container) {
            const appId = this.mountedApps.get(container);
            if (!appId) return;
            
            const instance = this.instances.get(appId);
            if (instance) {
                // Call lifecycle method
                if (instance.componentWillUnmount) {
                    instance.componentWillUnmount();
                }
                
                // Clean up
                instance.cleanup();
                
                // Remove from DOM
                if (instance.element && instance.element.parentNode) {
                    instance.element.parentNode.removeChild(instance.element);
                }
                
                // Clean up references
                instance.isMounted = false;
                this.instances.delete(appId);
                this.mountedApps.delete(container);
                
                this.logger.debug('Component unmounted');
            }
        }
        
        // Create DOM element from VNode
        createElement(vnode) {
            if (vnode.isText()) {
                return document.createTextNode(vnode.children[0]);
            }
            
            if (vnode.isFragment()) {
                const fragment = document.createDocumentFragment();
                vnode.children.forEach(child => {
                    if (child instanceof VNode) {
                        fragment.appendChild(this.createElement(child));
                    } else {
                        fragment.appendChild(document.createTextNode(String(child)));
                    }
                });
                return fragment;
            }
            
            if (vnode.isComponent()) {
                return this.createComponent(vnode);
            }
            
            const element = document.createElement(vnode.type);
            vnode.element = element;
            
            // Set attributes and properties
            this.updateElement(element, {}, vnode.props);
            
            // Create and append children
            vnode.children.forEach(child => {
                if (child instanceof VNode) {
                    element.appendChild(this.createElement(child));
                } else if (child != null) {
                    element.appendChild(document.createTextNode(String(child)));
                }
            });
            
            return element;
        }
        
        // Create component instance
        createComponent(vnode) {
            const componentType = vnode.props.componentType;
            const componentClass = this.getComponent(componentType);
            
            if (!componentClass) {
                throw new Error(`Component '${componentType}' not found`);
            }
            
            const instance = new componentClass(vnode.props);
            vnode.component = instance;
            
            // Render component
            const rendered = instance.render();
            const element = this.createElement(rendered);
            
            vnode.element = element;
            instance.element = element;
            instance.vnode = rendered;
            
            return element;
        }
        
        // Update DOM element properties
        updateElement(element, oldProps, newProps) {
            const isEvent = key => key.startsWith('on');
            const isProperty = key => key !== 'children' && !isEvent(key) && key !== 'key' && key !== 'ref';
            const isNew = (prev, next) => key => prev[key] !== next[key];
            const isGone = (prev, next) => key => !(key in next);
            
            // Remove old or changed event listeners
            Object.keys(oldProps)
                .filter(isEvent)
                .filter(key => !(key in newProps) || isNew(oldProps, newProps)(key))
                .forEach(name => {
                    const eventType = name.toLowerCase().substring(2);
                    element.removeEventListener(eventType, oldProps[name]);
                });
            
            // Remove old properties
            Object.keys(oldProps)
                .filter(isProperty)
                .filter(isGone(oldProps, newProps))
                .forEach(name => {
                    element[name] = '';
                });
            
            // Set new or changed properties
            Object.keys(newProps)
                .filter(isProperty)
                .filter(isNew(oldProps, newProps))
                .forEach(name => {
                    if (name === 'style' && typeof newProps[name] === 'object') {
                        Object.assign(element.style, newProps[name]);
                    } else if (name === 'className' || name === 'class') {
                        element.className = newProps[name];
                    } else if (name in element) {
                        element[name] = newProps[name];
                    } else {
                        element.setAttribute(name, newProps[name]);
                    }
                });
            
            // Add event listeners
            Object.keys(newProps)
                .filter(isEvent)
                .filter(isNew(oldProps, newProps))
                .forEach(name => {
                    const eventType = name.toLowerCase().substring(2);
                    element.addEventListener(eventType, newProps[name]);
                });
            
            // Handle ref
            if (newProps.ref) {
                if (typeof newProps.ref === 'function') {
                    newProps.ref(element);
                } else if (typeof newProps.ref === 'object') {
                    newProps.ref.current = element;
                }
            }
        }
        
        // Server-side rendering
        renderComponentToString(componentClass, props = {}, options = {}) {
            if (typeof componentClass === 'string') {
                componentClass = this.getComponent(componentClass);
            }
            
            if (!componentClass) {
                throw new Error('Component not found');
            }
            
            const instance = new componentClass(props);
            const vnode = instance.render();
            
            return this.vnodeToString(vnode, options);
        }
        
        // Convert VNode to HTML string
        vnodeToString(vnode, options = {}) {
            if (vnode.isText()) {
                return AdvancedUtils.escapeHtml(vnode.children[0]);
            }
            
            if (vnode.isFragment()) {
                return vnode.children.map(child => 
                    child instanceof VNode ? this.vnodeToString(child, options) : AdvancedUtils.escapeHtml(String(child))
                ).join('');
            }
            
            if (vnode.isComponent()) {
                const componentType = vnode.props.componentType;
                const componentClass = this.getComponent(componentType);
                
                if (componentClass) {
                    const instance = new componentClass(vnode.props);
                    const rendered = instance.render();
                    return this.vnodeToString(rendered, options);
                }
                
                return '';
            }
            
            const tag = vnode.type;
            const props = vnode.props;
            const children = vnode.children;
            
            // Build attributes
            const attributes = Object.keys(props)
                .filter(key => key !== 'children' && key !== 'key' && key !== 'ref')
                .map(key => {
                    if (key.startsWith('on')) return ''; // Skip event handlers in SSR
                    if (key === 'className') return `class="${AdvancedUtils.escapeHtml(props[key])}"`;
                    if (key === 'style' && typeof props[key] === 'object') {
                        const styleStr = Object.keys(props[key])
                            .map(styleProp => `${styleProp}: ${props[key][styleProp]}`)
                            .join('; ');
                        return `style="${AdvancedUtils.escapeHtml(styleStr)}"`;
                    }
                    return `${key}="${AdvancedUtils.escapeHtml(String(props[key]))}"`;
                })
                .filter(Boolean)
                .join(' ');
            
            const attributeStr = attributes ? ` ${attributes}` : '';
            
            // Self-closing tags
            const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
            
            if (selfClosingTags.includes(tag)) {
                return `<${tag}${attributeStr} />`;
            }
            
            // Regular tags
            const childrenStr = children.map(child => 
                child instanceof VNode ? this.vnodeToString(child, options) : AdvancedUtils.escapeHtml(String(child))
            ).join('');
            
            return `<${tag}${attributeStr}>${childrenStr}</${tag}>`;
        }
        
        // Component registry methods
        registerComponent(name, componentClass) {
            this.components.set(name, componentClass);
            this.logger.debug(`Component registered: ${name}`);
            this.hooks.emit('component:registered', { name, componentClass });
        }
        
        getComponent(name) {
            return this.components.get(name);
        }
        
        unregisterComponent(name) {
            const removed = this.components.delete(name);
            if (removed) {
                this.logger.debug(`Component unregistered: ${name}`);
                this.hooks.emit('component:unregistered', { name });
            }
            return removed;
        }
        
        // Plugin system
        use(plugin, options = {}) {
            if (typeof plugin === 'function') {
                plugin(this, options);
            } else if (plugin && typeof plugin.install === 'function') {
                plugin.install(this, options);
            } else {
                throw new Error('Invalid plugin format');
            }
            
            const pluginName = plugin.name || 'anonymous';
            this.plugins.set(pluginName, { plugin, options });
            this.logger.debug(`Plugin installed: ${pluginName}`);
            
            return this;
        }
        
        // Animation helpers
        animate(element, properties, options) {
            return this.animation.animate(element, properties, options);
        }
        
        timeline(options) {
            return this.animation.timeline(options);
        }
        
        tween(from, to, options) {
            return this.animation.tween(from, to, options);
        }
        
        // CSS helpers
        css(styles, options) {
            return this.css.processAndInject(styles, options);
        }
        
        // Reactive helpers
        reactive(target) {
            return this.reactive.reactive(target);
        }
        
        ref(value) {
            return this.reactive.ref(value);
        }
        
        computed(getter) {
            return this.reactive.computed(getter);
        }
        
        watch(source, callback, options) {
            return this.reactive.watch(source, callback, options);
        }
        
        // Virtual DOM helpers
        h(type, props, ...children) {
            return h(type, props, ...children);
        }
        
        text(content) {
            return text(content);
        }
        
        component(type, props, children) {
            return component(type, props, children);
        }
        
        fragment(children) {
            return fragment(children);
        }
        
        // Error handling
        displayError(container, error) {
            const errorElement = document.createElement('div');
            errorElement.style.cssText = `
                position: relative;
                padding: 20px;
                margin: 10px;
                background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                color: white;
                border-radius: 8px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 14px;
                line-height: 1.5;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border-left: 4px solid #ff4757;
            `;
            
            errorElement.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="
                        width: 20px;
                        height: 20px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 10px;
                        font-weight: bold;
                    ">!</div>
                    <strong>LuaUI Compilation Error</strong>
                </div>
                <div style="
                    background: rgba(0, 0, 0, 0.2);
                    padding: 12px;
                    border-radius: 4px;
                    margin-bottom: 12px;
                    font-family: inherit;
                    white-space: pre-wrap;
                ">${AdvancedUtils.escapeHtml(error.message)}</div>
                <div style="font-size: 12px; opacity: 0.8;">
                    Check the browser console for more details.
                </div>
            `;
            
            if (container.tagName === 'LUAUI') {
                container.innerHTML = '';
                container.appendChild(errorElement);
            } else {
                container.appendChild(errorElement);
            }
        }
        
        // Development tools methods
        inspectElement(element) {
            // TODO: Implement element inspection
            return {
                element,
                component: null,
                props: {},
                state: {},
                vnode: null
            };
        }
        
        getComponentTree() {
            // TODO: Implement component tree generation
            return [];
        }
        
        getPerformanceMetrics() {
            return {
                ...this.performance.getMetrics(),
                animation: this.animation.getPerformanceInfo(),
                css: this.css.getMetrics(),
                components: this.components.size,
                instances: this.instances.size
            };
        }
        
        highlightComponent(component) {
            // TODO: Implement component highlighting
        }
        
        // Debug information
        debug() {
            return {
                version: this.version,
                build: this.build,
                environment: this.environment,
                components: Array.from(this.components.keys()),
                instances: this.instances.size,
                mountedApps: this.mountedApps.size,
                plugins: Array.from(this.plugins.keys()),
                performance: this.getPerformanceMetrics(),
                security: {
                    obfuscation: SECURITY_CONFIG.obfuscation,
                    encryption: SECURITY_CONFIG.encryption,
                    antiDebug: SECURITY_CONFIG.antiDebug
                }
            };
        }
        
        // Cleanup
        destroy() {
            // Unmount all apps
            this.mountedApps.forEach((appId, container) => {
                this.unmount(container);
            });
            
            // Stop animation engine
            this.animation.stop();
            
            // Clear all registries
            this.components.clear();
            this.instances.clear();
            this.mountedApps.clear();
            this.plugins.clear();
            
            // Remove all styles
            this.css.styleSheets.forEach((element, id) => {
                this.css.remove(id);
            });
            
            this.logger.info('LuaUI destroyed');
        }
    }
    
    /* ============================================================================
     * GLOBAL INITIALIZATION AND EXPORT
     * ============================================================================ */
    
    // Create global LuaUI instance
    const LuaUI = new LuaUIRuntime();
    
    // Apply security protection if enabled
    if (SECURITY_CONFIG.runtimeProtection) {
        const protectedKeys = ['security', 'compiler', 'performance'];
        const protectedLuaUI = LuaUI.security.protectRuntime(LuaUI, protectedKeys);
        
        // Export protected instance
        return protectedLuaUI;
    }
    
    // Export unprotected instance
    return LuaUI;
}));

// Add copyright notice for server-side attribution
if (typeof module !== 'undefined' && module.exports) {
    module.exports.__COPYRIGHT__ = 'Copyright (c) 2025 Bluezly Technologies - Server-side attribution required';
}
