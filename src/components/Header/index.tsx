import styles from './style.module.scss';
import { useMemo } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');

function Header() {
  const currentDate = useMemo(() => moment().format('ddd, D MMMM '), []);
  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="" />
      <p>O melhor para voçê ouvir sempre</p>
      <span>{currentDate}</span>
    </header>
  );
}

export default Header;
