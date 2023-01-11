import prisma from '../../../../lib/prisma';
import handleError from '../../../../utils/handleErrors';
const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            let fecha = req.query.fecha;
            fecha = new Date(fecha);
            const ventas = await prisma.ventasxdia.findMany({
                // take: 1,
                where: {
                    FechaVenta: {
                        equals: fecha,
                    },
                },
                orderBy: {
                    OrdenSorteo: 'desc',
                },
            });
            res.status(200).json(ventas);
        } catch (error) {
            handleError(res, error);
        }
    }
};

export default handler;
