import prisma from '../../../../lib/prisma';
import handleError from '../../../../utils/handleErrors';
const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            let fecha = req.query.fecha;
            fecha = new Date(fecha);
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
                        equals: fecha,
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
    }
};

export default handler;
