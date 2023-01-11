import prisma from '../../../lib/prisma';
import handleError from '../../../utils/handleErrors';
const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            let fecha = req.query.fecha;
            fecha = new Date(fecha);
            const resumen = await prisma.resumenxvendedor.findMany({
                where: {
                    Fecha: {
                        equals: fecha,
                    },
                },
                orderBy: [
                    {
                        vendedorId: 'asc',
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
