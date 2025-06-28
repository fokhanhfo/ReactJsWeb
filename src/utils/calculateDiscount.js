import { discountStatus } from "enum/discountStatus";

export const calculateDiscount = (product,productDiscountPeriods) => {
    const sellingPrice = product.sellingPrice;
    const now = new Date();
  const validDiscounts = productDiscountPeriods?.filter((item) => {
    const startTime = new Date(item.discountPeriod?.startTime);
    const endTime = new Date(item.discountPeriod?.endTime);
    return startTime <= now && endTime >= now && item.discountPeriod?.status === discountStatus.HOATDONG;
  });

  const maxValidDiscount = validDiscounts?.reduce((max, current) => {
    return current.percentageValue > (max?.percentageValue ?? 0) ? current : max;
  }, null);

  const percentageValue = maxValidDiscount?.percentageValue;
  const finalPrice = percentageValue ? sellingPrice * (1 - percentageValue / 100) : sellingPrice;

  return { percentageValue, finalPrice };
};

// const discount = product.productDiscountPeriods?.reduce((max, current) => {
//                   return current.percentageValue > (max?.percentageValue ?? 0) ? current : max;
//                 }, null);

//                 const percentageValue = discount?.percentageValue;

//                 const finalPrice = percentageValue ? sellingPrice * (1 - percentageValue / 100) : sellingPrice;