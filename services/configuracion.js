import axios from 'axios';

export const obtenerConfiguracion = async (setConfiguracion) => {
    const { data } = await axios.get('/api/configuracion');
    setConfiguracion(data[0]);
};
