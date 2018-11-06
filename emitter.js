'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

class Event {

    /**
     * Constructor
     * @param {Object} params { eventName, context, handler, times, frequency }
     */
    constructor(params) {
        this.eventName = params.event;
        this.context = params.context;
        this.handler = params.handler;
        this.times = params.times > 0 ? params.times : Infinity;
        this.frequency = params.frequency > 0 ? params.frequency : 1;

        this.callsCount = 0;
    }

    execute() {
        if (this.callsCount < this.times && this.callsCount % this.frequency === 0) {
            this.handler.call(this.context);
        }
        this.callsCount++;
    }
}

class EventList {

    constructor() {
        this.events = [];
    }

    add(event) {
        this.events.push(event);
    }

    removeAll(eventName, context) {
        this.events = this.events.filter(event => {
            return !event.eventName.startsWith(eventName) ||
                event.context !== context;
        });
    }

    findAll(eventName) {
        return this.events.filter(event => event.eventName === eventName);
    }
}

function getAllEventsToEmit(event) {
    const namespaces = event.split('.');
    const eventsToEmit = [];
    while (namespaces.length !== 0) {
        eventsToEmit.push(namespaces.join('.'));
        namespaces.pop();
    }

    return eventsToEmit;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const events = new EventList();

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            const newEvent = new Event({ event, context, handler });
            events.add(newEvent);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            events.removeAll(event, context);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            getAllEventsToEmit(event).forEach(eventToEmit => {
                events.findAll(eventToEmit).forEach(currentEvent => currentEvent.execute());
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object} this
         */
        several: function (event, context, handler, times) {
            const newEvent = new Event({ event, context, handler, times });
            events.add(newEvent);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} this
         */
        through: function (event, context, handler, frequency) {
            const newEvent = new Event({ event, context, handler, frequency });
            events.add(newEvent);

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
