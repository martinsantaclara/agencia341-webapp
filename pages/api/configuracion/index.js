import prisma from '../../../lib/prisma';
import handleError from '../../../utils/handleErrors';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
        try {
            const configuracion = await prisma.configuracion.findMany();
            res.status(200).json(configuracion);
        } catch (error) {
            handleError(res, error);
        }
    } else if (req.method === 'PUT') {
        const {
            id,
            PorcentajeAgencia,
            PorcentajeVendedores,
            ImprimeResumen,
            idVendedorAgencia,
        } = req.body;
        try {
            const updatedRows = await prisma.configuracion.update({
                where: { id },

                data: {
                    PorcentajeAgencia,
                    PorcentajeVendedores,
                    ImprimeResumen,
                    idVendedorAgencia,
                },
            });
            res.status(200).send({
                type: 'success',
                title: 'Actualización de Configuración',
                message: 'Datos actualizados exitosamente!!!',
            });
        } catch (error) {
            handleError(res, error);
        }
    }
};

export default handler;
