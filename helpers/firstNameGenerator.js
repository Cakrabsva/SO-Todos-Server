function firstNameGenerator () {
    let date = new Date ().toLocaleString("sv-SE").split(' ')[0].replace(/-/g,'')
    let randomNumber = Math.round(Math.random()*1000)
    return `user${date}${randomNumber}`
}

module.exports = {firstNameGenerator}
