import hashtagsData from '../data/hashtags.json'
import { gsap } from "gsap";

let publishHashtag
let hashtags = hashtagsData.hashtags
const notifications = document.getElementById("notifications")

notifications.alpha = 0

export const initHashtag = () => {
    notifications.classList.remove('hidden')

    publishHashtag = setInterval(() => {
        const randomHashtagId = Math.floor(Math.random() * hashtags.length - 1)
        hashtags.splice(randomHashtagId, 1)
        var p = document.createElement('p')
        p.innerHTML = hashtags[randomHashtagId].title
        notifications.appendChild(p);
        gsap.to(p, {
            x: -30,
            duration: 3
        });
        gsap.to(p, {
            alpha: 1,
            y: -10,
            duration: 6
        });
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
    }
}

export const closeHashtag = () => {
    console.log("closeHashtag")
    notifications.classList.add('hidden')
    clearInterval(publishHashtag)
    document.getElementById("sunNav").style.display = 'none'
}