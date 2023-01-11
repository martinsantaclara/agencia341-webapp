import prisma from '../../../../lib/prisma';
import handleError from '../../../../utils/handleErrors';
const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            let fecha = req.query.fecha;
            fecha = new Date(fecha);
            const ventasxvendedor = await prisma.ventasxvendedor.findMany({
                // take: 1,
                where: {
                    Fecha: {
                        equals: fecha,
                    },
                },
                orderBy: {
                    sorteoId: 'asc',
                },
            });
            res.status(200).json(ventasxvendedor);
        } catch (error) {
            handleError(res, error);
        }
    }
};

export default handler;
