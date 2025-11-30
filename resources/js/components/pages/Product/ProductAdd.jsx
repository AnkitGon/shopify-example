import React, { useEffect, useState } from 'react';
import { Page } from '@shopify/polaris';
import ProductVariants from './ProductVariants';
import instance from '../../shopify/instance';

export default function ProductAdd() {
    const [hasVariants, setHasVariants] = React.useState(false);
    const [options, setOptions] = React.useState([
        { id: 1, name: '', values: [''] },
    ]);
    const [variants, setVariants] = React.useState([]);
    const [storeLocations, setStoreLocations] = useState([]);
    const apiKey = import.meta.env.VITE_APP_URL;
    
    useEffect(() => {
        instance.get(`${apiKey}/api/locations`)
            .then(res => res.json())
            .then(data => {
                setStoreLocations(data);
            })
            .catch(err => {
                console.error("API error:", err);
            });
    }, []);
    
    const handleToggleHasVariants = (event) => {
        const checked = event.target.checked;
        setHasVariants(checked);
        if (!checked) {
            setVariants([]);
        }
    };

    const handleOptionChange = (index, field, value) => {
        setOptions((prevOptions) => {
            const updated = [...prevOptions];
            updated[index] = {
                ...updated[index],
                [field]: value,
            };
            return updated;
        });
    };

    const handleAddOption = () => {
        setOptions((prevOptions) => {
            const nextId =
                prevOptions.reduce((maxId, option) => {
                    return option.id > maxId ? option.id : maxId;
                }, 0) + 1;

            return [
                ...prevOptions,
                { id: nextId, name: '', values: [''] },
            ];
        });
    };

    const handleAddOptionValue = (optionIndex) => {
        setOptions((prevOptions) => {
            const updated = [...prevOptions];
            const target = updated[optionIndex];
            const currentValues = Array.isArray(target.values)
                ? [...target.values]
                : (target.values || '')
                    .split(',')
                    .map((value) => value.trim());

            currentValues.push('');

            updated[optionIndex] = {
                ...target,
                values: currentValues,
            };

            return updated;
        });
    };

    const handleOptionValueChange = (
        optionIndex,
        valueIndex,
        value,
    ) => {
        setOptions((prevOptions) => {
            const updated = [...prevOptions];
            const target = updated[optionIndex];
            const currentValues = Array.isArray(target.values)
                ? [...target.values]
                : (target.values || '')
                    .split(',')
                    .map((item) => item.trim());

            currentValues[valueIndex] = value;

            updated[optionIndex] = {
                ...target,
                values: currentValues,
            };

            return updated;
        });
    };

    const handleRemoveOptionValue = (optionIndex, valueIndex) => {
        setOptions((prevOptions) => {
            const updated = [...prevOptions];
            const target = updated[optionIndex];
            const currentValues = Array.isArray(target.values)
                ? [...target.values]
                : (target.values || '')
                    .split(',')
                    .map((item) => item.trim());

            const nextValues = currentValues.filter(
                (_, index) => index !== valueIndex,
            );

            updated[optionIndex] = {
                ...target,
                values: nextValues,
            };

            return updated;
        });
    };

    const handleRemoveOption = (indexToRemove) => {
        setOptions((prevOptions) => {
            if (prevOptions.length <= 1) {
                return prevOptions;
            }

            return prevOptions.filter((_, index) => index !== indexToRemove);
        });
    };

    const handleGenerateVariants = () => {
        const normalizedOptions = options
            .map((option) => {
                const name = (option.name || '').trim();
                const rawValues = Array.isArray(option.values)
                    ? option.values
                    : (option.values || '')
                        .split(',');
                const values = rawValues
                    .map((value) => (value || '').trim())
                    .filter(Boolean);

                return {
                    name,
                    values,
                };
            })
            .filter(
                (option) =>
                    option.name && option.values.length > 0,
            );

        if (normalizedOptions.length === 0) {
            setVariants([]);
            return;
        }

        const groupedOptions = normalizedOptions.reduce(
            (accumulator, option) => {
                const existingIndex = accumulator.findIndex(
                    (group) =>
                        group.name.toLowerCase() ===
                        option.name.toLowerCase(),
                );

                if (existingIndex === -1) {
                    accumulator.push({
                        name: option.name,
                        values: [...option.values],
                    });
                } else {
                    const existing = accumulator[existingIndex];
                    const mergedValues = [
                        ...existing.values,
                        ...option.values,
                    ];

                    existing.values = Array.from(
                        new Set(mergedValues),
                    );
                }

                return accumulator;
            },
            [],
        );

        if (groupedOptions.length === 0) {
            setVariants([]);
            return;
        }

        const valueArrays = groupedOptions.map(
            (option) => option.values,
        );

        const cartesian = (arrays) => {
            if (arrays.length === 0) {
                return [];
            }

            return arrays.reduce(
                (accumulator, currentArray) => {
                    if (accumulator.length === 0) {
                        return currentArray.map((value) => [value]);
                    }

                    const result = [];

                    accumulator.forEach((previousCombo) => {
                        currentArray.forEach((value) => {
                            result.push([
                                ...previousCombo,
                                value,
                            ]);
                        });
                    });

                    return result;
                },
                [],
            );
        };

        const combinations = cartesian(valueArrays);

        const previousByKey = variants.reduce(
            (map, variant) => {
                if (variant.key) {
                    map[variant.key] = variant;
                }

                return map;
            },
            {},
        );

        const nextVariants = combinations.map(
            (values) => {
                const title = values.join(' / ');

                const key = values
                    .map((value, index) => {
                        const optionName =
                            groupedOptions[index].name;

                        return `${optionName}:${value}`;
                    })
                    .join('|');

                const existing = previousByKey[key];

                if (existing) {
                    return existing;
                }

                return {
                    key,
                    title,
                    price: '',
                    sku: '',
                    barcode: '',
                    quantity: '',
                };
            },
        );

        setVariants(nextVariants);
    };

    const handleVariantChange = (index, field, value) => {
        setVariants((prevVariants) => {
            const updated = [...prevVariants];

            updated[index] = {
                ...updated[index],
                [field]: value,
            };

            return updated;
        });
    };

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
                    <s-money-field
                        label="Price"
                        placeholder="99.99"
                    />
                </s-section>

                <s-section>
                    <ProductVariants
                        hasVariants={hasVariants}
                        options={options}
                        variants={variants}
                        onToggleHasVariants={handleToggleHasVariants}
                        onOptionChange={handleOptionChange}
                        onAddOption={handleAddOption}
                        onRemoveOption={handleRemoveOption}
                        onAddOptionValue={handleAddOptionValue}
                        onOptionValueChange={handleOptionValueChange}
                        onRemoveOptionValue={handleRemoveOptionValue}
                        onGenerateVariants={handleGenerateVariants}
                        onVariantChange={handleVariantChange}
                    />
                    {false && (
                        <div
                            style={{
                                border: '1px solid #d2d5d8',
                                borderRadius: 4,
                                padding: 16,
                                marginTop: 16,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 12,
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontWeight: 600,
                                            fontSize: 14,
                                        }}
                                    >
                                        Variants
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 13,
                                            color: '#6d7175',
                                            marginTop: 4,
                                        }}
                                    >
                                        Add options like size or color so
                                        customers can choose which version
                                        of this product to buy.
                                    </div>
                                </div>
                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        gap: 8,
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={hasVariants}
                                        onChange={handleToggleHasVariants}
                                    />
                                    <span>
                                        This product has options, like
                                        size or color
                                    </span>
                                </label>
                            </div>

                            {hasVariants && (
                                <>
                                    <div
                                        style={{
                                            borderTop:
                                                '1px solid #d2d5d8',
                                            paddingTop: 12,
                                            marginTop: 12,
                                        }}
                                    >
                                        {options.map(
                                            (option, index) => (
                                                <div
                                                    key={option.id}
                                                    style={{
                                                        display: 'flex',
                                                        gap: 12,
                                                        marginBottom: 12,
                                                        alignItems:
                                                            'flex-start',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize: 13,
                                                                fontWeight: 500,
                                                                marginBottom: 4,
                                                            }}
                                                        >
                                                            Option name
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Size"
                                                            value={
                                                                option.name
                                                            }
                                                            onChange={(
                                                                event,
                                                            ) =>
                                                                handleOptionChange(
                                                                    index,
                                                                    'name',
                                                                    event
                                                                        .target
                                                                        .value,
                                                                )
                                                            }
                                                            style={{
                                                                width: '100%',
                                                                padding:
                                                                    '6px 8px',
                                                                borderRadius: 4,
                                                                border:
                                                                    '1px solid #c9cccf',
                                                                fontSize: 13,
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: 2,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize: 13,
                                                                fontWeight: 500,
                                                                marginBottom: 4,
                                                            }}
                                                        >
                                                            Option values
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Separate options with commas"
                                                            value={
                                                                option.values
                                                            }
                                                            onChange={(
                                                                event,
                                                            ) =>
                                                                handleOptionChange(
                                                                    index,
                                                                    'values',
                                                                    event
                                                                        .target
                                                                        .value,
                                                                )
                                                            }
                                                            style={{
                                                                width: '100%',
                                                                padding:
                                                                    '6px 8px',
                                                                borderRadius: 4,
                                                                border:
                                                                    '1px solid #c9cccf',
                                                                fontSize: 13,
                                                            }}
                                                        />
                                                        <div
                                                            style={{
                                                                fontSize: 12,
                                                                color:
                                                                    '#6d7175',
                                                                marginTop: 4,
                                                            }}
                                                        >
                                                            Separate options
                                                            with commas.
                                                        </div>
                                                    </div>
                                                    {options.length >
                                                        1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveOption(
                                                                        index,
                                                                    )
                                                                }
                                                                style={{
                                                                    marginTop: 22,
                                                                    background:
                                                                        'none',
                                                                    border: 'none',
                                                                    color:
                                                                        '#bf0711',
                                                                    fontSize: 13,
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                </div>
                                            ),
                                        )}

                                        {options.length < 3 && (
                                            <button
                                                type="button"
                                                onClick={
                                                    handleAddOption
                                                }
                                                style={{
                                                    marginTop: 4,
                                                    fontSize: 13,
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#2c6ecb',
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                }}
                                            >
                                                Add another option
                                            </button>
                                        )}

                                        <div
                                            style={{
                                                marginTop: 12,
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={
                                                    handleGenerateVariants
                                                }
                                                style={{
                                                    padding:
                                                        '6px 12px',
                                                    borderRadius: 4,
                                                    border:
                                                        '1px solid #c9cccf',
                                                    backgroundColor:
                                                        '#f6f6f7',
                                                    fontSize: 13,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Generate variants
                                            </button>
                                        </div>
                                    </div>

                                    {variants.length > 0 && (
                                        <div
                                            style={{
                                                marginTop: 20,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontWeight: 500,
                                                    marginBottom: 8,
                                                    fontSize: 14,
                                                }}
                                            >
                                                Variants
                                            </div>
                                            <div
                                                style={{
                                                    overflowX:
                                                        'auto',
                                                }}
                                            >
                                                <table
                                                    style={{
                                                        width: '100%',
                                                        borderCollapse:
                                                            'collapse',
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                style={{
                                                                    textAlign:
                                                                        'left',
                                                                    padding:
                                                                        '8px 6px',
                                                                    borderBottom:
                                                                        '1px solid #d2d5d8',
                                                                }}
                                                            >
                                                                Variant
                                                            </th>
                                                            <th
                                                                style={{
                                                                    textAlign:
                                                                        'left',
                                                                    padding:
                                                                        '8px 6px',
                                                                    borderBottom:
                                                                        '1px solid #d2d5d8',
                                                                    width: 120,
                                                                }}
                                                            >
                                                                Price
                                                            </th>
                                                            <th
                                                                style={{
                                                                    textAlign:
                                                                        'left',
                                                                    padding:
                                                                        '8px 6px',
                                                                    borderBottom:
                                                                        '1px solid #d2d5d8',
                                                                    width: 140,
                                                                }}
                                                            >
                                                                SKU
                                                            </th>
                                                            <th
                                                                style={{
                                                                    textAlign:
                                                                        'left',
                                                                    padding:
                                                                        '8px 6px',
                                                                    borderBottom:
                                                                        '1px solid #d2d5d8',
                                                                    width: 140,
                                                                }}
                                                            >
                                                                Barcode
                                                            </th>
                                                            <th
                                                                style={{
                                                                    textAlign:
                                                                        'left',
                                                                    padding:
                                                                        '8px 6px',
                                                                    borderBottom:
                                                                        '1px solid #d2d5d8',
                                                                    width: 100,
                                                                }}
                                                            >
                                                                Quantity
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {variants.map(
                                                            (
                                                                variant,
                                                                index,
                                                            ) => (
                                                                <tr
                                                                    key={
                                                                        variant.key
                                                                    }
                                                                >
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                '8px 6px',
                                                                            borderBottom:
                                                                                '1px solid #ececec',
                                                                        }}
                                                                    >
                                                                        {
                                                                            variant.title
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                '8px 6px',
                                                                            borderBottom:
                                                                                '1px solid #ececec',
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                variant.price
                                                                            }
                                                                            onChange={(
                                                                                event,
                                                                            ) =>
                                                                                handleVariantChange(
                                                                                    index,
                                                                                    'price',
                                                                                    event
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                            style={{
                                                                                width: '100%',
                                                                                padding:
                                                                                    '4px 6px',
                                                                                borderRadius: 4,
                                                                                border:
                                                                                    '1px solid #c9cccf',
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                '8px 6px',
                                                                            borderBottom:
                                                                                '1px solid #ececec',
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                variant.sku
                                                                            }
                                                                            onChange={(
                                                                                event,
                                                                            ) =>
                                                                                handleVariantChange(
                                                                                    index,
                                                                                    'sku',
                                                                                    event
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                            style={{
                                                                                width: '100%',
                                                                                padding:
                                                                                    '4px 6px',
                                                                                borderRadius: 4,
                                                                                border:
                                                                                    '1px solid #c9cccf',
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                '8px 6px',
                                                                            borderBottom:
                                                                                '1px solid #ececec',
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                variant.barcode
                                                                            }
                                                                            onChange={(
                                                                                event,
                                                                            ) =>
                                                                                handleVariantChange(
                                                                                    index,
                                                                                    'barcode',
                                                                                    event
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                            style={{
                                                                                width: '100%',
                                                                                padding:
                                                                                    '4px 6px',
                                                                                borderRadius: 4,
                                                                                border:
                                                                                    '1px solid #c9cccf',
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                '8px 6px',
                                                                            borderBottom:
                                                                                '1px solid #ececec',
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            value={
                                                                                variant.quantity
                                                                            }
                                                                            onChange={(
                                                                                event,
                                                                            ) =>
                                                                                handleVariantChange(
                                                                                    index,
                                                                                    'quantity',
                                                                                    event
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                            style={{
                                                                                width: '100%',
                                                                                padding:
                                                                                    '4px 6px',
                                                                                borderRadius: 4,
                                                                                border:
                                                                                    '1px solid #c9cccf',
                                                                            }}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </s-section>
            </s-page>
        </>
    );
}
