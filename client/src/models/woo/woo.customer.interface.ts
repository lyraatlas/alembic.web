import {Shipping, Billing } from './woo.shared.interface';

export interface Customer {
    id: number;
    date_created: Date;
    date_created_gmt: Date;
    date_modified: Date;
    date_modified_gmt: Date;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    username: string;
    billing: Billing;
    shipping: Shipping;
    is_paying_customer: boolean;
    orders_count: number;
    total_spent: string;
    avatar_url: string;
}
