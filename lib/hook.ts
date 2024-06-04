import useSWR, {mutate} from 'swr';
import useSWRImmutable from 'swr/immutable';
import {fetchApiSwr} from './api';
import {useRecoilState} from 'recoil';
import {
  user,
  publicacionUser,
  getAllUser,
  getAllSolicitudesRecibidas,
  getAllAmigos,
  getAllSolicitudesEnviadas,
  publicacionAmigos,
  publicacionSearchUser,
  notificacionesUser,
  Publicacion,
  getSugerenciaAmigos,
} from '@/lib/atom';
import {useEffect} from 'react';
import {urltoBlob, filetoDataURL, compressAccurately} from 'image-conversion';
import {getCookie} from 'cookies-next';
import {useRouter} from 'next/navigation';

type DataUser = {
  fullName?: string;
  email?: string;
  password?: string;
  img?: string;
};
type DataPublicacion = {
  description: string;
  img: string;
  openSwr: boolean;
};
type DataSingin = {
  email: string;
  password: string;
};
type Solicitud = {
  amigoId: number;
  estado: boolean;
  userId?: number;
};
export function CreateUser(dataUser: DataUser) {
  const api = '/auth';
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',

    body: JSON.stringify(dataUser),
  };
  const {data, isLoading} = useSWRImmutable(
    dataUser.email && dataUser.password && dataUser.fullName ? api : null,
    (url) => fetchApiSwr(url, option)
  );
  return {data, isLoading};
}
export function SigninUser(dataUser: DataSingin) {
  const router = useRouter();
  const [userData, setUserData] = useRecoilState(user);
  const api = '/signin';
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(dataUser),
  };
  const {data, isLoading} = useSWRImmutable(
    dataUser.email ? api : null,
    (url) => fetchApiSwr(url, option),
    {
      revalidateOnReconnect: true,
    }
  );
  useEffect(() => {
    if (data && data.user == false) {
      alert('Contraseña o usuario incorrecto');
      return;
    }
    if (data && data.id) {
      setUserData(data);
      router.push('/home', {scroll: true});
      console.log(data);
    }
  }, [data]);
  return {data, isLoading};
}
export async function modificarUser(dataUser: DataUser) {
  const token = getCookie('token');
  const api = '/user/token';
  const option = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(dataUser),
  };

  const dataMod =
    dataUser?.fullName || dataUser?.email || dataUser?.password || dataUser?.img
      ? await fetchApiSwr(api, option)
      : null;

  if (dataMod) {
    mutate('/user/token');
  }
  return dataMod;
}
export function GetUser() {
  const [userData, setUserData] = useRecoilState(user);
  const [getAllUserData, setGetAllUserData] = useRecoilState(getAllUser);
  const [amigoAllData, setAmigosAllData] = useRecoilState(getAllAmigos);
  const [getSugerenciaAmigosData, setGetSugerenciaAmigosData] =
    useRecoilState(getSugerenciaAmigos);
  // const [publicacionesUser, setPublicacionesUser] =
  //   useRecoilState(publicacionUser);
  const [soliAllEnv, setSoliAllEnv] = useRecoilState(getAllSolicitudesEnviadas);
  const [soliAllReci, setSoliAllReci] = useRecoilState(
    getAllSolicitudesRecibidas
  );
  const token = getCookie('token');
  const api = '/user/token';
  const option = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const {data, isLoading} = useSWRImmutable(
    token ? api : null,
    (url) => fetchApiSwr(url, option),
    {
      // revalidateOnMount: true,
      // revalidateOnFocus: true,
      // revalidateOnReconnect: true,
      refreshInterval: 10000,
    }
  );
  useEffect(() => {
    if (data?.getUserRes?.id) {
      setUserData({
        user: {
          ...data.getUserRes,
        },
      });

      // setPublicacionesUser([...data.getUserRes.publicacions]);
      setAmigosAllData(data.friendsAccepted);
      setGetAllUserData(data.getAllUserRes);
      setGetSugerenciaAmigosData(data.getAllUserSugeridos);
      setSoliAllEnv(data.friendEnv);
      setSoliAllReci(data.friendReci);
    }
  }, [data]);
  return {data, isLoading};
}
export function NotificacionesUser(offset: number) {
  const [notificacionesUserAtom, setNotificacionesUserAtom] =
    useRecoilState(notificacionesUser);
  const token = getCookie('token');
  const api = `/user/notificaciones?offset=${offset}`;

  const option = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  };

  const {data, isLoading} = useSWR({api, option}, fetchApiSwr, {
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    revalidateOnFocus: true,
    refreshInterval: 10000,
  });

  useEffect(() => {
    if (data) {
      if (notificacionesUserAtom.length > 0 && offset !== 0) {
        setNotificacionesUserAtom((prev: any) => [
          ...prev,
          ...data.publicacion,
        ]);
        return;
      }
      setNotificacionesUserAtom([...data?.publicacion]);
    }
  }, [data]);

  return {
    dataNotiSwr: data,
    isLoadingNotiSwr: isLoading,
  };
}
export function NotificacionesUserImmutable(offset: number) {
  const [notificacionesUserAtom, setNotificacionesUserAtom] =
    useRecoilState(notificacionesUser);
  const token = getCookie('token');
  const api = `/user/notificaciones?offset=${offset}`;

  const option = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  };

  const {data, isLoading} = useSWRImmutable(token ? api : null, (url) =>
    fetchApiSwr(url, option)
  );

  useEffect(() => {
    if (data) {
      setNotificacionesUserAtom([...data?.publicacion]);
      return;
    }
  }, [data]);

  return {
    dataNotiSwr: data,
    isLoadingNotiSwr: isLoading,
  };
}
export function GetAllPublicaciones(offset: number) {
  const [publicacionesAllAmigos, setPublicacionesAllAmigos] =
    useRecoilState(publicacionAmigos);
  const token = getCookie('token');

  const api = `/user/amigos/publicaciones?offset=${offset}`;
  const option = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  };

  const {data, isLoading} = useSWRImmutable(
    api,
    (url) => fetchApiSwr(url, option),
    {
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      revalidateOnFocus: true,
      refreshInterval: 100000,
    }
  );

  useEffect(() => {
    if (data?.length) {
      if (publicacionesAllAmigos.length > 0 && offset !== 0) {
        setPublicacionesAllAmigos((prev: any) => [...prev, ...data]);
        return;
      }

      setPublicacionesAllAmigos([...data]);
    }
  }, [data]);
  return {
    dataPubliAllAmigosSwr: data,
    isLoadingAllAmigos: isLoading,
  };
}
export function GetAllPublicacionesUser(offset: number) {
  const [publicacionesUser, setPublicacionesUser] =
    useRecoilState(publicacionUser);
  const token = getCookie('token');

  const api = `/user/publicacion?offset=${offset}`;
  const option = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  };
  const {data, isLoading} = useSWR(api, (url) => fetchApiSwr(url, option), {
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    revalidateOnFocus: true,
    refreshInterval: 100000,
  });

  useEffect(() => {
    if (data) {
      if (publicacionesUser.length > 0 && offset !== 0) {
        setPublicacionesUser((prev: any) => [...prev, ...data]);
        return;
      }
      setPublicacionesUser([...data]);
    }
  }, [data]);

  return {dataPubliAllAmigosSwr: data, isLoadingAllAmigos: isLoading};
}
export function GetPubliAmigo(id: string, offset: number) {
  const [publicacionesAmigo, setPublicacionesAmigo] = useRecoilState(
    publicacionSearchUser
  );
  const token = getCookie('token');

  const api = `/user/amigos/publicaciones/${id}?offset=${offset}`;
  const option = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  };

  const {data, isLoading} = useSWR(api, (url) => fetchApiSwr(url, option), {
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    revalidateOnFocus: true,
    refreshInterval: 100000,
  });
  useEffect(() => {
    if (data) {
      if (publicacionesAmigo.length > 0 && offset !== 0) {
        setPublicacionesAmigo((prev: any) => [...prev, ...data]);
        return;
      }
      setPublicacionesAmigo([...data]);
    }
  }, [data]);

  return {dataPubliAmigo: data, isLoading};
}
export function DeletePublic(id: number) {
  const [publicacionesUser, setPublicacionesUser] =
    useRecoilState(publicacionUser);
  const token = getCookie('token');
  const api = '/user/publicacion/' + id;
  const option = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  };
  const {data, isLoading} = useSWR(id > -1 ? api : null, (url) =>
    fetchApiSwr(url, option)
  );
  useEffect(() => {
    if (data) {
      mutate(`/user/amigos/publicaciones?offset=0`);

      const newPublic = publicacionesUser.filter(
        (publi: Publicacion) => publi.id != id
      );
      setPublicacionesUser(newPublic);
    }
  }, [data]);

  return {dataDelete: data, isLoadingDeletePubli: isLoading};
}
export function GetAmigo(id: string) {
  const token = getCookie('token');
  const api = `/user/amigos/${id}`;

  const option = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  };

  const {data, isLoading} = useSWR(api, (url) => fetchApiSwr(url, option), {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    refreshInterval: 100000,
  });

  return {data, isLoading};
}
export function CreatePublicacion(dataPubli: DataPublicacion) {
  const token = getCookie('token');

  const api = '/user/publicacion';
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',

    body: JSON.stringify(dataPubli),
  };
  const {data, isLoading} = useSWR(dataPubli.openSwr ? api : null, (url) =>
    fetchApiSwr(url, option)
  );
  useEffect(() => {
    if (data) {
      mutate(`/user/amigos/publicaciones?offset=0`);
      mutate(`/user/publicacion?offset=0`);
    }
  }, [data]);

  return {data, isLoading};
}
export function CreateSolicitud(dataSoli: Solicitud) {
  const [userAllData, setUserAllData] = useRecoilState(
    getAllSolicitudesEnviadas
  );
  const token = getCookie('token');

  const api = '/user/solicitudAmistad';
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',

    body: JSON.stringify(dataSoli),
  };
  const {data, isLoading} = useSWR(dataSoli.amigoId > -1 ? api : null, (url) =>
    fetchApiSwr(url, option)
  );
  useEffect(() => {
    if (data) {
      const soli = userAllData ? userAllData : [];
      setUserAllData([...soli, data]);
    }
  }, [data]);
  return {dataCreateSoli: data, isLoadCreateSoli: isLoading};
}
export function AceptarSolicitud(dataSoli: Solicitud) {
  const token = getCookie('token');

  const api = '/user/amigos';
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(dataSoli),
  };
  const {data, isLoading} = useSWR(dataSoli.amigoId > -1 ? api : null, (url) =>
    fetchApiSwr(url, option)
  );

  return {dataAcep: data, isLoadingAcep: isLoading};
}
export function RechazarSolicitud(dataSoli: any) {
  const token = getCookie('token');
  const api = '/user/solicitudAmistad';
  const option = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(dataSoli),
  };
  const {data, isLoading} = useSWR(dataSoli.userId > -1 ? api : null, (url) =>
    fetchApiSwr(url, option)
  );

  return {dataRech: data, isLoadingRech: isLoading};
}
export function EliminarAmigo(datas: any) {
  const token = getCookie('token');
  const api = '/user/amigos';
  const option = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(datas),
  };
  const {data, isLoading} = useSWR(
    token && datas.userId > -1 ? api : null,
    (url) => fetchApiSwr(url, option)
  );
  return {dataElimAmigo: data, isLoadingElimAmigo: isLoading};
}
export async function LikeODisLike(datas: any) {
  const token = getCookie('token');
  const api = '/user/publicacion/' + datas.id;
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  };

  const data = await fetchApiSwr(api, option);
  mutate(`/user/amigos/publicaciones?offset=0`);

  return {dataLike: data};
}
export async function comentarPublicacion(datas: any) {
  const token = getCookie('token');
  const api = '/user/publicacion/' + datas.id;
  const option = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({description: datas.description}),
  };
  // const {data, isLoading} = useSWRImmutable(
  //   token && datas.click ? {api, option} : null,
  //   fetchApiSwr
  // );

  const data = await fetchApiSwr(api, option);
  mutate(`/user/amigos/publicaciones?offset=0`);
  return data;
}
export function GetPublicacionId(id: string) {
  const token = getCookie('token');
  const api = '/user/publicacion/' + id;
  const option = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  };
  const {data, isLoading} = useSWR(
    token && id ? api : null,
    (url) => fetchApiSwr(url, option),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );
  return {dataPubliId: data, isLoadGetPubliId: isLoading};
}
export function EnviarMessage(datas: any) {
  const token = getCookie('token');
  const api = '/user/room';
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(datas),
  };
  const {data, isLoading, error} = useSWR(
    token && datas.message && datas.rtdb ? api : null,
    (url) => fetchApiSwr(url, option),
    {
      revalidateOnReconnect: true,
      revalidateOnMount: true,
    }
  );
  return {dataMesssage: data, isLoadMessage: isLoading};
}
// export function OptimizarImage(dataUrl: string) {
//   const {data, isLoading} = useSWR(
//     dataUrl ? dataUrl : null,
//     async (dataUrl) => {
//       const optimizedBase64 = await urltoBlob(dataUrl);
//       const optimizedBase = await compressAccurately(optimizedBase64, {
//         size: 320,
//         quality: 0.6,
//       });
//       const dataFinal = await filetoDataURL(optimizedBase);
//       return dataFinal;
//     }
//   );
//   return {dataObtimizado: data, isLoading};
// }
export async function optimizarImage(dataUrl: string) {
  const optimizedBase64 = await urltoBlob(dataUrl);
  const optimizedBase = await compressAccurately(optimizedBase64, {
    size: 320,
    quality: 0.6,
  });
  const dataFinal = await filetoDataURL(optimizedBase);
  return dataFinal;
}
