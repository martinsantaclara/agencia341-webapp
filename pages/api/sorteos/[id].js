import prisma from '../../../lib/prisma';
import handleError from '../../../utils/handleErrors';
const handler = async (req, res) => {
    const { id } = req.query;
    switch (req.method) {
        case 'DELETE':
            try {
                const deletedRow = await prisma.sorteo.delete({
                    where: { id: parseInt(id) },
                });
                res.status(200).send('ok');
            } catch (error) {
                res.status(500).send(error);
            }
            break;
    }
};
export default handler;
