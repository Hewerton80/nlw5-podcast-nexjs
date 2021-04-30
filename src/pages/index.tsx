import { /*GetServerSideProps,*/ GetStaticProps } from "next";
import Image from 'next/image';
import Link from 'next/link';
import api from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from './home.module.scss';
import moment from 'moment';
import 'moment/locale/pt-br';
import { PlayerContext } from "../contexts/PlayerContex";
import { useContext, useMemo } from "react";
moment.locale('pt-br');


interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
}

interface HomeProps {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  const { play, playList } = useContext(PlayerContext);

  const episodeList = useMemo(() => [...latestEpisodes, ...allEpisodes], [latestEpisodes, allEpisodes]);


  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {
            latestEpisodes.map((episode, index) => (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit='cover'
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a> {episode.title} </a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button
                  type='button'
                  onClick={() => playList(episodeList, index + latestEpisodes.length)}
                >
                  <img src="/play-green.svg" alt="play" />
                </button>
              </li>
            ))
          }
        </ul>

      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => (
              <tr key={episode.id}>
                <td style={{ width: 72 }}>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit='cover'
                  />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a> {episode.title} </a>
                  </Link>
                </td>
                <td>{episode.members} </td>
                <td style={{ width: 100 }}>{episode.publishedAt} </td>
                <td>{episode.durationAsString} </td>
                <td>
                  <button
                    type='button'
                    onClick={() => play(episode)}
                  >
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  )
}


/**
 * (Static generation): Fetch data on each request.
 * @link https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
 */
export const getStaticProps: GetStaticProps = async () => {
  const response = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes: Episode[] = response.data.map((episode: any) => ({
    id: episode.id,
    title: episode.title,
    thumbnail: episode.thumbnail,
    members: episode.members,
    publishedAt: moment(episode.published_at).format('DD MMM YY'),
    duration: Number(episode.file.duration),
    durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
    description: episode.description,
    url: episode.file.url
  }));

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    /**
     * a cada 8 horas, quando uma pesoa acessar essa página. será ferada uma nova versão dessa página
     * ou seja, durante o dua apenas três chamadas serão feitas à api
     */
    revalidate: 60 * 60 * 8,
  }
}

/**
 * (Server-side Rendering): Fetch data on each request.
 * @link https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
// export const getServerSideProps: GetServerSideProps = async () => {
//   const response = await api.get('/episodes', {
//     params: {
//       _limit: 12,
//       _sort: 'published_at',
//       _order: 'desc'
//     }
//   });

//   const episodes: Episode[] = response.data.map((episode: any) => ({
//     id: episode.id,
//     title: episode.title,
//     thumbnail: episode.thumbnail,
//     members: episode.members,
//     publishedAt: moment(episode.published_at).format('DD MMM YY'),
//     duration: Number(episode.file.duration),
//     durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
//     description: episode.description,
//     url: episode.file.url
//   }));

//   const latestEpisodes = episodes.slice(0, 2);
//   const allEpisodes = episodes.slice(2, episodes.length);
//   return {
//     props: {
//       latestEpisodes,
//       allEpisodes
//     },
//     /**
//      * a cada 8 horas, quando uma pesoa acessar essa página. será ferada uma nova versão dessa página
//      * ou seja, durante o dua apenas três chamadas serão feitas à api
//      */
//     // revalidate: 60 * 60 * 8,
//   }
// }


