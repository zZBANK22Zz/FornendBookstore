const date = require('date-and-time'); date.locale('th');

const baseDateFormat = 'YYYY-MM-DD'
const baseDateTimeFormat = 'YYYY-MM-DD HH:mm:ss'
const baseTimeFormat = 'HH:mm'
const baseDisplayDateFormat = 'DD/MM/YYYY'

const currentDate = function(format = baseDateTimeFormat) {
    //return date.format(new Date('2022-03-18 19:11:00'), format)
    return date.format(new Date(), format)
}

const formatDate = function(dateData, dateFormat = baseDateFormat) {
    if(dateData) {
        return date.format(new Date(dateData), dateFormat)
    }else {
        return null
    }
}

const formatDateTime = function(dateTime) {
    if(dateTime) {
        return date.format(new Date(dateTime), baseDateTimeFormat)
    }else {
        return null
    }
}

const validateDate = function(dateData) {
    return date.isValid(dateData, baseDateFormat)
}

const validateDateTime = function(dateTime) {
    return date.isValid(dateTime, baseDateTimeFormat)
}

const validateTime = function(time) {
    return date.isValid(time, baseTimeFormat)
}

const isSameDay = function(day1, day2) {
    return date.isSameDay(new Date(day1) , new Date(day2))
}

const unixTimestamp = function() {
    return Math.floor(Date.now() / 1000)
}

const plusDay = function(day) {
    const now = new Date()
    const data = date.addDays(now, day)
    return date.format(new Date(data), baseDateTimeFormat)
}

const DAYS = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
}

module.exports = {
    baseDateFormat,
    baseDateTimeFormat,
    baseDisplayDateFormat,
    baseTimeFormat,
    currentDate,
    formatDate,
    formatDateTime,
    validateDate,
    validateDateTime,
    validateTime,
    isSameDay,
    unixTimestamp,
    plusDay
}