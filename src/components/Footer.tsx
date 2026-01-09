'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faInstagram,
  faTiktok,
  faWhatsapp
} from '@fortawesome/free-brands-svg-icons'
import {
  faArrowUp,
  faLocationDot,
  faPhone,
  faEnvelope,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons'

const footerLinks = {
  informacoes: {
    title: 'Informações',
    links: [
      { label: 'Sobre Nós', href: '/sobre' },
      { label: 'Como Funciona', href: '/como-funciona' },
      { label: 'Garantia', href: '/garantia' },
      { label: 'Política de Frete', href: '/frete' },
    ]
  },
  ajuda: {
    title: 'Ajuda',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Como Comprar', href: '/como-comprar' },
      { label: 'Trocas e Devoluções', href: '/trocas' },
      { label: 'Entregas', href: '/entregas' },
    ]
  },
  institucional: {
    title: 'Institucional',
    links: [
      { label: 'Política de Privacidade', href: '/privacidade' },
      { label: 'Termos de Uso', href: '/termos' },
      { label: 'Contato', href: '/contato' },
    ]
  },
}

export function Footer() {
  const [email, setEmail] = useState('')

  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <footer className="bg-sand-100 border-t border-cloud-200">
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo.png"
                alt="Maria Pistache"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>

            <p className="text-sm text-sage-700 mb-6 leading-relaxed max-w-xs">
              Moda feminina contemporânea, leve e sofisticada para todos os momentos da sua vida.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-sage-600">
                <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>Rua João Meneghete, 427 - Taboão da Serra, SP</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-sage-600">
                <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <a href="tel:5511974835035" className="hover:text-primary-600 transition-colors duration-300">
                  +55 11 97483-5035
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-sage-600">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <a href="mailto:contato@mariapistache.com.br" className="hover:text-primary-600 transition-colors duration-300">
                  contato@mariapistache.com.br
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.a
                href="https://www.instagram.com/mariapistacheoficial"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-md hover:bg-primary-600 hover:shadow-lg transition-all duration-300"
              >
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://tiktok.com/@mariapistache"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-md hover:bg-primary-600 hover:shadow-lg transition-all duration-300"
              >
                <FontAwesomeIcon icon={faTiktok} className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className="lg:col-span-2">
              <h3 className="text-sm font-bold text-sage-900 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-sage-600 hover:text-primary-600 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-sage-900 uppercase tracking-wider mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-sage-600 mb-4 leading-relaxed">
              Receba novidades e ofertas exclusivas!
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-cloud-200 rounded-lg px-4 py-3 text-sage-800 placeholder-sage-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-sm"
                  required
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <span className="text-sm">Inscrever-se</span>
                <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-cloud-200 bg-sand-50">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-sage-600 text-center md:text-left">
              © {new Date().getFullYear()} Maria Pistache. Todos os direitos reservados.
              <br className="md:hidden" />
              <span className="hidden md:inline"> | </span>
              CNPJ: 51.944.038/0001-05
            </p>

            <div className="flex items-center gap-3">
              <span className="text-xs text-sage-500 mr-2">Pagamento:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-sage-600 bg-white px-2 py-1 rounded border border-cloud-200">VISA</span>
                <span className="text-xs text-sage-600 bg-white px-2 py-1 rounded border border-cloud-200">MC</span>
                <span className="text-xs text-sage-600 bg-white px-2 py-1 rounded border border-cloud-200">PIX</span>
                <span className="text-xs text-sage-600 bg-white px-2 py-1 rounded border border-cloud-200">BOLETO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        onClick={handleScroll}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-all duration-300"
        aria-label="Voltar ao topo"
      >
        <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
      </motion.button>

      <motion.a
        href="https://wa.me/5511974835035?text=Olá! Gostaria de saber mais sobre os produtos da Maria Pistache."
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-all duration-300"
        aria-label="Contato via WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="w-7 h-7" />
      </motion.a>
    </footer>
  )
}