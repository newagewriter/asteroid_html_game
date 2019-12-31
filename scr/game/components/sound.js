class Sound {
    constructor(source) {
        this.sound = document.createElement("audio");
        this.sound.src = source;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
            this.sound.muted = muted;
    }

    setSource(source) {
        this.sound.src = source;
    }

    play() {
        this.sound.play();
    }
    stop() {
        this.sound.pause();
        this.sound.currentTime = 0;
    }

    clean() {
        document.body.removeChild(this.sound);
    }
}
