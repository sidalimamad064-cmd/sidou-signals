import { motion } from 'framer-motion'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import Stats from '../components/landing/Stats'
import Pricing from '../components/landing/Pricing'
import FAQ from '../components/landing/FAQ'
import Contact from '../components/landing/Contact'

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero />
      <Features />
      <Stats />
      <Pricing />
      <FAQ />
      <Contact />
    </motion.div>
  )
}
