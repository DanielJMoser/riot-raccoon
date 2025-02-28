import { orderStructure } from '../structure/orderView'

export default (S) =>
    S.list()
        .title('Content')
        .items([
            // Add your other list items here
            orderStructure(S),
            // List out the rest of your document types
            ...S.documentTypeListItems()
                .filter(listItem => !['order', 'transaction'].includes(listItem.getId()))
        ])