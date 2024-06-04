import {usePathname} from 'next/navigation';
import Link from 'next/link';
import Home from '@/ui/icons/home.svg';
import Logo from '@/public/logo.svg';
import Amigos from '@/ui/icons/amigos.svg';
import Chat from '@/ui/icons/chat.svg';
import Notificaciones from '@/ui/icons/notificaciones.svg';
import Search from '@/ui/icons/search.svg';
import {DivNotificacionActi} from './styled';
export default function NavegationUrl({
  amigos,
  message,
  notification,
}: {
  amigos: number;
  message: number;
  notification: number | false;
}) {
  const pathname = usePathname();
  const className = 'relative';
  return (
    <div className='flex justify-evenly items-center gap-8 max-md:gap-4'>
      <Link href={'/search'} aria-label='search'>
        <span className='hidden  max-md:block'>
          <Search
            className={`${
              pathname == '/search'
                ? 'fill-black dark:fill-white'
                : 'hover:fill-black fill-gray-600 '
            } dark:fill-gray-200`}
          />
        </span>
      </Link>
      <Link href={'/home'} aria-label='home' className={className}>
        <span className={``}>
          <Home
            className={`${
              pathname == '/home'
                ? 'fill-black dark:fill-white'
                : 'hover:fill-black fill-gray-600 '
            } dark:fill-gray-200`}
          />
        </span>
      </Link>
      <Link href={'/amigos'} aria-label='amigos' className={className}>
        {amigos ? <DivNotificacionActi>{amigos}</DivNotificacionActi> : null}
        <span className={``}>
          <Amigos
            className={`${
              pathname == '/amigos'
                ? 'fill-black dark:fill-white'
                : 'hover:fill-black fill-gray-600 '
            } dark:fill-gray-200`}
          />
        </span>
      </Link>
      <Link href={'/mensaje'} aria-label='mensaje' className={className}>
        {message > 0 && <DivNotificacionActi>{message}</DivNotificacionActi>}
        <span>
          <Chat
            className={`${
              pathname == '/mensaje'
                ? 'fill-black dark:fill-white'
                : 'hover:fill-black fill-gray-600 '
            } dark:fill-gray-200`}
          />{' '}
        </span>
      </Link>
      <Link
        href={'/notificaciones'}
        aria-label='notificaciones'
        className={className}>
        {notification && notification !== 0 && (
          <DivNotificacionActi>{notification}</DivNotificacionActi>
        )}
        <span>
          <Notificaciones
            className={`${
              pathname == '/notificaciones'
                ? 'fill-black dark:fill-white'
                : 'hover:fill-black fill-gray-600 '
            } dark:fill-gray-200`}
          />{' '}
        </span>
      </Link>
    </div>
  );
}
const obtenerObjetosUnicos = (array: any[]) => {
  return array.reduce((resultado, objeto) => {
    const existe = resultado.some((item: any) => item['id'] === objeto['id']);
    if (!existe) {
      resultado.push(objeto);
    }
    return resultado;
  }, []);
};