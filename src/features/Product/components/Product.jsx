import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { THUMBNAIL_PLACEHOLDER } from 'constants';
import { useNavigate } from 'react-router-dom';
import { calculateDiscount, formatPrice, imageMainProduct } from 'utils';
import { discountStatus } from 'enum/discountStatus';

Product.propTypes = {
  product: PropTypes.object.isRequired,
};

function Product({ product }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const image = product.productDetails
    .flatMap((productDetail) => productDetail.image)
    .find((image) => image.mainProduct === true);

  const thumbnailUrl = image?.imageUrl || imageMainProduct(product.productDetails)?.imageUrl || THUMBNAIL_PLACEHOLDER;

  const sellingPrice = product.sellingPrice;

  const { percentageValue, finalPrice } = calculateDiscount(product, product.productDiscountPeriods);

  const totalQuantity = product.productDetails
    .flatMap((pd) => pd.productDetailSizes)
    .reduce((sum, size) => sum + size.quantity, 0);

  const isOutOfStock = totalQuantity === 0;

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    navigate(`/products/${product.id}`);
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        opacity: isOutOfStock ? 0.5 : 1,
        pointerEvents: isOutOfStock ? 'none' : 'auto',
        position: 'relative',
        '&:hover': {
          transform: isOutOfStock ? 'none' : 'translateY(-4px)',
          boxShadow: isOutOfStock ? 'none' : '0 8px 16px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardActionArea
        onClick={handleClick}
        sx={{
          position: 'relative',
          pointerEvents: isOutOfStock ? 'none' : 'auto',
          '&:hover .slide-button': {
            transform: 'translate(-50%, -50%)',
            opacity: 1,
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            pointerEvents: 'auto',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            image={thumbnailUrl}
            alt={product.name}
            sx={{
              width: '100%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
            }}
          />
          {/* Discount badge */}
          {percentageValue && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                backgroundColor: 'red',
                color: 'white',
                px: 1,
                py: 0.5,
                fontSize: '12px',
                borderRadius: '4px',
                fontWeight: 'bold',
              }}
            >
              -{percentageValue}%
            </Box>
          )}
          {/* Hết hàng overlay */}
          {isOutOfStock && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                px: 2,
                py: 1,
                borderRadius: 1,
                fontWeight: 'bold',
                zIndex: 2,
              }}
            >
              Hết hàng
            </Box>
          )}

          {/* Overlay Button */}
          {!isMobile && (
            <Button
              size="small"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, 100%)',
                opacity: 0,
                backgroundColor: '#fff',
                color: 'black',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                textTransform: 'none',
                pointerEvents: 'none',
              }}
              className="slide-button"
            >
              Xem chi tiết
            </Button>
          )}
        </Box>
        <CardContent
          sx={{
            padding: 2,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              marginBottom: 1,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.name}
          </Typography>

          {/* Giá sản phẩm với khuyến mãi nếu có */}
          {percentageValue ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  textDecoration: 'line-through',
                  color: 'gray',
                }}
              >
                {formatPrice(sellingPrice)}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'red',
                }}
              >
                {formatPrice(finalPrice)}
              </Typography>
            </>
          ) : (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 400,
              }}
            >
              {formatPrice(sellingPrice)}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default Product;
