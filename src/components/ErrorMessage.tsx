import error from '../assets/svg/error.svg';

export const ErrorMessage = () => {
  return (
    <>
      <img src={error} alt="error" />
      <p>ERROR</p>
      <p>No se pudieron obtener los datos de las pistas y remontes desde el servidor.</p>
    </>
  );
};
