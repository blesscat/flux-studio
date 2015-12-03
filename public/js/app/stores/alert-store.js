define([
    'app/dispatcher/alert-dispatcher',
    'app/constants/alert-constants',
    'events',
    'helpers/object-assign'
], function(
    Dispatcher,
    AlertConstants,
    EventEmitter
) {
    'use strict';

    var NOTIFY_EVENT    = 'notify',
        POPUP_EVENT     = 'popup',
        NOTIFY_RETRY    = 'retry',
        NOTIFY_ABORT    = 'abort',
        NOTIFY_ANSWER   = 'answer',
        AlertStore;

    AlertStore = Object.assign(EventEmitter.prototype, {

        onNotify(callback) {
            this.on(NOTIFY_EVENT, callback);
        },

        onPopup(callback) {
            this.on(POPUP_EVENT, callback);
        },

        onRetry(callback) {
            this.on(NOTIFY_RETRY, callback);
        },

        onAbort(callback) {
            this.on(NOTIFY_ABORT, callback);
        },

        onAnswer(callback) {
            this.on(NOTIFY_ANSWER, callback);
        },

        removeNotifyListener(callback) {
            this.removeListener(NOTIFY_EVENT, callback);
        },

        removePopupListener(callback) {
            this.removeListener(POPUP_EVENT, callback);
        },

        removeRetryListener(callback) {
            this.removeListener(NOTIFY_RETRY, callback);
        },

        removeAbortListener(callback) {
            this.removeListener(NOTIFY_ABORT, callback);
        },

        dispatcherIndex: Dispatcher.register(function(payload) {
            var actionType = payload.actionType,
                action = {

                'SHOW_INFO': function() {
                    AlertStore.emit(NOTIFY_EVENT, AlertConstants.INFO, payload.message);
                },

                'SHOW_WARNING': function() {
                    AlertStore.emit(NOTIFY_EVENT, AlertConstants.WARNING, payload.message);
                },

                'SHOW_ERROR': function() {
                    AlertStore.emit(NOTIFY_EVENT, AlertConstants.ERROR, payload.message);
                },

                'SHOW_POPUP_INFO': function() {
                    AlertStore.emit(POPUP_EVENT, AlertConstants.INFO, payload.id, payload.message);
                },

                'SHOW_POPUP_WARNING': function() {
                    AlertStore.emit(POPUP_EVENT, AlertConstants.WARNING, payload.id, payload.message);
                },

                'SHOW_POPUP_ERROR': function() {
                    AlertStore.emit(POPUP_EVENT, AlertConstants.ERROR, payload.id, payload.message);
                },

                'SHOW_POPUP_RETRY': function() {
                    AlertStore.emit(POPUP_EVENT, AlertConstants.RETRY_CANCEL, payload.id, payload.message);
                },

                'SHOW_POPUP_RETRY_ABORT': function() {
                    AlertStore.emit(POPUP_EVENT, AlertConstants.RETRY_ABORT_CANCEL, payload.id, payload.message);
                },

                'SHOW_POPUP_YES_NO': function() {
                    AlertStore.emit(POPUP_EVENT, AlertConstants.YES_NO, payload.id, payload.message);
                },

                'SHOW_POPUP_QUESTION': function() {
                    AlertStore.emit(POPUP_EVENT, AlertConstants.QUESTION, payload.id, payload.message);
                },

                'NOTIFY_RETRY': function() {
                    AlertStore.emit(NOTIFY_RETRY, payload.id);
                },

                'NOTIFY_ABORT': function() {
                    AlertStore.emit(NOTIFY_ABORT, payload.id);
                },

                'NOTIFY_ANSWER': function() {
                    AlertStore.emit(NOTIFY_ANSWER, payload.id, payload.isYes);
                }

            };

            if(!!action[actionType]) {
                action[actionType]();
            }
        })

    });

    return AlertStore;

});
