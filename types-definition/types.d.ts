export type Product = {
    _id: string;
    name: string;
    slug: {
        current: string;
    };
    image: {
        asset: {
            _ref: string;
        };
    }[];
    price: number;
    details: string;
    quantity: number;
};

export type BannerData = {
    image: string;
    buttonText: string;
    product: string;
    desc: string;
    smallText: string;
    midText: string;
    largeText1: string;
    largeText2: string;
    discount: string;
    saleTime: string;
};

export interface IAppContext {
    showCart: boolean;
    cartItems: Product[];
    totalPrice: number;
    totalQuantities: number;
    currentQty: number;
    setShowCart: Dispatch<SetStateAction<boolean>>;
    incQty: () => void;
    decQty: () => void;
    onAddProduct: (product: Product, quantity: number) => void;
    toggleCartItemQuantity: (id: string, op: string) => void;
    onRemove: (product: Product) => void;
    setCartItems: (items: Product[]) => void;
    setTotalPrice: (n: number) => void;
    setTotalQuantities: (n: number) => void;
}