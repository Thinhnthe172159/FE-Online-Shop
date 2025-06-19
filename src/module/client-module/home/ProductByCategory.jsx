import React from 'react';
import { useParams } from 'react-router-dom';
import './ProductByCategory.scss';
import Product from '../product/Product';
import { useQuery } from '@tanstack/react-query';
import { getProductByCategory } from '../../../api/CategoryApi';
import Loading from '../loading/Loading';

const ProductByCategory = () => {
    const { categoryId } = useParams();
    const { data, isLoading } = useQuery({
        queryKey: ["ct"],
        queryFn: () => getProductByCategory(categoryId)
    });

    if (isLoading) {
        return <Loading />;
    }

    return <Product products={data} isLoading={isLoading} />;
};

export default ProductByCategory;
