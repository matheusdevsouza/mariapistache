'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope,
  faArrowRight,
  faClock
} from '@fortawesome/free-solid-svg-icons'
import {
  faWhatsapp
} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope as faEnvelopeRegular } from '@fortawesome/free-regular-svg-icons'

const ContactSkeleton = () => (
  <section className="pt-32 md:pt-40 pb-24 md:pb-32 bg-sand-100 relative overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 md:mb-20 space-y-6">
          <div className="h-8 w-40 bg-black/20 rounded-full mx-auto animate-pulse" />
          <div className="h-12 md:h-16 w-full max-w-2xl bg-black/30 rounded-lg mx-auto animate-pulse" />
          <div className="h-6 w-full max-w-xl bg-black/20 rounded mx-auto animate-pulse" />
        </div>
        <div className="h-12 w-64 bg-black/40 rounded-xl mx-auto animate-pulse" />
      </div>
    </div>
  </section>
)

const contactChannels = [
  {
    icon: faWhatsapp,
    title: 'WhatsApp',
    description: 'Resposta rápida',
    info: '+55 11 97483-5035',
    href: 'https://wa.me/5511974835035?text=Olá! Gostaria de saber mais sobre os produtos da Maria Pistache.',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600'
  },
  {
    icon: faEnvelopeRegular,
    title: 'E-mail',
    description: 'Resposta em até 24h',
    info: 'contato@mariapistache.com.br',
    href: 'mailto:contato@mariapistache.com.br',
    color: 'bg-primary-500',
    hoverColor: 'hover:bg-primary-600'
  }
]

export function ContactSection() {

  return (
    <section className="pt-32 md:pt-40 pb-24 md:pb-32 bg-sand-100 relative overflow-hidden">
      <div className="custom-shape-divider-top absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none" style={{
        zIndex: 1,
        backgroundColor: '#0a1f13',
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}>
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[20px] md:h-[100px]"
          style={{ width: 'calc(100% + 1.3px)', transform: 'scaleX(-1) scaleY(-1)' }}
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#FDF8F2"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 border border-sage-300/50 rounded-full bg-sage-100/50"
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-sage-400 text-sm w-4 h-4"
              />
              <span className="text-xs uppercase tracking-[0.2em] text-sage-500 font-medium">
                Entre em Contato
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-sage-900 mb-6"
            >
              Fale{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary-500 via-primary-700 to-primary-500 bg-clip-text text-transparent">
                  Conosco
                </span>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: ['0%', '100%', '100%', '0%', '0%']
                  }}
                  viewport={{ once: false }}
                  transition={{
                    duration: 12,
                    delay: 0.8,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    times: [0, 0.08, 0.5, 0.58, 1]
                  }}
                  className="absolute bottom-2 left-0 h-3 bg-primary-400/20 -z-0"
                  style={{ transform: 'skewX(-12deg)' }}
                />
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-sage-700 max-w-2xl mx-auto leading-relaxed"
            >
              Estamos prontos para ajudar você com qualquer dúvida sobre nossos produtos ou pedidos.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12"
          >
            {contactChannels.map((channel, index) => (
              <motion.a
                key={channel.title}
                href={channel.href}
                target={channel.title === 'WhatsApp' ? '_blank' : undefined}
                rel={channel.title === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sage-200/60 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 ease-out"
              >
                <div className={`w-12 h-12 ${channel.color} ${channel.hoverColor} rounded-xl flex items-center justify-center mb-4 transition-colors duration-300`}>
                  <FontAwesomeIcon icon={channel.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-sage-900 mb-1 group-hover:text-primary-600 transition-colors duration-300">
                  {channel.title}
                </h3>
                <p className="text-sm text-sage-600 mb-2">
                  {channel.description}
                </p>
                <p className="text-sm font-medium text-primary-600">
                  {channel.info}
                </p>
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            <div className="flex items-center gap-3 px-5 py-3 bg-white/60 rounded-full border border-sage-200/50">
              <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-sage-400" />
              <span className="text-sm text-sage-600 font-medium">Resposta média: 2 horas</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 bg-white/60 rounded-full border border-sage-200/50">
              <span className="text-sm text-sage-600 font-medium">Atendimento: Seg-Sex, 9h às 18h</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center"
          >
            <Link href="/contato">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary-500 text-sand-100 rounded-xl font-semibold text-sm uppercase tracking-[0.2em] shadow-lg shadow-primary-500/25 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30 hover:bg-primary-600"
              >
                <span className="relative z-10">
                  MAIS OPÇÕES DE CONTATO
                </span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export const NewsletterSection = ContactSection
