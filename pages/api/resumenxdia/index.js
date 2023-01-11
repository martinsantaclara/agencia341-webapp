import prisma from '../../../lib/prisma';
import handleError from '../../../utils/handleErrors';
const handler = async (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                let fecha = req.query.fecha;
                fecha = new Date(fecha);
                const resumen = await prisma.resumenxdia.findMany({
                    where: {
                        FechaVenta: {
                            equals: fecha,
                        },
                    },
                });
                res.status(200).json(resumen);
            } catch (error) {
                handleError(res, error);
            }
            break;
        case 'PUT':
            const { id, Gastos } = req.body;
            try {
                const updatedRow = await prisma.resumenxdia.update({
                    where: { id },
                    data: {
                        Gastos: Gastos,
                    },
                });
                res.status(200).send({
                    type: 'success',
                    title: 'Cierre Diario',
                    message: 'El cierre diario se ha realizado exitosamente!!!',
                });
            } catch (error) {
                handleError(res, error);
            }
            break;
    }
};

export default handler;
