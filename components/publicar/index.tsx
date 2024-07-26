'use client';
import dynamic from 'next/dynamic';
import {DivPublicar} from '@/ui/container';
import {useRecoilValue} from 'recoil';
import {DivSubir, DivASubir, DivText, DivCrear} from './styled';
import {useState} from 'react';
import {user, isConnect} from '@/lib/atom';

const ImageSubir = dynamic(() => import('@/ui/icons/image.svg'));
const VideoSubir = dynamic(() => import('@/ui/icons/video.svg'));

const SkeletonPlicate = dynamic(() =>
  import('@/ui/skeleton').then((mod) => mod.SkeletonPlicate)
);
const NotificationToastStatus = dynamic(() =>
  import('@/ui/toast').then((mod) => mod.NotificationToastStatus)
);
const Body = dynamic(() => import('@/ui/typography').then((mod) => mod.Body));
const TemplateFormPublicar = dynamic(() => import('./templateFormPublicate'));
const FotoPerfil = dynamic(() => import('@/ui/FotoPerfil'));

export default function Publicar() {
  const [formClick, setFormClick] = useState(false);
  const dataValor = useRecoilValue(user);
  const dataIsConnect = useRecoilValue(isConnect);
  const [alert, setAlert] = useState<
    {message: string; status: 'success' | 'error' | 'info' | 'warning'} | false
  >(false);

  return dataValor.user.id ? (
    <DivPublicar>
      <DivText>
        <FotoPerfil
          img={dataValor?.user?.img}
          className='w-[40px] h-[40px]'
          connect={
            dataIsConnect?.find((e: any) => e.id == dataValor?.user?.id)
              ?.connect && true
          }
        />
        <DivCrear onClick={() => setFormClick(true)}>
          <p>Crear publicacion</p>
        </DivCrear>
      </DivText>
      <DivSubir>
        <DivASubir onClick={() => setFormClick(true)}>
          <ImageSubir /> <Body>Foto</Body>
        </DivASubir>
        {formClick ? (
          <TemplateFormPublicar
            fullName={dataValor.user.fullName}
            image={dataValor.user.img}
            verification={dataValor.user.verification}
            close={() => setFormClick(false)}
          />
        ) : null}
        <DivASubir
          onClick={() => setAlert({message: 'Proximamente', status: 'info'})}>
          <VideoSubir />
          <Body>Video</Body>
        </DivASubir>
      </DivSubir>
      {alert && (
        <NotificationToastStatus
          message={alert.message}
          status={alert.status}
          close={() => setAlert(false)}
        />
      )}
    </DivPublicar>
  ) : (
    <SkeletonPlicate />
  );
}
