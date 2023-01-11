import prisma from '../../../../lib/prisma';
import handleError from '../../../../utils/handleErrors';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            let fechaDesde = req.query.fechaDesde;
            let fechaHasta = req.query.fechaHasta;

            fechaDesde = new Date(fechaDesde);
            fechaHasta = new Date(fechaHasta);

            const resumen = await prisma.resumenxmaquina.findMany({
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
                where: {
                    FechaVenta: {
                        gte: fechaDesde,
                        lte: fechaHasta,
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
            res.status(200).json(resumen);
        } catch (error) {
            handleError(res, error);
        }
    }
};

export default handler;
