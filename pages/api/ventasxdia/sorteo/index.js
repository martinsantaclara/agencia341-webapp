import prisma from '../../../../lib/prisma';
import handleError from '../../../../utils/handleErrors';
const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const sorteoId = parseInt(req.query.sorteoId);
            const ventas = await prisma.ventasxdia.findMany({
                where: {
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
