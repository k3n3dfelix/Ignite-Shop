import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from 'next/router';
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";
import { ImageContainer, ProductContainer, ProductDetails} from '../../styles/pages/product';
import Image from "next/image";
import axios from "axios";
import { useState } from "react";

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    defaultPriceId: string;
  }
}

export default function Product({product}: ProductProps) {
  const { isFallback } = useRouter()
  const [isCreatingCheckoutSession, setisCreatingCheckoutSession] = useState(false);
  //const router = useRouter();

  if(isFallback){
    return <p>Loading...</p>
  }

  async function handleBuyProduct() {
   try {

    setisCreatingCheckoutSession(true);
      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })
      //Redirecnionar dentro da aplicação
      //router.push('/checkout');

      const { checkoutUrl } = response.data;
      window.location.href = checkoutUrl;
    }catch(error){
      //Conectar com uma ferramente de observabilidade (Dtadog / Sentry)
      setisCreatingCheckoutSession(false);
      alert('Falha ao redirecionar ao checkout!')
    }finally{

    }
  }
  return (
    <>
    <Head>
      <title>{product.name} | Ignite Shop</title>
    </Head>

   <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt=""/>
      </ImageContainer>
      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>
        <p>{product.description}</p>
        <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>Comprar Agora</button>
      </ProductDetails>
   </ProductContainer>
   </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  //Buscar os produtos mais vendidos / mais acessados

  return {
    paths: [
      { params: {id: 'prod_NOlRizaHia1Gfk'}}
    ],
    fallback: true,
    //fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<any, {id: string}> = async ({ params }) => {

  const productId = params!.id;

  const product = await stripe.products.retrieve(productId, {
    expand:  ['default_price'],
  });

  const price = product.default_price as Stripe.Price;


  return  {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price.unit_amount! / 100),
        description: product.description,
        defaultPriceId: price.id,
      }
    },
    revalidate: 60 * 60 * 1, // 1hour
  }
}