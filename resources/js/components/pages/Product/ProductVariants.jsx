import React from 'react';

export default function ProductVariants({
    hasVariants,
    options,
    variants,
    onToggleHasVariants,
    onOptionChange,
    onAddOption,
    onRemoveOption,
    onAddOptionValue,
    onOptionValueChange,
    onRemoveOptionValue,
    onGenerateVariants,
    onVariantChange,
}) {
    const [selectedLocation, setSelectedLocation] = React.useState('all');
    return (
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
                        Add options like size or color so customers can choose
                        which version of this product to buy.
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
                        onChange={onToggleHasVariants}
                    />
                    <span>This product has options, like size or color</span>
                </label>
            </div>

            {hasVariants && (
                <>
                    <div
                        style={{
                            borderTop: '1px solid #d2d5d8',
                            paddingTop: 12,
                            marginTop: 12,
                        }}
                    >
                        {options.map((option, index) => (
                            <div
                                key={option.id}
                                style={{
                                    borderBottom: '1px solid #e1e3e5',
                                    paddingBottom: 12,
                                    marginBottom: 12,
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: 12,
                                        alignItems: 'flex-start',
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
                                            value={option.name}
                                            onChange={(event) =>
                                                onOptionChange(
                                                    index,
                                                    'name',
                                                    event.target.value,
                                                )
                                            }
                                            style={{
                                                width: '100%',
                                                padding: '6px 8px',
                                                borderRadius: 4,
                                                border: '1px solid #c9cccf',
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
                                        {(Array.isArray(option.values)
                                            ? option.values
                                            : (option.values || '')
                                                .split(',')
                                                .map((value) =>
                                                    value.trim(),
                                                )
                                        ).map((value, valueIndex) => (
                                            <div
                                                key={valueIndex}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: 4,
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(event) =>
                                                        onOptionValueChange(
                                                            index,
                                                            valueIndex,
                                                            event.target
                                                                .value,
                                                        )
                                                    }
                                                    style={{
                                                        flex: 1,
                                                        padding:
                                                            '6px 8px',
                                                        borderRadius: 4,
                                                        border:
                                                            '1px solid #c9cccf',
                                                        fontSize: 13,
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onRemoveOptionValue(
                                                            index,
                                                            valueIndex,
                                                        )
                                                    }
                                                    style={{
                                                        marginLeft: 6,
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#5c5f62',
                                                        cursor: 'pointer',
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onAddOptionValue(index)
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
                                            Add another value
                                        </button>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginTop: 8,
                                    }}
                                >
                                    <div>
                                        {options.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onRemoveOption(index)
                                                }
                                                style={{
                                                    background: 'none',
                                                    border: '1px solid #e0b3b2',
                                                    color: '#bf0711',
                                                    fontSize: 13,
                                                    padding:
                                                        '4px 10px',
                                                    borderRadius: 4,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={onGenerateVariants}
                                        style={{
                                            backgroundColor: '#202223',
                                            color: '#ffffff',
                                            borderRadius: 4,
                                            border: '1px solid #202223',
                                            padding: '4px 14px',
                                            fontSize: 13,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={onAddOption}
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
                    </div>

                    {variants.length > 0 && (
                        <div
                            style={{
                                marginTop: 20,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 8,
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                    }}
                                >
                                    Variants
                                </div>
                                <select
                                    value={selectedLocation}
                                    onChange={(event) =>
                                        setSelectedLocation(
                                            event.target.value,
                                        )
                                    }
                                    style={{
                                        padding: '4px 28px 4px 8px',
                                        fontSize: 13,
                                        borderRadius: 4,
                                        border: '1px solid #c9cccf',
                                        backgroundColor: '#ffffff',
                                    }}
                                >
                                    <option value="all">All Locations</option>
                                </select>
                            </div>
                            <div
                                style={{
                                    overflowX: 'auto',
                                }}
                            >
                                <table
                                    style={{
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        fontSize: 13,
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '8px 6px',
                                                    borderBottom:
                                                        '1px solid #d2d5d8',
                                                }}
                                            >
                                                Variant
                                            </th>
                                            <th
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '8px 6px',
                                                    borderBottom:
                                                        '1px solid #d2d5d8',
                                                    width: 120,
                                                }}
                                            >
                                                Price
                                            </th>
                                            <th
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '8px 6px',
                                                    borderBottom:
                                                        '1px solid #d2d5d8',
                                                    width: 100,
                                                }}
                                            >
                                                Available
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variants.map((variant, index) => (
                                            <tr key={variant.key}>
                                                <td
                                                    style={{
                                                        padding: '8px 6px',
                                                        borderBottom:
                                                            '1px solid #ececec',
                                                    }}
                                                >
                                                    {variant.title}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: '8px 6px',
                                                        borderBottom:
                                                            '1px solid #ececec',
                                                    }}
                                                >
                                                    <input
                                                        type="text"
                                                        value={variant.price}
                                                        onChange={(event) =>
                                                            onVariantChange(
                                                                index,
                                                                'price',
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        style={{
                                                            width: '100%',
                                                            padding:
                                                                '4px 6px',
                                                            borderRadius: 4,
                                                            border: '1px solid #c9cccf',
                                                        }}
                                                    />
                                                </td>
                                                <td
                                                    style={{
                                                        padding: '8px 6px',
                                                        borderBottom:
                                                            '1px solid #ececec',
                                                    }}
                                                >
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={variant.quantity}
                                                        onChange={(event) =>
                                                            onVariantChange(
                                                                index,
                                                                'quantity',
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        style={{
                                                            width: '100%',
                                                            padding:
                                                                '4px 6px',
                                                            borderRadius: 4,
                                                            border: '1px solid #c9cccf',
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
