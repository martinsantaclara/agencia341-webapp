import { Prisma } from '@prisma/client';

const handleError = (res, error) => {
    if (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.PrismaClientValidationError
    ) {
        // The .code property can be accessed in a type-safe manner
        res.status(422).send({
            type: 'warning',
            title: 'Ha ocurrido un Error!',
            message: 'Verifique sus datos de ingreso!!!',
        });
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
        res.status(500).send({
            type: 'danger',
            title: 'Error inesperado!',
            message: 'Contáctese con su Administrador!!!',
        });
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
        res.status(422).send({
            type: 'warning',
            title: 'Ha ocurrido un Error!',
            message: 'Verifique sus credenciales de ingreso!!!',
        });
    } else {
        res.status(500).send({
            type: 'danger',
            title: 'Error inesperado!',
            message: 'Contáctese con su Administrador!!!',
        });
    }

    // if (
    //     error.name === 'PrismaClientKnownRequestError' ||
    //     error.name === 'PrismaClientUnknownRequestError'
    // ) {
    //     res.status(422).send({
    //         type: 'warning',
    //         title: 'Ha ocurrido un Error!',
    //         message: error.message,
    //     });
    // } else if (error.name === 'PrismaClientValidationError') {
    //     res.status(422).send({
    //         type: 'warning',
    //         title: 'Error de Validación!',
    //         message: error.message,
    //     });
    // } else if (
    //     error.name === 'PrismaClientRustPanicError' ||
    //     error.name === 'PrismaClientInitializationError'
    // ) {
    //     res.status(500).send({
    //         type: 'danger',
    //         title: 'Error inesperado!',
    //         message: error.message,
    //     });
    // } else {
    //     res.status(500).send({
    //         type: 'danger',
    //         title: 'Error inesperado!',
    //         message: 'Contáctese con su Administrador!!!',
    //     });
    // }
};

export default handleError;
