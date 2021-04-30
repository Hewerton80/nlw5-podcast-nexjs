import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import api from '../../services/api';
import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');
import styles from './episode.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { useContext } from 'react';
import { PlayerContext } from '../../contexts/PlayerContex';

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  description: string;
  durationAsString: string;
  url: string;
}

interface EpisodeProps {
  episode: Episode
}

function Episode({ episode }: EpisodeProps) {

  const { play } = useContext(PlayerContext);
  // const router = useRouter();

  //caso a página esteja em carregamento 
  // caso fallback seja true
  // if (router.isFallback) { 
  //   return <p>carregando...</p>
  // }
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href='/'>
          <button type='button'>
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        < Image
          width={700}
          height={160}
          src={episode.thumbnail}
          alt={episode.title}
          objectFit='cover'
        />
        <button type='button' onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />

    </div>
  );
}

/**
 * 
 * @link https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation 
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'publised_at',
      _order: 'desc'
    }
  });

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })
  return {
    paths,
    fallback: 'blocking',
  }
}


/**
 * (Static generation): Fetch data on each request.
 * @link https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
 */
export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: moment(data.published_at).format('DD MMM YY'),
    duration: Number(data.file.duration),
    description: data.description,
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    url: data.file.url
  }

  return {
    props: {
      episode
    },
    /**
     * a cada 24 horas, quando uma pesoa acessar essa página. será feita uma nova versão dessa página
     * ou seja, durante o dia apenas 1 chamada será feita à api
     */
    revalidate: 60 * 60 * 24,
  }
}

export default Episode;
