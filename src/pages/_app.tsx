import Header from '../components/Header';
import styles from '../styles/app.module.scss';
import Player from '../components/Player';
import { PlayerProvider } from '../contexts/PlayerContex';
import '../styles/global.scss';

function MyApp({ Component, pageProps }) {
  return (
    <PlayerProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerProvider>
  )
}

export default MyApp;
