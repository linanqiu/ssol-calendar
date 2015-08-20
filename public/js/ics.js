/* global saveAs, Blob, BlobBuilder, console */
/* exported ics */

var ics = function () {
    'use strict';

    if (navigator.userAgent.indexOf('MSIE') > -1 && navigator.userAgent.indexOf('MSIE 10') == -1) {
        console.log('Unsupported Browser');
        return;
    }

    var SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
    var calendarEvents = [];
    var calendarStart = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0'
    ].join(SEPARATOR);
    var calendarEnd = SEPARATOR + 'END:VCALENDAR';

    return {
        /**
         * Returns events array
         * @return {array} Events
         */
        'events': function () {
            return calendarEvents;
        },

        /**
         * Returns calendar
         * @return {string} Calendar in iCalendar format
         */
        'calendar': function () {
            return calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
        },

        /**
         * Add event to the calendar
         * @param  {string} subject     Subject/Title of event
         * @param  {string} description Description of event
         * @param  {string} location    Location of event
         * @param  {string} begin       Beginning date of event
         * @param  {string} stop        Ending date of event
         */
        'addEvent': function (subject, description, location, start_date, end_date, days, ex_date) {

            var toDateFormat = function (date) {
                var temp_year = ("0000" + (date.getFullYear().toString())).slice(-4);
                var temp_month = ("00" + ((date.getMonth() + 1).toString())).slice(-2);
                var temp_day = ("00" + ((date.getDate()).toString())).slice(-2);
                var temp_hours = ("00" + (date.getHours().toString())).slice(-2);
                var temp_minutes = ("00" + (date.getMinutes().toString())).slice(-2);
                var temp_seconds = ("00" + (date.getMinutes().toString())).slice(-2);
                var temp_time = 'T' + temp_hours + temp_minutes + temp_seconds;
                var temp = temp_year + temp_month + temp_day + temp_time;
                return temp;
            }

            var start = toDateFormat(start_date);
            var end = toDateFormat(end_date);
            var ex = toDateFormat(ex_date);

            var calendarEvent = [
                'BEGIN:VEVENT',
                'CLASS:PUBLIC',
                'DESCRIPTION:' + description,
                'DTSTART;TZID=America/New_York:' + start,
                'DTEND;TZID=America/New_York:' + end,
                'RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=' + ex +';BYDAY=' + days.join(',').toUpperCase(),
                'LOCATION:' + location,
                'SUMMARY;LANGUAGE=en-us:' + subject,
                'TRANSP:TRANSPARENT',
                'END:VEVENT'
            ].join(SEPARATOR);

            calendarEvents.push(calendarEvent);
            return calendarEvent;
        },

        /**
         * Download calendar using the saveAs function from filesave.js
         * @param  {string} filename Filename
         * @param  {string} ext      Extention
         */
        'download': function (filename, ext) {
            if (calendarEvents.length < 1) {
                return false;
            }

            ext = (typeof ext !== 'undefined') ? ext : '.ics';
            filename = (typeof filename !== 'undefined') ? filename : 'calendar';
            var calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;

            var blob;
            if (navigator.userAgent.indexOf('MSIE 10') === -1) { // chrome or firefox
                blob = new Blob([calendar]);
            } else { // ie
                var bb = new BlobBuilder();
                bb.append(calendar);
                blob = bb.getBlob('text/x-vCalendar;charset=' + document.characterSet);
            }
            saveAs(blob, filename + ext);
            return calendar;
        }
    };
};
