import prisma from '../../../../lib/prisma';
import handleError from '../../../../utils/handleErrors';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
        try {
            const vendedores = await prisma.vendedor.findMany({
                include: {
                    localidad: true,
                },
                orderBy: [
                    {
                        id: 'asc',
                    },
                ],
            });
            res.status(200).json(vendedores);
        } catch (error) {
            handleError(res, error);
        }
    }
};

export default handler;
