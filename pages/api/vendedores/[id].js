import prisma from '../../../lib/prisma';

const handler = async (req, res) => {
    const { id } = req.query;
    switch (req.method) {
        case 'GET':
            try {
                const vendedor = await prisma.vendedor.findUnique({
                    where: { id: parseInt(id) },
                });
                res.status(200).json(vendedor);
            } catch (error) {
                res.status(500).send(error);
            }
            break;
        case 'DELETE':
            try {
                const deletedRow = await prisma.vendedor.delete({
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
