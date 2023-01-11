import prisma from '../../../../lib/prisma';
import handleError from '../../../../utils/handleErrors';

const handler = async (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
                const maquinas = await prisma.maquina.findMany({
                    include: {
                        vendedor: true,
                    },
                    orderBy: {
                        NroMaquina: 'asc',
                    },
                });
                res.status(200).json(maquinas);
            } catch (error) {
                handleError(res, error);
            }
            break;
    }
};

export default handler;
