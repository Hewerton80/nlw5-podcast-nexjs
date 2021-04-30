
import Image from 'next/image';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PlayerContext } from '../../contexts/PlayerContex';
import styles from './style.module.scss';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

function Player() {
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious
  } = useContext(PlayerContext);

  const audioRef = useRef<HTMLAudioElement>();

  const [progress, setProgress] = useState(0);

  const currentEpisode = useMemo(() => episodeList[currentEpisodeIndex], [episodeList, currentEpisodeIndex]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    }
    else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="tocando agora" />
        <strong>Tocando agora {currentEpisode?.title}</strong>
      </header>

      {
        currentEpisode ? (
          <div className={styles.currentEpisode}>
            <Image
              width={592}
              height={592}
              src={currentEpisode.thumbnail}
              alt={currentEpisode.title}
              objectFit='cover'
            />
            <strong>{currentEpisode.title}</strong>
            <span>{currentEpisode.members}</span>
          </div>
        ) : (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>
        )
      }

      <footer className={!currentEpisode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {currentEpisode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }} //barra do progresso que ja aconteceu
                railStyle={{ backgroundColor: '#9f75ff' }} //barra do progresso que vai acontecer
                handleStyle={{ backgroundColor: '#04d361', borderWidth: 4 }} //barra do progresso que ja vai acontecer
                min={0}
                max={audioRef?.current?.duration || 0}
                value={progress}
                onChange={value => {
                  audioRef.current.currentTime = value;
                  setProgress(value);
                }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(audioRef?.current?.duration || 0)}</span>
        </div>

        {currentEpisode && (
          <audio
            src={currentEpisode.url}
            autoPlay
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            ref={audioRef}
            onTimeUpdate={e => setProgress(e.currentTarget.currentTime)}
          />
        )}

        <div className={styles.buttons}>
          <button
            type='button'
            disabled={!currentEpisode}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button
            type='button'
            disabled={!currentEpisode}
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button
            type='button'
            className={styles.playButton}
            disabled={!currentEpisode}
            onClick={togglePlay}
          >
            <img src={`/${isPlaying ? 'pause' : 'play'}.svg`} alt="Tocar" />
          </button>

          <button
            type='button'
            disabled={!currentEpisode}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar Próxima" />
          </button>

          <button
            type='button'
            className={styles.playButton}
            disabled={!currentEpisode}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>

        </div>
      </footer>
    </div>
  );
};

export default Player;
