import { GetServerSideProps, GetStaticProps } from "next";
import { useRouter } from 'next/router';
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";
import { ImageContainer, ProductContainer, ProductDetails} from '../../styles/pages/product';

export default function Product() {
  const { query } = useRouter()

  return (
   <ProductContainer>
      <ImageContainer>

      </ImageContainer>
      <ProductDetails>
        <h1>Camiseta X</h1>
        <span>R$ 79,90</span>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores aliquid rerum exercitationem facere a molestiae ut sed velit non mollitia? Officiis hic velit assumenda aspernatur nihil, sint sed laboriosam tempora?</p>
        <button>Comprar Agora</button>
      </ProductDetails>
   </ProductContainer>
  )
}

export const getStaticProps: GetStaticProps<any, {id: string}> = async ({ params }) => {

  const productId = params.id;

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
      }
    },
    revalidate: 60 * 60 * 1, // 1hour
  }
}