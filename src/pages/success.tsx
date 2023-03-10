import { ImageContainer, SuccessContainer } from "@/styles/pages/success";
import Link from "next/link";

export default function Product() {
  return (
    <SuccessContainer>
      <h1>Compra efetuada!</h1>

      <ImageContainer></ImageContainer>
      <p>Uhull <strong>Kened Felix</strong>, sua <strong>camiseta Beyond the Limits</strong> já esta a caminho.</p>

      <Link href="/">
        Voltar ao catalogo
      </Link>
    </SuccessContainer>
  )
}