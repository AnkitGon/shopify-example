
import React from 'react'
import { NavigationMenu } from '@shopify/app-bridge-react';

function Tabs() {

    return (
        <>
            <NavigationMenu
                navigationLinks={[
                    {
                        label: 'Home',
                        destination: '/',
                    },
                    {
                        label: 'Product',
                        destination: '/product',
                    }
                ]}
            />
        </>
    )
}

export default Tabs