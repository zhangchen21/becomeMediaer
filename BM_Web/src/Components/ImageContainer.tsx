import React, { FC, useState } from 'react';

interface ImageContainer {
    product: string
}

const ImageContainer: FC<ImageContainer> = ({product}) => {
  // 定义一个函数，用来生成bing搜索的URL
  const getBingSearchURL = () => {
    return `https://www.bing.com/images/search?q=${product}`;
  };

  return (
    <div>
        {
           product &&
            <>
                <iframe src={getBingSearchURL()} width="100%" height="300" />             
            </>
        }
    </div>
  );
}

export default ImageContainer;