export const CalculoVentasxMaquina = (ventas, idVendedorAgencia) => {
    const ventasxmaquina = ventas.reduce((vtaMaquina, venta) => {
        const index = vtaMaquina.findIndex(
            (vta) => vta.MaquinaId === venta.maquinaId
        );
        if (index !== -1) {
            vtaMaquina[index].ImporteVenta += parseFloat(venta.ImporteVenta);
            vtaMaquina[index].ComisionVendedor += venta.ComisionVendedor;
            vtaMaquina[index].ComisionAgencia += venta.ComisionAgencia;
        } else {
            vtaMaquina.push({
                MaquinaId: venta.maquinaId,
                NroMaquina: venta.maquina.NroMaquina,
                Vendedor: `${venta.vendedor.ApellidoVendedor} ${
                    venta.vendedor.NombreVendedor || ''
                }`,
                Agencia: venta.vendedorId === idVendedorAgencia,
                ImporteVenta: parseFloat(venta.ImporteVenta),
                ComisionVendedor: venta.ComisionVendedor,
                ComisionAgencia: venta.ComisionAgencia,
            });
        }

        return vtaMaquina;
    }, []);
    return ventasxmaquina;
};

export const CalculoVentasxDia = (ventas) => {
    const ventasxdia = ventas.reduce(
        (acc, actual) => {
            acc.VentaAgencia += actual.Agencia
                ? parseFloat(actual.ImporteVenta)
                : 0;
            acc.VentaVendedores += !actual.Agencia
                ? parseFloat(actual.ImporteVenta)
                : 0;
            acc.ComisionAgencia += actual.ComisionAgencia;
            acc.ComisionVendedores += actual.ComisionVendedor;
            return acc;
        },
        {
            VentaAgencia: 0,
            VentaVendedores: 0,
            ComisionAgencia: 0,
            ComisionVendedores: 0,
        }
    );
    return ventasxdia;
};

export const CalculoVentasxVendedor = (fecha, ventas, idVendedorAgencia) => {
    const ventasxvendedor = ventas.reduce(
        (vtaVendedor, venta) => {
            if (venta.Agencia) {
                // vtaVendedor[0].Fecha = venta.FechaVenta;
                vtaVendedor[0].Venta += parseFloat(venta.ImporteVenta);
            } else {
                const index = vtaVendedor.findIndex(
                    (vta) => vta.vendedorId === venta.VendedorId
                );
                if (index !== -1) {
                    vtaVendedor[index].Venta += parseFloat(venta.ImporteVenta);
                    vtaVendedor[index].Comision += venta.ComisionVendedor;
                } else {
                    vtaVendedor.push({
                        Fecha: new Date(fecha),
                        vendedorId: venta.VendedorId,
                        Venta: parseFloat(venta.ImporteVenta),
                        Comision: venta.ComisionVendedor,
                    });
                }
            }
            vtaVendedor[0].Comision += venta.ComisionAgencia;
            return vtaVendedor;
        },
        [
            {
                Fecha: new Date(fecha),
                vendedorId: idVendedorAgencia,
                Venta: 0,
                Comision: 0,
            },
        ]
    );
    return ventasxvendedor;
};
