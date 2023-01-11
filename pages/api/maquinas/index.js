import prisma from '../../../lib/prisma';
import handleError from '../../../utils/handleErrors';

const handler = async (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
                const maquinas = await prisma.maquina.findMany({
                    include: {
                        vendedor: true,
                    },
                    where: {
                        Activa: {
                            equals: 1,
                        },
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

        case 'POST':
            //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
            try {
                const { NroMaquina, Descripcion, Activa, vendedorId } =
                    req.body;
                let nuevaMaquina = await prisma.maquina.create({
                    data: {
                        NroMaquina: NroMaquina,
                        Descripcion: Descripcion,
                        Activa: Activa,
                        vendedorId: vendedorId,
                    },
                });

                res.status(201).send({
                    type: 'success',
                    title: 'Nueva Máquina',
                    message: 'Máquina creada exitosamente!!!',
                });
            } catch (error) {
                handleError(res, error);
            }
            break;
        case 'PUT':
            const { id, NroMaquina, Descripcion, Activa, vendedorId } =
                req.body;
            try {
                const updatedRows = await prisma.maquina.update({
                    where: { id },
                    data: {
                        NroMaquina: NroMaquina,
                        Descripcion: Descripcion,
                        Activa: Activa,
                        vendedorId: vendedorId,
                    },
                });

                res.status(200).send({
                    type: 'success',
                    title: 'Actualización de Máquina',
                    message: 'Máquina actualizada exitosamente!!!',
                });
            } catch (error) {
                handleError(res, error);
            }
            break;
    }
};

export default handler;
