import {Shipping, Billing } from './woo.shared.interface';

export interface MetaData {
    id: number;
    key: string;
    value: string;
}

export interface Tax {
    id: number;
    total: string;
    subtotal: string;
}

export interface LineItem {
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    taxes: Tax[];
    meta_data: any[];
    sku: string;
    price: number;
    // These are virtuals that are making it easier for me to build a grid with all the details I want
    permalink?: string;
    image_url: string;
}

export interface TaxLine {
    id: number;
    rate_code: string;
    rate_id: number;
    label: string;
    compound: boolean;
    tax_total: string;
    shipping_tax_total: string;
    meta_data: any[];
}

export interface ShippingLine {
    id: number;
    method_title: string;
    method_id: string;
    total: string;
    total_tax: string;
    taxes: Tax[];
    meta_data: MetaData[];
}


export interface Order {
    id: number;
    parent_id: number;
    number: string;
    order_key: string;
    created_via: string;
    version: string;
    status: string;
    currency: string;
    date_created: Date;
    date_created_gmt: Date;
    date_modified: Date;
    date_modified_gmt: Date;
    discount_total: string;
    discount_tax: string;
    shipping_total: string;
    shipping_tax: string;
    cart_tax: string;
    total: string;
    total_tax: string;
    prices_include_tax: boolean;
    customer_id: number;
    customer_ip_address: string;
    customer_user_agent: string;
    customer_note: string;
    billing: Billing;
    shipping: Shipping;
    payment_method: string;
    payment_method_title: string;
    transaction_id: string;
    date_paid: Date;
    date_paid_gmt: Date;
    date_completed?: any;
    date_completed_gmt?: any;
    cart_hash: string;
    meta_data: MetaData[];
    line_items: LineItem[];
    tax_lines: TaxLine[];
    shipping_lines: ShippingLine[];
    fee_lines: any[];
    coupon_lines: any[];
    refunds: any[];
}