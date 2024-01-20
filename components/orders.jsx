import styles from '../styles/orders.module.css'
import { useRouter } from 'next/router';
import redirectWithQuery from '../functions/redirect';
import { useOrder } from '../context/orderContext';

const Orders = () => {

  const {addQuantity, setQuantity, quantity, total, getTotal, orders, setOrders} = useOrder();

const router = useRouter()

const handleDelete = (order, i) => {
  filterLocalOrders(i)
  getTotal();
  updateQuantity(order);
}
const handleEdit = async (order, i) => {
  filterLocalOrders(i)
  updateQuantity(order.quantity);
  await redirectWithQuery(`/product/${order.product._id}`, router)
}
const updateQuantity = (order) => {
  const newQuantity = parseInt(quantity) - parseInt(order.quantity);
  setQuantity(newQuantity);
  localStorage.setItem("quantity", `${newQuantity}`);
}
const filterLocalOrders = (i) => {
  const newOrders = orders.filter((_, index) => index !== i)
  setOrders(newOrders)
  localStorage.setItem("Orders", JSON.stringify(newOrders))
}

// ** Makes lStorage "Orders" empty array, updates redux and state
const handleClear = () => {
  localStorage.setItem("Orders", "[]");
  setOrders([]);
  addQuantity(0);
  getTotal();
}
const cartSections = ["Name", "Fries", "Extras", "Quant", "Note", "Price", "Action"];

  return (
    <>
      <h1 className={styles.title}> <br/>Cart </h1>
      <div className={styles.container}>
        <div className={styles.hdr_container}>
            {cartSections.map((section) => 
            <h2 className={styles.hdr} key={section}>{section}</h2>
            )}
        </div>

        {orders.map((order, i) => 
          <div key={i} className={styles.order_container}>
            <div className={styles.items_container}>
                <p className={styles.text}>{order.product.title}</p>
                <p className={styles.text}>{order.fries === false ? 'Yes' : 'No'}</p>
                <div className={styles.extras_container}>
                  <ul className={styles.extraOptions}>
                  {order.extraOptions.map((option) => 
                  <li key={option._id}className={styles.text}>{option.title}</li>
                  )}
                  </ul>
                  <ul className={styles.extraUpgrades}>
                  {order.extraUpgrades.map((upgrade) => 
                  <li key={upgrade._id} className={styles.text}>{upgrade.title}</li>
                  )}</ul>
                </div>
                <p className={styles.text}>{order.quantity}</p>
                <p className={styles.note}>{order.note?.slice(0, 20)}..</p>
                <p className={styles.text}>{(order.price * order.quantity).toLocaleString("en-US", {style: "currency", currency: "GBP"})}</p>
            </div>
          <div className={styles.btn_container}>
            <button className={styles.btn_edit} onClick={() => handleEdit(order, i)}>Edit</button>
            <button className={styles.btn_delete} onClick={() => handleDelete(order, i)}>Del</button>
          </div>
          </div>
        )}
          <button className={styles.btn_clear} onClick={() => handleClear()}>Clear Basket</button>
          <h3 className={styles.total}>Cart total: {total.toLocaleString("en-US", {style: "currency", currency: "GBP"})}</h3>
      </div>
    </>
  )
}

export default Orders