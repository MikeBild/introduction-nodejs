declare interface Product {
    price: number;
    id: string;
}
declare interface Store {
    billings: any;
    consumers: Array<any>;
    products: Array<Product>;
}
export declare function calculate(store: Store): any;
export {};
//# sourceMappingURL=billing-report.d.ts.map