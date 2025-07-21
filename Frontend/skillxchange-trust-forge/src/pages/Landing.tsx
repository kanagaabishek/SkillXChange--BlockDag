import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users, Bot, Shield, Award } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const Landing = () => {
  const { connectWallet, isConnected, disconnectWallet, account } = useWallet();

  const steps = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Post",
      description: "Share your skill or request what you'd like to learn."
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Match",
      description: "Let our AI match you with ideal exchange partners."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Barter",
      description: "Trade knowledge securely, powered by smart contracts."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Earn NFT",
      description: "Build your blockchain reputation with verified NFTs."
    }
  ];

  const features = [
    {
      title: "AI Matchmaking",
      description: "AI matches you with the best peers to teach or learn together, saving you time and boosting results."
    },
    {
      title: "On-Chain Reputation",
      description: "Show off your completed skill barters and build trust with unique, unforgeable reputation NFTs."
    },
    {
      title: "Peer-to-Peer & Free",
      description: "No fees. No middlemen. Just real peer-to-peer learning and mentoring for everyone in the community."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 web3-gradient rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">SkillXchange</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/explore" className="text-foreground hover:text-primary transition-colors">
              Explore Skills
            </Link>
            <Link to="/post" className="text-foreground hover:text-primary transition-colors">
              Post Skill
            </Link>
            <Link to="/profile" className="text-foreground hover:text-primary transition-colors">
              Profile
            </Link>
          </nav>
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                {account ? account.slice(0, 6) + '...' + account.slice(-4) : ''}
              </span>
              <Button onClick={disconnectWallet} variant="outline" className="connect-wallet-btn text-black bg-red-500">
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={connectWallet} className="connect-wallet-btn">
              Connect Wallet
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SkillXchange
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            The Web3 bartering app where students and developers trade skills, not cash.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/explore">
              <Button size="lg" className="web3-button">
                Explore Star Skills
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/post">
              <Button size="lg" variant="outline" className="hover-lift">
                Post a Skill
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How SkillXchange Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <Card key={idx} className="text-center skill-card">
                <CardHeader>
                  <div className="w-12 h-12 web3-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why SkillXchange?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="skill-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 web3-gradient rounded-lg flex items-center justify-center">
                      {idx === 0 && <Bot className="w-4 h-4 text-white" />}
                      {idx === 1 && <Shield className="w-4 h-4 text-white" />}
                      {idx === 2 && <Award className="w-4 h-4 text-white" />}
                    </div>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 bg-muted/30">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 SkillXchange. Built for students and devs, powered by smart contracts.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
