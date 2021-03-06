import Cookies from 'js-cookie';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProductInfo from '../components/ProductInfo';
import { getChocolates } from '../util/database';
import { Chocolate, Order } from '../util/types';

type Props = {
  chocolates: Chocolate[];
  orderArr: Order[];
  orderQuantity: number;
};

export default function Checkout(props: Props) {
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (orderPlaced === true) {
      Cookies.remove('order');
      setOrderPlaced(false);
    }
  }, [orderPlaced]);

  let totalAmount = 0;

  return (
    <>
      <Head>
        <title>Checkout | Chocolate Heaven</title>
      </Head>

      <Layout orderQuantity={props.orderQuantity}>
        <h1 className="text-4xl ml-10 mt-10 h-5 w-full">Checkout</h1>

        <form className="w-full my-10 ml-10 mr-60 flex flex-wrap justify-between">
          <div>
            <h2 className="text-3xl my-8">Shipping Information</h2>

            <label htmlFor="firstName">First Name</label>
            <br />
            <input
              id="firstName"
              type="text"
              className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
            />
            <br />

            <label htmlFor="lastName">Last Name</label>
            <br />
            <input
              id="lastName"
              type="text"
              className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
            />
            <br />

            <label htmlFor="address">Address</label>
            <br />
            <input
              id="address"
              type="text"
              className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
            />
            <br />

            <label htmlFor="city">City</label>
            <br />
            <input
              id="city"
              type="text"
              className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
            />
            <br />

            <label htmlFor="zip">ZIP Code</label>
            <br />
            <input
              id="zip"
              type="text"
              className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
            />
          </div>

          <div>
            <h2 className="text-3xl my-8">Contact information</h2>

            <label htmlFor="email">Email Address</label>
            <br />
            <input
              id="email"
              type="email"
              className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
            />
            <br />

            <label htmlFor="phone">Phone Number</label>
            <br />
            <input
              id="phone"
              type="tel"
              className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
            />
          </div>

          <div>
            <h2 className="text-3xl my-8">Payment information</h2>

            <label htmlFor="card">Credit Card Number</label>
            <br />
            <input
              id="card"
              type="text"
              className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
            />
            <br />

            <label htmlFor="date">Expiration Date</label>
            <br />
            <input
              id="date"
              type="month"
              className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
            />
            <br />

            <label htmlFor="security">Security Code</label>
            <br />
            <input
              id="security"
              type="text"
              className="w-96 mt-2 block rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-30"
            />
          </div>
        </form>

        <div className="w-full m-10 flex flex-wrap justify-evenly">
          <h2 className="text-3xl my-8 w-full">Order Summary</h2>
          {props.chocolates.map((chocolate: Chocolate) => {
            return props.orderArr.map((singleOrder: Order) => {
              let element;

              if (chocolate.id === singleOrder.id) {
                const amount =
                  Number(chocolate.price.split(',').join('.')) *
                  singleOrder.quantity;
                totalAmount += amount;

                element = (
                  <div key={chocolate.id} className="flex items-center">
                    <ProductInfo
                      id={chocolate.id}
                      src={chocolate.imgPath}
                      alt={chocolate.name}
                      width={200}
                      height={200}
                    />

                    <div>
                      <p className="font-semibold mb-6">{chocolate.name}</p>
                      <div className="flex">
                        <div className="mr-20">
                          <p className="font-semibold">Price</p>
                          <p>{chocolate.price} €</p>
                        </div>

                        <div className="mr-20">
                          <p className="font-semibold">Quantity</p>
                          <p>{singleOrder.quantity}</p>
                        </div>

                        <div className="mr-20">
                          <p className="font-semibold">Amount</p>
                          <p>
                            {amount.toFixed(2).toString().split('.').join(',')}{' '}
                            €
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return element;
            });
          })}
        </div>

        <div className="mx-10 mt-10 mb-24 w-full">
          <p className="font-semibold">Total Amount</p>
          <p className="mb-10">
            {totalAmount.toFixed(2).toString().split('.').join(',')} €
          </p>

          <Link href="/confirmation">
            <button
              className="bg-tertiary rounded-lg font-medium px-4 py-1.5 mr-20 w-52"
              onClick={() => setOrderPlaced(true)}
            >
              Place order
            </button>
          </Link>

          <Link href="/cart">
            <button className="bg-tertiary rounded-lg font-medium px-4 py-1.5 w-52">
              Back to cart
            </button>
          </Link>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chocolates = await getChocolates();

  const order = context.req.cookies.order;
  const orderArr = order ? JSON.parse(order) : [];

  const orderQuantity = orderArr.reduce(
    (acc: number, val: Order) => acc + val.quantity,
    0,
  );

  return {
    props: {
      chocolates: chocolates,
      orderArr: orderArr,
      orderQuantity: orderQuantity,
    },
  };
}
