import prisma from '../../../lib/prisma';
import handleError from '../../../utils/handleErrors';
const handler = async (req, res) => {
    const { id } = req.query;
    switch (req.method) {
        case 'GET':
            try {
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
            //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
            // const maquinas = await Maquina.findAll({
            //     include: {
            //         model: Vendedor,
            //         attributes: [
            //             'id',
            //             'ApellidoVendedor',
            //             'NombreVendedor',
            //             'Agencia',
            //         ],
            //     },
            //     order: [['NroMaquina', 'ASC']],
            // });
            // res.json({
            //     data: maquinas,
            // });

            break;
        case 'DELETE':
            try {
                const deletedRow = await prisma.maquina.delete({
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
