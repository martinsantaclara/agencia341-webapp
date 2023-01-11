import prisma from '../../../lib/prisma';
import handleError from '../../../utils/handleErrors';

const updateMaquina = (fecha, venta) => {
    return prisma.ventasxmaquina.update({
        where: {
            FechaVenta_vendedorId_maquinaId_sorteoId: {
                FechaVenta: fecha,
                maquinaId: venta.maquinaId,
                vendedorId: venta.vendedorId,
                sorteoId: venta.sorteoId,
            },
        },
        data: {
            ImporteVenta: parseFloat(venta.ImporteVenta),
            ComisionVendedor: parseFloat(venta.ComisionVendedor),
            ComisionAgencia: parseFloat(venta.ComisionAgencia),
        },
    });
};

const updateVendedor = (fecha, venta) => {
    return prisma.ventasxvendedor.update({
        where: {
            Fecha_vendedorId_sorteoId: {
                Fecha: fecha,
                vendedorId: venta.vendedorId,
                sorteoId: venta.sorteoId,
            },
        },
        data: {
            Venta: parseFloat(venta.Venta),
            Comision: parseFloat(venta.Comision),
        },
    });
};

const updateVentas = (
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
    const resultMaquina = ventasxmaquina.map((venta) => {
        return updateMaquina(fecha, venta);
    });
    const resultVendedor = ventasxvendedor.map((venta) => {
        return updateVendedor(fecha, venta);
    });
    const resultDia = prisma.ventasxdia.update({
        where: {
            FechaVenta_sorteoId: {
                FechaVenta: fecha,
                sorteoId: sorteoId,
            },
        },
        data: {
            FechaVenta: fecha,
            VentaAgencia: resumenDiario.VentaAgencia,
            VentaVendedores: resumenDiario.VentaVendedores,
            ComisionAgencia: resumenDiario.ComisionAgencia,
            ComisionVendedores: resumenDiario.ComisionVendedores,
            Blocked: blocked,
            NumeroSorteo: numeroSorteo,
        },
    });
    const resultDelResumenDia = prisma.resumenxdia.delete({
        where: { FechaVenta: fecha },
    });
    const resultResumenDia = prisma.resumenxdia.create({
        data: {
            FechaVenta: fecha,
            VentaAgencia: resumenxdia.VentaAgencia,
            VentaVendedores: resumenxdia.VentaVendedores,
            ComisionAgencia: resumenxdia.ComisionAgencia,
            ComisionVendedores: resumenxdia.ComisionVendedores,
            Gastos: resumenxdia.Gastos,
        },
    });
    const resultDelResumenMaquina = prisma.resumenxmaquina.deleteMany({
        where: { FechaVenta: fecha },
    });
    const resultResumenMaquina = prisma.resumenxmaquina.createMany({
        data: resumenxmaquina,
    });
    const resultDelResumenVendedor = prisma.resumenxvendedor.deleteMany({
        where: { Fecha: fecha },
    });
    const resultResumenVendedor = prisma.resumenxvendedor.createMany({
        data: resumenxvendedor,
    });
    const resultSorteo = prisma.sorteo.update({
        where: {
            id: sorteoId,
        },
        data: {
            FechaSorteo: fecha,
            NumeroSorteo: numeroSorteo,
        },
    });
    const updates = resultMaquina.concat(
        resultVendedor,
        resultDia,
        resultDelResumenDia,
        resultResumenDia,
        resultDelResumenMaquina,
        resultResumenMaquina,
        resultDelResumenVendedor,
        resultResumenVendedor,
        updateSorteo ? resultSorteo : []
    );
    return updates;
};

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const ventas = await prisma.ventasxmaquina.findMany({
                include: {
                    maquina: {
                        select: {
                            NroMaquina: true,
                            Descripcion: true,
                        },
                    },
                    vendedor: {
                        select: {
                            ApellidoVendedor: true,
                            NombreVendedor: true,
                        },
                    },
                },
                orderBy: [
                    {
                        maquina: {
                            NroMaquina: 'asc',
                        },
                    },
                ],
            });
            res.status(200).json(ventas);
        } catch (error) {
            handleError(res, error);
        }
    } else if (req.method === 'POST') {
        const {
            fechaVenta,
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
            numeroSorteo,
        } = req.body;
        const fecha = new Date(fechaVenta);
        const arrayTransaction = [
            prisma.ventasxdia.create({
                data: {
                    FechaVenta: fecha,
                    VentaAgencia: resumenDiario.VentaAgencia,
                    VentaVendedores: resumenDiario.VentaVendedores,
                    ComisionAgencia: resumenDiario.ComisionAgencia,
                    ComisionVendedores: resumenDiario.ComisionVendedores,
                    Blocked: blocked,
                    sorteoId: sorteoId,
                    OrdenSorteo: ordenSorteo,
                    NumeroSorteo: numeroSorteo,
                },
            }),
            prisma.ventasxmaquina.createMany({
                data: ventasxmaquina,
            }),
            prisma.ventasxvendedor.createMany({
                data: ventasxvendedor,
            }),
            ...(existe
                ? [
                      prisma.resumenxdia.delete({
                          where: { FechaVenta: fecha },
                      }),
                  ]
                : []),
            prisma.resumenxdia.create({
                data: {
                    FechaVenta: fecha,
                    VentaAgencia: resumenxdia.VentaAgencia,
                    VentaVendedores: resumenxdia.VentaVendedores,
                    ComisionAgencia: resumenxdia.ComisionAgencia,
                    ComisionVendedores: resumenxdia.ComisionVendedores,
                    Gastos: resumenxdia.Gastos,
                },
            }),
            ...(existe
                ? [
                      prisma.resumenxmaquina.deleteMany({
                          where: { FechaVenta: fecha },
                      }),
                  ]
                : []),
            prisma.resumenxmaquina.createMany({
                data: resumenxmaquina,
            }),
            ...(existe
                ? [
                      prisma.resumenxvendedor.deleteMany({
                          where: { Fecha: fecha },
                      }),
                  ]
                : []),
            prisma.resumenxvendedor.createMany({
                data: resumenxvendedor,
            }),
            ...(updateSorteo
                ? [
                      prisma.sorteo.update({
                          where: {
                              id: sorteoId,
                          },
                          data: {
                              FechaSorteo: fecha,
                              NumeroSorteo: numeroSorteo,
                          },
                      }),
                  ]
                : []),
        ];
        try {
            const result = await prisma.$transaction(arrayTransaction);
            res.status(201).send({
                type: 'success',
                title: 'Nuevo Resumen',
                message: 'Resumen creado exitosamente!!!',
            });
        } catch (error) {
            handleError(res, error);
        }
    } else if (req.method === 'PUT') {
        const {
            fechaVenta,
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
            numeroSorteo,
        } = req.body;
        const fecha = new Date(fechaVenta);
        try {
            const result = await prisma.$transaction(
                updateVentas(
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
                )
            );
            res.status(200).send({
                type: 'success',
                title: 'Actualización de Resumen',
                message: 'Resumen actualizado exitosamente!!!',
            });
        } catch (error) {
            handleError(res, error);
        }
    }
};

export default handler;
