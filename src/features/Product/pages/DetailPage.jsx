import { Box, Container, Grid, Paper } from '@mui/material';
import ProductThumbnail from '../components/ProductThumbnail';
import { useMatch } from 'react-router-dom';
import useProductDetail from '../hooks/useProductDetail';
import styled from '@emotion/styled';
import ProductInfo from '../components/ProductInfo';

DetailPage.propTypes = {
    
};
const spacing = (factor) => `${8 * factor}px`;

const RootBox = styled(Box)`
    padding: 16px;
`;

const LeftGrid = styled(Grid)`
    width: 400px;
    padding: 8px;
    border-right: 1px solid #ccc;
`;

const RightGrid = styled(Grid)`
    flex: 1 1 0;
    padding: 8px;
    justifyContent: center;
`;

function DetailPage(props) {

    const match = useMatch('/products/:productId');
    const productId = match ? match.params.productId : null;

    const {product,loading} =useProductDetail(productId);

    if(loading){
        return <Box>Loading</Box>
    }
    return (
        <RootBox>
            <Container>
                <Paper>
                    <Grid container spacing={1} marginLeft={0}>
                        <LeftGrid item >
                            <ProductThumbnail product={product}></ProductThumbnail>
                        </LeftGrid>

                        <RightGrid item>
                            <ProductInfo product={product} />
                        </RightGrid>
                    </Grid>
                </Paper>
            </Container>
        </RootBox>
    );
}

export default DetailPage;