import prisma from '../../../lib/prisma';
import handleError from '../../../utils/handleErrors';
const handler = async (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                let fecha = req.query.fecha;
                fecha = new Date(fecha);
                const cierre = await prisma.cierremensual.findMany({
                    where: {
                        Fecha: {
                            equals: fecha,
                        },
                    },
                });
                res.status(200).json(cierre);
            } catch (error) {
                handleError(res, error);
            }
            break;
        case 'POST':
            try {
                const {
                    Fecha,
                    VentaAgencia,
                    VentaVendedores,
                    ComisionAgencia,
                    ComisionVendedores,
                    Gastos,
                    Honorarios,
                    Impuestos,
                    Otros,
                } = req.body;
                const fecha = new Date(Fecha);
                let nuevoCierre = await prisma.cierremensual.create({
                    data: {
                        Fecha: fecha,
                        VentaAgencia: VentaAgencia,
                        VentaVendedores: VentaVendedores,
                        ComisionAgencia: ComisionAgencia,
                        ComisionVendedores: ComisionVendedores,
                        Gastos: Gastos,
                        Honorarios: Honorarios,
                        Impuestos: Impuestos,
                        Otros: Otros,
                    },
                });
                res.status(201).send({
                    type: 'success',
                    title: 'Nuevo Cierre Mensual',
                    message: 'Cierre Mensual creado exitosamente!!!',
                });
            } catch (error) {
                handleError(res, error);
            }
            break;
        case 'PUT':
            try {
                const {
                    id,
                    Fecha,
                    VentaAgencia,
                    VentaVendedores,
                    ComisionAgencia,
                    ComisionVendedores,
                    Gastos,
                    Honorarios,
                    Impuestos,
                    Otros,
                } = req.body;
                const fecha = new Date(Fecha);
                let updateCierre = await prisma.cierremensual.update({
                    where: { id },
                    data: {
                        Fecha: fecha,
                        VentaAgencia: VentaAgencia,
                        VentaVendedores: VentaVendedores,
                        ComisionAgencia: ComisionAgencia,
                        ComisionVendedores: ComisionVendedores,
                        Gastos: Gastos,
                        Honorarios: Honorarios,
                        Impuestos: Impuestos,
                        Otros: Otros,
                    },
                });
                res.status(201).send({
                    type: 'success',
                    title: 'Actualización Cierre Mensual',
                    message: 'Cierre Mensual actualizado exitosamente!!!',
                });
            } catch (error) {
                handleError(res, error);
            }
            break;
    }
};

export default handler;
