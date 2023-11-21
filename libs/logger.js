
function toLog(message, importance=1){
    if (importance>1) {
        console.log(`log message: ${message};`)
    }
}

module.exports = {toLog};