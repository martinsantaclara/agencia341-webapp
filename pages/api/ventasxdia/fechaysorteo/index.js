import prisma from '../../../../lib/prisma';
import handleError from '../../../../utils/handleErrors';
const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            let fecha = req.query.fecha;
            fecha = new Date(fecha);
            const sorteoId = parseInt(req.query.sorteo);
            const ventas = await prisma.ventasxdia.findMany({
                where: {
                    FechaVenta: {
                        equals: fecha,
                    },
                    sorteoId: {
                        equals: sorteoId,
                    },
                },
            });
            res.status(200).json(ventas);
        } catch (error) {
            handleError(res, error);
        }
    }
};

export default handler;
