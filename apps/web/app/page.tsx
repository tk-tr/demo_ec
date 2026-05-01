import { getProducts } from '../lib/api'
import { HeroSection } from '../components/home/HeroSection'
import { HomeProducts } from '../components/home/HomeProducts'

export default async function HomePage() {
  const products = await getProducts()
  return (
    <>
      <HeroSection />
      <HomeProducts products={products} />
    </>
  )
}
