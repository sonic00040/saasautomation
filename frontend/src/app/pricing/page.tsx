import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Bot, ArrowLeft } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for small businesses getting started with AI support",
    features: [
      "1,000 messages/month",
      "1 chatbot",
      "Basic knowledge base",
      "Email support",
      "Standard response time",
      "Web integration",
    ],
    limitations: [
      "No phone support",
      "Limited customization",
      "Basic analytics",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "Advanced features for growing businesses",
    features: [
      "10,000 messages/month",
      "5 chatbots",
      "Advanced knowledge base",
      "Priority email support",
      "Custom branding",
      "Web & mobile integration",
      "Advanced analytics",
      "API access",
    ],
    limitations: [
      "No phone support",
      "Limited team members",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$299",
    period: "/month",
    description: "Full-featured solution for large organizations",
    features: [
      "50,000 messages/month",
      "Unlimited chatbots",
      "Enterprise knowledge base",
      "24/7 phone & email support",
      "Full white-label solution",
      "All platform integrations",
      "Advanced analytics & reporting",
      "Full API access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    limitations: [],
    popular: false,
  },
]

const allFeatures = [
  { name: "Monthly Messages", starter: "1,000", professional: "10,000", enterprise: "50,000" },
  { name: "Chatbots", starter: "1", professional: "5", enterprise: "Unlimited" },
  { name: "Knowledge Base", starter: "Basic", professional: "Advanced", enterprise: "Enterprise" },
  { name: "Support", starter: "Email", professional: "Priority Email", enterprise: "24/7 Phone & Email" },
  { name: "Custom Branding", starter: "❌", professional: "✅", enterprise: "✅" },
  { name: "API Access", starter: "❌", professional: "Basic", enterprise: "Full" },
  { name: "Analytics", starter: "Basic", professional: "Advanced", enterprise: "Enterprise" },
  { name: "Integrations", starter: "Web only", professional: "Web & Mobile", enterprise: "All Platforms" },
  { name: "White-label", starter: "❌", professional: "❌", enterprise: "✅" },
  { name: "SLA", starter: "❌", professional: "❌", enterprise: "99.9%" },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full opacity-10 blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Enhanced Header */}
      <header className="border-b border-white/20 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">BotAI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose the perfect plan for your business. Start with our 14-day free trial, 
              no credit card required.
            </p>
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                💰 30% off for the first 3 months
              </Badge>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-4 text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/signup" className="w-full">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Compare Plans
            </h2>
            <p className="text-xl text-gray-600">
              Detailed feature comparison across all plans
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold text-gray-900">Features</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Starter</th>
                  <th className="text-center p-4 font-semibold text-gray-900">
                    Professional
                    <Badge className="ml-2 bg-blue-600">Popular</Badge>
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, index) => (
                  <tr key={feature.name} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-4 font-medium text-gray-900">{feature.name}</td>
                    <td className="p-4 text-center text-gray-700">{feature.starter}</td>
                    <td className="p-4 text-center text-gray-700">{feature.professional}</td>
                    <td className="p-4 text-center text-gray-700">{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate the billing accordingly.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                What happens if I exceed my message limit?
              </h3>
              <p className="text-gray-600">
                We'll notify you when you reach 80% and 95% of your limit. If you exceed your limit, 
                your chatbots will continue to work, but you'll be charged for additional messages at standard rates.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Do you offer custom enterprise solutions?
              </h3>
              <p className="text-gray-600">
                Yes! For large organizations with specific needs, we offer custom solutions with 
                dedicated support, custom integrations, and volume discounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start your 14-day free trial today. No credit card required.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg text-gray-900">BotAI</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 BotAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}