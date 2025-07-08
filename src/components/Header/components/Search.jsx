import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

const scroll = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

function Search() {
  return (
    <Box
      sx={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        backgroundColor: '#000', // nền đen
        py: 0.5, // padding nhỏ lại
        height: '28px', // đảm bảo chiều cao gọn
      }}
    >
      <Typography
        sx={{
          display: 'inline-block',
          animation: `${scroll} 25s linear infinite`,
          fontSize: 13,
          color: '#fff', // chữ trắng
        }}
      >
        Khám phá những sản phẩm thời trang cao cấp được tuyển chọn kỹ lưỡng! &nbsp;&nbsp;&nbsp; Hotline hỗ trợ:
        0977.477.636 - Mua sắm an toàn cùng chúng tôi!
      </Typography>
    </Box>
  );
}

export default Search;
