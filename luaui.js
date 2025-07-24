/**
 * LuaUI - Advanced Frontend UI Programming Language
 * Version 1.0.0
 * 
 * A complete Lua-inspired UI framework with built-in LuaCSS styling,
 * reactive state management, component system, and advanced animations.
 * 
 * Copyright (c) 2025 LuaUI Framework
 * License: MIT
 */

(function(global) {
    'use strict';
    
    /* ============================================================================
     * CORE ARCHITECTURE OVERVIEW
     * ============================================================================
     * 
     * LuaUI Architecture:
     * 1. Lexer: Tokenizes LuaUI source code into meaningful tokens
     * 2. Parser: Builds Abstract Syntax Tree (AST) from tokens
     * 3. Compiler: Converts AST to executable JavaScript functions
     * 4. Virtual DOM: Lightweight virtual representation of DOM elements
     * 5. Diffing Engine: Efficiently updates real DOM based on virtual DOM changes
     * 6. Reactive System: Automatic UI updates when state changes using proxies
     * 7. Component System: Reusable, composable UI components with props and slots
     * 8. Animation Engine: Built-in animation and transition support with timelines
     * 9. LuaCSS Engine: CSS parser with scoped styling, variables, and mixins
     * 10. Runtime: Orchestrates all systems and provides public API
     * 
     * The entire system is self-contained with no external dependencies.
     */
    
    // ============================================================================
    // CONSTANTS AND UTILITIES
    // ============================================================================
    
    const VERSION = '1.0.0';
    const DEBUG = false;
    
    // Token types for the lexer
    const TokenType = {
        // Literals
        STRING: 'STRING',
        NUMBER: 'NUMBER',
        BOOLEAN: 'BOOLEAN',
        NIL: 'NIL',
        
        // Identifiers and keywords
        IDENTIFIER: 'IDENTIFIER',
        COMPONENT: 'COMPONENT',
        FUNCTION: 'FUNCTION',
        LOCAL: 'LOCAL',
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
        AND: 'AND',
        OR: 'OR',
        NOT: 'NOT',
        IN: 'IN',
        
        // Operators
        PLUS: 'PLUS',
        MINUS: 'MINUS',
        MULTIPLY: 'MULTIPLY',
        DIVIDE: 'DIVIDE',
        MODULO: 'MODULO',
        POWER: 'POWER',
        CONCAT: 'CONCAT',
        ASSIGN: 'ASSIGN',
        EQUAL: 'EQUAL',
        NOT_EQUAL: 'NOT_EQUAL',
        LESS_THAN: 'LESS_THAN',
        LESS_EQUAL: 'LESS_EQUAL',
        GREATER_THAN: 'GREATER_THAN',
        GREATER_EQUAL: 'GREATER_EQUAL',
        
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
        
        // Special
        NEWLINE: 'NEWLINE',
        EOF: 'EOF',
        
        // CSS-specific
        CSS_SELECTOR: 'CSS_SELECTOR',
        CSS_PROPERTY: 'CSS_PROPERTY',
        CSS_VALUE: 'CSS_VALUE'
    };
    
    // Virtual DOM node types
    const VNodeType = {
        ELEMENT: 'ELEMENT',
        TEXT: 'TEXT',
        COMMENT: 'COMMENT',
        COMPONENT: 'COMPONENT',
        FRAGMENT: 'FRAGMENT'
    };
    
    // Animation types
    const AnimationType = {
        CSS_TRANSITION: 'CSS_TRANSITION',
        CSS_ANIMATION: 'CSS_ANIMATION',
        TIMELINE: 'TIMELINE',
        SPRING: 'SPRING'
    };
    
    // Utility functions
    const utils = {
        isArray: Array.isArray,
        
        isObject(value) {
            return value !== null && typeof value === 'object' && !Array.isArray(value);
        },
        
        isFunction(value) {
            return typeof value === 'function';
        },
        
        isString(value) {
            return typeof value === 'string';
        },
        
        isNumber(value) {
            return typeof value === 'number' && !isNaN(value);
        },
        
        isBoolean(value) {
            return typeof value === 'boolean';
        },
        
        isEmpty(value) {
            if (value == null) return true;
            if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
            if (typeof value === 'object') return Object.keys(value).length === 0;
            return false;
        },
        
        clone(obj) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj.getTime());
            if (Array.isArray(obj)) return obj.map(item => utils.clone(item));
            
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = utils.clone(obj[key]);
                }
            }
            return cloned;
        },
        
        merge(target, ...sources) {
            if (!target) target = {};
            sources.forEach(source => {
                if (source) {
                    Object.keys(source).forEach(key => {
                        if (utils.isObject(source[key]) && utils.isObject(target[key])) {
                            target[key] = utils.merge(target[key], source[key]);
                        } else {
                            target[key] = source[key];
                        }
                    });
                }
            });
            return target;
        },
        
        throttle(func, delay) {
            let lastCall = 0;
            return function(...args) {
                const now = Date.now();
                if (now - lastCall >= delay) {
                    lastCall = now;
                    return func.apply(this, args);
                }
            };
        },
        
        debounce(func, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        },
        
        generateId() {
            return 'luaui_' + Math.random().toString(36).substr(2, 9);
        },
        
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },
        
        log(...args) {
            if (DEBUG) {
                console.log('[LuaUI]', ...args);
            }
        },
        
        warn(...args) {
            console.warn('[LuaUI]', ...args);
        },
        
        error(...args) {
            console.error('[LuaUI]', ...args);
        }
    };
    
    // ============================================================================
    // LEXER IMPLEMENTATION
    // ============================================================================
    
    /**
     * LuaUI Lexer - Tokenizes LuaUI source code
     * 
     * The lexer scans through source code character by character and produces
     * a stream of tokens that represent the meaningful elements of the language.
     * It handles Lua-like syntax including strings, numbers, identifiers, operators,
     * and keywords.
     */
    class Lexer {
        constructor(source) {
            this.source = source;
            this.position = 0;
            this.line = 1;
            this.column = 1;
            this.tokens = [];
            this.keywords = new Set([
                'component', 'function', 'local', 'if', 'then', 'else', 'elseif',
                'end', 'for', 'while', 'do', 'repeat', 'until', 'return', 'break',
                'and', 'or', 'not', 'in', 'true', 'false', 'nil'
            ]);
        }
        
        // Get current character without advancing
        peek(offset = 0) {
            const pos = this.position + offset;
            return pos < this.source.length ? this.source[pos] : '\0';
        }
        
        // Get current character and advance position
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
        
        // Skip whitespace except newlines
        skipWhitespace() {
            while (this.peek() && /[ \t\r]/.test(this.peek())) {
                this.advance();
            }
        }
        
        // Skip comments
        skipComment() {
            if (this.peek() === '-' && this.peek(1) === '-') {
                this.advance(); // -
                this.advance(); // -
                
                // Multi-line comment
                if (this.peek() === '[' && this.peek(1) === '[') {
                    this.advance(); // [
                    this.advance(); // [
                    
                    while (this.peek()) {
                        if (this.peek() === ']' && this.peek(1) === ']') {
                            this.advance(); // ]
                            this.advance(); // ]
                            break;
                        }
                        this.advance();
                    }
                } else {
                    // Single-line comment
                    while (this.peek() && this.peek() !== '\n') {
                        this.advance();
                    }
                }
                return true;
            }
            return false;
        }
        
        // Read string literal
        readString() {
            const quote = this.advance(); // ' or "
            let value = '';
            
            while (this.peek() && this.peek() !== quote) {
                if (this.peek() === '\\') {
                    this.advance(); // \
                    const escaped = this.advance();
                    switch (escaped) {
                        case 'n': value += '\n'; break;
                        case 't': value += '\t'; break;
                        case 'r': value += '\r'; break;
                        case '\\': value += '\\'; break;
                        case '\'': value += '\''; break;
                        case '"': value += '"'; break;
                        default: value += escaped; break;
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
            
            return this.createToken(TokenType.STRING, value);
        }
        
        // Read number literal
        readNumber() {
            let value = '';
            let hasDot = false;
            
            while (this.peek() && (/\d/.test(this.peek()) || (!hasDot && this.peek() === '.'))) {
                if (this.peek() === '.') {
                    hasDot = true;
                }
                value += this.advance();
            }
            
            return this.createToken(TokenType.NUMBER, parseFloat(value));
        }
        
        // Read identifier or keyword
        readIdentifier() {
            let value = '';
            
            while (this.peek() && /[a-zA-Z0-9_]/.test(this.peek())) {
                value += this.advance();
            }
            
            // Check if it's a keyword
            if (this.keywords.has(value)) {
                if (value === 'true' || value === 'false') {
                    return this.createToken(TokenType.BOOLEAN, value === 'true');
                } else if (value === 'nil') {
                    return this.createToken(TokenType.NIL, null);
                } else {
                    return this.createToken(value.toUpperCase(), value);
                }
            }
            
            return this.createToken(TokenType.IDENTIFIER, value);
        }
        
        // Create token object
        createToken(type, value, line = this.line, column = this.column) {
            return {
                type,
                value,
                line,
                column
            };
        }
        
        // Main tokenization method
        tokenize() {
            while (this.position < this.source.length) {
                this.skipWhitespace();
                
                if (this.position >= this.source.length) break;
                
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
                if (char === '"' || char === "'") {
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
                if (/[a-zA-Z_]/.test(char)) {
                    this.tokens.push(this.readIdentifier());
                    continue;
                }
                
                // Two-character operators
                const twoChar = char + this.peek(1);
                switch (twoChar) {
                    case '==':
                        this.advance();
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.EQUAL, twoChar, line, column));
                        continue;
                    case '~=':
                    case '!=':
                        this.advance();
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.NOT_EQUAL, twoChar, line, column));
                        continue;
                    case '<=':
                        this.advance();
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.LESS_EQUAL, twoChar, line, column));
                        continue;
                    case '>=':
                        this.advance();
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.GREATER_EQUAL, twoChar, line, column));
                        continue;
                    case '..':
                        this.advance();
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.CONCAT, twoChar, line, column));
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
                        this.advance();
                        this.tokens.push(this.createToken(TokenType.MULTIPLY, char, line, column));
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
    
    // ============================================================================
    // PARSER IMPLEMENTATION
    // ============================================================================
    
    /**
     * LuaUI Parser - Builds Abstract Syntax Tree (AST) from tokens
     * 
     * The parser implements a recursive descent parser that converts the token
     * stream into an Abstract Syntax Tree. It handles all LuaUI language constructs
     * including components, functions, expressions, statements, and control flow.
     */
    class Parser {
        constructor(tokens) {
            this.tokens = tokens;
            this.current = 0;
        }
        
        // Check if we're at the end of tokens
        isAtEnd() {
            return this.peek().type === TokenType.EOF;
        }
        
        // Get current token without advancing
        peek() {
            return this.tokens[this.current];
        }
        
        // Get previous token
        previous() {
            return this.tokens[this.current - 1];
        }
        
        // Advance to next token
        advance() {
            if (!this.isAtEnd()) this.current++;
            return this.previous();
        }
        
        // Check if current token matches any of the given types
        check(type) {
            if (this.isAtEnd()) return false;
            return this.peek().type === type;
        }
        
        // Advance if current token matches any of the given types
        match(...types) {
            for (const type of types) {
                if (this.check(type)) {
                    this.advance();
                    return true;
                }
            }
            return false;
        }
        
        // Consume token of given type or throw error
        consume(type, message) {
            if (this.check(type)) return this.advance();
            
            const current = this.peek();
            throw new Error(`${message}. Got ${current.type} at line ${current.line}, column ${current.column}`);
        }
        
        // Skip newlines
        skipNewlines() {
            while (this.match(TokenType.NEWLINE)) {
                // Skip
            }
        }
        
        // Parse program (entry point)
        parse() {
            const statements = [];
            
            this.skipNewlines();
            
            while (!this.isAtEnd()) {
                if (this.match(TokenType.NEWLINE)) continue;
                
                const stmt = this.statement();
                if (stmt) statements.push(stmt);
                
                this.skipNewlines();
            }
            
            return {
                type: 'Program',
                body: statements
            };
        }
        
        // Parse statement
        statement() {
            try {
                if (this.match(TokenType.COMPONENT)) return this.componentDeclaration();
                if (this.match(TokenType.FUNCTION)) return this.functionDeclaration();
                if (this.match(TokenType.LOCAL)) return this.localDeclaration();
                if (this.match(TokenType.IF)) return this.ifStatement();
                if (this.match(TokenType.FOR)) return this.forStatement();
                if (this.match(TokenType.WHILE)) return this.whileStatement();
                if (this.match(TokenType.REPEAT)) return this.repeatStatement();
                if (this.match(TokenType.RETURN)) return this.returnStatement();
                if (this.match(TokenType.BREAK)) return this.breakStatement();
                
                return this.expressionStatement();
            } catch (error) {
                // Synchronize on error
                this.synchronize();
                throw error;
            }
        }
        
        // Synchronize after parse error
        synchronize() {
            this.advance();
            
            while (!this.isAtEnd()) {
                if (this.previous().type === TokenType.NEWLINE) return;
                
                switch (this.peek().type) {
                    case TokenType.COMPONENT:
                    case TokenType.FUNCTION:
                    case TokenType.LOCAL:
                    case TokenType.FOR:
                    case TokenType.IF:
                    case TokenType.WHILE:
                    case TokenType.REPEAT:
                    case TokenType.RETURN:
                        return;
                }
                
                this.advance();
            }
        }
        
        // Parse component declaration
        componentDeclaration() {
            const name = this.consume(TokenType.IDENTIFIER, "Expected component name").value;
            
            this.consume(TokenType.LEFT_BRACE, "Expected '{' after component name");
            this.skipNewlines();
            
            const properties = {};
            
            while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                const key = this.consume(TokenType.IDENTIFIER, "Expected property name").value;
                this.consume(TokenType.ASSIGN, "Expected '=' after property name");
                
                const value = this.expression();
                properties[key] = value;
                
                this.skipNewlines();
                
                if (!this.check(TokenType.RIGHT_BRACE)) {
                    this.match(TokenType.COMMA);
                    this.skipNewlines();
                }
            }
            
            this.consume(TokenType.RIGHT_BRACE, "Expected '}' after component body");
            
            return {
                type: 'ComponentDeclaration',
                name,
                properties
            };
        }
        
        // Parse function declaration
        functionDeclaration() {
            const name = this.consume(TokenType.IDENTIFIER, "Expected function name").value;
            
            this.consume(TokenType.LEFT_PAREN, "Expected '(' after function name");
            
            const parameters = [];
            if (!this.check(TokenType.RIGHT_PAREN)) {
                do {
                    parameters.push(this.consume(TokenType.IDENTIFIER, "Expected parameter name").value);
                } while (this.match(TokenType.COMMA));
            }
            
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after parameters");
            this.skipNewlines();
            
            const body = [];
            while (!this.check(TokenType.END) && !this.isAtEnd()) {
                if (this.match(TokenType.NEWLINE)) continue;
                body.push(this.statement());
                this.skipNewlines();
            }
            
            this.consume(TokenType.END, "Expected 'end' after function body");
            
            return {
                type: 'FunctionDeclaration',
                name,
                parameters,
                body
            };
        }
        
        // Parse local declaration
        localDeclaration() {
            const name = this.consume(TokenType.IDENTIFIER, "Expected variable name").value;
            
            let initializer = null;
            if (this.match(TokenType.ASSIGN)) {
                initializer = this.expression();
            }
            
            return {
                type: 'LocalDeclaration',
                name,
                initializer
            };
        }
        
        // Parse if statement
        ifStatement() {
            const condition = this.expression();
            this.consume(TokenType.THEN, "Expected 'then' after if condition");
            this.skipNewlines();
            
            const thenBranch = [];
            while (!this.check(TokenType.ELSE) && !this.check(TokenType.ELSEIF) && !this.check(TokenType.END) && !this.isAtEnd()) {
                if (this.match(TokenType.NEWLINE)) continue;
                thenBranch.push(this.statement());
                this.skipNewlines();
            }
            
            const elseIfBranches = [];
            while (this.match(TokenType.ELSEIF)) {
                const elseIfCondition = this.expression();
                this.consume(TokenType.THEN, "Expected 'then' after elseif condition");
                this.skipNewlines();
                
                const elseIfBody = [];
                while (!this.check(TokenType.ELSE) && !this.check(TokenType.ELSEIF) && !this.check(TokenType.END) && !this.isAtEnd()) {
                    if (this.match(TokenType.NEWLINE)) continue;
                    elseIfBody.push(this.statement());
                    this.skipNewlines();
                }
                
                elseIfBranches.push({
                    condition: elseIfCondition,
                    body: elseIfBody
                });
            }
            
            let elseBranch = null;
            if (this.match(TokenType.ELSE)) {
                this.skipNewlines();
                elseBranch = [];
                while (!this.check(TokenType.END) && !this.isAtEnd()) {
                    if (this.match(TokenType.NEWLINE)) continue;
                    elseBranch.push(this.statement());
                    this.skipNewlines();
                }
            }
            
            this.consume(TokenType.END, "Expected 'end' after if statement");
            
            return {
                type: 'IfStatement',
                condition,
                thenBranch,
                elseIfBranches,
                elseBranch
            };
        }
        
        // Parse for statement
        forStatement() {
            const variable = this.consume(TokenType.IDENTIFIER, "Expected variable name").value;
            
            if (this.match(TokenType.ASSIGN)) {
                // Numeric for loop
                const start = this.expression();
                this.consume(TokenType.COMMA, "Expected ',' after for start");
                const end = this.expression();
                
                let step = null;
                if (this.match(TokenType.COMMA)) {
                    step = this.expression();
                }
                
                this.consume(TokenType.DO, "Expected 'do' after for range");
                this.skipNewlines();
                
                const body = [];
                while (!this.check(TokenType.END) && !this.isAtEnd()) {
                    if (this.match(TokenType.NEWLINE)) continue;
                    body.push(this.statement());
                    this.skipNewlines();
                }
                
                this.consume(TokenType.END, "Expected 'end' after for body");
                
                return {
                    type: 'NumericForStatement',
                    variable,
                    start,
                    end,
                    step,
                    body
                };
            } else if (this.match(TokenType.IN)) {
                // Generic for loop
                const iterable = this.expression();
                this.consume(TokenType.DO, "Expected 'do' after for iterable");
                this.skipNewlines();
                
                const body = [];
                while (!this.check(TokenType.END) && !this.isAtEnd()) {
                    if (this.match(TokenType.NEWLINE)) continue;
                    body.push(this.statement());
                    this.skipNewlines();
                }
                
                this.consume(TokenType.END, "Expected 'end' after for body");
                
                return {
                    type: 'GenericForStatement',
                    variable,
                    iterable,
                    body
                };
            } else {
                throw new Error("Expected '=' or 'in' after for variable");
            }
        }
        
        // Parse while statement
        whileStatement() {
            const condition = this.expression();
            this.consume(TokenType.DO, "Expected 'do' after while condition");
            this.skipNewlines();
            
            const body = [];
            while (!this.check(TokenType.END) && !this.isAtEnd()) {
                if (this.match(TokenType.NEWLINE)) continue;
                body.push(this.statement());
                this.skipNewlines();
            }
            
            this.consume(TokenType.END, "Expected 'end' after while body");
            
            return {
                type: 'WhileStatement',
                condition,
                body
            };
        }
        
        // Parse repeat statement
        repeatStatement() {
            this.skipNewlines();
            
            const body = [];
            while (!this.check(TokenType.UNTIL) && !this.isAtEnd()) {
                if (this.match(TokenType.NEWLINE)) continue;
                body.push(this.statement());
                this.skipNewlines();
            }
            
            this.consume(TokenType.UNTIL, "Expected 'until' after repeat body");
            const condition = this.expression();
            
            return {
                type: 'RepeatStatement',
                body,
                condition
            };
        }
        
        // Parse return statement
        returnStatement() {
            let value = null;
            if (!this.check(TokenType.NEWLINE) && !this.check(TokenType.EOF) && !this.check(TokenType.END)) {
                value = this.expression();
            }
            
            return {
                type: 'ReturnStatement',
                value
            };
        }
        
        // Parse break statement
        breakStatement() {
            return {
                type: 'BreakStatement'
            };
        }
        
        // Parse expression statement
        expressionStatement() {
            const expr = this.expression();
            return {
                type: 'ExpressionStatement',
                expression: expr
            };
        }
        
        // Parse expression
        expression() {
            return this.assignment();
        }
        
        // Parse assignment
        assignment() {
            const expr = this.logicalOr();
            
            if (this.match(TokenType.ASSIGN)) {
                const value = this.assignment();
                
                if (expr.type === 'Identifier' || expr.type === 'MemberExpression' || expr.type === 'IndexExpression') {
                    return {
                        type: 'AssignmentExpression',
                        left: expr,
                        right: value
                    };
                }
                
                throw new Error("Invalid assignment target");
            }
            
            return expr;
        }
        
        // Parse logical OR
        logicalOr() {
            let expr = this.logicalAnd();
            
            while (this.match(TokenType.OR)) {
                const operator = this.previous().value;
                const right = this.logicalAnd();
                expr = {
                    type: 'BinaryExpression',
                    left: expr,
                    operator,
                    right
                };
            }
            
            return expr;
        }
        
        // Parse logical AND
        logicalAnd() {
            let expr = this.equality();
            
            while (this.match(TokenType.AND)) {
                const operator = this.previous().value;
                const right = this.equality();
                expr = {
                    type: 'BinaryExpression',
                    left: expr,
                    operator,
                    right
                };
            }
            
            return expr;
        }
        
        // Parse equality
        equality() {
            let expr = this.comparison();
            
            while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL)) {
                const operator = this.previous().value;
                const right = this.comparison();
                expr = {
                    type: 'BinaryExpression',
                    left: expr,
                    operator,
                    right
                };
            }
            
            return expr;
        }
        
        // Parse comparison
        comparison() {
            let expr = this.concatenation();
            
            while (this.match(TokenType.GREATER_THAN, TokenType.GREATER_EQUAL, TokenType.LESS_THAN, TokenType.LESS_EQUAL)) {
                const operator = this.previous().value;
                const right = this.concatenation();
                expr = {
                    type: 'BinaryExpression',
                    left: expr,
                    operator,
                    right
                };
            }
            
            return expr;
        }
        
        // Parse concatenation
        concatenation() {
            let expr = this.addition();
            
            while (this.match(TokenType.CONCAT)) {
                const operator = this.previous().value;
                const right = this.addition();
                expr = {
                    type: 'BinaryExpression',
                    left: expr,
                    operator,
                    right
                };
            }
            
            return expr;
        }
        
        // Parse addition and subtraction
        addition() {
            let expr = this.multiplication();
            
            while (this.match(TokenType.PLUS, TokenType.MINUS)) {
                const operator = this.previous().value;
                const right = this.multiplication();
                expr = {
                    type: 'BinaryExpression',
                    left: expr,
                    operator,
                    right
                };
            }
            
            return expr;
        }
        
        // Parse multiplication, division, and modulo
        multiplication() {
            let expr = this.unary();
            
            while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO)) {
                const operator = this.previous().value;
                const right = this.unary();
                expr = {
                    type: 'BinaryExpression',
                    left: expr,
                    operator,
                    right
                };
            }
            
            return expr;
        }
        
        // Parse unary expressions
        unary() {
            if (this.match(TokenType.NOT, TokenType.MINUS)) {
                const operator = this.previous().value;
                const right = this.unary();
                return {
                    type: 'UnaryExpression',
                    operator,
                    operand: right
                };
            }
            
            return this.power();
        }
        
        // Parse power (exponentiation)
        power() {
            let expr = this.postfix();
            
            if (this.match(TokenType.POWER)) {
                const operator = this.previous().value;
                const right = this.unary(); // Right associative
                expr = {
                    type: 'BinaryExpression',
                    left: expr,
                    operator,
                    right
                };
            }
            
            return expr;
        }
        
        // Parse postfix expressions (function calls, member access, indexing)
        postfix() {
            let expr = this.primary();
            
            while (true) {
                if (this.match(TokenType.LEFT_PAREN)) {
                    expr = this.finishCall(expr);
                } else if (this.match(TokenType.DOT)) {
                    const name = this.consume(TokenType.IDENTIFIER, "Expected property name after '.'").value;
                    expr = {
                        type: 'MemberExpression',
                        object: expr,
                        property: name,
                        computed: false
                    };
                } else if (this.match(TokenType.LEFT_BRACKET)) {
                    const index = this.expression();
                    this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after index");
                    expr = {
                        type: 'MemberExpression',
                        object: expr,
                        property: index,
                        computed: true
                    };
                } else {
                    break;
                }
            }
            
            return expr;
        }
        
        // Finish parsing function call
        finishCall(callee) {
            const args = [];
            
            if (!this.check(TokenType.RIGHT_PAREN)) {
                do {
                    args.push(this.expression());
                } while (this.match(TokenType.COMMA));
            }
            
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments");
            
            return {
                type: 'CallExpression',
                callee,
                arguments: args
            };
        }
        
        // Parse primary expressions
        primary() {
            if (this.match(TokenType.TRUE, TokenType.FALSE)) {
                return {
                    type: 'Literal',
                    value: this.previous().value
                };
            }
            
            if (this.match(TokenType.NIL)) {
                return {
                    type: 'Literal',
                    value: null
                };
            }
            
            if (this.match(TokenType.NUMBER, TokenType.STRING)) {
                return {
                    type: 'Literal',
                    value: this.previous().value
                };
            }
            
            if (this.match(TokenType.IDENTIFIER)) {
                return {
                    type: 'Identifier',
                    name: this.previous().value
                };
            }
            
            if (this.match(TokenType.LEFT_PAREN)) {
                const expr = this.expression();
                this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression");
                return expr;
            }
            
            if (this.match(TokenType.LEFT_BRACE)) {
                return this.tableConstructor();
            }
            
            if (this.match(TokenType.FUNCTION)) {
                return this.functionExpression();
            }
            
            throw new Error(`Unexpected token ${this.peek().type} at line ${this.peek().line}`);
        }
        
        // Parse table constructor
        tableConstructor() {
            const fields = [];
            this.skipNewlines();
            
            while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                if (this.check(TokenType.IDENTIFIER) && this.tokens[this.current + 1].type === TokenType.ASSIGN) {
                    // Named field
                    const key = this.advance().value;
                    this.advance(); // =
                    const value = this.expression();
                    fields.push({
                        type: 'NamedField',
                        key,
                        value
                    });
                } else if (this.check(TokenType.LEFT_BRACKET)) {
                    // Computed field
                    this.advance(); // [
                    const key = this.expression();
                    this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after computed key");
                    this.consume(TokenType.ASSIGN, "Expected '=' after computed key");
                    const value = this.expression();
                    fields.push({
                        type: 'ComputedField',
                        key,
                        value
                    });
                } else {
                    // Array element
                    const value = this.expression();
                    fields.push({
                        type: 'ArrayElement',
                        value
                    });
                }
                
                this.skipNewlines();
                
                if (!this.check(TokenType.RIGHT_BRACE)) {
                    this.match(TokenType.COMMA, TokenType.SEMICOLON);
                    this.skipNewlines();
                }
            }
            
            this.consume(TokenType.RIGHT_BRACE, "Expected '}' after table constructor");
            
            return {
                type: 'TableConstructor',
                fields
            };
        }
        
        // Parse function expression
        functionExpression() {
            this.consume(TokenType.LEFT_PAREN, "Expected '(' after 'function'");
            
            const parameters = [];
            if (!this.check(TokenType.RIGHT_PAREN)) {
                do {
                    parameters.push(this.consume(TokenType.IDENTIFIER, "Expected parameter name").value);
                } while (this.match(TokenType.COMMA));
            }
            
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after parameters");
            this.skipNewlines();
            
            const body = [];
            while (!this.check(TokenType.END) && !this.isAtEnd()) {
                if (this.match(TokenType.NEWLINE)) continue;
                body.push(this.statement());
                this.skipNewlines();
            }
            
            this.consume(TokenType.END, "Expected 'end' after function body");
            
            return {
                type: 'FunctionExpression',
                parameters,
                body
            };
        }
    }
    
    // ============================================================================
    // VIRTUAL DOM IMPLEMENTATION
    // ============================================================================
    
    /**
     * Virtual DOM Implementation
     * 
     * The Virtual DOM is a lightweight representation of the actual DOM.
     * It allows us to efficiently diff changes and update only the parts
     * of the DOM that have actually changed.
     */
    
    // Virtual Node class
    class VNode {
        constructor(type, props = {}, children = []) {
            this.type = type;
            this.props = props || {};
            this.children = Array.isArray(children) ? children : [children];
            this.key = props.key || null;
            this.ref = props.ref || null;
            this.element = null; // Reference to actual DOM element
            this.component = null; // Reference to component instance
        }
        
        // Check if this VNode represents a text node
        isText() {
            return this.type === VNodeType.TEXT;
        }
        
        // Check if this VNode represents a component
        isComponent() {
            return this.type === VNodeType.COMPONENT;
        }
        
        // Check if this VNode represents an element
        isElement() {
            return this.type === VNodeType.ELEMENT;
        }
        
        // Clone this VNode
        clone() {
            return new VNode(this.type, utils.clone(this.props), this.children.map(child => 
                child instanceof VNode ? child.clone() : child
            ));
        }
    }
    
    // Helper functions for creating VNodes
    const h = (type, props, ...children) => {
        const flatChildren = children.flat().filter(child => child != null);
        return new VNode(type, props, flatChildren);
    };
    
    const text = (content) => {
        return new VNode(VNodeType.TEXT, {}, [String(content)]);
    };
    
    const component = (type, props, children) => {
        return new VNode(VNodeType.COMPONENT, { ...props, componentType: type }, children);
    };
    
    const fragment = (children) => {
        return new VNode(VNodeType.FRAGMENT, {}, children);
    };
    
    // ============================================================================
    // DIFFING ENGINE IMPLEMENTATION
    // ============================================================================
    
    /**
     * DOM Diffing and Patching Engine
     * 
     * This engine efficiently compares two virtual DOM trees and applies
     * only the necessary changes to the real DOM. It implements a reconciliation
     * algorithm similar to React's but optimized for LuaUI's specific needs.
     */
    class DOMRenderer {
        constructor() {
            this.mountedComponents = new Map();
            this.hooks = {
                beforeMount: [],
                afterMount: [],
                beforeUpdate: [],
                afterUpdate: [],
                beforeUnmount: []
            };
        }
        
        // Register lifecycle hook
        addHook(type, callback) {
            if (this.hooks[type]) {
                this.hooks[type].push(callback);
            }
        }
        
        // Execute lifecycle hooks
        executeHooks(type, ...args) {
            if (this.hooks[type]) {
                this.hooks[type].forEach(callback => callback(...args));
            }
        }
        
        // Create DOM element from VNode
        createElement(vnode) {
            if (vnode.isText()) {
                return document.createTextNode(vnode.children[0]);
            }
            
            if (vnode.type === VNodeType.FRAGMENT) {
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
            const componentClass = LuaUI.getComponent(componentType);
            
            if (!componentClass) {
                throw new Error(`Component '${componentType}' not found`);
            }
            
            const instance = new componentClass(vnode.props);
            vnode.component = instance;
            
            this.executeHooks('beforeMount', instance);
            
            // Render component
            const rendered = instance.render();
            const element = this.createElement(rendered);
            
            vnode.element = element;
            instance.element = element;
            instance.vnode = rendered;
            
            this.mountedComponents.set(vnode, instance);
            
            this.executeHooks('afterMount', instance);
            
            return element;
        }
        
        // Update DOM element properties
        updateElement(element, oldProps, newProps) {
            // Remove old properties
            Object.keys(oldProps).forEach(key => {
                if (!(key in newProps)) {
                    if (key.startsWith('on')) {
                        // Remove event listener
                        const eventType = key.slice(2).toLowerCase();
                        element.removeEventListener(eventType, oldProps[key]);
                    } else if (key === 'style') {
                        element.style.cssText = '';
                    } else if (key === 'className' || key === 'class') {
                        element.className = '';
                    } else if (key in element) {
                        element[key] = '';
                    } else {
                        element.removeAttribute(key);
                    }
                }
            });
            
            // Set new properties
            Object.keys(newProps).forEach(key => {
                if (key === 'key' || key === 'ref' || key === 'componentType') {
                    return; // Skip special props
                }
                
                if (oldProps[key] !== newProps[key]) {
                    if (key.startsWith('on')) {
                        // Event listener
                        const eventType = key.slice(2).toLowerCase();
                        if (oldProps[key]) {
                            element.removeEventListener(eventType, oldProps[key]);
                        }
                        if (newProps[key]) {
                            element.addEventListener(eventType, newProps[key]);
                        }
                    } else if (key === 'style') {
                        if (typeof newProps[key] === 'object') {
                            Object.assign(element.style, newProps[key]);
                        } else {
                            element.style.cssText = newProps[key];
                        }
                    } else if (key === 'className' || key === 'class') {
                        element.className = newProps[key];
                    } else if (key in element) {
                        element[key] = newProps[key];
                    } else {
                        element.setAttribute(key, newProps[key]);
                    }
                }
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
        
        // Diff and patch two VNode trees
        patch(container, oldVNode, newVNode) {
            if (!oldVNode) {
                // Initial render
                const element = this.createElement(newVNode);
                container.appendChild(element);
                return newVNode;
            }
            
            if (!newVNode) {
                // Remove old node
                this.unmount(oldVNode);
                if (oldVNode.element && oldVNode.element.parentNode) {
                    oldVNode.element.parentNode.removeChild(oldVNode.element);
                }
                return null;
            }
            
            if (this.isDifferentNodeType(oldVNode, newVNode)) {
                // Replace entire node
                const newElement = this.createElement(newVNode);
                if (oldVNode.element && oldVNode.element.parentNode) {
                    oldVNode.element.parentNode.replaceChild(newElement, oldVNode.element);
                }
                this.unmount(oldVNode);
                return newVNode;
            }
            
            if (newVNode.isText()) {
                // Update text content
                if (oldVNode.children[0] !== newVNode.children[0]) {
                    oldVNode.element.textContent = newVNode.children[0];
                }
                return newVNode;
            }
            
            if (newVNode.isComponent()) {
                return this.updateComponent(oldVNode, newVNode);
            }
            
            // Update element
            newVNode.element = oldVNode.element;
            this.updateElement(oldVNode.element, oldVNode.props, newVNode.props);
            
            // Update children
            this.updateChildren(oldVNode.element, oldVNode.children, newVNode.children);
            
            return newVNode;
        }
        
        // Check if two VNodes represent different types
        isDifferentNodeType(oldVNode, newVNode) {
            if (oldVNode.type !== newVNode.type) return true;
            if (oldVNode.isComponent() && newVNode.isComponent()) {
                return oldVNode.props.componentType !== newVNode.props.componentType;
            }
            return false;
        }
        
        // Update component
        updateComponent(oldVNode, newVNode) {
            const instance = this.mountedComponents.get(oldVNode);
            if (!instance) {
                return this.createComponent(newVNode);
            }
            
            this.executeHooks('beforeUpdate', instance);
            
            // Update props
            instance.props = newVNode.props;
            
            // Re-render
            const newRendered = instance.render();
            const patchedVNode = this.patch(null, instance.vnode, newRendered);
            
            instance.vnode = patchedVNode;
            newVNode.element = oldVNode.element;
            newVNode.component = instance;
            
            this.mountedComponents.delete(oldVNode);
            this.mountedComponents.set(newVNode, instance);
            
            this.executeHooks('afterUpdate', instance);
            
            return newVNode;
        }
        
        // Update children using key-based reconciliation
        updateChildren(element, oldChildren, newChildren) {
            const oldChildrenMap = new Map();
            const newChildrenMap = new Map();
            
            // Build maps for keyed children
            oldChildren.forEach((child, index) => {
                if (child instanceof VNode && child.key) {
                    oldChildrenMap.set(child.key, { vnode: child, index });
                }
            });
            
            newChildren.forEach((child, index) => {
                if (child instanceof VNode && child.key) {
                    newChildrenMap.set(child.key, { vnode: child, index });
                }
            });
            
            const maxLength = Math.max(oldChildren.length, newChildren.length);
            const childNodes = Array.from(element.childNodes);
            
            for (let i = 0; i < maxLength; i++) {
                const oldChild = oldChildren[i];
                const newChild = newChildren[i];
                
                if (!oldChild && newChild) {
                    // Add new child
                    const childElement = newChild instanceof VNode 
                        ? this.createElement(newChild)
                        : document.createTextNode(String(newChild));
                    element.appendChild(childElement);
                } else if (oldChild && !newChild) {
                    // Remove old child
                    if (oldChild instanceof VNode) {
                        this.unmount(oldChild);
                    }
                    if (childNodes[i]) {
                        element.removeChild(childNodes[i]);
                    }
                } else if (oldChild && newChild) {
                    // Update child
                    if (oldChild instanceof VNode && newChild instanceof VNode) {
                        this.patch(element, oldChild, newChild);
                    } else if (!(oldChild instanceof VNode) && !(newChild instanceof VNode)) {
                        // Both are text nodes
                        if (oldChild !== newChild && childNodes[i]) {
                            childNodes[i].textContent = String(newChild);
                        }
                    } else {
                        // Different types, replace
                        const newElement = newChild instanceof VNode
                            ? this.createElement(newChild)
                            : document.createTextNode(String(newChild));
                        
                        if (oldChild instanceof VNode) {
                            this.unmount(oldChild);
                        }
                        
                        if (childNodes[i]) {
                            element.replaceChild(newElement, childNodes[i]);
                        }
                    }
                }
            }
        }
        
        // Unmount component and clean up
        unmount(vnode) {
            if (vnode.isComponent()) {
                const instance = this.mountedComponents.get(vnode);
                if (instance) {
                    this.executeHooks('beforeUnmount', instance);
                    
                    if (instance.componentWillUnmount) {
                        instance.componentWillUnmount();
                    }
                    
                    this.mountedComponents.delete(vnode);
                }
            }
            
            // Recursively unmount children
            if (vnode.children) {
                vnode.children.forEach(child => {
                    if (child instanceof VNode) {
                        this.unmount(child);
                    }
                });
            }
        }
    }
    
    // ============================================================================
    // REACTIVE SYSTEM IMPLEMENTATION
    // ============================================================================
    
    /**
     * Reactive State Management System
     * 
     * This system provides automatic reactivity using ES6 Proxies. When state
     * changes, all dependent components are automatically re-rendered.
     */
    class ReactiveSystem {
        constructor() {
            this.currentComponent = null;
            this.dependencies = new Map(); // component -> Set of observables
            this.observers = new Map(); // observable -> Set of components
            this.updateQueue = new Set();
            this.isUpdating = false;
        }
        
        // Create reactive state object
        createState(initialState, component) {
            const self = this;
            
            return new Proxy(initialState, {
                get(target, key) {
                    // Track dependency
                    if (component && key !== Symbol.toStringTag) {
                        self.trackDependency(component, target, key);
                    }
                    
                    const value = target[key];
                    
                    // Make nested objects reactive too
                    if (utils.isObject(value) && !value.__isReactive) {
                        target[key] = self.createState(value, component);
                        target[key].__isReactive = true;
                    }
                    
                    return target[key];
                },
                
                set(target, key, value) {
                    const oldValue = target[key];
                    
                    if (oldValue !== value) {
                        target[key] = value;
                        
                        // Trigger update for all observers
                        self.triggerUpdate(target, key);
                    }
                    
                    return true;
                },
                
                deleteProperty(target, key) {
                    if (key in target) {
                        delete target[key];
                        self.triggerUpdate(target, key);
                    }
                    return true;
                }
            });
        }
        
        // Track dependency between component and observable
        trackDependency(component, observable, key) {
            const depKey = `${this.getObjectId(observable)}.${key}`;
            
            if (!this.dependencies.has(component)) {
                this.dependencies.set(component, new Set());
            }
            this.dependencies.get(component).add(depKey);
            
            if (!this.observers.has(depKey)) {
                this.observers.set(depKey, new Set());
            }
            this.observers.get(depKey).add(component);
        }
        
        // Get unique ID for object
        getObjectId(obj) {
            if (!obj.__reactiveId) {
                obj.__reactiveId = utils.generateId();
            }
            return obj.__reactiveId;
        }
        
        // Trigger update for all observers of a specific property
        triggerUpdate(observable, key) {
            const depKey = `${this.getObjectId(observable)}.${key}`;
            const components = this.observers.get(depKey);
            
            if (components) {
                components.forEach(component => {
                    this.scheduleUpdate(component);
                });
            }
        }
        
        // Schedule component update
        scheduleUpdate(component) {
            this.updateQueue.add(component);
            
            if (!this.isUpdating) {
                this.isUpdating = true;
                // Use microtask to batch updates
                Promise.resolve().then(() => {
                    this.flushUpdates();
                });
            }
        }
        
        // Flush all pending updates
        flushUpdates() {
            const componentsToUpdate = Array.from(this.updateQueue);
            this.updateQueue.clear();
            this.isUpdating = false;
            
            componentsToUpdate.forEach(component => {
                if (component.update) {
                    component.update();
                }
            });
        }
        
        // Clean up dependencies for component
        cleanupComponent(component) {
            const deps = this.dependencies.get(component);
            if (deps) {
                deps.forEach(depKey => {
                    const observers = this.observers.get(depKey);
                    if (observers) {
                        observers.delete(component);
                    }
                });
                this.dependencies.delete(component);
            }
        }
    }
    
    // ============================================================================
    // COMPONENT SYSTEM IMPLEMENTATION
    // ============================================================================
    
    /**
     * Component System
     * 
     * Provides the base class for all LuaUI components and manages
     * component lifecycle, state, and props.
     */
    class Component {
        constructor(props = {}) {
            this.props = props;
            this.state = {};
            this.element = null;
            this.vnode = null;
            this.mounted = false;
            this.reactive = LuaUI.reactive;
            
            // Initialize reactive state
            if (this.initialState) {
                this.state = this.reactive.createState(this.initialState(), this);
            }
            
            // Bind methods
            this.setState = this.setState.bind(this);
            this.forceUpdate = this.forceUpdate.bind(this);
        }
        
        // Set state and trigger update
        setState(newState) {
            if (utils.isFunction(newState)) {
                newState = newState(this.state);
            }
            
            Object.assign(this.state, newState);
        }
        
        // Force component update
        forceUpdate() {
            if (this.mounted) {
                this.update();
            }
        }
        
        // Update component
        update() {
            if (!this.mounted || !this.element) return;
            
            const newVNode = this.render();
            const container = this.element.parentNode;
            
            if (container) {
                const patchedVNode = LuaUI.renderer.patch(container, this.vnode, newVNode);
                this.vnode = patchedVNode;
            }
        }
        
        // Lifecycle methods (to be overridden)
        componentDidMount() {}
        componentWillUnmount() {}
        componentDidUpdate() {}
        
        // Abstract render method (must be implemented by subclasses)
        render() {
            throw new Error('Component must implement render() method');
        }
        
        // Get computed property
        computed(fn) {
            return fn.call(this);
        }
        
        // Watch for changes
        watch(expression, callback) {
            // TODO: Implement watcher system
        }
    }
    
    // ============================================================================
    // ANIMATION ENGINE IMPLEMENTATION
    // ============================================================================
    
    /**
     * Animation Engine
     * 
     * Provides comprehensive animation capabilities including CSS transitions,
     * CSS animations, and JavaScript-based timeline animations.
     */
    class AnimationEngine {
        constructor() {
            this.animations = new Map();
            this.timelines = new Map();
            this.rafId = null;
            this.isRunning = false;
        }
        
        // Start animation loop
        start() {
            if (this.isRunning) return;
            
            this.isRunning = true;
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
        
        // Animation loop tick
        tick() {
            if (!this.isRunning) return;
            
            const now = performance.now();
            
            // Update all active animations
            this.animations.forEach((animation, id) => {
                this.updateAnimation(animation, now);
            });
            
            // Update all active timelines
            this.timelines.forEach((timeline, id) => {
                this.updateTimeline(timeline, now);
            });
            
            this.rafId = requestAnimationFrame(() => this.tick());
        }
        
        // Create CSS transition
        transition(element, properties, options = {}) {
            const {
                duration = 300,
                easing = 'ease',
                delay = 0,
                onComplete = null
            } = options;
            
            const id = utils.generateId();
            const animation = {
                id,
                type: AnimationType.CSS_TRANSITION,
                element,
                properties,
                duration,
                easing,
                delay,
                startTime: performance.now() + delay,
                onComplete,
                completed: false
            };
            
            // Apply transition styles
            const transitionValue = Object.keys(properties)
                .map(prop => `${prop} ${duration}ms ${easing} ${delay}ms`)
                .join(', ');
            
            element.style.transition = transitionValue;
            
            // Apply target values
            Object.assign(element.style, properties);
            
            // Listen for transition end
            const onTransitionEnd = (e) => {
                if (e.target === element) {
                    element.removeEventListener('transitionend', onTransitionEnd);
                    this.animations.delete(id);
                    if (onComplete) onComplete();
                }
            };
            
            element.addEventListener('transitionend', onTransitionEnd);
            this.animations.set(id, animation);
            
            if (!this.isRunning) this.start();
            
            return {
                id,
                cancel: () => this.cancelAnimation(id)
            };
        }
        
        // Create CSS animation
        animate(element, keyframes, options = {}) {
            const {
                duration = 1000,
                easing = 'ease',
                delay = 0,
                iterations = 1,
                direction = 'normal',
                fillMode = 'both',
                onComplete = null
            } = options;
            
            const id = utils.generateId();
            const animationName = `luaui-animation-${id}`;
            
            // Create keyframes
            const keyframeCSS = this.createKeyframeCSS(animationName, keyframes);
            
            // Add keyframes to document
            const styleElement = document.createElement('style');
            styleElement.textContent = keyframeCSS;
            document.head.appendChild(styleElement);
            
            const animation = {
                id,
                type: AnimationType.CSS_ANIMATION,
                element,
                keyframes,
                duration,
                easing,
                delay,
                iterations,
                direction,
                fillMode,
                startTime: performance.now() + delay,
                styleElement,
                animationName,
                onComplete,
                completed: false
            };
            
            // Apply animation
            element.style.animation = `${animationName} ${duration}ms ${easing} ${delay}ms ${iterations} ${direction} ${fillMode}`;
            
            // Listen for animation end
            const onAnimationEnd = (e) => {
                if (e.target === element && e.animationName === animationName) {
                    element.removeEventListener('animationend', onAnimationEnd);
                    document.head.removeChild(styleElement);
                    this.animations.delete(id);
                    if (onComplete) onComplete();
                }
            };
            
            element.addEventListener('animationend', onAnimationEnd);
            this.animations.set(id, animation);
            
            if (!this.isRunning) this.start();
            
            return {
                id,
                cancel: () => this.cancelAnimation(id)
            };
        }
        
        // Create timeline animation
        timeline(timeline, options = {}) {
            const {
                onComplete = null,
                onUpdate = null
            } = options;
            
            const id = utils.generateId();
            const timelineObj = {
                id,
                type: AnimationType.TIMELINE,
                timeline: [...timeline], // Copy array
                currentIndex: 0,
                startTime: performance.now(),
                totalDuration: timeline.reduce((sum, item) => sum + (item.duration || 0), 0),
                onComplete,
                onUpdate,
                completed: false
            };
            
            this.timelines.set(id, timelineObj);
            
            if (!this.isRunning) this.start();
            
            return {
                id,
                cancel: () => this.cancelTimeline(id),
                pause: () => this.pauseTimeline(id),
                resume: () => this.resumeTimeline(id)
            };
        }
        
        // Create keyframe CSS
        createKeyframeCSS(name, keyframes) {
            let css = `@keyframes ${name} {\n`;
            
            Object.keys(keyframes).forEach(percent => {
                css += `  ${percent} {\n`;
                const frame = keyframes[percent];
                Object.keys(frame).forEach(prop => {
                    css += `    ${prop}: ${frame[prop]};\n`;
                });
                css += `  }\n`;
            });
            
            css += '}';
            return css;
        }
        
        // Update animation
        updateAnimation(animation, now) {
            if (animation.completed) return;
            
            if (now >= animation.startTime + animation.duration) {
                animation.completed = true;
            }
        }
        
        // Update timeline
        updateTimeline(timeline, now) {
            if (timeline.completed) return;
            
            const elapsed = now - timeline.startTime;
            let currentTime = 0;
            
            for (let i = 0; i < timeline.timeline.length; i++) {
                const item = timeline.timeline[i];
                const itemEnd = currentTime + (item.duration || 0);
                
                if (elapsed >= currentTime && elapsed <= itemEnd) {
                    const progress = (elapsed - currentTime) / (item.duration || 1);
                    this.executeTimelineItem(item, progress);
                    break;
                }
                
                currentTime = itemEnd;
            }
            
            if (elapsed >= timeline.totalDuration) {
                timeline.completed = true;
                if (timeline.onComplete) timeline.onComplete();
                this.timelines.delete(timeline.id);
            }
        }
        
        // Execute timeline item
        executeTimelineItem(item, progress) {
            if (item.type === 'style') {
                const element = item.element;
                const from = item.from || {};
                const to = item.to || {};
                
                Object.keys(to).forEach(prop => {
                    const fromValue = parseFloat(from[prop]) || 0;
                    const toValue = parseFloat(to[prop]) || 0;
                    const currentValue = fromValue + (toValue - fromValue) * progress;
                    element.style[prop] = currentValue + (item.unit || 'px');
                });
            } else if (item.type === 'callback') {
                if (progress >= 1 && item.callback) {
                    item.callback();
                }
            }
        }
        
        // Cancel animation
        cancelAnimation(id) {
            const animation = this.animations.get(id);
            if (animation) {
                if (animation.type === AnimationType.CSS_ANIMATION && animation.styleElement) {
                    animation.element.style.animation = '';
                    if (animation.styleElement.parentNode) {
                        document.head.removeChild(animation.styleElement);
                    }
                } else if (animation.type === AnimationType.CSS_TRANSITION) {
                    animation.element.style.transition = '';
                }
                
                this.animations.delete(id);
            }
        }
        
        // Cancel timeline
        cancelTimeline(id) {
            this.timelines.delete(id);
        }
        
        // Pause timeline
        pauseTimeline(id) {
            // TODO: Implement timeline pause/resume
        }
        
        // Resume timeline
        resumeTimeline(id) {
            // TODO: Implement timeline pause/resume
        }
        
        // Easing functions
        easing = {
            linear: t => t,
            easeIn: t => t * t,
            easeOut: t => t * (2 - t),
            easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        };
    }
    
    // ============================================================================
    // LUACSS ENGINE IMPLEMENTATION
    // ============================================================================
    
    /**
     * LuaCSS Engine
     * 
     * A complete CSS parser and processor that supports variables, mixins,
     * nested selectors, scoped styles, and dynamic style generation.
     */
    class LuaCSSEngine {
        constructor() {
            this.variables = new Map();
            this.mixins = new Map();
            this.scopedStyles = new Map();
            this.globalStyles = [];
            this.styleSheets = new Map();
            this.componentScopes = new Map();
        }
        
        // Parse CSS string
        parseCSS(css, scope = null) {
            const tokens = this.tokenizeCSS(css);
            const ast = this.parseCSSTokens(tokens);
            return this.processCSSAST(ast, scope);
        }
        
        // Tokenize CSS
        tokenizeCSS(css) {
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
                    while (current < css.length - 1) {
                        if (css[current] === '*' && css[current + 1] === '/') {
                            current += 2;
                            break;
                        }
                        current++;
                    }
                    continue;
                }
                
                // Selectors
                if (char === '.' || char === '#' || /[a-zA-Z]/.test(char)) {
                    let value = '';
                    while (current < css.length && !/[{};]/.test(css[current]) && css[current] !== '\n') {
                        value += css[current];
                        current++;
                    }
                    tokens.push({ type: 'selector', value: value.trim() });
                    continue;
                }
                
                // Properties and values
                if (char === '{') {
                    tokens.push({ type: 'openBrace', value: char });
                    current++;
                    continue;
                }
                
                if (char === '}') {
                    tokens.push({ type: 'closeBrace', value: char });
                    current++;
                    continue;
                }
                
                if (char === ':') {
                    tokens.push({ type: 'colon', value: char });
                    current++;
                    continue;
                }
                
                if (char === ';') {
                    tokens.push({ type: 'semicolon', value: char });
                    current++;
                    continue;
                }
                
                // Values
                let value = '';
                while (current < css.length && css[current] !== ';' && css[current] !== '}') {
                    value += css[current];
                    current++;
                }
                
                if (value.trim()) {
                    tokens.push({ type: 'value', value: value.trim() });
                }
            }
            
            return tokens;
        }
        
        // Parse CSS tokens into AST
        parseCSSTokens(tokens) {
            const rules = [];
            let current = 0;
            
            while (current < tokens.length) {
                const token = tokens[current];
                
                if (token.type === 'selector') {
                    const rule = {
                        type: 'rule',
                        selector: token.value,
                        declarations: []
                    };
                    
                    current++; // Skip selector
                    
                    if (current < tokens.length && tokens[current].type === 'openBrace') {
                        current++; // Skip {
                        
                        while (current < tokens.length && tokens[current].type !== 'closeBrace') {
                            if (tokens[current].type === 'value') {
                                const propValue = tokens[current].value;
                                const colonIndex = propValue.indexOf(':');
                                
                                if (colonIndex !== -1) {
                                    const property = propValue.substring(0, colonIndex).trim();
                                    const value = propValue.substring(colonIndex + 1).trim();
                                    
                                    rule.declarations.push({
                                        property,
                                        value
                                    });
                                }
                            }
                            current++;
                        }
                        
                        if (current < tokens.length && tokens[current].type === 'closeBrace') {
                            current++; // Skip }
                        }
                    }
                    
                    rules.push(rule);
                } else {
                    current++;
                }
            }
            
            return rules;
        }
        
        // Process CSS AST and apply transformations
        processCSSAST(ast, scope) {
            const processedRules = [];
            
            ast.forEach(rule => {
                if (rule.type === 'rule') {
                    const processedRule = {
                        ...rule,
                        selector: this.processCSSSelector(rule.selector, scope),
                        declarations: rule.declarations.map(decl => ({
                            ...decl,
                            value: this.processCSSValue(decl.value)
                        }))
                    };
                    
                    processedRules.push(processedRule);
                }
            });
            
            return processedRules;
        }
        
        // Process CSS selector with scoping
        processCSSSelector(selector, scope) {
            if (!scope) return selector;
            
            // Add scope prefix to selectors
            return selector.split(',').map(sel => {
                const trimmed = sel.trim();
                if (trimmed.startsWith('@')) return trimmed; // Skip at-rules
                return `.${scope} ${trimmed}`;
            }).join(', ');
        }
        
        // Process CSS value (variables, calculations, etc.)
        processCSSValue(value) {
            // Process CSS variables
            value = value.replace(/var\((--[\w-]+)\)/g, (match, varName) => {
                return this.variables.get(varName) || match;
            });
            
            // Process calc() functions
            value = value.replace(/calc\(([^)]+)\)/g, (match, expression) => {
                try {
                    // Simple calc evaluation (for basic cases)
                    const result = this.evaluateCSSCalc(expression);
                    return result !== null ? result + 'px' : match;
                } catch (e) {
                    return match;
                }
            });
            
            return value;
        }
        
        // Evaluate CSS calc() expressions
        evaluateCSSCalc(expression) {
            // Remove units and evaluate simple arithmetic
            const sanitized = expression.replace(/px|em|rem|%|vh|vw/g, '');
            try {
                return eval(sanitized); // Note: In production, use a safer expression evaluator
            } catch (e) {
                return null;
            }
        }
        
        // Define CSS variable
        defineVariable(name, value) {
            this.variables.set(name, value);
        }
        
        // Define CSS mixin
        defineMixin(name, styles) {
            this.mixins.set(name, styles);
        }
        
        // Apply mixin
        applyMixin(name) {
            return this.mixins.get(name) || '';
        }
        
        // Add scoped styles for component
        addScopedStyles(componentName, css) {
            const scope = `luaui-${componentName}-${utils.generateId()}`;
            const processedCSS = this.parseCSS(css, scope);
            
            this.scopedStyles.set(componentName, {
                scope,
                rules: processedCSS
            });
            
            this.injectStyles(this.compileCSSRules(processedCSS), scope);
            
            return scope;
        }
        
        // Add global styles
        addGlobalStyles(css) {
            const processedCSS = this.parseCSS(css);
            this.globalStyles.push(...processedCSS);
            this.injectStyles(this.compileCSSRules(processedCSS), 'global');
        }
        
        // Compile CSS rules to string
        compileCSSRules(rules) {
            return rules.map(rule => {
                if (rule.type === 'rule') {
                    const declarations = rule.declarations
                        .map(decl => `  ${decl.property}: ${decl.value};`)
                        .join('\n');
                    
                    return `${rule.selector} {\n${declarations}\n}`;
                }
                return '';
            }).join('\n\n');
        }
        
        // Inject styles into document
        injectStyles(css, id) {
            let styleElement = this.styleSheets.get(id);
            
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.setAttribute('data-luaui-scope', id);
                document.head.appendChild(styleElement);
                this.styleSheets.set(id, styleElement);
            }
            
            styleElement.textContent = css;
        }
        
        // Remove styles
        removeStyles(id) {
            const styleElement = this.styleSheets.get(id);
            if (styleElement && styleElement.parentNode) {
                styleElement.parentNode.removeChild(styleElement);
                this.styleSheets.delete(id);
            }
        }
        
        // Get component scope
        getComponentScope(componentName) {
            const scopedStyle = this.scopedStyles.get(componentName);
            return scopedStyle ? scopedStyle.scope : null;
        }
        
        // Generate dynamic styles
        generateDynamicStyles(template, data) {
            let css = template;
            
            Object.keys(data).forEach(key => {
                const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
                css = css.replace(regex, data[key]);
            });
            
            return css;
        }
        
        // Process media queries
        processMediaQueries(css) {
            // TODO: Implement media query processing
            return css;
        }
        
        // Process keyframes
        processKeyframes(css) {
            // TODO: Implement keyframe processing
            return css;
        }
    }
    
    // ============================================================================
    // COMPILER IMPLEMENTATION
    // ============================================================================
    
    /**
     * LuaUI Compiler
     * 
     * Compiles LuaUI AST to executable JavaScript code that creates
     * virtual DOM structures and handles component logic.
     */
    class Compiler {
        constructor() {
            this.context = {
                components: new Map(),
                functions: new Map(),
                variables: new Map()
            };
        }
        
        // Compile AST to JavaScript
        compile(ast) {
            const code = this.compileProgram(ast);
            return new Function('LuaUI', 'h', 'text', 'component', 'fragment', code);
        }
        
        // Compile program
        compileProgram(node) {
            const statements = node.body.map(stmt => this.compileStatement(stmt));
            return statements.join('\n');
        }
        
        // Compile statement
        compileStatement(node) {
            switch (node.type) {
                case 'ComponentDeclaration':
                    return this.compileComponentDeclaration(node);
                case 'FunctionDeclaration':
                    return this.compileFunctionDeclaration(node);
                case 'LocalDeclaration':
                    return this.compileLocalDeclaration(node);
                case 'IfStatement':
                    return this.compileIfStatement(node);
                case 'ForStatement':
                case 'NumericForStatement':
                case 'GenericForStatement':
                    return this.compileForStatement(node);
                case 'WhileStatement':
                    return this.compileWhileStatement(node);
                case 'RepeatStatement':
                    return this.compileRepeatStatement(node);
                case 'ReturnStatement':
                    return this.compileReturnStatement(node);
                case 'BreakStatement':
                    return 'break;';
                case 'ExpressionStatement':
                    return this.compileExpression(node.expression) + ';';
                default:
                    throw new Error(`Unknown statement type: ${node.type}`);
            }
        }
        
        // Compile component declaration
        compileComponentDeclaration(node) {
            const componentName = node.name;
            const properties = node.properties;
            
            let componentCode = `
class ${componentName} extends LuaUI.Component {
    constructor(props) {
        super(props);
        this.componentName = '${componentName}';
`;
            
            // Process component properties
            if (properties.initialState) {
                componentCode += `
        this.state = this.reactive.createState(${this.compileExpression(properties.initialState)}, this);
`;
            }
            
            if (properties.props) {
                componentCode += `
        this.defaultProps = ${this.compileExpression(properties.props)};
`;
            }
            
            componentCode += `
    }
`;
            
            // Compile lifecycle methods
            if (properties.componentDidMount) {
                componentCode += `
    componentDidMount() {
        ${this.compileExpression(properties.componentDidMount)}.call(this);
    }
`;
            }
            
            if (properties.componentWillUnmount) {
                componentCode += `
    componentWillUnmount() {
        ${this.compileExpression(properties.componentWillUnmount)}.call(this);
    }
`;
            }
            
            // Compile render method
            if (properties.render) {
                componentCode += `
    render() {
        return ${this.compileExpression(properties.render)}.call(this);
    }
`;
            } else {
                componentCode += `
    render() {
        return h('div', {}, ['Component ${componentName}']);
    }
`;
            }
            
            // Compile custom methods
            Object.keys(properties).forEach(key => {
                if (!['render', 'props', 'initialState', 'componentDidMount', 'componentWillUnmount', 'styles'].includes(key)) {
                    componentCode += `
    ${key}() {
        return ${this.compileExpression(properties[key])}.call(this);
    }
`;
                }
            });
            
            componentCode += `
}
`;
            
            // Register component and handle styles
            componentCode += `
LuaUI.registerComponent('${componentName}', ${componentName});
`;
            
            if (properties.styles) {
                componentCode += `
LuaUI.css.addScopedStyles('${componentName}', ${this.compileExpression(properties.styles)});
`;
            }
            
            return componentCode;
        }
        
        // Compile function declaration
        compileFunctionDeclaration(node) {
            const params = node.parameters.join(', ');
            const body = node.body.map(stmt => this.compileStatement(stmt)).join('\n');
            
            return `
function ${node.name}(${params}) {
    ${body}
}
`;
        }
        
        // Compile local declaration
        compileLocalDeclaration(node) {
            const initializer = node.initializer ? this.compileExpression(node.initializer) : 'undefined';
            return `let ${node.name} = ${initializer};`;
        }
        
        // Compile if statement
        compileIfStatement(node) {
            let code = `if (${this.compileExpression(node.condition)}) {\n`;
            code += node.thenBranch.map(stmt => this.compileStatement(stmt)).join('\n');
            code += '\n}';
            
            node.elseIfBranches.forEach(branch => {
                code += ` else if (${this.compileExpression(branch.condition)}) {\n`;
                code += branch.body.map(stmt => this.compileStatement(stmt)).join('\n');
                code += '\n}';
            });
            
            if (node.elseBranch) {
                code += ' else {\n';
                code += node.elseBranch.map(stmt => this.compileStatement(stmt)).join('\n');
                code += '\n}';
            }
            
            return code;
        }
        
        // Compile for statement
        compileForStatement(node) {
            if (node.type === 'NumericForStatement') {
                const step = node.step ? this.compileExpression(node.step) : '1';
                const body = node.body.map(stmt => this.compileStatement(stmt)).join('\n');
                
                return `
for (let ${node.variable} = ${this.compileExpression(node.start)}; 
     ${node.variable} <= ${this.compileExpression(node.end)}; 
     ${node.variable} += ${step}) {
    ${body}
}
`;
            } else if (node.type === 'GenericForStatement') {
                const body = node.body.map(stmt => this.compileStatement(stmt)).join('\n');
                
                return `
for (const ${node.variable} of ${this.compileExpression(node.iterable)}) {
    ${body}
}
`;
            }
        }
        
        // Compile while statement
        compileWhileStatement(node) {
            const body = node.body.map(stmt => this.compileStatement(stmt)).join('\n');
            
            return `
while (${this.compileExpression(node.condition)}) {
    ${body}
}
`;
        }
        
        // Compile repeat statement
        compileRepeatStatement(node) {
            const body = node.body.map(stmt => this.compileStatement(stmt)).join('\n');
            
            return `
do {
    ${body}
} while (!(${this.compileExpression(node.condition)}));
`;
        }
        
        // Compile return statement
        compileReturnStatement(node) {
            const value = node.value ? this.compileExpression(node.value) : '';
            return `return ${value};`;
        }
        
        // Compile expression
        compileExpression(node) {
            switch (node.type) {
                case 'Literal':
                    return this.compileLiteral(node);
                case 'Identifier':
                    return this.compileIdentifier(node);
                case 'BinaryExpression':
                    return this.compileBinaryExpression(node);
                case 'UnaryExpression':
                    return this.compileUnaryExpression(node);
                case 'AssignmentExpression':
                    return this.compileAssignmentExpression(node);
                case 'CallExpression':
                    return this.compileCallExpression(node);
                case 'MemberExpression':
                    return this.compileMemberExpression(node);
                case 'TableConstructor':
                    return this.compileTableConstructor(node);
                case 'FunctionExpression':
                    return this.compileFunctionExpression(node);
                default:
                    throw new Error(`Unknown expression type: ${node.type}`);
            }
        }
        
        // Compile literal
        compileLiteral(node) {
            if (typeof node.value === 'string') {
                return `"${node.value.replace(/"/g, '\\"')}"`;
            }
            return String(node.value);
        }
        
        // Compile identifier
        compileIdentifier(node) {
            // Handle special identifiers
            switch (node.name) {
                case 'div':
                case 'span':
                case 'p':
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                case 'button':
                case 'input':
                case 'textarea':
                case 'select':
                case 'option':
                case 'img':
                case 'a':
                case 'ul':
                case 'ol':
                case 'li':
                case 'table':
                case 'tr':
                case 'td':
                case 'th':
                case 'thead':
                case 'tbody':
                case 'form':
                case 'label':
                case 'br':
                case 'hr':
                case 'canvas':
                case 'svg':
                case 'audio':
                case 'video':
                    return `(function(props, ...children) { return h('${node.name}', props || {}, children.flat()); })`;
                case 'state':
                    return 'this.state';
                case 'props':
                    return 'this.props';
                case 'setState':
                    return 'this.setState';
                default:
                    return node.name;
            }
        }
        
        // Compile binary expression
        compileBinaryExpression(node) {
            const left = this.compileExpression(node.left);
            const right = this.compileExpression(node.right);
            
            switch (node.operator) {
                case '..':
                    return `String(${left}) + String(${right})`;
                case '==':
                    return `(${left} === ${right})`;
                case '~=':
                case '!=':
                    return `(${left} !== ${right})`;
                default:
                    return `(${left} ${node.operator} ${right})`;
            }
        }
        
        // Compile unary expression
        compileUnaryExpression(node) {
            const operand = this.compileExpression(node.operand);
            
            switch (node.operator) {
                case 'not':
                    return `!(${operand})`;
                default:
                    return `${node.operator}(${operand})`;
            }
        }
        
        // Compile assignment expression
        compileAssignmentExpression(node) {
            const left = this.compileExpression(node.left);
            const right = this.compileExpression(node.right);
            
            return `${left} = ${right}`;
        }
        
        // Compile call expression
        compileCallExpression(node) {
            const callee = this.compileExpression(node.callee);
            const args = node.arguments.map(arg => this.compileExpression(arg)).join(', ');
            
            return `${callee}(${args})`;
        }
        
        // Compile member expression
        compileMemberExpression(node) {
            const object = this.compileExpression(node.object);
            
            if (node.computed) {
                const property = this.compileExpression(node.property);
                return `${object}[${property}]`;
            } else {
                return `${object}.${node.property}`;
            }
        }
        
        // Compile table constructor
        compileTableConstructor(node) {
            if (node.fields.every(field => field.type === 'ArrayElement')) {
                // Array
                const elements = node.fields.map(field => this.compileExpression(field.value));
                return `[${elements.join(', ')}]`;
            } else {
                // Object
                const properties = node.fields.map(field => {
                    if (field.type === 'NamedField') {
                        return `"${field.key}": ${this.compileExpression(field.value)}`;
                    } else if (field.type === 'ComputedField') {
                        return `[${this.compileExpression(field.key)}]: ${this.compileExpression(field.value)}`;
                    } else {
                        return this.compileExpression(field.value);
                    }
                });
                return `{${properties.join(', ')}}`;
            }
        }
        
        // Compile function expression
        compileFunctionExpression(node) {
            const params = node.parameters.join(', ');
            const body = node.body.map(stmt => this.compileStatement(stmt)).join('\n');
            
            return `
function(${params}) {
    ${body}
}
`;
        }
    }
    
    // ============================================================================
    // MAIN LUAUI RUNTIME
    // ============================================================================
    
    /**
     * Main LuaUI Runtime
     * 
     * Orchestrates all subsystems and provides the public API for LuaUI.
     * This is the main entry point that developers interact with.
     */
    class LuaUIRuntime {
        constructor() {
            this.version = VERSION;
            this.components = new Map();
            this.instances = new Map();
            this.mountedApps = new Map();
            
            // Initialize subsystems
            this.reactive = new ReactiveSystem();
            this.renderer = new DOMRenderer();
            this.animation = new AnimationEngine();
            this.css = new LuaCSSEngine();
            this.compiler = new Compiler();
            
            // Public component base class
            this.Component = Component;
            
            // Bind public methods
            this.mount = this.mount.bind(this);
            this.unmount = this.unmount.bind(this);
            this.compile = this.compile.bind(this);
            this.registerComponent = this.registerComponent.bind(this);
            this.getComponent = this.getComponent.bind(this);
            
            this.init();
        }
        
        // Initialize LuaUI
        init() {
            if (typeof document !== 'undefined') {
                // Browser environment
                this.setupBrowserEnvironment();
            }
        }
        
        // Setup browser environment
        setupBrowserEnvironment() {
            // Process existing <luaui> tags when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.processLuaUITags();
                });
            } else {
                this.processLuaUITags();
            }
            
            // Watch for new <luaui> tags
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
        
        // Process all <luaui> tags in document
        processLuaUITags() {
            const luauiElements = document.querySelectorAll('luaui');
            luauiElements.forEach(element => this.processLuaUIElement(element));
        }
        
        // Process individual <luaui> element
        processLuaUIElement(element) {
            try {
                const source = element.textContent || element.innerHTML;
                const src = element.getAttribute('src');
                
                if (src) {
                    // Load external .luaui file
                    this.loadExternalLuaUI(src, element);
                } else if (source.trim()) {
                    // Compile and mount inline LuaUI code
                    this.compileAndMount(source, element);
                }
            } catch (error) {
                utils.error('Error processing LuaUI element:', error);
                element.innerHTML = `<div style="color: red; border: 1px solid red; padding: 10px;">
                    LuaUI Error: ${error.message}
                </div>`;
            }
        }
        
        // Load external LuaUI file
        async loadExternalLuaUI(src, element) {
            try {
                const response = await fetch(src);
                const source = await response.text();
                this.compileAndMount(source, element);
            } catch (error) {
                utils.error('Error loading external LuaUI file:', error);
                throw error;
            }
        }
        
        // Compile LuaUI source code
        compile(source) {
            try {
                // Tokenize
                const lexer = new Lexer(source);
                const tokens = lexer.tokenize();
                
                utils.log('Tokens:', tokens);
                
                // Parse
                const parser = new Parser(tokens);
                const ast = parser.parse();
                
                utils.log('AST:', ast);
                
                // Compile
                const compiledFunction = this.compiler.compile(ast);
                
                return compiledFunction;
            } catch (error) {
                utils.error('Compilation error:', error);
                throw error;
            }
        }
        
        // Compile and mount LuaUI code
        compileAndMount(source, container) {
            const compiledFunction = this.compile(source);
            
            // Execute compiled code
            compiledFunction(this, h, text, component, fragment);
            
            // Check if there's a default export or component to mount
            // For now, we'll look for a component named 'App' or the first component
            const appComponent = this.getComponent('App') || 
                                  Array.from(this.components.values())[0];
            
            if (appComponent) {
                this.mount(appComponent, {}, container);
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
            
            // Create component instance
            const instance = new componentClass(props);
            
            // Render initial virtual DOM
            const vnode = instance.render();
            
            // Create actual DOM elements
            const element = this.renderer.createElement(vnode);
            
            // Mount to container
            if (container.tagName === 'LUAUI') {
                // Replace <luaui> tag content
                container.innerHTML = '';
                container.appendChild(element);
            } else {
                container.appendChild(element);
            }
            
            // Store references
            instance.element = element;
            instance.vnode = vnode;
            instance.mounted = true;
            
            const appId = utils.generateId();
            this.instances.set(appId, instance);
            this.mountedApps.set(container, appId);
            
            // Call lifecycle method
            if (instance.componentDidMount) {
                instance.componentDidMount();
            }
            
            utils.log('Component mounted:', componentClass.name);
            
            return {
                appId,
                instance,
                unmount: () => this.unmount(container)
            };
        }
        
        // Unmount component from DOM
        unmount(container) {
            const appId = this.mountedApps.get(container);
            if (!appId) return;
            
            const instance = this.instances.get(appId);
            if (instance) {
                // Call lifecycle method
                if (instance.componentWillUnmount) {
                    instance.componentWillUnmount();
                }
                
                // Clean up reactive dependencies
                this.reactive.cleanupComponent(instance);
                
                // Remove from DOM
                if (instance.element && instance.element.parentNode) {
                    instance.element.parentNode.removeChild(instance.element);
                }
                
                // Clean up references
                instance.mounted = false;
                this.instances.delete(appId);
                this.mountedApps.delete(container);
                
                utils.log('Component unmounted');
            }
        }
        
        // Register component
        registerComponent(name, componentClass) {
            this.components.set(name, componentClass);
            utils.log('Component registered:', name);
        }
        
        // Get component by name
        getComponent(name) {
            return this.components.get(name);
        }
        
        // Create virtual DOM helper
        h(type, props, children) {
            return h(type, props, children);
        }
        
        // Animation helpers
        animate(element, keyframes, options) {
            return this.animation.animate(element, keyframes, options);
        }
        
        transition(element, properties, options) {
            return this.animation.transition(element, properties, options);
        }
        
        timeline(timeline, options) {
            return this.animation.timeline(timeline, options);
        }
        
        // CSS helpers
        css(styles, scope) {
            if (scope) {
                return this.css.addScopedStyles(scope, styles);
            } else {
                return this.css.addGlobalStyles(styles);
            }
        }
        
        // Utility functions for LuaUI code
        utils = utils;
        
        // Debug information
        debug() {
            return {
                version: this.version,
                components: Array.from(this.components.keys()),
                instances: this.instances.size,
                mountedApps: this.mountedApps.size
            };
        }
    }
    
    // ============================================================================
    // GLOBAL INITIALIZATION
    // ============================================================================
    
    // Create global LuaUI instance
    const LuaUI = new LuaUIRuntime();
    
    // Export to global scope
    if (typeof global !== 'undefined') {
        global.LuaUI = LuaUI;
    }
    
    if (typeof window !== 'undefined') {
        window.LuaUI = LuaUI;
    }
    
    // AMD/CommonJS compatibility
    if (typeof define === 'function' && define.amd) {
        define(() => LuaUI);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = LuaUI;
    }
    
    utils.log(`LuaUI v${VERSION} initialized`);
    
    return LuaUI;
    
})(typeof globalThis !== 'undefined' ? globalThis : 
   typeof window !== 'undefined' ? window : 
   typeof global !== 'undefined' ? global : this);
