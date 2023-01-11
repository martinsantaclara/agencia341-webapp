import prisma from '../../../../../lib/prisma';
import handleError from '../../../../../utils/handleErrors';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            let fechaDesde = req.query.fechaDesde;
            let fechaHasta = req.query.fechaHasta;
            const sorteoId = parseInt(req.query.sorteoId);

            fechaDesde = new Date(fechaDesde);
            fechaHasta = new Date(fechaHasta);

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
                where: {
                    FechaVenta: {
                        gte: fechaDesde,
                        lte: fechaHasta,
                    },
                    sorteoId: { equals: sorteoId },
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
            console.log(error);
            handleError(res, error);
        }
    }
};

export default handler;
