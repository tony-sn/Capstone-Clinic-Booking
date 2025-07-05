"use client"

import { Activity, Droplets, HeartPulse, Leaf, RefreshCw, Zap } from 'lucide-react'
import { useRef } from 'react'

import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'


const benefits = [
  {
    icon: <HeartPulse className="size-6 text-theme-600" />,
    title: 'Comprehensive Blood Screening',
    description: 'State-of-the-art lab tests analyze key biomarkers to give you a full picture of your health.'
  },
  {
    icon: <Leaf className="size-6 text-theme-600" />,
    title: 'Personalized Treatment Plans',
    description: 'Our physicians review your results and craft targeted care strategies that fit your unique profile.'
  },
  {
    icon: <Zap className="size-6 text-theme-600" />,
    title: 'Early Disease Detection',
    description: 'Routine blood work uncovers potential issues before symptoms appear, so you can take action sooner.'
  },
  {
    icon: <Activity className="size-6 text-theme-600" />,
    title: 'Holistic Wellness Monitoring',
    description: 'Track your health trends over time and adjust lifestyle or medical recommendations for optimal well-being.'
  },
  {
    icon: <RefreshCw className="size-6 text-theme-600" />,
    title: 'Detoxification & Nutrient Balancing',
    description: 'Lab-guided insights help clear toxins and optimize nutrient levels to support cellular repair.'
  },
  {
    icon: <Droplets className="size-6 text-theme-600" />,
    title: 'Enhanced Vitality',
    description: 'With precise diagnostics and expert care, many patients report sustained energy boosts and improved resilience.'
  }
]

const Benefits = () => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  return (
    <section id="benefits" className="bg-gradient-to-b from-background to-gray-50 py-20 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="font-sans text-3xl font-medium text-gray-900 dark:text-white md:text-4xl">
            Benefits of Cyber Clinic
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our warranty of most advanced technologies and best practitioners in the world
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={cn(
                "bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-700 transform",
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12",
                isInView && `transition-delay-${index * 100}`
              )}
              style={{
                transitionDelay: isInView ? `${index * 100}ms` : '0ms'
              }}
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-theme-50 dark:bg-theme-900/20 dark:hover:bg-gray-700/20 [&_svg]:hover:animate-pulse">
                {benefit.icon}
              </div>
              <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
