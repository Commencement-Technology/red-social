'use client';
import dynamic from 'next/dynamic';
import FotoPerfil from '@/ui/FotoPerfil';
import {Body} from '@/ui/typography';
import {DivPublicar} from '@/ui/container';
import {useRecoilValue} from 'recoil';
import {
  DivSubir,
  DivASubir,
  DivText,
  DivForm,
  Form,
  Button,
  DivButton,
  ButtonPublicar,
  DivCrear,
} from './styled';
import {FormEvent, useState} from 'react';
import {ImageSVG} from '@/ui/icons';
import {user, isConnect} from '@/lib/atom';
import {CreatePublicacion} from '@/lib/hook';

const Verification = dynamic(() => import('@/ui/verification'));
const CloseSvg = dynamic(() => import('@/ui/icons/close.svg'));
const ImageSubir = dynamic(() => import('@/ui/icons/image.svg'));
const VideoSubir = dynamic(() => import('@/ui/icons/video.svg'));
const Loader = dynamic(() => import('../loader').then((mod) => mod.Loader));
const NotificationToastStatus = dynamic(() =>
  import('@/ui/toast').then((mod) => mod.NotificationToastStatus)
);

export default function Publicar() {
  const [formClick, setFormClick] = useState(false);
  const dataValor = useRecoilValue(user);
  const dataIsConnect = useRecoilValue(isConnect);
  const [alert, setAlert] = useState<
    {message: string; status: 'success' | 'error' | 'info' | 'warning'} | false
  >(false);

  return (
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
          <TemplateFormPublicar close={(data: boolean) => setFormClick(data)} />
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
  );
}

function TemplateFormPublicar(props: any) {
  const dataUser = useRecoilValue(user);
  const [dataUrl, setDataUrl] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (event: any) => {
    const textContent = event.target.textContent;

    setText(textContent);

    // if (text.length >= 250) {
    //   event.target.textContent = text;
    // }
  };

  const handleClickForm = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await CreatePublicacion({
      description: text,
      img: dataUrl,
    });
    setIsLoading(false);
    props.close(false);
  };
  const fullName = dataUser?.user?.fullName.split(' ')[0];

  return (
    <>
      <DivForm>
        <div className='max-w-[550px] w-[90%]'>
          <Form onSubmit={handleClickForm}>
            <div className='flex gap-4 items-start font-bold justify-between w-full'>
              <div className='flex gap-4 items-center'>
                <FotoPerfil
                  className='w-[50px] h-[50px]'
                  img={dataUser?.user?.img}
                />
                <div className='flex items-center gap-2'>
                  <h3 className='text-xl'>{dataUser?.user?.fullName}</h3>
                  {dataUser.user.verification ? (
                    <Verification publication={false} />
                  ) : null}
                </div>
              </div>
              <Button onClick={() => props.close(false)}>
                <CloseSvg />
              </Button>
            </div>
            <p
              id='description'
              data-before={'En que estas pensando ' + fullName + ' ?'}
              className={`relative z-10 mt-8 mb-8 text-start p-2 outline-none overflow-auto max-h-[250px] ${
                !text
                  ? `before:relative before:z-[-1]   before:content-[attr(data-before)] before:text-hoverPrimary  before:text-2xl`
                  : ''
              }`}
              onInput={handleInput}
              suppressContentEditableWarning={true}
              contentEditable={true}></p>
            <div>
              <ImageSVG dataUrl={(data: string) => setDataUrl(data)}></ImageSVG>
            </div>
            <DivButton>
              <ButtonPublicar
                color={text || dataUrl}
                disabled={!text && !dataUrl ? true : false}>
                Publicar
              </ButtonPublicar>
            </DivButton>
          </Form>
        </div>
      </DivForm>
      {isLoading ? <Loader /> : null}
    </>
  );
}
