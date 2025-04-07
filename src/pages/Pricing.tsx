
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PlanType = 'monthly' | 'yearly';
type PlanTier = 'free' | 'pro' | 'enterprise';

const Pricing = () => {
  const [planType, setPlanType] = useState<PlanType>('monthly');
  
  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started with basic thought mapping',
      price: { monthly: '$0', yearly: '$0' },
      features: [
        'Create up to 3 thought maps',
        'Basic thought nodes',
        'Export as PDF',
        'Community support'
      ],
      cta: 'Get Started',
      ctaLink: '/signup',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Advanced features for power users and professionals',
      price: { monthly: '$19', yearly: '$190' },
      features: [
        'Unlimited thought maps',
        'Advanced node types and connections',
        'AI-assisted insights',
        'Export in multiple formats',
        'Priority support',
        'Real-time collaboration (up to 3 users)'
      ],
      cta: 'Upgrade to Pro',
      ctaLink: '/signup?plan=pro',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Custom solutions for teams and organizations',
      price: { monthly: '$49', yearly: '$490' },
      features: [
        'Unlimited everything',
        'Advanced security and compliance',
        'Dedicated account manager',
        'Custom integrations',
        'Team workspaces',
        'Unlimited collaborators',
        'Advanced analytics'
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      popular: false
    }
  ];
  
  const handleGetStarted = (tier: PlanTier) => {
    // This would be a real implementation if we had a backend
    console.log(`Selected ${tier} plan with ${planType} billing`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="heading-lg mb-4">Simple, Transparent Pricing</h1>
            <p className="body-md max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include core thought mapping features.
            </p>
            
            <div className="mt-8 inline-flex items-center p-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
              <button
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  planType === 'monthly' 
                    ? "bg-white dark:bg-gray-700 shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setPlanType('monthly')}
              >
                Monthly
              </button>
              <button
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  planType === 'yearly' 
                    ? "bg-white dark:bg-gray-700 shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setPlanType('yearly')}
              >
                Yearly <span className="text-primary text-xs">Save 20%</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={cn(
                  "relative rounded-xl p-6 bg-white dark:bg-gray-900 border transition-all hover:border-primary/50 hover:shadow-md",
                  plan.popular 
                    ? "border-primary/50 shadow-lg" 
                    : "border-gray-200 dark:border-gray-800"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-primary text-white text-xs font-medium py-1 px-3 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground mt-1 text-sm">{plan.description}</p>
                </div>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price[planType]}</span>
                  {plan.id !== 'free' && (
                    <span className="text-muted-foreground ml-2">per {planType === 'monthly' ? 'month' : 'year'}</span>
                  )}
                </div>
                
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={cn(
                    "w-full", 
                    !plan.popular && "bg-primary/90 hover:bg-primary"
                  )}
                  asChild
                >
                  <Link to={plan.ctaLink}>{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center bg-gray-50 dark:bg-gray-900/30 rounded-xl p-8 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We offer tailored solutions for larger teams and specialized requirements.
              Our team can work with you to create a custom plan that meets your specific needs.
            </p>
            <Button variant="outline" asChild>
              <Link to="/contact">Contact our sales team</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
