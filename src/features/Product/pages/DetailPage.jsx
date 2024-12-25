import { Box, Container, Grid, Paper } from '@mui/material';
import ProductThumbnail from '../components/ProductThumbnail';
import { useMatch } from 'react-router-dom';
import useProductDetail from '../hooks/useProductDetail';
import ProductInfo from '../components/ProductInfo';

function DetailPage() {

    const match = useMatch('/products/:productId');
    const productId = match ? match.params.productId : null;

    const { product, loading } = useProductDetail(productId);

    if (loading) {
        return <Box>Loading</Box>;
    }

    return (
        <Box>
            <Container>
                <Paper>
                    <Grid container spacing={1}>
                        <Grid item style={{ width: '400px', padding: '8px', borderRight: '1px solid #ccc' }}>
                            <ProductThumbnail product={product} />
                        </Grid>

                        <Grid item style={{ flex: '1 1 0', padding: '8px', justifyContent: 'center' }}>
                            <ProductInfo product={product} />
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
}

export default DetailPage;
