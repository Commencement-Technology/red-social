'use client';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Logo from '@/public/logo.svg';
import {
  HeaderNav,
  Nav,
  DivEnlaces,
  InputDiv,
  Input,
  Enlaces,
  EnlaceSearch,
  Button,
} from './styled';
import Home from '@/ui/icons/home.svg';
import Amigos from '@/ui/icons/amigos.svg';
import Chat from '@/ui/icons/chat.svg';
import Notificaciones from '@/ui/icons/notificaciones.svg';
import Search from '@/ui/icons/search.svg';
import Link from 'next/link';
import {FotoPerfil} from '@/ui/FotoPerfil';
import {Menu} from '@/components/menu';
import {
  GetUser,
  GetPublicaciones,
  GetAllUser,
  GetAllSolicitudes,
  GetAllAmigos,
} from '@/lib/hook';
import {usePathname} from 'next/navigation';

const stylelinkIcon = {
  fill: '#b3b3b3',
};

export function Header() {
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();

  const router = useRouter();
  const {data, isLoading} = GetUser();
  useEffect(() => {
    if (data && pathname == '/') {
      router.push('/home');
    }
    if (!data) {
      router.push('/');
    }
  }, [data]);

  const handleMenu = (e: any) => {
    e.preventDefault();
    if (menu) {
      setMenu(false);
      return;
    }
    setMenu(true);
  };
  const handleClick = (data: boolean) => {
    setMenu(data);
  };

  return data ? (
    <HeaderNav>
      <Nav>
        <InputDiv>
          <Logo style={{borderRadius: '10px', fill: '#fff'}} />
          <Input type='text' placeholder='Buscador'></Input>
        </InputDiv>
        <DivEnlaces>
          <Link href={'/search'}>
            <EnlaceSearch>
              <Search />
            </EnlaceSearch>
          </Link>
          <Link href={'/home'} style={stylelinkIcon}>
            <Enlaces>
              <Home />
            </Enlaces>
          </Link>
          <Link href={'/amigos'} style={stylelinkIcon}>
            <Enlaces>
              <Amigos />{' '}
            </Enlaces>
          </Link>
          <Link href={'/mensaje'} style={stylelinkIcon}>
            <Enlaces>
              <Chat />{' '}
            </Enlaces>
          </Link>
          <Link href={'/notificaciones'} style={stylelinkIcon}>
            <Enlaces>
              <Notificaciones />{' '}
            </Enlaces>
          </Link>
        </DivEnlaces>
        <div style={{position: 'relative'}}>
          <Button onClick={handleMenu}>
            <FotoPerfil wid='40' hei='40' />
          </Button>
          {menu ? <Menu click={handleClick} /> : null}
        </div>
      </Nav>
    </HeaderNav>
  ) : null;
}
