let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "en-gb";
    window.speechSynthesis.speak(text_speak);
}

function wishme() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("good morning mam");
    } else if (hours >= 12 && hours < 16) {
        speak("good afternoon mam");
    } else {
        speak("good evening mam");
    }
}

window.addEventListener("load", () => {
    wishme();
    // Optional: Hide voice animation on load
    if (voice) voice.style.display = "none";
});

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.onresult = function(event) {
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript);
};

// Handle recognition end to show button again
recognition.onend = function() {
    btn.style.display = "inline-block";
    if (voice) voice.style.display = "none";
};

btn.addEventListener("click", () => {
    recognition.start();
    btn.style.display = "none";
    if (voice) voice.style.display = "block";
});

const contacts = {
    "harsh": "918700284930",
    "maa": "919873762708",
    "papa": "919811616029",
    "papa": "917011664846",
    "vansh": "918860088650",
    "preeti": "918860291013"

};

function takeCommand(message) {
    btn.style.display = "inline-block";
    if (voice) voice.style.display = "none";
    message = message.toLowerCase();

    // Play any song on YouTube
    if (message.startsWith("play") && message.includes("song")) {
        let song = message.replace("play", "").replace("song", "").trim();
        if (song.length > 0) {
            speak(`Playing ${song} on YouTube`);
            window.open(`https://www.google.com/search?q=${encodeURIComponent(song + " site:youtube.com")}&btnI=I`, "_blank");
        } else {
            speak("Please tell me which song to play.");
        }
    }
    // Take notes
    else if (message.startsWith("make a note") || message.startsWith("note") || message.startsWith("take a note")) {
        let note = message.replace(/(make a note|note|take a note)/, "").trim();
        if (note.length > 0) {
            let notes = JSON.parse(localStorage.getItem("notes") || "[]");
            notes.push(note);
            localStorage.setItem("notes", JSON.stringify(notes));
            speak("Note saved!");
        } else {
            speak("What would you like me to note?");
        }
    }
    // Read notes
    else if (message.includes("read my notes") || message.includes("show my notes")) {
        let notes = JSON.parse(localStorage.getItem("notes") || "[]");
        if (notes.length > 0) {
            speak("Here are your notes: " + notes.join(", "));
        } else {
            speak("You have no saved notes.");
        }
    }
    // Send WhatsApp message feature
    else if (
        (message.includes("whatsapp") || message.includes("send message")) &&
        message.includes("to")
    ) {
        // Example: "send message on whatsapp to sachin hello how are you"
        let match = message.match(/(?:whatsapp|send message)(?: on whatsapp)? to (\w+) (.+)/);
        if (match) {
            let name = match[1];
            let text = match[2];
            let phone = contacts[name];
            if (phone) {
                speak(`Opening WhatsApp chat with ${name}`);
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
            } else {
                speak(`Sorry, I don't have the number for ${name}.`);
            }
        } else {
            speak("Please say, for example: send message on whatsapp to sachin hello how are you");
        }
        return;
    }
    // Show product on Amazon, Flipkart, Meesho, or Zepto
    else if (
        (message.includes("show") || message.includes("search") || message.includes("dikhao")) &&
        (message.includes("amazon") || message.includes("flipkart") || message.includes("meesho") || message.includes("zepto"))
    ) {
        let itemMatch = message.match(/(?:show|search|dikhao)\s+(.*?)\s+(?:on|pr)\s*(amazon|flipkart|meesho|zepto)/);
        if (itemMatch) {
            let item = itemMatch[1].trim();
            let site = itemMatch[2].toLowerCase();
            speak(`Searching for ${item} on ${site}`);
            if (site === "amazon") {
                window.open(`https://www.amazon.in/s?k=${encodeURIComponent(item)}`, "_blank");
            } else if (site === "flipkart") {
                window.open(`https://www.flipkart.com/search?q=${encodeURIComponent(item)}`, "_blank");
            } else if (site === "meesho") {
                window.open(`https://www.meesho.com/search?q=${encodeURIComponent(item)}`, "_blank");
            } else if (site === "zepto") {
                window.open(`https://www.zepto.com/search?q=${encodeURIComponent(item)}`, "_blank");
            }
        } else {
            speak("Please say, for example: show milk on zepto");
        }
        return;
    }
    // Job search on Job Hai, Naukri, LinkedIn, Internshala, Indeed
    else if (
        (message.includes("job") || message.includes("naukri") || message.includes("linkedin") || message.includes("internshala") || message.includes("indeed") || message.includes("job hai") || message.includes("internship")) &&
        (message.includes("search") || message.includes("show") || message.includes("dikhao"))
    ) {
        let jobMatch = message.match(/(?:search|show|dikhao)\s+(.*?)\s*(?:job|internship)?\s*(?:on|pr)?\s*(job hai|naukri|linkedin|internshala|indeed)/);
        if (jobMatch) {
            let role = jobMatch[1].trim();
            let site = jobMatch[2].toLowerCase();
            speak(`Searching for ${role} jobs on ${site}`);
            if (site === "job hai") {
                window.open(`https://www.jobhai.com/search-jobs?keyword=${encodeURIComponent(role)}`, "_blank");
            } else if (site === "naukri") {
                window.open(`https://www.naukri.com/${encodeURIComponent(role)}-jobs`, "_blank");
            } else if (site === "linkedin") {
                window.open(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(role)}`, "_blank");
            } else if (site === "internshala") {
                window.open(`https://internshala.com/internships/keywords-${encodeURIComponent(role)}/`, "_blank");
            } else if (site === "indeed") {
                window.open(`https://www.indeed.com/jobs?q=${encodeURIComponent(role)}`, "_blank");
            }
        } else {
            speak("Please say, for example: search HR job on naukri");
        }
        return;

    }
    // Joke feature
    else if (message.includes("joke")) {
        const jokes = [
            "Why did the computer show up at work late? It had a hard drive.",
            "Why do programmers prefer dark mode? Because light attracts bugs.",
            "Why did the JavaScript developer wear glasses? Because he couldn't C sharp.",
            "Why was the math book sad? Because it had too many problems.",
            "Why did the scarecrow win an award? Because he was outstanding in his field."
        ];
        let joke = jokes[Math.floor(Math.random() * jokes.length)];
        speak(joke);
    }
    // Math calculation feature
    else if (message.match(/what is [\d\s\+\-\*\/\.]+/)) {
        try {
            let expr = message.replace("what is", "").replace(/[^-()\d/*+.]/g, "");
            let result = eval(expr);
            speak(`The answer is ${result}`);
        } catch {
            speak("Sorry, I couldn't calculate that.");
        }
    }
    // Motivation feature
    else if (message.includes("motivate me") || message.includes("motivation")) {
        const quotes = [
            "Believe in yourself and all that you are.",
            "Every day is a second chance.",
            "Push yourself, because no one else is going to do it for you.",
            "Great things never come from comfort zones.",
            "Dream it. Wish it. Do it."
        ];
        let quote = quotes[Math.floor(Math.random() * quotes.length)];
        speak(quote);
    } else if (message.includes("hello") || message.includes("hey")) {
        speak("hello mam, how can I help you today?");
    } else if (message.includes("how are you")) {
        speak("I am fine mam, thank you for asking");
    } else if (message.includes("what is your name")) {
        speak("I am your lili your personal assistant");
    } else if (message.includes("who made you")) {
        speak("I was made by my master, she is a software engineer and her name is prerns singh");
    } else if (message.includes("thank you")) {
        speak("You are welcome mam");
    } else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://www.youtube.com", "_blank");
    } else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://www.google.com", "_blank");
    } else if (message.includes("open facebook")) {
        speak("Opening Facebook...");
        window.open("https://www.facebook.com", "_blank");
    } else if (message.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://www.instagram.com", "_blank");
    } else if (message.includes("open twitter")) {
        speak("Opening Twitter...");
        window.open("https://www.twitter.com", "_blank");
    } else if (message.includes("open whatsapp")) {
        speak("Opening WhatsApp...");
        window.open("https://www.whatsapp.com");
    } else if (message.includes("play music")) {
        speak("Playing music...");
        window.open("https://www.spotify.com", "_blank");
    } else if (message.includes("open calculator")) {
        speak("Opening calculator...");
        window.open("calculator://");
    } else if (message.includes(" time ")) {
        let time = new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric" });
        speak(`The current time is ${time}`);
    } else if (message.includes("date")) {
        let date = new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
        speak(`The current date is ${date}`);
    } else if (message.includes("remind me") || message.includes("set reminder")) {
        let match = message.match(/remind me in (\d+) (second|seconds|minute|minutes|hour|hours) to (.+)/);
        if (match) {
            let value = parseInt(match[1]);
            let unit = match[2];
            let task = match[3];
            let ms = 0;
            if (unit.startsWith("second")) ms = value * 1000;
            else if (unit.startsWith("minute")) ms = value * 60 * 1000;
            else if (unit.startsWith("hour")) ms = value * 60 * 60 * 1000;
            speak(`Okay, I will remind you to ${task} in ${value} ${unit}.`);
            setTimeout(() => {
                speak(`Reminder: ${task}`);
                alert(`Reminder: ${task}`);
            }, ms);
        } else {
            speak("Please say, for example: remind me in 10 minutes to check the oven.");
        }
    } else if (message.includes("what is javascript")) {
        speak(`this is what I found on internet regarding ${message}`);
        window.open(`https://www.google.com/search?q=${message}`);
    } else if (message.includes("today weather")) {
        speak(`this is what I found on internet regarding ${message}`);
        window.open(`https://www.google.com/search?q=${message}`);
    } else {
        speak(`Searching Google for ${message}`);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
    }
}