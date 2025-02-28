import { MdShoppingCart } from 'react-icons/md'

export const orderStructure = (S) =>
    S.listItem()
        .title('Orders')
        .icon(MdShoppingCart)
        .child(
            S.list()
                .title('Order Status')
                .items([
                    S.listItem()
                        .title('All Orders')
                        .child(
                            S.documentList()
                                .title('All Orders')
                                .filter('_type == "order"')
                                .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                        ),
                    S.listItem()
                        .title('Pending Orders')
                        .child(
                            S.documentList()
                                .title('Pending Orders')
                                .filter('_type == "order" && status == "pending"')
                                .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                        ),
                    S.listItem()
                        .title('Processing Orders')
                        .child(
                            S.documentList()
                                .title('Processing Orders')
                                .filter('_type == "order" && status == "processing"')
                                .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                        ),
                    S.listItem()
                        .title('Shipped Orders')
                        .child(
                            S.documentList()
                                .title('Shipped Orders')
                                .filter('_type == "order" && status == "shipped"')
                                .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                        ),
                    S.listItem()
                        .title('Delivered Orders')
                        .child(
                            S.documentList()
                                .title('Delivered Orders')
                                .filter('_type == "order" && status == "delivered"')
                                .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                        ),
                    S.listItem()
                        .title('Cancelled Orders')
                        .child(
                            S.documentList()
                                .title('Cancelled Orders')
                                .filter('_type == "order" && status == "cancelled"')
                                .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                        )
                ])
        )