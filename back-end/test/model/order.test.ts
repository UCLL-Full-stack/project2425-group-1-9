import { Order } from "../../model/order"
import { set } from 'date-fns';

const date = set(new Date(), { hours: 15, minutes: 30, seconds: 20, milliseconds: 200 })
const cartId = 2 // Q& since cartId can be optional and undefined, do we use it create tests?

test("Given valid values; When creating order; Then order is created with those values.", () => {
     // GIVEN
     // Values at the top of this file.

     // WHEN
     const order = new Order({ date, cartId })

     // THEN
     expect(order.getDate()).toEqual(date) // use toEqual for date validation
     expect(order.getCartId()).toBe(cartId)
})