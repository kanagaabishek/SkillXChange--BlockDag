import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CreditCard, DollarSign, Shield, AlertCircle } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  price: string;
  priceUSDC: string;
  popular?: boolean;
}

const Payments = () => {
  const [searchParams] = useSearchParams();
  const skillId = searchParams.get('skill');
  const { account, isConnected } = useWallet();
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [isMonetized, setIsMonetized] = useState(false);

  const paymentOptions: PaymentOption[] = [
    {
      id: 'basic',
      name: 'Basic Session',
      description: '1-hour skill exchange session',
      price: '0.01',
      priceUSDC: '25'
    },
    {
      id: 'standard',
      name: 'Standard Session',
      description: '2-hour comprehensive skill exchange',
      price: '0.02',
      priceUSDC: '50',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium Session',
      description: '4-hour intensive skill exchange with follow-up',
      price: '0.04',
      priceUSDC: '100'
    },
    {
      id: 'custom',
      name: 'Custom Amount',
      description: 'Set your own price for the skill exchange',
      price: 'Custom',
      priceUSDC: 'Custom'
    }
  ];

  const handlePayment = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to make payments.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedOption) {
      toast({
        title: "Select Option",
        description: "Please select a payment option.",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      const option = paymentOptions.find(opt => opt.id === selectedOption);
      const paymentAmount = selectedOption === 'custom' ? amount : option?.priceUSDC;

      // In a real app, this would interact with the payment smart contract
      // const paymentTx = await contract.payForSkill(skillId, paymentAmount);
      // await paymentTx.wait();

      toast({
        title: "Payment Successful!",
        description: `Payment of ${paymentAmount} USDC sent successfully. The skill exchange can now begin.`,
      });

      // Mock delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirect to session or match page
      window.location.href = `/session/${skillId}`;
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleFreeJoin = () => {
    toast({
      title: "Joined Successfully!",
      description: "You've joined the free skill exchange. Check your profile for session details.",
    });
    
    // Navigate to session or match page
    window.location.href = `/match?skill=${skillId}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 web3-gradient rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">SkillXchange</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/explore" className="text-foreground hover:text-primary transition-colors">
              Explore Skills
            </Link>
            <Link to="/profile" className="text-foreground hover:text-primary transition-colors">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/explore">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explore
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Payment Options</h1>
          </div>

          {/* Monetization Toggle */}
          <Card className="mb-6 card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Skill Monetization
              </CardTitle>
              <CardDescription>
                Choose whether this skill exchange should be free or monetized.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="monetization"
                  checked={isMonetized}
                  onCheckedChange={setIsMonetized}
                />
                <Label htmlFor="monetization" className="text-sm font-medium">
                  {isMonetized ? 'Monetized Skill Exchange' : 'Free Skill Exchange'}
                </Label>
              </div>
              
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-muted-foreground">
                    {isMonetized ? (
                      <div>
                        <p className="font-medium text-foreground mb-1">Monetized Exchange</p>
                        <p>Participants pay in USDC for premium skill exchanges. Payments are secured by smart contracts and released upon completion.</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-foreground mb-1">Free Exchange</p>
                        <p>Traditional skill bartering without monetary exchange. Build your reputation through successful skill sharing.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Options or Free Join */}
          {!isMonetized ? (
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Shield className="w-5 h-5" />
                  Free Skill Exchange
                </CardTitle>
                <CardDescription>
                  Join this skill exchange for free and build your reputation through successful knowledge sharing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">What you get:</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Direct skill exchange with community members</li>
                      <li>• Reputation NFT upon successful completion</li>
                      <li>• Access to future skill exchange opportunities</li>
                      <li>• Community support and networking</li>
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={handleFreeJoin}
                    className="w-full web3-button"
                  >
                    Join Free Exchange
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Premium Skill Exchange</CardTitle>
                <CardDescription>
                  Select a payment option for this monetized skill exchange. Payments are secured by smart contracts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedOption === option.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{option.name}</h3>
                            {option.popular && (
                              <Badge variant="default">Popular</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {option.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {option.price !== 'Custom' ? `${option.price} ETH` : 'Custom'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {option.priceUSDC !== 'Custom' ? `${option.priceUSDC} USDC` : 'Set amount'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {selectedOption === 'custom' && (
                    <div className="space-y-2">
                      <Label htmlFor="amount">Custom Amount (USDC)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount in USDC"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Smart Contract Security</h4>
                    <p className="text-sm text-muted-foreground">
                      Your payment is held in escrow by a smart contract and only released when both parties confirm completion of the skill exchange.
                    </p>
                  </div>

                  <Button 
                    onClick={handlePayment}
                    className="w-full web3-button"
                    disabled={processing || !selectedOption}
                  >
                    {processing ? 'Processing Payment...' : 'Send Payment'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;