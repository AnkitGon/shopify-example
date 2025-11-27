import React from "react";
import {
    Routes, Route
} from "react-router-dom";

import Home from "../pages/Home/Home";
import Product from "../pages/Product/Product";
import ProductAdd from "../pages/Product/ProductAdd";

export default function RoutePath() {

    return (
        <>
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route path='/product' element={<Product />} />
                <Route path='/product/add' element={<ProductAdd />} />
            </Routes>
        </>
    )
}
