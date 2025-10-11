'use strict';

const SentryNode = require('@sentry/node');
const Logger = require('./logs');
const log = new Logger('Sentry');

const SENTRY_ENABLED = process.env.SENTRY_ENABLED === 'true';
const SENTRY_LOG_LEVELS = (process.env.SENTRY_LOG_LEVELS || 'error').split(',').map((level) => level.trim());
const SENTRY_DSN = process.env.SENTRY_DSN;
const SENTRY_TRACES_SAMPLE_RATE = parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.5');

function patchConsoleForSentry() {
    const originalConsole = {};
    SENTRY_LOG_LEVELS.forEach((level) => {
        originalConsole[level] = console[level];
        console[level] = function (...args) {
            switch (level) {
                case 'warn':
                    SentryNode.captureMessage(args.join(' '), 'warning');
                    break;
                case 'error':
                    args[0] instanceof Error
                        ? SentryNode.captureException(args[0])
                        : SentryNode.captureException(new Error(args.join(' ')));
                    break;
            }
            originalConsole[level].apply(console, args);
        };
    });
}

function start() {
    if (SENTRY_ENABLED && typeof SENTRY_DSN === 'string' && SENTRY_DSN.trim()) {
        log.info('Sentry monitoring started...');

        SentryNode.init({
            dsn: SENTRY_DSN,
            tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
        });

        patchConsoleForSentry();

        // log.error('Sentry error', { foo: 'bar' });
        // log.warn('Sentry warning');
    }
}

module.exports = {
    start,
};
