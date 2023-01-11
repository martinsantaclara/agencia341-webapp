import prisma from '../../../lib/prisma';
import handleError from '../../../utils/handleErrors';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
        try {
            const vendedores = await prisma.vendedor.findMany({
                include: {
                    localidad: true,
                },
                where: {
                    Activo: {
                        equals: 1,
                    },
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
    } else if (req.method === 'POST') {
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
        const {
            ApellidoVendedor,
            NombreVendedor,
            Activo,
            Domicilio,
            localidadId,
            Telefono,
        } = req.body;
        try {
            const tinyIntActivo = Activo ? 1 : 0;
            let nuevoVendedor = await prisma.vendedor.create({
                data: {
                    ApellidoVendedor: ApellidoVendedor,
                    NombreVendedor: NombreVendedor,
                    Activo: tinyIntActivo,
                    Domicilio: Domicilio,
                    localidadId: localidadId,
                    Telefono: Telefono,
                },
            });
            res.status(201).send({
                type: 'success',
                title: 'Nuevo Vendedor',
                message: 'Vendedor creado exitosamente!!!',
            });
        } catch (error) {
            handleError(res, error);
        }
    } else if (req.method === 'PUT') {
        const {
            id,
            ApellidoVendedor,
            NombreVendedor,
            Activo,
            Domicilio,
            localidadId,
            Telefono,
        } = req.body;
        try {
            const updatedRows = await prisma.vendedor.update({
                where: { id },

                data: {
                    ApellidoVendedor: ApellidoVendedor,
                    NombreVendedor: NombreVendedor,
                    Activo: Activo,
                    Domicilio: Domicilio,
                    localidadId: localidadId,
                    Telefono: Telefono,
                },
            });
            res.status(200).send({
                type: 'success',
                title: 'Actualización de Vendedor',
                message: 'Vendedor actualizado exitosamente!!!',
            });
        } catch (error) {
            handleError(res, error);
        }
    }
};

export default handler;
