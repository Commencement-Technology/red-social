'use client';
import {Section, DivSection, DivIcons, DivResponse, DivResult} from './styled';
import MyAmigos from '@/ui/icons/myAmigos.svg';
import {ButtonNoti} from '@/ui/boton';
import {useEffect, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {
  User,
  getAllAmigos,
  getAllSolicitudesRecibidas,
  getAllSolicitudesEnviadas,
  getSugerenciaAmigos,
} from '@/lib/atom';
import {
  createSolicitud,
  AceptarSolicitud,
  rechazarSolicitud,
  EliminarAmigo,
} from '@/lib/hook';
import {Loader} from '../loader';
import TemplateFriendRequest from '../templateFriends';

export default function AmigosComponent() {
  const dataAllUser = useRecoilValue(getSugerenciaAmigos);
  const dataAllAmigos = useRecoilValue(getAllAmigos);
  const dataAllSoliReci = useRecoilValue(getAllSolicitudesRecibidas);
  const dataAllSoliEnv = useRecoilValue(getAllSolicitudesEnviadas);
  const [sugerencia, setSugerencia] = useState(false);
  const [soliAmis, setSoliAmis] = useState(true);
  const [allAmig, setAllAmig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [soliEnv, setSoliEnv] = useState(false);
  const [acepAmigoId, setAcepAmigoId] = useState(Number(-1));

  const [eliminarAmigo, setEliminarAmigo] = useState(Number(-1));

  const {dataAcep} = AceptarSolicitud({
    amigoId: acepAmigoId,
  });

  const {dataElimAmigo} = EliminarAmigo({
    userId: eliminarAmigo,
  });
  const handleClick = (e: any) => {
    e.preventDefault();
    if (e.target.id == 'suge') {
      setSugerencia(true);
      setSoliAmis(false);
      setAllAmig(false);
      setSoliEnv(false);
      return;
    }
    if (e.target.id == 'soli') {
      setSoliAmis(true);
      setSugerencia(false);
      setAllAmig(false);
      setSoliEnv(false);

      return;
    }
    if (e.target.id == 'all') {
      setAllAmig(true);
      setSugerencia(false);
      setSoliAmis(false);
      setSoliEnv(false);

      return;
    }
    if (e.target.id == 'SoliEnv') {
      setAllAmig(false);
      setSugerencia(false);
      setSoliEnv(true);
      setSoliAmis(false);
      return;
    }
  };
  const handleSolicitudEnv = async (e: any) => {
    setIsLoading(true);
    const id = e.target.id;
    await createSolicitud({
      amigoId: Number(id),
    });
    setIsLoading(false);
  };
  const handleSolicitudAcep = (e: any) => {
    const id = e.target.id;

    setAcepAmigoId(Number(id));
  };
  const handleSolicitudRecha = async (e: any) => {
    const id = e.target.id;
    setIsLoading(true);
    await rechazarSolicitud({
      userId: Number(id),
    });
    setIsLoading(false);
  };
  const handleEliminarAmigo = (e: any) => {
    const id = e.target.id;
    setEliminarAmigo(Number(id));
  };

  useEffect(() => {
    if (dataAcep || dataElimAmigo) {
      setAcepAmigoId(Number(-1));
      setEliminarAmigo(Number(-1));
    }
  }, [dataAcep, eliminarAmigo]);

  return (
    <Section>
      <DivSection>
        <div className='sticky top-16 z-[9]'>
          <h2 className='font-semibold text-2xl text-center p-2'>Amigos</h2>
          <div
            style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <ButtonNoti onClick={handleClick} id='suge' open={sugerencia}>
              <DivIcons>
                <MyAmigos /> {'>'}
              </DivIcons>
              Sugerencia de amistad
            </ButtonNoti>
            <ButtonNoti onClick={handleClick} id='soli' open={soliAmis}>
              <DivIcons>
                <MyAmigos />
                {'+'}
              </DivIcons>
              Solicitud de amistad
            </ButtonNoti>
            <ButtonNoti onClick={handleClick} id='all' open={allAmig}>
              <DivIcons>
                <MyAmigos />
              </DivIcons>
              Todos tus amigos
            </ButtonNoti>
            <ButtonNoti onClick={handleClick} id='SoliEnv' open={soliEnv}>
              <DivIcons>
                <MyAmigos />
              </DivIcons>
              Solicitud Enviado
            </ButtonNoti>
          </div>
        </div>
      </DivSection>
      <DivResult>
        {sugerencia && !soliAmis && !allAmig ? (
          <>
            <h3 className='font-semibold text-xl mb-4'>
              Sugerencias de amistad
            </h3>
            <DivResponse>
              {dataAllUser?.length > 0
                ? dataAllUser?.map((user) => (
                    <TemplateFriendRequest
                      key={user.id}
                      id={user.id}
                      fullName={user.fullName}
                      img={user.img}
                      handleSolicitudEnv={handleSolicitudEnv}
                      requestClassDuo={false}
                      typeRequest='suggestion'
                    />
                  ))
                : 'Sin Usuarios'}
            </DivResponse>
          </>
        ) : null}
        {soliAmis ? (
          <>
            <h3 className='font-semibold text-xl mb-4'>
              Solicitudes de amistad
            </h3>
            <DivResponse>
              {dataAllSoliReci?.length > 0
                ? dataAllSoliReci.map((user) => (
                    <TemplateFriendRequest
                      key={user.id}
                      id={user.id}
                      fullName={user.fullName}
                      img={user.img}
                      handleSolicitudAcep={handleSolicitudAcep}
                      handleSolicitudRecha={handleSolicitudRecha}
                      requestClassDuo={true}
                      typeRequest='requestFriend'
                    />
                  ))
                : 'No hay solicitud de amistad'}
            </DivResponse>
          </>
        ) : null}
        {allAmig ? (
          <>
            <h3 className='font-semibold text-xl mb-4' style={{marginTop: '0'}}>
              Todos tus amigos
            </h3>
            <DivResponse>
              {dataAllAmigos?.length > 0
                ? dataAllAmigos.map((user) => (
                    <TemplateFriendRequest
                      key={user.id}
                      id={user.id}
                      fullName={user.fullName}
                      img={user.img}
                      handleEliminarAmigo={handleEliminarAmigo}
                      typeRequest={'allFriend'}
                      requestClassDuo={false}
                    />
                  ))
                : 'No tienes amigos'}
            </DivResponse>
          </>
        ) : null}
        {soliEnv ? (
          <>
            <h3 className='font-semibold text-xl mb-4' style={{marginTop: '0'}}>
              Solicitud Enviado
            </h3>
            <DivResponse>
              {dataAllSoliEnv?.length > 0
                ? dataAllSoliEnv.map((user) => (
                    <TemplateFriendRequest
                      key={user.id}
                      id={user.id}
                      fullName={user.fullName}
                      img={user.img}
                      handleSolicitudRecha={handleSolicitudRecha}
                      requestClassDuo={false}
                      typeRequest={'requestSent'}
                    />
                  ))
                : 'No enviastes solicitudes'}
            </DivResponse>
          </>
        ) : null}
      </DivResult>
      {isLoading ? <Loader /> : null}
    </Section>
  );
}