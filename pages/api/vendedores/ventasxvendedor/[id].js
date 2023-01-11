import prisma from '../../../../lib/prisma';

const handler = async (req, res) => {
    const { id } = req.query;
    switch (req.method) {
        case 'GET':
            try {
                const vendedores = await prisma.ventasxmaquina.findMany({
                    where: { vendedorId: parseInt(id) },
                });
                res.status(200).json(vendedores);
            } catch (error) {
                res.status(500).send(error);
            }
            break;
    }
};

export default handler;
