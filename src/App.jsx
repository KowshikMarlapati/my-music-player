import React, { useRef, useState, useEffect } from "react";
import "./App.css";

// Import FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faBackward,
  faForward,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";

const songs = [
  {
    title: "Apna Bana Le",
    src: "/songs/Apna Bana Le.mp3",
    cover: "/covers/apna-bane-le-bhediya.jpeg",
  },
  {
    title: "Kesariya",
    src: "/songs/Kesariya-Brahmastra.mp3",
    cover: "/covers/kesariya-brahmastra.jpg",
  },
  {
    title: "Raatan Lambiya",
    src: "/songs/Raataan Lambiyana.mp3",
    cover: "/covers/raataan-lambiyan-shershaah.jpg",
  },
];

function App() {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [currentIndex]);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  const playPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    const newIndex = (currentIndex + 1) % songs.length;
    setCurrentIndex(newIndex);
    setIsPlaying(true);
  };

  const prevSong = () => {
    const newIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentIndex(newIndex);
    setIsPlaying(true);
  };

  const toggleLoop = () => {
    const newLoop = !isLooping;
    setIsLooping(newLoop);
    audioRef.current.loop = newLoop;
  };

  const onAudioEnded = () => {
    if (!isLooping) {
      nextSong();
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentIndex, isPlaying]);

  return (
    <div className="player">
      <div className="album">
        <img src={songs[currentIndex].cover} alt="Cover" />
        <h2>{songs[currentIndex].title}</h2>
      </div>
      <audio
        ref={audioRef}
        src={songs[currentIndex].src}
        onEnded={onAudioEnded}
      />

      <div className="progress-container">
        <div className="time">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input type="range" value={progress} max="100" onChange={handleSeek} />
      </div>

      <div className="controls">
        <button onClick={prevSong}>
          <FontAwesomeIcon icon={faBackward} size="2x" />
        </button>

        <button onClick={playPause}>
          {isPlaying ? (
            <FontAwesomeIcon icon={faPause} size="2x" />
          ) : (
            <FontAwesomeIcon icon={faPlay} size="2x" />
          )}
        </button>

        <button onClick={nextSong}>
          <FontAwesomeIcon icon={faForward} size="2x" />
        </button>

        <button onClick={toggleLoop} className={isLooping ? "active" : ""}>
          <FontAwesomeIcon icon={faRepeat} size="2x" />
        </button>
      </div>
    </div>
  );
}

export default App;
