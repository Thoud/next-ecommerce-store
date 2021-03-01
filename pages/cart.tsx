import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import { getChocolates } from '../util/database';
import { Chocolate, Order } from '../util/types';

type Props = {
  chocolates: Chocolate[];
  orderArr: Order[];
};

export default function Cart(props: Props) {
  let totalAmount = 0;

  return (
    <>
      <Head>
        <title>Shopping Cart | Chocolate Heaven</title>
      </Head>

      <Layout>
        <h1>Cart</h1>
        {props.chocolates.map((chocolate: Chocolate) => {
          return props.orderArr.map((order: Order) => {
            let element;

            if (chocolate.id === order.id) {
              const amount = chocolate.price * order.quantity;
              totalAmount += amount;

              element = (
                <div key={chocolate.id}>
                  <Image
                    src={chocolate.imgPath}
                    alt={chocolate.name}
                    width={200}
                    height={200}
                  />
                  <p>{chocolate.name}</p>
                  <p>Quantity: {order.quantity}</p>
                  <p>Price: {chocolate.price} €</p>
                  <p>Amount: {amount.toFixed(2)} €</p>
                </div>
              );
            }

            return element;
          });
        })}
        <p>Total Amount: {totalAmount.toFixed(2)} €</p>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chocolates = await getChocolates();

  const order = context.req.cookies.order;
  const orderArr = order ? JSON.parse(order) : [];

  return {
    props: {
      chocolates: chocolates,
      orderArr: orderArr,
    },
  };
}
