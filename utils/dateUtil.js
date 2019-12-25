function getDate (timeDefinition) {
    let day;
    let date = new Date()
    let month = '' + (date.getMonth() + 1)
    let year = date.getFullYear()
    if (timeDefinition === "today") {
        day = '' + date.getDate()
    } else if (timeDefinition === "startOfCurrentMonth") {
        day = '1'
    } else {
        let monthsDifference;
        if (timeDefinition.includes('-')) {
            monthsDifference = parseInt( "-" + timeDefinition.split('-')[1])
        } else if (timeDefinition.includes('+')) {
            monthsDifference = parseInt(timeDefinition.split('+')[1])
        }
        date = new Date(date.getFullYear(), date.getMonth() + monthsDifference + 1, 1)
        month = '' + (date.getMonth() + 1)
        day = '' + date.getDate()
        year = '' + date.getFullYear()
    }

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function getMonthFromIndex(index) {
    return months[index-1]
}

const months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September',
    'October', 'November', 'December'
    ];

module.exports = {
    getDate,
    getMonthFromIndex
}