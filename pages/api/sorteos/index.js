import prisma from '../../../lib/prisma';
import handleError from '../../../utils/handleErrors';

const handler = async (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
                const sorteos = await prisma.sorteo.findMany({
                    orderBy: {
                        OrdenSorteo: 'asc',
                    },
                });
                res.status(200).json(sorteos);
            } catch (error) {
                handleError(res, error);
            }
            break;
        case 'POST':
            //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
            try {
                const { OrdenSorteo, NombreSorteo, FechaSorteo, NumeroSorteo } =
                    req.body;
                const fecha = new Date(FechaSorteo);
                let nuevoSorteo = await prisma.sorteo.create({
                    data: {
                        OrdenSorteo: OrdenSorteo,
                        NombreSorteo: NombreSorteo,
                        FechaSorteo: fecha,
                        NumeroSorteo: NumeroSorteo,
                    },
                });
                res.status(201).send({
                    type: 'success',
                    title: 'Nuevo Sorteo',
                    message: 'Sorteo creado exitosamente!!!',
                });
            } catch (error) {
                handleError(res, error);
            }
            break;
        case 'PUT':
            let { id, OrdenSorteo, NombreSorteo, FechaSorteo, NumeroSorteo } =
                req.body;
            const fecha = new Date(FechaSorteo);
            try {
                const updatedRows = await prisma.sorteo.update({
                    where: { id },
                    data: {
                        OrdenSorteo: OrdenSorteo,
                        NombreSorteo: NombreSorteo,
                        FechaSorteo: fecha,
                        NumeroSorteo: NumeroSorteo,
                    },
                });

                res.status(200).send({
                    type: 'success',
                    title: 'Actualización de Sorteo',
                    message: 'Sorteo actualizado exitosamente!!!',
                });
            } catch (error) {
                handleError(res, error);
            }
            break;
    }
};

export default handler;
