import hashtagsData from '../data/hashtags.json'

let hashtags = hashtagsData.hashtags
let notifications = document.getElementById("notifications")

export const initHashtag = () => {
    notifications.classList.remove('hidden')

    const publishHashtag = setInterval(() => {
        const randomHashtagId = Math.floor(Math.random() * hashtags.length - 1)
        hashtags.splice(randomHashtagId, 1)
        var p = document.createElement('p')
        p.innerHTML = hashtags[randomHashtagId].title
        notifications.appendChild(p);
    }, 20000)
    
}

export const createNotification = (partnerName, type) => {
    switch(type) {
        case "treasureAdded":
            var p = document.createElement('p')
            p.innerHTML = partnerName + " vient d'ajouter un trésor"
            notifications.appendChild(p);
            break;
        case "treasureRemoved":
            var p = document.createElement('p')
            p.innerHTML = partnerName + " vient d'enlever un trésor"
            notifications.appendChild(p);
            break;
        case "treasureTagged":
            alert(partnerName + " vient de tagger un trésor de [rayonannt]")
            break;
    }
}

export const closeHashtag = () => {
    notifications.classList.add('hidden')
    clearInterval(publishHashtag)
}




