import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import {fetchApiSwr} from './api';
import {useRecoilState} from 'recoil';
import {user, publicacionUser} from '@/lib/atom';
import {useEffect} from 'react';

type DataUser = {
  fullName?: string;
  email?: string;
  password?: string;
  img?: string;
};
type DataPublicacion = {
  id: number;
  description: string;
  like: number;
  img: string;
  comentarios: [];
  fecha: string;
};
type DataSingin = {
  email: string;
  password: string;
};

export function CreateUser(dataUser: DataUser) {
  const api = '/auth';
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataUser),
  };
  const {data, isLoading, error} = useSWRImmutable(
    dataUser.email ? [api, option] : null,
    fetchApiSwr
  );
  return {data, isLoading};
}
export function SigninUser(dataUser: DataSingin) {
  const [userData, setUserData] = useRecoilState(user);
  const api = '/signin';
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataUser),
  };
  const {data, isLoading, error} = useSWR(
    dataUser.email ? [api, option] : null,
    fetchApiSwr
  );
  useEffect(() => {
    setUserData(data ? data : null);
  }, [data]);
  return {data, isLoading};
}
export function ModificarUser(dataUser: DataUser, token: string) {
  const [userData, setUserData] = useRecoilState(user);
  const api = '/user/token';
  console.log(dataUser);
  const option = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dataUser),
  };
  const {data, isLoading, error} = useSWR(
    dataUser?.email || dataUser?.password || dataUser?.img
      ? [api, option]
      : null,
    fetchApiSwr
  );

  useEffect(() => {
    if (data?.user?.img) {
      const newUserData = {
        ...userData,
        user: {
          ...userData?.user,
          img: data?.user.img,
        },
      };
      setUserData(newUserData);
      return;
    }
    if (data && dataUser?.email) {
      const newUserData = {
        ...userData,
        user: {
          ...userData?.user,
          fullName: dataUser.fullName || '',
          email: dataUser.email || '',
        },
      };
      setUserData(newUserData);
    }
  }, [data]);
  return {data, isLoading};
}
export function GetUser(token: string) {
  const [userData, setUserData] = useRecoilState(user);
  const api = '/user/token';
  const option = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const {data, isLoading, error} = useSWR(
    token ? [api, option] : null,
    fetchApiSwr
  );
  useEffect(() => {
    if (data?.id) {
      setUserData({
        token,
        user: {
          ...data,
        },
      });
    }
  }, [data]);

  return {data, isLoading};
}

export function CreatePublicacion(dataPubli: DataPublicacion, token: string) {
  const api = '/user/publicar';
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dataPubli),
  };
  const {data, isLoading, error} = useSWRImmutable(
    dataPubli.id !== 0 ? [api, option] : null,
    fetchApiSwr
  );
  return {data, isLoading};
}

export function GetPublicaciones(token: string) {
  const [publicaciones, setPublicaciones] = useRecoilState(publicacionUser);
  const api = '/user/publicar';
  const option = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const {data, isLoading, error} = useSWR(
    token ? [api, option] : null,
    fetchApiSwr
  );
  useEffect(() => {
    if (data) {
      setPublicaciones(data);
    }
  }, [data]);
  return {dataPubli: data};
}
