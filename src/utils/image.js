export const imageMainColor = (productDetail) => {
    return productDetail?.image.find((item)=>item.mainColor === true)
};

export const imageMainProduct = (data) => {
  console.log(data);
    const mainProductImages = data
  .flatMap(item => item.image)
  .filter(img => img.mainProduct === true)[0];
    return mainProductImages
};
