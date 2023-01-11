import prisma from '../../../lib/prisma';
import handleError from '../../../utils/handleErrors';
const handler = async (req, res) => {
    const { id } = req.query;
    switch (req.method) {
        case 'GET':
            try {
                const maquinas = await prisma.ventasxmaquina.findMany({
                    where: { maquinaId: parseInt(id) },
                });
                res.status(200).json(maquinas);
            } catch (error) {
                handleError(res, error);
            }
            break;
    }
};

export default handler;
