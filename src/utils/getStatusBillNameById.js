export const getStatusNameById = (id) => {
  switch (id) {
    case 0:
      return "Chờ phê duyệt";
    case 1:
      return "Đơn hoàn thành";
    case 2:
      return "Chuẩn bị hàng";
    case 3:
      return "Vận chuyển";
    case 4:
      return "Chờ giao hàng";
    case 5:
      return "Hoàn thành";
    case 6:
      return "Đơn hàng hủy";
    default:
      return "Không xác định";
  }
};