export const formatoFechaLarga = (fecha, desde = false, hasta = false) => {
    let fechaLarga;

    if (!desde && !hasta) {
        fechaLarga = new Date(fecha.concat(' 00:00:00'))
            .toLocaleDateString('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            .replace(',', '');
    } else if (!hasta) {
        fechaLarga = new Date(fecha.concat(' 00:00:00'))
            .toLocaleDateString('es-AR', {
                month: 'long',
                day: 'numeric',
            })
            .replace(',', '');
    } else {
        fechaLarga = new Date(fecha.concat(' 00:00:00'))
            .toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            .replace(',', '');
    }
    const index = fechaLarga.search('de');
    fechaLarga = [
        fechaLarga[0].toUpperCase(),
        fechaLarga.slice(1, index + 3),
        fechaLarga[index + 3].toUpperCase(),
        fechaLarga.slice(index + 4),
    ].join('');
    return fechaLarga;
};

export const formatoFechaMensual = (fecha, sameYear = false) => {
    const fechaMensual = new Date(fecha.concat(' 00:00:00'))
        .toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
        })
        .replace(',', '');
    const index = fechaMensual.search('de');

    let soloMes = fechaMensual;
    soloMes = [soloMes[0].toUpperCase(), soloMes.substring(1, index)].join('');

    fechaMensual = [
        fechaMensual[0].toUpperCase(),
        fechaMensual.slice(1, index + 3),
        fechaMensual[index + 3].toUpperCase(),
        fechaMensual.slice(index + 4),
    ].join('');

    return sameYear ? soloMes : fechaMensual;
};
