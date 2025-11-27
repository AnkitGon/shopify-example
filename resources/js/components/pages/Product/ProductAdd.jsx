import React from 'react';
import { Page } from '@shopify/polaris';

export default function ProductAdd() {
    return (
        <>
            <Page title="Add Product">
            </Page>
            <s-page heading="Add Product" >
                <s-section>
                    <s-text-field
                        label="Title"
                        placeholder="Enter product name"
                    />
                    <s-text-area
                        label="Description"
                        placeholder="Enter product description"
                        rows={3}
                    />
                    <s-drop-zone
                        label="Media"
                        accessibilityLabel="Upload image of type jpg, png, or gif"
                        accept=".jpg,.png,.gif"
                        multiple  
                    />
                </s-section>
            </s-page>
        </>

    );
}
