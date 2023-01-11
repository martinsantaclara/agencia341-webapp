import styled from 'styled-components';
export const PageWrapper = styled.div`
    width: 100%;
    padding: 0 2rem 1rem 5rem;
    background-color: ${({ theme }) => theme.surface};
    border-radius: 0.375rem;
    max-width: ${({ print }) => (print ? '738px' : '')};

    // @media ${({ theme }) => theme.breakpoints.md} {
    //     padding: 0 1rem 2.25rem 2rem;
    // }
`;

export const PageHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
`;

export const PageTitle = styled.h1`
    font-size: 24px;
    width: ${({ print, page }) => (print || page ? '100%' : '200px')};
    color: ${({ theme, print }) =>
        print ? 'hsl(214 17% 51%)' : theme.clrHeading};
    margin-bottom: ${({ print }) => (print ? '1rem' : '')};
`;
