import { useEffect, useId, useRef } from "react";
import Carousel from "bootstrap/js/dist/carousel";

function CarruselVehiculo({ imagenes, nombre }) {
    const id = `galeria-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const elemento = useRef(null);

    useEffect(() => {
        const carrusel = new Carousel(elemento.current, { interval: false });
        return () => carrusel.dispose();
    }, []);

    return (
        <div ref={elemento} id={id} className="carousel slide carousel-fade carrusel-vehiculo"
            role="region" aria-roledescription="carrusel" aria-label={`Fotos de ${nombre}`}>
            <div className="carousel-inner">
                {imagenes.map((imagen, indice) => (
                    <div key={imagen.src} className={`carousel-item${indice === 0 ? " active" : ""}`}
                        role="group" aria-roledescription="diapositiva" aria-label={`${indice + 1} de ${imagenes.length}`}>
                        <img src={imagen.src} className="d-block w-100 rounded-5" alt={imagen.alt} />
                        {imagen.etiqueta && (
                            <div className="carousel-caption p-2">
                                <span className="badge text-bg-dark fs-6">{imagen.etiqueta}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="carrusel-controles">
                <button className="btn-icon btn-sm" type="button" data-bs-target={`#${id}`} data-bs-slide="prev">
                    <span className="carousel-icon-prev carousel-control-prev-icon" aria-hidden="true" />
                    <span className="visually-hidden">Foto anterior</span>
                </button>
                <button className="btn-icon btn-sm" type="button" data-bs-target={`#${id}`} data-bs-slide="next">
                    <span className="carousel-icon-next carousel-control-next-icon" aria-hidden="true" />
                    <span className="visually-hidden">Foto siguiente</span>
                </button>
            </div>
        </div>
    );
}

export default CarruselVehiculo;