import { useContext } from 'react';
import { CloseIcon } from '../assets/icons/CloseIcon';
import { IconButton } from '../components/IconButton';
import { ViewBoxesContext } from '../context/viewBoxes/ViewBoxesContext';

export const InfoBox = () => {
  const { state, handleDispatch } = useContext(ViewBoxesContext);

  return (
    <section className={`box info-box ${state.infoBox ? 'show' : ''}`}>
      <IconButton icon={<CloseIcon />} closeClass="close-button" onClick={() => handleDispatch({ type: 'INFO_BOX' })} />
      <article>
        <h3>Acerca de</h3>
        <p>
          Esta plataforma ha sido diseñada para facilitarte la planificación de tus jornadas de esquí de manera ágil y
          visual. Para su funcionamiento, utilizamos una base de datos externa que, si bien es una herramienta
          perfectamente funcional, puede presentar desactualizaciones, como pistas o remontes que ya no existen o que
          han cambiado. Al basarse en fuentes abiertas, los itinerarios pueden contener errores derivados de estas
          peculiaridades técnicas; no obstante, trabajo activamente para ir subsanando los fallos que detecto y añadir
          nuevas estaciones de esquí. Cualquier usuario puede contribuir a mejorar la precisión de estos datos
          actualizándolos directamente a través de openstreetmap.org, lo que beneficia a toda la comunidad.
          <br />
          <br />
          Asimismo, queremos recalcar que todos los tiempos estimados de recorrido son estrictamente orientativos, ya
          que no pueden prever variables críticas como las condiciones meteorológicas, el estado de la nieve, la
          afluencia de la estación o el nivel técnico de cada esquiador. El uso de esta aplicación se realiza bajo la
          responsabilidad exclusiva del usuario, declinando nosotros cualquier responsabilidad por decisiones tomadas en
          base a la información mostrada. Recuerda que la montaña es un entorno cambiante: utiliza siempre el sentido
          común, contrasta esta información con los partes oficiales de la estación y respeta las señalizaciones del
          terreno.
        </p>
      </article>
      <article>
        <h3>Credits</h3>
        <div>
          <p>
            <b>Base Map</b>
            {' - '}
            &copy; <a href="https://carto.com/">CARTO</a>
            {' | '}
            &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
          </p>
          <p>
            <b>Ski Data</b>
            {' - '}
            &copy;{' '}
            <a href="https://openskimap.org/" target="_blank">
              OpenSkiMap.org
            </a>
            {' | '}
            &copy;{' '}
            <a href="https://skimap.org/" target="_blank">
              SkiMap.org
            </a>
            {' | '}
            &copy;{' '}
            <a href="https://www.openstreetmap.org/copyright" target="_blank">
              OSM contributors
            </a>
          </p>
          <p>
            <b>Ski Icon</b>
            {' - '}
            &copy; <a href="https://www.freepik.com/icon/ski_94150">Ski icon</a>
            {' by '}
            <a href="https://www.freepik.com/">FREEPIK</a>
          </p>
          <p>
            <b>Smash Icons</b>
            {' - '}
            &copy; <a href="https://www.freepik.com/author/smashicons">Smashicons</a>
            {' by '}
            <a href="https://www.freepik.com/">FREEPIK</a>
          </p>
        </div>
      </article>
    </section>
  );
};
