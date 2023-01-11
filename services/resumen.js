import axios from 'axios';

export const creaResumen = async (
    fecha,
    resumenDiario,
    ventasxmaquina,
    ventasxvendedor,
    existe,
    resumenxdia,
    resumenxmaquina,
    resumenxvendedor,
    blocked,
    updateSorteo,
    sorteoId,
    ordenSorteo,
    numeroSorteo
) => {
    const body = {
        fechaVenta: fecha,
        resumenDiario: resumenDiario,
        ventasxmaquina: ventasxmaquina,
        ventasxvendedor: ventasxvendedor,
        existe: existe,
        resumenxdia: resumenxdia,
        resumenxmaquina: resumenxmaquina,
        resumenxvendedor: resumenxvendedor,
        blocked: blocked ? 1 : 0,
        updateSorteo: updateSorteo,
        sorteoId: sorteoId,
        ordenSorteo: ordenSorteo,
        numeroSorteo: numeroSorteo,
    };
    const { data } = await axios.post('/api/ventas', body);
    return data;
};

// export const destroySummary = async (date) => {
//     // const body = {
//     //     date: date,
//     // };
//     const { data } = await axios.delete('http://localhost:3000/api/ventas', {
//         data: date,
//     });
//     return data;
// };

export const actualizaResumen = async (
    fecha,
    resumenDiario,
    ventasxmaquina,
    ventasxvendedor,
    resumenxdia,
    resumenxmaquina,
    resumenxvendedor,
    blocked,
    updateSorteo,
    sorteoId,
    ordenSorteo,
    numeroSorteo
) => {
    const body = {
        fechaVenta: fecha,
        resumenDiario: resumenDiario,
        ventasxmaquina: ventasxmaquina,
        ventasxvendedor: ventasxvendedor,
        resumenxdia: resumenxdia,
        resumenxmaquina: resumenxmaquina,
        resumenxvendedor: resumenxvendedor,
        blocked: blocked ? 1 : 0,
        updateSorteo: updateSorteo,
        sorteoId: sorteoId,
        ordenSorteo: ordenSorteo,
        numeroSorteo: numeroSorteo,
    };
    const { data } = await axios.put('/api/ventas', body);
    return data;
};
