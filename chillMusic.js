const song = document.getElementById("song");
const playBtn = document.querySelector(".player-inner");
const nextBtn = document.querySelector(".play-forward");
const prevBtn = document.querySelector(".play-back");
const durationTime = document.querySelector(".duration");
const remainingTime = document.querySelector(".remaining");
const rangeBar = document.querySelector(".range");
const sliderEl = document.querySelector("#rangeMusic");
const musicName = document.querySelector(".music-name");
const playRepeat = document.querySelector(".play-repeat");
const randomBtn = document.querySelector(".play-random");

let isPlaying = true;
let indexSong = 0;
let isRepeat = false;
let isRandom = false;

const musics = [
    {
        id: 0,
        title: "Là Kẻ Địch / 为敌",
        file: "/LaKeDich.mp3",
    },
    {
        id: 1,
        title: "Windy Hill",
        file: "/WindyHill.mp3",
    },
    {
        id: 2,
        title: "Mirror Mirror",
        file: "/Mirror.mp3",
    },
    {
        id: 3,
        title: "Serenade",
        file: "/Serenade.mp3",
    },

    {
        id: 4,
        title: "The Witch & The Girl",
        file: "/WitchGirl.mp3",
    },
    {
        id: 5,
        title: "Witching Hour",
        file: "/WitchingHour.mp3",
    },
    {
        id: 6,
        title: "Wolf's Knight",
        file: "/Wolf'sKnight.mp3",
    },
    {
        id: 7,
        title: "Wolf's Song",
        file: "/Wolf'sSong.mp3",
    },
    {
        id: 8,
        title: "Vây giữ",
        file: "/VayGiu.mp3",
    },
    {
        id: 9,
        title: "Against the Odds",
        file: "/Against.mp3",
    },
];
/**
 * Music
 * id: 1
 * title: Holo
 * file: holo.mp3
 * image: unsplash
 */
let timer;
let repeatCount = 0;
playRepeat.addEventListener("click", function () {
    if (isRepeat) {
        isRepeat = false;
        playRepeat.removeAttribute("style");
    } else {
        isRepeat = true;
        isRandom = false; // Disable isRandom khi isRepeat được kích hoạt
        playRepeat.style.color = "#ec1f55";
        randomBtn.removeAttribute("style"); // Reset style của randomBtn
    }
});
song.addEventListener("ended", function () {
    if (isRepeat) {
        // Phát lại bài hát hiện tại
        init(indexSong);
        playPause();
    } else if (isRandom) {
        // Phát một bài hát ngẫu nhiên
        playRandomSong();
    } else {
        // Chuyển đến bài hát tiếp theo
        changeSong(1);
    }
});
randomBtn.addEventListener("click", function () {
    isRandom = !isRandom; // Toggle trạng thái của isRandom
    randomBtn.style.color = isRandom ? "#ec1f55" : ""; // Cập nhật màu sắc của nút
    if (isRandom) {
        isRepeat = false; // Disable isRepeat khi isRandom được kích hoạt
        playRepeat.removeAttribute("style"); // Reset style của playRepeat
    }
});

function playRandomSong() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * musics.length);
    } while (randomIndex === indexSong); // Đảm bảo bài hát ngẫu nhiên không trùng với bài hát hiện tại

    indexSong = randomIndex; // Cập nhật indexSong với chỉ số ngẫu nhiên
    init(indexSong); // Khởi tạo bài hát mới
    playPause(); // Phát bài hát
    // changeSong(dir);
}

nextBtn.addEventListener("click", function () {
    changeSong(1);
});
prevBtn.addEventListener("click", function () {
    changeSong(-1);
});
song.addEventListener("ended", handleEndedSong);
function handleEndedSong() {
    repeatCount++;
    if (isRepeat) {
        // handle repeat song
        isPlaying = true;
        playPause();
    } else {
        changeSong(1);
    }
}
function changeSong(dir) {
    if (dir === 1) {
        // next song
        indexSong++;
        if (indexSong >= musics.length) {
            indexSong = 0;
        }
        isPlaying = true;
    } else if (dir === -1) {
        // prev song
        indexSong--;
        if (indexSong < 0) {
            indexSong = musics.length - 1;
        }
        isPlaying = true;
    }
    init(indexSong);

    playPause();
}

playBtn.addEventListener("click", playPause);
function playPause() {
    if (isPlaying) {
        song.play();
        playBtn.innerHTML = `<ion-icon name="pause"></ion-icon>`;
        isPlaying = false;
        timer = setInterval(displayTimer, 500);
    } else {
        song.pause();
        playBtn.innerHTML = `<ion-icon name="play"></ion-icon>`;
        isPlaying = true;
        clearInterval(timer);
    }
}
function displayTimer() {
    const { duration, currentTime } = song;
    rangeBar.max = duration;
    rangeBar.value = currentTime;
    remainingTime.textContent = formatTimer(currentTime);
    if (!duration) {
        durationTime.textContent = "00:00";
    } else {
        durationTime.textContent = formatTimer(duration);
    }
}
function formatTimer(number) {
    const minutes = Math.floor(number / 60);
    const seconds = Math.floor(number - minutes * 60);
    return `${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
    }`;
}

function updateProgressBar() {
    const percentage = (song.currentTime / song.duration) * 100;
    rangeBar.style.background = `linear-gradient(to right, red ${percentage}%, #ccc ${percentage}%)`;
}
song.addEventListener("timeupdate", updateProgressBar);

// Function để cập nhật âm lượng của phần tử media
function setVolume() {
    song.volume = volumeControl.value / 100;
}
const volumeControl = document.getElementById("volumeSlider");

function updateVolumeBar() {
    let volumeValue = volumeControl.value;
    volumeControl.style.background = `linear-gradient(to right, red ${volumeValue}%, #ddd ${volumeValue}%)`;
}

volumeControl.addEventListener("input", updateVolumeBar);

// Thêm sự kiện 'input' cho phần tử range để cập nhật âm lượng khi người dùng di chuyển thanh trượt
volumeControl.addEventListener("input", setVolume);
rangeBar.addEventListener("change", handleChangeBar);
function handleChangeBar() {
    song.currentTime = rangeBar.value;
}

function init(indexSong) {
    song.setAttribute("src", `./assets/music/${musics[indexSong].file}`);
    musicName.textContent = musics[indexSong].title;
}

displayTimer();
init(indexSong);
