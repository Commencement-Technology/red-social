'use client';
import Dropzone from 'dropzone';
import {FotoPerfil} from '@/ui/FotoPerfil';
import {
  DivPerfilUser,
  DivHeadPerfil,
  DivFotoName,
  DivButton,
  DivPublicaciones,
} from './styled';
import {Publicar} from '../publicar';
import {Publicaciones} from '../publicaciones';
import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {user} from '@/lib/atom';
import {useRecoilValue} from 'recoil';
import {ModificarUser} from '@/lib/hook';
import 'dropzone/dist/dropzone.css';
import {Loader} from '../loader';

export function PerfilUser() {
  const dataValor = useRecoilValue(user);
  const [dataImg, setDataImg] = useState('');
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const {data, isLoading} = ModificarUser({img: dataImg}, token as string);
  useEffect(() => {
    const myDropzone = new Dropzone('.dropzoneClick', {
      url: '/false',
      autoProcessQueue: false,
    });

    myDropzone.on('thumbnail', function (file) {
      setDataImg(file.dataURL as string);
    });
  }, []);

  useEffect(() => {
    if (data) {
      setDataImg('');
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <DivPerfilUser>
      <DivHeadPerfil>
        <DivFotoName>
          <div style={{position: 'relative'}}>
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
              }}>
              <div className='dropzoneClick' style={{height: '24px'}}>
                <div
                  className='dz-default dz-message'
                  style={{margin: '0 !important', height: '24px'}}>
                  <button
                    className='dz-button'
                    type='button'
                    style={{
                      padding: '0',
                      border: 'none',
                      backgroundColor: 'transparent',
                      height: '24px',
                    }}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 512 512'
                      width='24'
                      height='24'
                      cursor='pointer'>
                      <path
                        fill='#ddd'
                        d='M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <FotoPerfil wid='80' hei='80' />
          </div>
          <h2 style={{textAlign: 'center'}}>{dataValor?.user?.fullName}</h2>
        </DivFotoName>
        <DivButton>
          <Link
            href='/configuracion'
            style={{textDecoration: 'none', color: '#00bdff'}}>
            Editar perfil
          </Link>
        </DivButton>
      </DivHeadPerfil>

      <DivPublicaciones>
        <Publicar />
        <Publicaciones />
      </DivPublicaciones>
    </DivPerfilUser>
  );
}

// const canvas = document.createElement("canvas");
// const ctx = canvas.getContext("2d");
// let currentImg = "";
// let webpImg = "";
// let convertedImg = "";

// function handleUploadedFile(data:any){

//   if(currentImg != "" || webpImg != "" || convertedImg != ""){
//     URL.revokeObjectURL(currentImg);
//     convertedImg = "";
//     currentImg = "";
//     webpImg = "";
//   }

//   currentImg = URL.createObjectURL(data);

//   webpImg = new Image();

//   webpImg.onload = ()=>{
//      canvas.width = webpImg.naturalWidth;
//      canvas.height = webpImg.naturalHeight;
//      ctx.drawImage(webpImg, 0, 0, canvas.width, canvas.height);
//      convertedImg = canvas.toDataURL("image/webp", 1.0);
//      console.log(convertedImg);
//   }

//   webpImg.src = currentImg;
// }
