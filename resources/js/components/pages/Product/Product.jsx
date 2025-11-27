import React from 'react';
import { Page, Text } from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';

export default function Product() {
    const navigate = useNavigate();

    return (
        <Page
            title='Product Page'
        >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <s-button
                    variant="primary"
                    onClick={() => navigate('/product/add')}
                >
                    Add Product
                </s-button>
            </div>
        </Page>
    )
}