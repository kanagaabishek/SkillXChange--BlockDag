import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Users, Clock, MapPin, Star, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import axios from 'axios';

interface MatchPair {
  id: string;
  skillA: {
    id: string;
    title: string;
    category: string;
    level: string;
    user: {
      name: string;
      reputation: number;
      verified: boolean;
    };
  };
  skillB: {
    id: string;
    title: string;
    category: string;
    level: string;
    user: {
      name: string;
      reputation: number;
      verified: boolean;
    };
  };
  matchScore: number;
  aiReason: string;
  estimatedDuration: string;
  location: string;
}

const Match = () => {
  const { toast } = useToast();
  const { isConnected, account } = useWallet();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const skillId = searchParams.get('skill');
  const [matches, setMatches] = useState<MatchPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [lockingDeal, setLockingDeal] = useState<string | null>(null);

  // Mock AI-generated matches for demonstration
  const mockMatches: MatchPair[] = [
    {
      id: '1',
      skillA: {
        id: '1',
        title: 'React Development',
        category: 'Frontend',
        level: 'intermediate',
        user: {
          name: 'Sarah Chen',
          reputation: 4.8,
          verified: true
        }
      },
      skillB: {
        id: '2',
        title: 'UI/UX Design Feedback',
        category: 'Design',
        level: 'advanced',
        user: {
          name: 'Alex Rodriguez',
          reputation: 4.9,
          verified: true
        }
      },
      matchScore: 95,
      aiReason: 'Perfect complement: React developer needs design skills, designer wants to understand implementation constraints.',
      estimatedDuration: '2-3 hours each',
      location: 'Remote'
    },
    {
      id: '2',
      skillA: {
        id: '3',
        title: 'Spring Boot Basics',
        category: 'Backend',
        level: 'beginner',
        user: {
          name: 'Mike Johnson',
          reputation: 4.2,
          verified: false
        }
      },
      skillB: {
        id: '4',
        title: 'Database Design',
        category: 'Backend',
        level: 'intermediate',
        user: {
          name: 'Lisa Wang',
          reputation: 4.6,
          verified: true
        }
      },
      matchScore: 87,
      aiReason: 'Great backend synergy: Spring Boot naturally integrates with database design principles.',
      estimatedDuration: '3-4 hours each',
      location: 'Remote'
    },
    {
      id: '3',
      skillA: {
        id: '5',
        title: 'Python Data Analysis',
        category: 'Data Science',
        level: 'intermediate',
        user: {
          name: 'David Kim',
          reputation: 4.7,
          verified: true
        }
      },
      skillB: {
        id: '6',
        title: 'Machine Learning Basics',
        category: 'Data Science',
        level: 'beginner',
        user: {
          name: 'Emily Foster',
          reputation: 4.3,
          verified: false
        }
      },
      matchScore: 82,
      aiReason: 'Natural progression: Data analysis skills are fundamental for machine learning applications.',
      estimatedDuration: '4-5 hours each',
      location: 'Remote'
    }
  ];

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        // In a real app, this would call the AI matching API
        // const response = await axios.get(`${process.env.NEXT_PUBLIC_AI_API_URL}/api/match/${skillId}`);
        // setMatches(response.data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMatches(mockMatches);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
        toast({
          title: "Error",
          description: "Failed to load AI matches. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [skillId]);

  const handleLockDeal = async (matchId: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to lock deals.",
        variant: "destructive"
      });
      return;
    }

    setLockingDeal(matchId);
    try {
      const match = matches.find(m => m.id === matchId);
      if (!match) return;

      // In a real app, this would call the smart contract
      // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/createContract`, {
      //   skillAId: match.skillA.id,
      //   skillBId: match.skillB.id,
      //   userAWallet: account,
      //   userBWallet: match.skillB.user.wallet, // Would be available in real data
      //   matchId: matchId
      // });

      toast({
        title: "Deal Locked!",
        description: `Smart contract created for ${match.skillA.title} ↔ ${match.skillB.title}`,
      });

      // Navigate to course detail
      navigate(`/courses/${matchId}`);
    } catch (error) {
      console.error('Failed to lock deal:', error);
      toast({
        title: "Error",
        description: "Failed to lock the deal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLockingDeal(null);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">AI is finding perfect matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 web3-gradient rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/explore">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explore
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">AI-Powered Matches</h1>
          </div>

          <div className="mb-8">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Smart Contract Protection
                </CardTitle>
                <CardDescription>
                  All skill exchanges are secured by blockchain smart contracts. Lock a deal to create an immutable agreement between both parties.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-6">
            {matches.map((match) => (
              <Card key={match.id} className="skill-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Perfect Match Found!</CardTitle>
                    <Badge className={getMatchScoreColor(match.matchScore)}>
                      {match.matchScore}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Skill A */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {match.skillA.user.name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{match.skillA.user.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{match.skillA.user.reputation}</span>
                            {match.skillA.user.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-primary">{match.skillA.title}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">{match.skillA.category}</Badge>
                        <Badge variant="outline">{match.skillA.level}</Badge>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center">
                      <div className="bg-primary/10 rounded-full p-3">
                        <ArrowRight className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    {/* Skill B */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {match.skillB.user.name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{match.skillB.user.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{match.skillB.user.reputation}</span>
                            {match.skillB.user.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-accent">{match.skillB.title}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">{match.skillB.category}</Badge>
                        <Badge variant="outline">{match.skillB.level}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">AI Analysis:</h4>
                    <p className="text-sm text-muted-foreground mb-4">{match.aiReason}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {match.estimatedDuration}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {match.location}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Button 
                      onClick={() => handleLockDeal(match.id)}
                      className="web3-button"
                      disabled={lockingDeal === match.id}
                    >
                      {lockingDeal === match.id ? 'Locking Deal...' : 'Lock Deal'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {matches.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your skill criteria or check back later for new matches.
                </p>
                <Link to="/post">
                  <Button className="web3-button">
                    Post Another Skill
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Match;
