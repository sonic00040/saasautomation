'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Target,
  Award,
  Lightbulb,
  Globe,
  Shield,
  Star,
  Heart,
  CheckCircle,
  Zap,
  Brain,
  Clock,
  TrendingUp,
  Coffee,
  MessageSquare,
  Code,
  Rocket
} from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-founder",
      bio: "Former VP of Engineering at TechCorp with 15+ years in AI and customer service automation.",
      image: "/api/placeholder/150/150",
      linkedin: "#"
    },
    {
      name: "David Chen",
      role: "CTO & Co-founder",
      bio: "Machine Learning PhD from Stanford. Previously led AI initiatives at major SaaS companies.",
      image: "/api/placeholder/150/150",
      linkedin: "#"
    },
    {
      name: "Maria Rodriguez",
      role: "Head of Product",
      bio: "Product strategist with expertise in UX design and customer success platforms.",
      image: "/api/placeholder/150/150",
      linkedin: "#"
    },
    {
      name: "Alex Thompson",
      role: "Head of Engineering",
      bio: "Full-stack architect specializing in scalable cloud infrastructure and real-time systems.",
      image: "/api/placeholder/150/150",
      linkedin: "#"
    }
  ]

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make starts with how it benefits our customers and their success."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We push the boundaries of AI technology to solve real business challenges."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your data security and privacy are fundamental to everything we build."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe the best solutions come from diverse teams working together."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We're committed to delivering the highest quality products and support."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Making AI-powered customer service accessible to businesses worldwide."
    }
  ]

  const milestones = [
    {
      year: "2021",
      title: "Company Founded",
      description: "Started with a vision to democratize AI customer service"
    },
    {
      year: "2022",
      title: "First 100 Customers",
      description: "Reached our first milestone with enterprise clients"
    },
    {
      year: "2023",
      title: "Series A Funding",
      description: "$15M raised to accelerate product development"
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Serving 10,000+ businesses across 50 countries"
    }
  ]

  const stats = [
    { label: "Active Customers", value: "10,000+", icon: Users },
    { label: "Messages Processed", value: "50M+", icon: MessageSquare },
    { label: "Countries Served", value: "50+", icon: Globe },
    { label: "Uptime", value: "99.9%", icon: CheckCircle },
    { label: "Avg Response Time", value: "<100ms", icon: Zap },
    { label: "Customer Satisfaction", value: "98%", icon: Star }
  ]

  const certifications = [
    { name: "SOC 2 Type II", description: "Security and compliance certified", icon: Shield },
    { name: "GDPR Compliant", description: "European data protection standards", icon: Shield },
    { name: "ISO 27001", description: "Information security management", icon: Award },
    { name: "HIPAA Ready", description: "Healthcare data protection", icon: Heart }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" size="lg" className="mb-6">
            <Heart className="h-4 w-4 mr-2" />
            Our Story
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Building the Future of
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Customer Service</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're on a mission to transform how businesses connect with their customers through intelligent AI automation that feels genuinely human.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe every business deserves access to world-class customer service capabilities, regardless of size or budget. Our AI-powered platform levels the playing field, enabling small startups to provide the same quality of support as Fortune 500 companies.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                By combining cutting-edge artificial intelligence with intuitive design, we're making it possible for any business to deliver exceptional customer experiences at scale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Join Our Mission
                </Button>
                <Button size="lg" variant="outline">
                  <Coffee className="h-5 w-5 mr-2" />
                  Meet the Team
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Rocket className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Innovation First</h4>
                <p className="text-sm text-gray-600">Pushing AI boundaries to solve real customer service challenges</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Globe className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Global Scale</h4>
                <p className="text-sm text-gray-600">Serving businesses worldwide with localized solutions</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Brain className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">AI Excellence</h4>
                <p className="text-sm text-gray-600">Advanced machine learning for natural conversations</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Human Touch</h4>
                <p className="text-sm text-gray-600">Technology that enhances rather than replaces human connection</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Impact by the Numbers</h2>
            <p className="text-xl opacity-90">See how we're transforming customer service globally</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">The passionate people behind our AI revolution</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">Key milestones in our growth story</p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 to-purple-200"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">{milestone.year}</span>
                  </div>
                  <div className="ml-6 flex-1">
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <h4 className="font-semibold text-gray-900 text-lg mb-2">{milestone.title}</h4>
                      <p className="text-gray-600">{milestone.description}</p>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trust & Compliance</h2>
            <p className="text-lg text-gray-600">Certified security and compliance standards you can rely on</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <cert.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">{cert.name}</h4>
                <p className="text-sm text-gray-600">{cert.description}</p>
                <Badge variant="success" className="mt-3">Certified</Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Our Mission?</h2>
          <p className="text-xl mb-8 opacity-90">
            Whether you're looking to transform your customer service or join our team, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Journey
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              View Careers
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}