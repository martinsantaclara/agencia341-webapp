import prisma from '../../../../lib/prisma';
import handleError from '../../../../utils/handleErrors';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            let fechaDesde = req.query.fechaDesde;
            let fechaHasta = req.query.fechaHasta;

            fechaDesde = new Date(fechaDesde);
            fechaHasta = new Date(fechaHasta);

            const cierres = await prisma.cierremensual.findMany({
                where: {
                    Fecha: {
                        gte: fechaDesde,
                        lte: fechaHasta,
                    },
                },
            });
            res.status(200).json(cierres);
        } catch (error) {
            handleError(res, error);
        }
    }
};

export default handler;
