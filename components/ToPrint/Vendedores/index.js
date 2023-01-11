import React from 'react';
import {
    Container,
    HeaderLeft,
    HeaderPrint,
    HeaderRight,
    HeaderTitle,
} from '../../../styles/globals';
import { Card, CardBody, CardHeader } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { GlobalStyles } from '../../../themes/themes';

class ToPrint1 extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { vendedores, darkMode } = this.props;
        const columns = [
            {
                name: 'Apellido',
                selector: (row) => row.ApellidoVendedor,
                style: {
                    paddingLeft: '30px',
                },
            },
            {
                name: 'Nombre',
                selector: (row) => row.NombreVendedor,
            },
            {
                name: 'Domicilio',
                selector: (row) => row.Domicilio,
            },
            {
                name: 'Localidad',
                selector: (row) => row.localidad.NombreLocalidad,
            },
            {
                name: 'Teléfono/s',
                selector: (row) => row.Telefono,
            },
            {
                name: <div style={{ paddingLeft: '25px' }}>Activo?</div>,
                selector: (row) => row.Activo,
                center: true,
                cell: (row) => {
                    let clase;
                    clase = row.Activo
                        ? 'badge bg-info p-2'
                        : 'badge bg-success p-2';
                    return (
                        <span className={clase}>
                            {row.Activo ? 'Sí' : 'No'}
                        </span>
                    );
                },
            },
        ];
        const customStyles = {
            headCells: {
                style: {
                    fontSize: '16px',
                    fontWeight: 800,
                    justifyContent: 'center',
                },
            },
            headRow: {
                style: {
                    backgroundColor: '#eee',
                },
            },
            rows: {
                style: {
                    backgroundColor: darkMode
                        ? 'hsl(219 29% 14%)'
                        : 'hsl(0 0% 100%)',
                    color: darkMode ? 'hsl(0 0% 100%)' : 'hsl(219 29% 14%)',
                    border: '1px solid hsl(214 17% 51%)', // override the row height
                },
            },
        };
        return (
            <>
                <GlobalStyles print />
                <Container flxdirection={'column'} crud print>
                    {/* <style type="text/css" media="print">
                        {
                            '\
                            @page { size: portrait; }\
                        '
                        }
                    </style> */}
                    <style type="text/css" media="print">
                        {
                            '\
                            @page { size: landscape; }\
                        '
                        }
                    </style>
                    <HeaderPrint>
                        <HeaderLeft>Agencia 341</HeaderLeft>
                        <HeaderTitle>Listado de Vendedores</HeaderTitle>
                        <HeaderRight>Puerto Piray - Misiones</HeaderRight>
                    </HeaderPrint>
                    <Card
                        style={{
                            maxWidth: '950px',
                            minWidth: '500px',
                            width: '100%',
                            margin: '0 auto',
                        }}
                    >
                        <CardBody
                            style={{
                                backgroundColor: darkMode
                                    ? 'hsl(219 29% 10%)'
                                    : 'hsl(210 22% 82%)',
                            }}
                        >
                            <DataTable
                                columns={columns}
                                data={vendedores}
                                customStyles={customStyles}
                            />
                        </CardBody>
                    </Card>
                </Container>
            </>
        );
    }
}

export const ToPrint = React.forwardRef((props, ref) => {
    // eslint-disable-line max-len
    return (
        <ToPrint1
            ref={ref}
            vendedores={props.vendedores}
            darkMode={props.darkMode}
        />
    );
});
